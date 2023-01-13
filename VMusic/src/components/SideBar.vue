<template>
  <div id="sidebar">
    <h1>
      <img src="../assets/music.svg" height="20" alt="音乐" />&ensp;EN音乐
    </h1>
    <div class="navs">
      <h3>在线音乐</h3>
      <ul class="list">
        <li
          v-for="(link, index) in ols"
          :class="index == current && 'active'"
          :key="index"
          @click="linkFn(index)"
        >
          <img
            v-if="link.icon"
            :src="`/src/assets/img/icons/${link.icon}${
              index == current ? '_active' : ''
            }.svg`"
            alt=""
          />
          {{ link.val }}
        </li>
      </ul>
    </div>
    <div class="user">
      <a-button
        v-if="!profile?.userId"
        size="small"
        type="outline"
        status="success"
        @click="setModalVisible('login', true)"
        >登录</a-button
      >
      <p v-else>{{ profile.nickname }}</p>
    </div>
  </div>
  <login-modal v-if="!profile?.userId"></login-modal>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { routeCfg } from '@/utils/types/route.type'
import { useShowModals, useAccount } from '@/utils/hooks'
import loginModal from '@/components/Modals/Login.vue'

const router = useRouter()
const [, setModalVisible] = useShowModals()
const [{ profile }] = useAccount()
const current: Ref<number> = ref(0)
const ols: Ref<routeCfg[]> = ref([
  { val: '音乐馆', path: '/home', icon: `musics` },
  { val: 'MV', path: '/mv', icon: 'MV' },
  { val: '电台', path: '/station', icon: 'station' }
])

function linkFn(ind: number): void {
  current.value = ind
  router.push({
    path: ols.value[ind].path
  })
}
</script>
<style lang="scss" scoped>
$indent: 12px;
$sidebg: #f3f6fa;
h1 {
  font: {
    size: 20px;
    weight: 300;
  }
  line-height: 26px;
  padding: 15px 5px 25px;
  text-indent: $indent - 6;
}
h3 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  color: $textlight;
  text-indent: $indent;
}
#sidebar {
  float: left;
  display: flex;
  flex-flow: column;
  width: $sidewidth;
  height: 100%;
  padding: 0 15px;
  position: relative;
  background-color: $sidebg;
}
.list {
  padding-top: 10px;
  li {
    padding-left: $indent;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      color: $mygreen;
    }
    &.active {
      color: #fff;
      @include linerBg;
    }
    img {
      height: 14px;
      margin: -3px 4px 0 0;
    }
  }
}
.navs {
  flex: 1;
}
.user {
  padding: 10px 15px;
  text-align: center;
}
</style>
