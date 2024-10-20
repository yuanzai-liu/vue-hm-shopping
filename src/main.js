import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/utils/vant-ui'
import App from './App.vue'
import router from './router'
import '@/styles/common.less'
import piniaPersist from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)
app.mount('#app')
