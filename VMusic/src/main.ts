import { createApp } from 'vue'
import Idux from './idux'
import './style.css'
import App from './App.vue'

createApp(App).use(Idux).mount('#app')
