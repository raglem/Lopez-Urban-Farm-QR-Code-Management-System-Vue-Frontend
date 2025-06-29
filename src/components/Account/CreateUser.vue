<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../../api.js'
    import Loading from '../Loading.vue'
    import toastConfig from '../../assets/toastNotification.js';

    const props = defineProps(['message'])
    const emit = defineEmits(['continue', 'close'])

    const username = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const $toast = useToast()

    const handleCreate = async () => {
        loading.value = true
        try {
            const response = await api.post('/users/add-user/', {
                username: username.value,
                password: password.value
            })
            $toast.success(`User ${username.value} created`, toastConfig('success'));
            console.log(response)
            emit('continue', { _id: response.data.user._id, username: username.value, role: response.data.user.role })
        } catch (err) {
            console.log(err)
            if(err?.response?.data?.message){
                $toast.error(`Error creating user: ${err.response.data.message}`, toastConfig('error'));    
            }
            else if(err.message){
                $toast.error(`Error creating user: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error creating user', toastConfig('error'));
            }
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="overlay">
        <form @submit.prevent>
            <h1>New User</h1>
            <div class="input-group">
                <div>
                    <div class="input-wrapper">
                        <input type="text" id="username" v-model="username" placeholder="Username" />
                    </div>
                </div>
                <div class="password-wrapper">
                    <div class="input-wrapper">
                        <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" />
                        <span @click="() => showPassword = !showPassword">show</span>
                    </div>
                    <p>The new user can change their password after using the provided credentials</p>
                </div>
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-wrapper">
                <button class="create" @click="handleCreate">
                    Create
                </button>
                <button class="cancel" @click="emit('close')">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }
    form{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-width: 300px;
        width: 50vw;
        max-width: 600px;
        background-color: white;
        row-gap: 20px;
        padding: 20px;
        box-shadow: 0px 0px 40 rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        z-index: 2;
    }
    .input-group{
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .input-wrapper{
        display: flex;
        align-items: center;
        border: 1px solid black;
        padding: 10px;
    }
    .input-wrapper input{
        border: none;
        outline: none;
        font-size: 1.5rem;
        width: 100%;
    }
    .input-wrapper span{
        right: 10px;
        color: var(--primary);
    }
    .input-wrapper span:hover{
        cursor: pointer;
    }
    .password-wrapper p{
        font-size: 0.9rem;
        font-style: italic;
        color: rgb(75, 75, 75);
        margin: 2px 0px 0px 0px;
    }
    .loading-wrapper{
        display: flex;
        justify-content: center;
    }
    .btn-wrapper{
        display: flex;
        justify-content: flex-end;
        column-gap: 10px;
    }
    button{
        padding: 10px;
        border: none;
        border-radius: 5px;
    }
    .create{
        background-color: var(--primary);
        color: white;
    }
    .cancel{
        background-color: lightgray;
        color: black;
    }
    h1{
        font-weight: normal;
        font-size: 2.5rem;
        margin: 0;
    }
      
</style>