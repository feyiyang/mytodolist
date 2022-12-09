import { createApp } from 'vue'
import Idux from './idux'
import './assets/style.scss'
import App from './App.vue'

createApp(App).use(Idux).mount('#app')
