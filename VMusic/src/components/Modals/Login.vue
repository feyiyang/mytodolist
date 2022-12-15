<template>
  <a-modal v-model:visible="modalsVisible.login" destroyOnClose :bodyStyle="{paddingTop: '5px'}" width="400px" :title="null" :footer="null">
    <a-tabs v-model:activeKey="activeTab" @change="tabChange">
      <a-tab-pane key="1" tab="邮箱登录">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="onLogin" @finishFailed="onLoginFailed">
          <a-form-item name="email" :rules="[{ required: true, message: '请输入邮箱!' }]">
            <a-input v-model:value="formState.email" placeholder="邮箱" />
          </a-form-item>
          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="formState.password" placeholder="密码" />
          </a-form-item>
          <a-form-item name="remember">
            <a-checkbox v-model:checked="formState.remember">记着我</a-checkbox>
          </a-form-item>
          <a-form-item class="btns">
            <a-button :disabled="loginDisabled" type="primary" html-type="submit" class="login-form-button">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="二维码登录">
        <div class="qr_wrap">
          <img class="qr_img" :src="qrimg" alt="">
          <p>{{qrstate.message}}<a-button v-if="qrstate.code === 800">刷新</a-button></p>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useShowModals, useLoginState } from '@/utils/hooks'
import { loginState } from '@/utils/types/user.type'
import { userApi } from '@/api'
import { docCookies } from '@/utils/cookie'

const [modalsVisible, setModalVisible] = useShowModals()
const [isLogin, setLoginState] = useLoginState()
const activeTab = ref<string>('1')
const formState = reactive<loginState>({
  email: '',
  password: '',
  remember: true,
})
const loginDisabled = computed<boolean>(() => {
  return !(formState.email && formState.password)
})
const qrimg = ref<string>('')
const qrkey = ref<string>('')
const qrstate = reactive<{code?: number, message?: string}>({})

!qrkey.value && getQrKey()
function onLogin(): void {
  userApi.loginEmail({
    email: formState.email,
    password: formState.password
  }).then((res: any) => {
    console.log(res)
  })
}

function onLoginFailed(): void {}
function getQrKey(): void {
  userApi.loginQrKey().then((res: any) => {
    qrkey.value = res.unikey
  })
}
function getQrImg(): void {
  userApi.loginQrCreate({
    key: qrkey.value
  }).then((res: any) => {
    qrimg.value = res.qrimg
    qrCheck()
  })
}
let checkTimer: any = null
function qrCheck(): void {
  clearTimeout(checkTimer)
  userApi.loginQrCheck({
    key: qrkey.value
  }).then((res: any) => {
    qrstate.message = res.message
    qrstate.code = res.code
    if (res.code !== 803) {
      checkTimer = setTimeout(() => {
        qrCheck()
      }, 5000)
    } else if (res.code === 800) {

    } else {
      docCookies.setItem('login', encodeURIComponent(res.cookie))
      setLoginState(true)
    }
  }).catch((err: any) => {
    checkTimer = setTimeout(() => {
      qrCheck()
    }, 5000)
  })
}
function tabChange(val: any) {
  const isqr: boolean = val == '2'
  isqr && !qrimg.value && getQrImg()
}
</script>
<style lang="scss" scoped>
::v-deep .ant-tabs-nav{
  margin-bottom: 24px;
}
.btns{
  margin: 0;
}
.login-form-button {
  width: 100%;
}
.qr_wrap{
  height: 200px;
  text-align: center;
}
.qr-img{
  display: block;
  margin: 0 auto;
  width: 160px;
}
</style>