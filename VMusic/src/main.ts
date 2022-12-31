import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import VueSplide from '@splidejs/vue-splide'
import '@arco-design/web-vue/dist/arco.less'
import '@splidejs/splide/css'
import './assets/style.scss'
import router from './router'
import App from './App.vue'

createApp(App)
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(VueSplide)
  .mount('#app')
