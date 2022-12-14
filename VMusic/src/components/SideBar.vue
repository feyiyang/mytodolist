<template>
  <div id="sidebar">
    <h1><img src="@/assets/music.svg" height="20" alt="音乐">&ensp;EN音乐</h1>
    <div class="navs">
      <h3>在线音乐</h3>
      <ul class="list">
        <li v-for="(link, index) in ols" :class="index == current && 'active'" :key="index" @click="linkFn(index)">
          <img v-if="link.icon" :src="`/src/assets/img/icons/${link.icon}${index == current ? '_active' : ''}.svg`" alt="">
          {{link.val}}
        </li>
      </ul>
    </div>
    <div class="user">
      <a-button size="small" @click="loginVisble = true">登录</a-button>
    </div>
  </div>
  <a-modal v-model:visible="loginVisble" title="邮箱登录" width="400px" :footer="null">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onLogin"
      @finishFailed="onLoginFailed"
    >
      <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱!' }]">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button :disabled="loginDisabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
        Or
        <a href="">register now!</a>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { Ref, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { routeCfg } from '@/utils/types/route.type'
import { loginState } from '@/utils/types/user.type'

const router = useRouter()
const current: Ref<number> = ref(0)
const loginVisble: Ref<boolean> = ref(false)  
const ols: Ref<routeCfg[]> = ref([
  { val: '音乐馆', path: '/home', icon: `musics` },
  { val: 'MV', path: '/mv', icon: 'MV' },
  { val: '电台', path: '/station', icon: 'station' }
])
const formState = reactive<loginState>({
  email: '',
  password: '',
  remember: true,
})
const loginDisabled = computed(() => {
  return !(formState.email && formState.password)
})

function linkFn(ind: number): void {
  current.value = ind
  router.push({
    path: ols.value[ind].path
  })
}
function onLogin(): void {}
function onLoginFailed(): void {}
</script>
<style lang="scss" scoped>
$indent: 12px;
$sidebg: #f4f1ff;
h1 {
  font: {
    size: 20px;
    weight: 300;
  }
  line-height: 26px;
  padding: 5px;
  text-indent: $indent - 6;
}
h3 {
  font-size: 14px;
  color: $textligth;
  text-indent: $indent;
}
#sidebar{
  float: left;
  display: flex;
  flex-flow: column;
  width: $sidewidth;
  height: 100%;
  padding: 5px 15px;
  position: relative;
  background-color: $sidebg;
}
.list {
  padding-top: 5px;
  li {
    padding-left: $indent;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      color: $mygreen;
    }
    &.active{
      background-color: $mygreen;
      color: #fff;
    }
    img{
      height: 14px;
      margin: -3px 4px 0 0;
    }
  }
}
.navs{
  flex: 1;
}
.user{
  padding: 10px 15px;
  text-align: center;
}
</style>