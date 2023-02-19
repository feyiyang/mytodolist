<template>
  <div class="interface" v-if="onInterface">
    <span class="close" @click="onInterface = false">收起</span>
    <div class="cover">
      <a-image class="img" :src="player.current?.al?.picUrl"></a-image>
      <canvas id="oscilloscope"></canvas>
      <section class="controls-main">
        <span class="vol_wrap">
          <icon-font class="icon-yinliang-" type="icon-yinliang-" />
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.01"
            :value="volumes"
            list="volumes"
            name="volume"
            @change="change"
          />
        </span>
        <input type="checkbox" id="playBtn" />
        <label for="playBtn">Play</label>
      </section>
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
import {
  ref,
  computed,
  onMounted,
  nextTick,
  defineProps,
  defineEmits
} from 'vue'
import { Icon } from '@arco-design/web-vue'
import { usePlayer } from '@/utils/hooks'

const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/c/font_1640412_a1g460m24t.js'
})
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
const emits = defineEmits(['volChange'])
var bufferLength: any
var dataArray: any
let drawVisual: any

const volumes = ref<number>(50)

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

  const playButton = document.querySelector('#playBtn') as HTMLElement
  playButton.onclick = function () {
    // emits('playPause')
    if (props.audioCtx.state === 'running') {
      props.audioCtx.suspend()
    } else if (props.audioCtx.state === 'suspended') {
      props.audioCtx.resume()
    }
  }
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

function change(evt: any) {
  const { target } = evt
  emits('volChange', target.value)
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
    width: 288px;
    position: relative;
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
  margin-top: 50px;
}
.controls-main {
  position: absolute;
  left: 0;
  top: 288px;
  width: 268px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(220, 220, 220, 0.45);
  .icon-yinliang- {
    display: inline-block;
    vertical-align: middle;
  }
  .icon-yinliang- {
    font-size: 26px;
  }
}
#playBtn {
  appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 20px;
  background: var(--white)
    url('data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" fill="black" /></svg>')
    no-repeat center center;
  background-size: 50% 50%;
  cursor: pointer;
}

#playBtn ~ label {
  display: none;
}
#playBtn:hover,
#playBtn:checked:hover {
  background-color: var(--yellow);
}
#playBtn:checked {
  background: var(--green)
    url('data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" fill="black" /></svg>')
    no-repeat center center;
  background-size: 60% 60%;
}
.controls label {
  justify-self: end;
  padding-right: 10px;
}

.controls-main input {
  height: 16px;
  margin: 0 10px;
  overflow: hidden;
  border-radius: 15px;
}
input[type='range']:focus::-webkit-slider-thumb {
  background-color: var(--boxHigh);
}
input[type='range']::-webkit-slider-runnable-track {
  height: 16px;
  cursor: pointer;
  background-color: var(--black);
  border-radius: var(--borderRad);
}
</style>
