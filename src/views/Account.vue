<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRouter } from 'vue-router'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import Alert from '../components/Account/Confirm.vue'
    import CreateUser from '../components/Account/CreateUser.vue';
    import UserOptions from '../components/Account/UserOptions.vue'
    import api from '../api.js'
    import toastConfig from '../assets/toastNotification.js'
    import { useUserStore } from '../stores/user.js'
    import Loading from '../components/Loading.vue';

    const store = useUserStore()
    const { _id: currentUserId, username: currentUsername, role: currentRole } = storeToRefs(store)

    const newUsername = ref('')
    const newRole = ref('')
    const roleOptions = ref(['Owner', 'Staff'])
    const oldPassword = ref('')
    const newPassword = ref('')
    const confirmNewPassword = ref('')
    const loadingAccountUpdate = ref(false)
    const loadingPasswordReset = ref(false)

    const users = ref([])
    const openOption = ref('')
    const showNewUserForm = ref(false)
    const showConfirm = ref(false)
    const userChoice = ref('')
    const confirmMessage = ref('')
    const loadingUsers = ref(true)
    const router = useRouter()
    const $toast = useToast()

    onMounted(() => {
        // Fetch all users when the component is mounted
        fetchUsers()

        // Update account details to the current account details from the store
        updateFromStore()
    })

    const updateFromStore = () => {
        newUsername.value = currentUsername.value
        newRole.value = currentRole.value
    }

    // Handle the account detail forms
    const handleAccountUpdate = async () => {
        const regex = /^[a-zA-Z0-9]*$/
        if(newUsername.value === ''){
            $toast.error('Username cannot be empty', toastConfig('error'));
            return
        }
        if(!regex.test(newUsername.value)){
            $toast.error('Username can only contain letters and numbers', toastConfig('error'));
            return
        }

        loadingAccountUpdate.value = true
        try{
            const newUsernameOfRequest = newUsername.value
            const newRoleOfRequest = newRole.value

            const response = await api.put(`/users/${currentUserId.value}`, { username: newUsernameOfRequest, role: newRoleOfRequest })
            currentUsername.value = newUsernameOfRequest
            currentRole.value = newRoleOfRequest
            $toast.success('Account updated successfully', toastConfig('success'));

            // update users ref
            users.value = users.value.map(user => 
                user._id === currentUserId.value ? { ...user, username: newUsernameOfRequest, role: newRoleOfRequest } : user
            ).sort((a, b) => {
                if(a.role !== b.role){
                    // First sort by role, Owner first
                    return a.role === 'Owner' ? -1 : 1
                }
                else{
                    // Sort by username alphabetically
                    return a.username.localeCompare(b.username)
                }
            })
        }
        catch(err){
            console.log(err)
            if (err?.response?.data?.message) {
                $toast.error(`Error updating account: ${err.response.data.message}`, toastConfig('error'));
            } else if (err.message) {
                $toast.error(`Error updating account: ${err.message}`, toastConfig('error'));
            } else {
                $toast.error('Error updating account', toastConfig('error'));
            }
        }
        finally{
            // ensure the form reflects the current store values
            updateFromStore()
            loadingAccountUpdate.value = false
        }
    }
    const handlePasswordReset = async () => {
        if(oldPassword.value === '' || newPassword.value === '' || confirmNewPassword.value === ''){
            $toast.error('All fields are required', toastConfig('error'));
            return
        }
        if(newPassword.value !== confirmNewPassword.value){
            $toast.error('New passwords do not match', toastConfig('error'));
            return
        }

        loadingPasswordReset.value = true
        try{
            const response = await api.patch(`/users/reset-password/${currentUserId.value}`, {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value
            })

            // Clear the password fields
            oldPassword.value = ''
            newPassword.value = ''
            confirmNewPassword.value = ''

            $toast.success('Password reset successfully', toastConfig('success'));
        }
        catch(err){
            if (err?.response?.data?.message) {
                $toast.error(`Error resetting password: ${err.response.data.message}`, toastConfig('error'));
            } else if (err.message) {
                $toast.error(`Error resetting password: ${err.message}`, toastConfig('error'));
            } else {
                $toast.error('Error resetting password', toastConfig('error'));
            }
        }
        finally{
            loadingPasswordReset.value = false
        }
    }

    // Handle the new user creation from the emit of the CreateUser component
    const handleNewUser = ({ _id, username, role }) => {
        showNewUserForm.value = false
        users.value = [...users.value, { _id, username, role }]
    }
    const handleOpenOptionChange = (userId) => {
        openOption.value = openOption.value === userId ? '' : userId
    }

    // General functions to handle the state of the Confirm component
    const confirm = async () => {
        return new Promise((resolve) => {
            // Initialize the confirmation process
            showConfirm.value = true
            userChoice.value = ''

            // Watch for userChoice
            const stop = watch(userChoice, async () => {
                // Remove the watcher
                stop()

                //Resolve the promise with the user's choice
                showConfirm.value = false
                resolve(userChoice.value)
            }, { immediate: false })
            
        })
    }
    const handleConfirmClose = () => {
        showConfirm.value = false
        userChoice.value = ''
    }

    // Functions to handle the user options
    const handleChangeRole = async (_id) => {
        const updateRole = async (_id, newRole) => {
            const response = await api.patch(`/users/edit-role/${_id}`, { role: newRole });
            return response
        } 

        // Find the user by ID and prepare the confirmation message
        const user = users.value.find(currentUser => currentUser._id === _id)
        const newRole = user.role === 'Owner' ? 'Staff' : 'Owner'
        confirmMessage.value = `This action will change ${user.username} to "${newRole}". Are you sure?`

        // Wait for confirmation before proceeding
        const userChoiceToUpdate = await confirm()

        try{
            if(userChoiceToUpdate === 'cancel'){
                return
            }
            if(userChoiceToUpdate === 'continue'){
                loadingUsers.value = true
                await updateRole(_id, newRole)
                $toast.success(`User ${user.username} role changed to ${newRole}`, toastConfig('success'));

                // Update the user's role in the local state
                users.value = users.value.map(user => 
                    user._id === _id ? { ...user, role: newRole } : user
                );
            }
        }
        catch(err){
            console.log(err)
            if (err?.response?.data?.message) {
                $toast.error(`Error updating role: ${err.response.data.message}`, toastConfig('error'));
            } else if (err.message) {
                $toast.error(`Error updating role: ${err.message}`, toastConfig('error'));
            } else {
                $toast.error('Error updating role', toastConfig('error'));
            }
        }
        finally{
            loadingUsers.value = false
        }
    }
    const handleRemoveUser = async (_id) => {
        const deleteUser = async (_id) => {
            const response = await api.delete(`/users/remove-user/${_id}`)
            return response
        }

        // Find the user by ID and prepare the confirmation message
        const user = users.value.find(currentUser => currentUser._id === _id)

        // Wait for confirmation before proceeding
        confirmMessage.value = `This action will delete the account of ${user.username}. Are you sure?`
        const userChoiceToRemove = await confirm()
        
        try{
            if(userChoiceToRemove === 'cancel') {
                return
            }
            if(userChoiceToRemove === 'continue'){
                loadingUsers.value = true
                await deleteUser(_id)

                // Update the user's role in the local state
                users.value = users.value.filter(user => user._id !== _id)
                $toast.success(`User ${user.username} deleted`, toastConfig('success'));
            }
        }
        catch(err){
            if (err?.response?.data?.message) {
                $toast.error(`Error deleting user: ${err.response.data.message}`, toastConfig('error'));
            } else if (err.message) {
                $toast.error(`Error deleting user: ${err.message}`, toastConfig('error'));
            } else {
                $toast.error('Error deleting user', toastConfig('error'));
            }
        }
        finally{
            loadingUsers.value = false
        }
    }

    // API endpoints
    const fetchUsers = async () => {
        loadingUsers.value = true
        try{
            const response = await api.get('/users')
            users.value = response.data.users.sort((a, b) => {
                if(a.role !== b.role){
                    // First sort by role, Owner first
                    return a.role === 'Owner' ? -1 : 1
                }
                else{
                    // Sort by username alphabetically
                    return a.username.localeCompare(b.username)
                }
            })
        }
        catch(err){
            if(err?.response?.data?.message){
                $toast.error(`Error fetching users: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error fetching users: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error fetching users', toastConfig('error'));
            }
        }
        finally{
            loadingUsers.value = false
        }
    }
</script>

<template>
    <CreateUser 
        @continue="handleNewUser"
        @close="showNewUserForm = false"
        v-if="showNewUserForm"
    />
    <Alert 
        :message="confirmMessage"
        @continue="userChoice = 'continue'"
        @close="handleConfirmClose"
        v-if="showConfirm"
    />
    <div class="wrapper">
        <section class="account-section">
            <div>
                <h1>My Account | {{ currentUsername }}</h1>
                <form class="card" @submit.prevent>
                    <h2>Update account</h2>
                    <input type="text" placeholder="New username" v-model="newUsername" />
                    <select v-model="newRole">
                        <option 
                            :value="option"
                            v-for="option in roleOptions" 
                            :key="option"
                        >
                            {{ option }}
                        </option>
                    </select>
                    <div class="loading-wrapper" v-if="loadingAccountUpdate">
                        <Loading />
                    </div>
                    <button type="submit" @click="handleAccountUpdate">Update</button>
                </form>
            </div>
            <div>
                <form class="card" @submit.prevent>
                    <h2>Reset Password</h2>
                    <input type="text" placeholder="Old password" v-model="oldPassword" />
                    <input type="password" placeholder="New password" v-model="newPassword" />
                    <input type="password" placeholder="Confirm new password" v-model="confirmNewPassword" />
                    <div class="loading-wrapper" v-if="loadingPasswordReset">
                        <Loading />
                    </div>
                    <button type="submit" @click="handlePasswordReset">Reset</button>
                </form>
            </div>
        </section>
        <section class="users-wrapper">
            <header>
                <h1>Users</h1>
                <span class="icon-wrapper">
                    <i class="pi pi-plus" v-if="currentRole === 'Owner' || currentRole === 'Test'" @click="() => showNewUserForm = true"></i>
                </span>
            </header>
            <ul v-if="!loadingUsers">
                <li class="user-row" v-for="user in users" :key="user._id">
                    <h3> {{ user.username }}</h3>
                    <span>
                        <h3> {{ user.role }}</h3>
                        <i class="pi pi-cog" v-if="currentRole === 'Owner' || currentRole === 'Test'" @click="() => handleOpenOptionChange(user._id)">
                            <UserOptions 
                                @changeRole="() => handleChangeRole(user._id)" 
                                @removeUser="() => handleRemoveUser(user._id)" 
                                @closeOptions="() => handleOpenOptionChange(user._id)"
                                v-if="openOption === user._id"
                            />
                        </i>
                    </span>
                </li>
            </ul>
            <div class="loading-wrapper" v-else>
                <Loading />
            </div>
        </section>
    </div>
</template>

<style scoped>
    .wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 40px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
    }
    .account-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        height: fit-content;
        width: 100%;
        max-width: 1024px;
    }
    .account-section > div{
        display: flex;
        flex-direction: column;
    }
    .card{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        padding: 20px;
        row-gap: 20px;
        border-color: var(--primary);
        border-style: solid;
        border-radius: 10px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 576px) {
        .account-section{
            grid-template-columns: 1fr;
        }
        
    }
    .users-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: stretch;
        width: 100%;
        max-width: 1024px;
        box-sizing: border-box;
        padding: 20px;
        border-color: var(--primary);
        border-style: solid;
        border-radius: 10px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    .users-wrapper > header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .users-wrapper > ul{
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        height: 100%;
        width: 100%;
        padding: 0;
    }
    .user-row{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        padding-top: 10px;
        border-bottom: 1px solid var(--primary);
    }
    .user-row span{
        display: flex;
        align-items: center;
        column-gap: 10px;
        position: relative;
    }
    .user-row i{
        cursor: pointer;
        color: var(--primary);
    }
    .loading-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .pi-plus{
        font-size: 1.5rem;
        color: var(--primary-light);
        transition: font-size 0.3s ease-in-out;
    }
    .pi-plus:hover{
        cursor: pointer;
        font-size: 2rem;
    }
    button{
        display: flex;
        justify-content: center;
        padding: 10px 30px;
        background: var(--primary-gradient-dark);
        color: white;
        border: none;
        border-radius: 10px;
    }
    input, select{
        box-sizing: border-box;
        padding: 5px 10px;
        width: 80%;
        font-size: 1.5rem;
    }
    select{
        padding: 5px 5px;
    }
    h1, h2, h3{
        font-weight: normal;
        margin: 0;
    }
    h1{
        font-size: 2rem;
        margin-bottom: 5px;
    }
</style>