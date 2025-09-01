import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import your vanilla CSS
import './assets/style.css'

createApp(App).use(router).mount('#app')
