import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import store from './store/store' 
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())  
app.use(router)
app.use(store)         
app.mount('#display')
