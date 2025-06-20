import { createApp } from 'vue'
import ToastPlugin from 'vue-toast-notification'
import router from './router'
import './style.css'
import './styles.scss'
import App from './App.vue'

createApp(App)
    .use(router)
    .use(ToastPlugin)
    .mount('#app')
