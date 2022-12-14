import { createApp } from 'vue'
import Antd, { ConfigProvider } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.variable.min.css'
import './assets/style.scss'
import router from './router'
import App from './App.vue'

ConfigProvider.config({
  theme: {
    primaryColor: '#66cc99',
  }
})

createApp(App).use(router).use(Antd).mount('#app')
