import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user', () => {
    onMounted(() => {
        checkAuthentication()
    })
    const user = ref({
        username: '',
        role: ''
    })
    const isAuthenticated = ref(false)
    function login(username, role){
        user.value.username = username
        user.value.role = role
        isAuthenticated.value = true
    }
    function logout(){
        user.value.username = ''
        user.value.role = ''
        isAuthenticated.value = false
    }
    function checkAuthentication(){
        const token = localStorage.getItem('ACCESS_TOKEN')
        if(!token){
            logout()
            return false
        }
    
        const expTime = jwtDecode(token)?.exp
        const isExpired = expTime * 1000 <= Date.now()
        if(isExpired){
            logout()
            return false
        }

        login(localStorage.getItem('USERNAME'), localStorage.getItem('ROLE'))
        return true
    }
    return { user, isAuthenticated, login, logout, checkAuthentication }
})