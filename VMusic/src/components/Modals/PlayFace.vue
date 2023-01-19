<template>
  <div class="interface" v-if="onInterface">
    <span class="close" @click="onInterface = false">收起</span>
    <div class="cover">
      <a-image class="img" :src="player.current?.al.picUrl"></a-image>
    </div>
    <a-scrollbar outer-class="lyric" style="height: 100%; overflow-y: auto">
      <strong>{{ player.current?.name }}</strong>
      <p v-for="(ly, index) in lyrics" :key="index">
        {{ ly.l }}
      </p>
    </a-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '@/utils/hooks'

const { player, onInterface } = usePlayer()
const lyrics = computed(() => {
  let ret: { t: string; l: string }[] = []
  const lyArr = player.lyric.lyric.split('\n').forEach((ly: any) => {
    const reg = /.*]/
    const t = ly.match(reg) ? ly.match(reg)[0] : ''
    const l = ly.split(reg)[1]
    ret.push({ t, l })
    console.log(t, l)
  })
  return ret
})
</script>
<style lang="scss">
.interface {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 60px);
  height: calc(100% - 20px);
  display: flex;
  align-items: center;
  padding: 20px 30px 0;
  justify-content: space-between;
  z-index: 100;
  background-color: #000;
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
    }
  }
}
</style>
