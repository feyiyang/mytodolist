```
npm install -g netlify-cli
npm install
ntl dev
```

vue更行到3了，想着用来做一个项目。水平一般，望多多指教，如果觉得还行也望给个Star。本项目仅个人学习用，更新功能不全请轻喷。下面是项目的思路或框架  

推荐nvm管理node版本。  

### IDE：VSCode
[vue IDE 支持(Volar)](https://cn.vuejs.org/guide/scaling-up/tooling.html#ide-support)、Prettier-Code formater、Prettier Eslint

### Vite + Vue3 + TypeScript
创建项目可用vite或vue-create, 此项目使用vite 选择vue + ts。  
[vite](https://vitejs.cn/vite3-cn/)创建 `npm create vite@latest` ，  
或用[vue-create](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)创建 `npm init vue@latest`。 

#### 代码格式
自动格式化 eslint + prettier，这两个格式化配置可以百度下 vite vue3 ts eslint prettier 参考比较新的文章  
安装eslint、[eslint-plugin-vue](https://eslint.vuejs.org/user-guide/)、[typescript-eslint](https://typescript-eslint.io/getting-started)及相关  
`npm install eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin -D`  
创建文件.eslintrc.cjs并配置, 或`eslint --init` 生成配置文件[.eslintrc.*](https://zh-hans.eslint.org/docs/latest/user-guide/configuring/configuration-files)  
安装prettier、[eslint-config-prettier](https://prettier.io/docs/en/install.html#eslint-and-other-linters)、eslint-plugin-prettier  
`npm install prettier eslint-config-prettier eslint-plugin-prettier -D`  
创建.prettierrc.cjs  
完成配置后 `npm run format` 可以自动格式化项目里的代码了。

### vue-router4
安装[vue-router](https://router.vuejs.org/zh/installation.html) `npm install vue-router@4`  
src下创建router.ts 按[文档](https://router.vuejs.org/zh/)配置路由  

### axios 封装
1. src/api/featch 封装[axios](https://www.axios-http.cn/)并对 api 提供方法
2. src/api/servers 提供接口 api 枚举
3. src/api/index 对外暴露 api

### 状态管理
src/utils/hooks.ts 管理全局Store状态

### css 预处理器 scss
src/assets/vars.scss 定义全局变量

### ui 框架
[Arco Design Vue](https://arco.design/vue/docs/start)

### 部署

```sh
# 安装 Netlify CLI
npm install -g netlify-cli

# 在 Netlify 中创建一个新站点
ntl init

# 部署一个独一无二的预览 URL
ntl deploy
```
使用[netlify](https://vitejs.cn/vite3-cn/guide/static-deploy.html#netlify)部署在网络上  

### 参考
[Web_Audio_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)， QQ音乐界面，网易云音乐界面和api    

---
### 结构
```
目录
├─netlify 云函数 跨域调用接口

│  App.vue
│  main.ts
│  router.ts
│  vite-env.d.ts
│  
├─api
│  │  featch.ts
│  │  index.ts
│  │  
│  └─servers
│          blocks.ts
│          song.ts
│          user.ts
│          
├─assets
│  │  music.svg
│  │  style.scss
│  │  vars.scss
│  │  
│  └─img
│      │  default.svg
│              
├─components
│  │  PlayBar.vue
│  │  SideBar.vue
│  │  TopBar.vue
│  │  
│  ├─HomeSlider
│  │      index.vue
│  │      
│  └─Modals
│          Login.vue
│          PlayFace.vue
│          
├─utils
│  │  cookie.ts
│  │  hooks.ts
│  │  index.ts
│  │  
│  └─types
│          playlist.type.ts
│          route.type.ts
│          user.type.ts
│          
└─views
    │  Mv.vue
    │  searchResult.vue
    │  Station.vue
    │  
    ├─home
    │      blocks.vue
    │      index.vue
    │      
    ├─playlists
    │  │  catlist.vue
    │  │  index.vue
    │  │  
    │  └─hook
    │          list.ts
    │          
    ├─singers
    │      detail.vue
    │      index.vue
    │      
    ├─song
    │      detail.vue
    │      
    └─toplists
            index.vue
```

**特别鸣谢**[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)  
**本项目仅用于个人学习，勿用于商业及非法用途**  
