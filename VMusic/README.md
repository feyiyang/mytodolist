```
npm install
npm run dev
```

### IDE：VSCode

[vue IDE 支持(Volar)](https://cn.vuejs.org/guide/scaling-up/tooling.html#ide-support)、Prettier-Code formater、Prettier Eslint

### Vue3 + TypeScript + Vite

[vite](https://vitejs.cn/vite3-cn/)初始化项目

#### 代码格式

`npm run format`自动格式化 eslint + prettier

### vue-router4

router.ts 按[文档](https://router.vuejs.org/zh/)配置路由

### axios 封装

src/api/featch 封装[axios](https://www.axios-http.cn/)并对 api 提供方法, src/api/servers 提供接口 api 枚举， /src/api/index 对外提供所有 api

### css 预处理器 scss

src/assets/vars.scss 定义全局变量

### ui 框架

[Arco Design Vue](https://arco.design/vue/docs/start)

### 参考

[Web Audio](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API) [云 api](https://neteasecloudmusicapi-docs.4everland.app/#/)

### 结构

```
目录
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
│          song.ts
│          user.ts
│
├─assets
│  │  music.svg
│  │  style.scss
│  │  vars.scss
│  │
│  └─img
│      └─icons
│              musics.svg
│              musics_active.svg
│              MV.svg
│              MV_active.svg
│              station.svg
│              station_active.svg
│
├─components
│      SideBar.vue
│      TopBar.vue
│
├─utils
│  └─types
│          route.type.ts
│          user.type.ts
│
└─views
        Home.vue
        Mv.vue
        searchResult.vue
        Station.vue
```
