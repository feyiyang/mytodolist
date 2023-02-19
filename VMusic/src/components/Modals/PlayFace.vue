<template>
  <div class="interface" v-if="onInterface">
    <span class="close" @click="onInterface = false">收起</span>
    <div class="cover">
      <a-image class="img" :src="player.current?.al?.picUrl"></a-image>
      <canvas id="oscilloscope"></canvas>
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
import { ref, computed, onMounted, nextTick, defineProps } from 'vue'
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
const props = defineProps(['audioCtx', 'analyserNode'])
var bufferLength: any
var dataArray: any
let drawVisual: any

let tempCur = 0
const curLine = computed(() => {
  if (!lyrics.value) return 0
  let nowStr: any = player.now + ''
  const ind: number = nowStr.indexOf('.')
  nowStr = nowStr.substring(0, ind + 4)
  nowStr = nowStr.replace('.', '')
  nowStr = 1 * nowStr

  if (lyrics.value[tempCur] && nowStr + 100 >= lyrics.value[tempCur].nt) {
    tempCur++
    const eleAct = eleWrap.value?.querySelector('.active') as HTMLElement
    const eleT = eleAct ? eleAct.offsetTop : 0
    scRef.value && scRef.value.scrollTop(eleT - 200)
  }
  return tempCur - 1
})

let canvas: any
let canvasCtx: any
onMounted(() => {
  playerSubs('current', (val) => {
    tempCur = 0
  })
  nextTick(() => {
    eleWrap.value = document.querySelector('.interface') as Element
  })
  bufferLength = props.analyserNode.fftSize
  dataArray = new Uint8Array(bufferLength)
  // 获取 ID 为 "oscilloscope" 的画布
  canvas = document.getElementById('oscilloscope') as HTMLCanvasElement
  canvasCtx = canvas.getContext('2d')
  draw()
})
function draw() {
  // drawVisual =
  drawVisual = requestAnimationFrame(draw)

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
  props.analyserNode.getByteTimeDomainData(dataArray)

  canvasCtx.lineWidth = 2
  canvasCtx.strokeStyle = 'rgb(200, 220, 160)'

  canvasCtx.beginPath()

  var sliceWidth = (canvas.width * 1.0) / bufferLength
  var x = 0

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0
    var y = (v * canvas.height) / 2

    if (i === 0) {
      canvasCtx.moveTo(x, y)
    } else {
      canvasCtx.lineTo(x, y)
    }

    x += sliceWidth
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2)
  canvasCtx.stroke()
}
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
#oscilloscope {
  width: 100%;
  height: 100px;
  margin-top: 10px;
}
</style>
