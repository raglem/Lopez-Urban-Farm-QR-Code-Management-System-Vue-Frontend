import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user', () => {
    const _id = ref('')
    const username = ref('')
    const role = ref('')
    const isAuthenticated = ref(false)

    onMounted(() => {
        checkAuthentication()
    })

    function login(_idParam, usernameParam, roleParam){
        _id.value = _idParam
        username.value = usernameParam
        role.value = roleParam
        isAuthenticated.value = true
        
        localStorage.setItem('_ID', _idParam)
        localStorage.setItem('USERNAME', usernameParam)
        localStorage.setItem('ROLE', roleParam)
    }
    function logout(){
        username.value = ''
        role.value = ''
        isAuthenticated.value = false

        localStorage.clear()
    }
    function checkAuthentication(){
        const token = localStorage.getItem('ACCESS_TOKEN')
        if(!token){
            logout()
            return false
        }
    
        // Check if token is invalid or expired
        try{
            const expTime = jwtDecode(token)?.exp
            const isExpired = expTime * 1000 <= Date.now()
            if(isExpired){
                logout()
                return false
            }
        }
        catch(err){
            logout()
            return false
        }

        login(localStorage.getItem('_ID'), localStorage.getItem('USERNAME'), localStorage.getItem('ROLE'))
        return true
    }
    return { _id, username, role, isAuthenticated, login, logout, checkAuthentication }
})