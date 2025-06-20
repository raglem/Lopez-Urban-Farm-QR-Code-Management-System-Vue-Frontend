import { jwtDecode } from 'jwt-decode'
const isAuthenticated = () => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    if(!token)  return false
  
    const expTime = jwtDecode(token)?.exp
    const isExpired = expTime * 1000 > Date.now()
    if(!isExpired)    return false
    return true
}
export default isAuthenticated