<script setup>
    import { ref, inject } from 'vue'
    import { storeToRefs } from 'pinia';
    import { useRouter, useRoute } from 'vue-router'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from "../assets/toastNotification.js"
    import { useUserStore } from '../stores/user.js';

    const router = useRouter()
    const route = useRoute()
    const store = useUserStore()
    const $toast = useToast()

    const { isAuthenticated } = storeToRefs(store)
    const { logout } = store
    
    const handleView = () => {
        router.push('/view')
    }
    const handleAdd = () => {
        if(isAuthenticated){
            router.push('/add')
        }
    }
    const handleAccount = () => {
        if(isAuthenticated){
            router.push('/account')
        }
    }
    const handleLogout = () => {
        logout()
        router.push('/login')

        $toast.success('You have successfully logged out', toastConfig('success'))
    }
</script>

<template>
    <nav class="navbar">
        <h2>Lopez Urban Farm</h2>

        <div class="btn-group">
            <button class="inactive" @click="handleView">
                View
            </button>
            <button class="inactive" v-if="isAuthenticated" @click="handleAdd">
                Add
            </button>
            <button class="inactive" v-if="isAuthenticated" @click="handleAccount">
                Account
            </button>
            <button class="inactive" v-if="isAuthenticated" @click="handleLogout">
                Logout
            </button>
        </div>
    </nav>
</template>

<style scoped>
    h2{
        font-style: normal;
        color: white;
    }
    .navbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 5px 20px;
        box-sizing: border-box;
        background: var(--primary-gradient);
        border: 1px solid green;
    }
    .btn-group{
        display: flex;
        justify-content: space-evenly;
        column-gap: 10px;
    }
    .btn-group button{
        padding: 5px 15px;
        border-width: 1px;
        border-radius: 5px;
        text-align: center;
        color: black;
    }
    .btn-group button.active{
        background-color: lightgray;
    }
    .btn-group button.inactive{
        background-color: white;
    }
</style>