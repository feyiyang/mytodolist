<template>
  <a-modal
    v-model:visible="modalsVisible.login"
    destroyOnClose
    :bodyStyle="{ paddingTop: '5px' }"
    width="400px"
    title=" "
    title-align="start"
    :footer="false"
    @close="closeModel"
  >
    <template #title>
      <a-tabs
        v-model:activeKey="activeTab"
        type="text"
        header-padding
        justify
        @change="tabChange"
      >
        <a-tab-pane key="1" title="邮箱登录"></a-tab-pane>
        <a-tab-pane key="2" title="二维码登录"></a-tab-pane>
      </a-tabs>
    </template>
    <a-form
      v-if="activeTab === '1'"
      :model="formState"
      auto-label-width
      autocomplete="off"
      @submit="onLogin"
      @submit-failed="onLoginFailed"
    >
      <a-form-item
        field="email"
        :rules="[{ required: true, message: '请输入邮箱!' }]"
      >
        <a-input v-model:value="formState.email" placeholder="邮箱" />
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="密码"
        />
      </a-form-item>
      <a-form-item field="remember">
        <a-checkbox v-model:checked="formState.remember">记着我</a-checkbox>
      </a-form-item>
      <a-form-item class="btns">
        <a-button
          :disabled="loginDisabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
    <div v-else class="qr_wrap">
      <img class="qr_img" :src="qrimg" alt="" />
      <p>
        {{ qrstate.message
        }}<a-button v-if="qrstate.code === 800" @click="getQrImg"
          >刷新</a-button
        >
      </p>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import {
  useShowModals,
  useLoginState,
  useStorage,
  useAccount
} from '@/utils/hooks'
import { loginState } from '@/utils/types/user.type'
import { userApi } from '@/api'

const [modalsVisible, setModalVisible] = useShowModals()
const [, setLoginState] = useLoginState()
const storage = useStorage()
const activeTab = ref<string>('1')
const formState = reactive<loginState>({
  email: '',
  password: '',
  remember: true
})
const loginDisabled = computed<boolean>(() => {
  return !(formState.email && formState.password)
})
const qrimg = ref<string>('')
const qrkey = ref<string | null>(null)
const qrstate = reactive<{ code?: number; message?: string }>({})

!qrkey.value && getQrKey()
function onLogin(): void {
  userApi
    .loginEmail({
      email: formState.email,
      password: formState.password
    })
    .then((res: any) => {
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
  userApi
    .loginQrCreate({
      key: qrkey.value
    })
    .then((res: any) => {
      qrimg.value = res.qrimg
      qrCheck()
    })
}
let checkTimer: any = null
function qrCheck(): void {
  clearTimeout(checkTimer)
  userApi
    .loginQrCheck({
      key: qrkey.value
    })
    .then((res: any) => {
      qrstate.message = res.message
      qrstate.code = res.code
      if (res.code !== 803) {
        checkTimer = setTimeout(() => {
          qrCheck()
        }, 6000)
      } else if (res.code === 800) {
      } else {
        storage.set('token', encodeURIComponent(res.cookie))
        setLoginState(true)
        useAccount()
        setModalVisible('login', false)
      }
    })
    .catch((err: any) => {
      console.log(err)
      checkTimer = setTimeout(() => {
        qrCheck()
      }, 6000)
    })
}
function tabChange(val: any) {
  clearTimeout(checkTimer)
  const isqr: boolean = val == '2'
  if (isqr) {
    qrimg.value ? qrCheck() : getQrImg()
  }
}
function closeModel() {
  clearTimeout(checkTimer)
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 24px;
}
.btns {
  margin: 0;
}
.login-form-button {
  width: 100%;
}
.qr_wrap {
  height: 200px;
  text-align: center;
}
.qr-img {
  display: block;
  margin: 0 auto;
  width: 160px;
}
:deep(.arco-tabs-nav) {
  top: 10px;
}
</style>
