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
    const showMenu = ref(false)
    
    const handleView = () => {
        router.push('/view')
    }
    const handleQuiz = () => {
        router.push('/quiz')
        console.log(route.name)
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
            <button :class="route.name === 'View' ? 'active' : 'inactive'" @click="handleView">
                View
            </button>
            <button :class="route.name === 'Quiz' ? 'active' : 'inactive'" @click="handleQuiz">
                Quiz
            </button>
            <button :class="route.name === 'Add' ? 'active' : 'inactive'" v-if="isAuthenticated" @click="handleAdd">
                Add
            </button>
            <button :class="route.name === 'Account' ? 'active' : 'inactive'" v-if="isAuthenticated" @click="handleAccount">
                Account
            </button>
            <button class="inactive" v-if="isAuthenticated" @click="handleLogout">
                Logout
            </button>
        </div>
        <i class="pi pi-bars" @click="showMenu = !showMenu">
            <ul class="menu-options" v-if="showMenu">
                <li :class="route.name === 'View' ? 'active' : 'inactive'" @click="handleView">
                    View
                </li>
                <li :class="route.name === 'Quiz' ? 'active' : 'inactive'" @click="handleQuiz">
                    Quiz
                </li>
                <li :class="route.name === 'Add' ? 'active' : 'inactive'" v-if="isAuthenticated" @click="handleAdd">
                    Add
                </li>
                <li :class="route.name === 'Account' ? 'active' : 'inactive'" v-if="isAuthenticated" @click="handleAccount">
                    Account
                </li>
                <li class="inactive" v-if="isAuthenticated" @click="handleLogout">
                    Logout
                </li>
            </ul>
        </i>
    </nav>
</template>

<style scoped>
    h2{
        font-style: normal;
        color: white;
        box-sizing: border-box;
        padding: 5px 20px;
    }
    @media (max-width: 768px) {
        h2{
            padding: 5px 5px;
        }
    }
    .navbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        box-sizing: border-box;
        background: var(--primary-gradient);
    }
    .btn-group{
        display: flex;
        justify-content: space-evenly;
        column-gap: 10px;
        box-sizing: border-box;
        padding: 5px 20px;
    }
    @media (max-width: 768px){
        .btn-group{
            display: none;
            box-sizing: border-box;
            padding: 5px 5px;
        }
    }
    .btn-group button{
        padding: 5px 15px;
        border: 1px solid #231f20;
        border-width: 1px;
        border-radius: 5px;
        text-align: center;
        color: black;
    }
    .btn-group button.active{
        background-color: lightgray;
        color: black;
    }
    .btn-group button.inactive, ul.menu-options > li.inactive{
        background-color: white;
    }
    i.pi-bars{
        position: relative;
        display: flex;
        color: white;
        box-sizing: border-box;
        padding: 0px 10px;
        font-size: 1.5rem;
    }
    ul.menu-options{
        position: absolute;
        right: 0;
        top: 50%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100vw;
        z-index: 1;
    }
    ul.menu-options > li {
        padding: 10px 5px;
        background-color: white;
        border: 1px solid black;
        border-top: none;
        color: black;
        list-style: none;
    }
    ul.menu-options > li.active{
        background-color: var(--primary);
        color: white;
    }
    ul.menu-options > li:first-of-type{
        border-top: 1px solid black;
    }
    @media (min-width: 768px){
        i.pi-bars{
            display: none;
        }
    }
</style>