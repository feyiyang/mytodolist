<template>
  <div class="playbar">
    <div class="onplay"></div>
    <div class="play_handlers">
      <icon-skip-previous-fill class="pre btn" />
      <icon-loading v-if="loading" />
      <component v-else :is="`icon-${onPlay ? 'pause' : 'play'}-circle-fill`" class="play btn" @click="onPlay = !onPlay"></component>
      <icon-skip-next-fill class="next btn" />
    </div>
    <div class="extra_handlers">
      <span class="list" @click="visible = !visible">
        <icon-list class="ico_list" />{{ queue.length }}
      </span>
    </div>
    <a-slider class="slider_bar" :min="0" :max="50" />
  </div>
  <audio ref="audioElem" :src="media?.url" />
  <a-drawer popup-container="#app" :visible="visible">
    <template #header>
      <p class="title">播放队列</p>
      <p class="sub_tit"></p>
    </template>
    <template #footer>
      <icon-list class="ico_list" @click="visible = !visible" />
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, nextTick } from 'vue'
import { usePlayer } from '@/utils/hooks'
import { songApi } from '@/api';

const audioElem = ref<HTMLAudioElement>()
const { player: playsongs, playerSubs } = usePlayer()
const { list: queue, current: songInfo, playing: onPlay } = toRefs(playsongs)
const loading = ref<boolean>(false)
const media = ref()
const visible = ref<boolean>(false)
const canPlay = ref<boolean>(!!media.value?.url)
onMounted(() => {
  let getTimer: any = null
  playerSubs('current', (val) => {
    clearTimeout(getTimer)
    songInfo.value = val
    getTimer = setTimeout(() => {
      loading.value = true
      songApi.getUrl({ id: songInfo.value?.id }).then(res => {
        media.value = res[0]
      }).finally(() => {
        loading.value = false
      })
    }, 400)
    if (audioElem.value) {
      audioElem.value.oncanplay = () => {
        audioElem.value?.play()
      }
    }
  })
})

</script>
<style lang="scss" scoped>
.playbar {
  position: relative;
  display: flex;
  height: 70px;
  align-items: center;
  .play_handlers {
    flex: 1;
    padding: 0 20px;
    font-size: 25px;
    .btn {
      &.play {
        font-size: 40px;
      }
    }
    display: flex;
    // justify-content: center;
    align-items: center;
  }
  .extra_handlers {
    padding-right: 30px;
    
  }
  .slider_bar {
    position: absolute;
    left: 0;
    top: -8px;
    width: 100%;
  }
}
.ico_list {
    font-size: 20px;
  }
</style>
