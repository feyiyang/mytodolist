<template>
  <div class="interface" v-if="onInterface">
    <span class="close" @click="onInterface = false">收起</span>
    <div class="cover">
      <a-image class="img" :src="player.current?.al.picUrl"></a-image>
    </div>
    <a-scrollbar
      ref="scRef"
      outer-class="lyric"
      style="height: 100%; overflow-y: auto"
    >
      <strong>{{ player.current?.name }}</strong>
      <p
        v-for="(ly, index) in lyrics"
        :key="index"
        :class="{ active: curLine === index }"
      >
        {{ ly.l }}
      </p>
    </a-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePlayer } from '@/utils/hooks'

const { player, onInterface, playerSubs } = usePlayer()
const lyrics = computed(() => {
  if (!player.lyric.lyric) return
  let ret: { t: string; l: string; nt: number }[] = []
  player.lyric.lyric.split('\n').forEach((ly: any) => {
    const reg = /.*]/
    const t = ly.match(reg) ? ly.match(reg)[0] : ''
    const l = ly.split(reg)[1]
    let nt = t.replace(/(\[|\])/g, '')
    let [mstr, sstr] = nt.split(':')
    if (mstr) {
      let [ss, mm] = sstr.split('.')
      ss = ss * 1000
      nt = mstr * 60000 + mm * 1 + ss
    }
    ret.push({ t, l, nt })
  })
  return ret
})
const scRef = ref()
const eleWrap = ref<Element>(document.querySelector('.interface') as Element)
let tempCur = 0
const curLine = computed(() => {
  if (!lyrics.value) return 0
  let nowStr: any = player.now + ''
  const ind: number = nowStr.indexOf('.')
  nowStr = nowStr.substring(0, ind + 4)
  nowStr = nowStr.replace('.', '')
  nowStr = 1 * nowStr

  if (nowStr + 100 >= lyrics.value[tempCur].nt) {
    tempCur++
    const eleAct = eleWrap.value?.querySelector('.active') as HTMLElement
    const eleT = eleAct ? eleAct.offsetTop : 0
    scRef.value && scRef.value.scrollTop(eleT - 200)
  }
  return tempCur - 1
})

onMounted(() => {
  playerSubs('current', (val) => {
    tempCur = 0
  })
  nextTick(() => {
    eleWrap.value = document.querySelector('.interface') as Element
  })
})
</script>
<style lang="scss">
.interface {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 60px);
  height: calc(100% - 70px);
  display: flex;
  align-items: center;
  padding: 20px 30px 50px;
  justify-content: space-between;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  .cover {
    width: 30%;
  }
  .lyric {
    width: 55%;
    height: 90%;
    overflow-y: auto;
    white-space: pre-line;
    line-height: 1.4;
    p {
      padding: 10px 0;
      &.active {
        color: $mygreen;
      }
    }
  }
}
</style>
