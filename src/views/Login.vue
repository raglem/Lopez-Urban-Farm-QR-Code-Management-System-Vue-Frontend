<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../api.js'
    import Loading from '../components/Loading.vue'
    import toastConfig from '../assets/toastNotification.js';

    const username = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)

    const router = useRouter()
    const $toast = useToast()

    const toggleShowPassword = () => {
        showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
        loading.value = true
        localStorage.clear()
        try {
            const response = await api.post('/users/login/', {
                username: username.value,
                password: password.value
            })
            localStorage.setItem('ACCESS_TOKEN', response.data.token)
            localStorage.setItem('USERNAME', username.value)
            localStorage.setItem('ROLE', response.data.role)
            router.push('/view')
        } catch (error) {
            $toast.error('Login failed. Please check your credentials.', toastConfig('error'))
            console.error(error)
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="wrapper">
        <div class="card">
            <h1>Sign in</h1>
            <div class="input-group">
                <div class="input-wrapper">
                    <input type="text" id="username" v-model="username" placeholder="Username" />
                </div>
                <div class="input-wrapper">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" />
                    <span @click="toggleShowPassword">show</span>
                </div>
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-wrapper">
                <button @click="handleLogin">
                    Sign in
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .wrapper{
        display: flex;
        justify-content: center;
        align-items: center;   
        height: 100%;
    }
    .card{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: stretch;
        min-width: 300px;
        width: 50%;
        max-width: 768px;
        padding: 20px;
        row-gap: 20px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1{
        font-size: 2.5rem;
        margin: 0;
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
        column-gap: 10px;
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
    .loading-wrapper, .btn-wrapper{
        display: flex;
        justify-content: center;
    }
    .card > .btn-wrapper > button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 480px;
        padding: 10px;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: 20px;
    }
</style>