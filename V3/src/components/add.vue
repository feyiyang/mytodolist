<template>
  <div class="add_wrap">
    <div class="text">
      <span class="cir"></span>
      <input v-model="content" type="text" placeholder="添加任务">
    </div>
    <div class="handlers">
      <div class="times">
        <div class="come">
          <span @click="reTimeHdl">提醒&nbsp;·&nbsp;</span>
          <span class="btn_sw" @click="(e) => { showPopHdl(e, 'shoWeeks') }">{{selState.selWeek.v}} </span>
          <input v-model="selTime" :class="[selState.selWeek.v ? 'short' : '']" @click="(e) => { showPopHdl(e, 'shoWeeks') }" />
        </div>
        <ul class="popover timesls" v-if="shoWeeks">
          <template v-for="(item, index) in weeks" :key="index">
            <li v-if="index < 7" @click="setDay(item)">每周{{item.v}}</li>
            <li v-else-if="selState.selWeek.v" @click="reTimeHdl">{{item.v}}</li>
          </template>
        </ul>
      </div>
      <div class="level">
        <span class="btn" @click="setLev()">要次&nbsp;·&nbsp;</span>
        <span class="" @click="(e) => { showPopHdl(e, 'showLevels') }">{{selState.selLev.v}}</span>
        <ul v-if="showLevels" class="popover levels">
          <li v-for="(item, index) in levelsarr" :key="index" :class="'lev_' + item.lev" @click="setLev(item)">
            {{item.v}}
          </li>
        </ul>
      </div>
      <div class="add">
        <button :disabled="!content" @click="add">添加</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive, defineEmits, onMounted, onUnmounted} from 'vue'
import { dateFormat, weeksarr, levelsarr } from '../assets/utils'
const today = new Date()
const daystr = dateFormat(new Date(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy/MM/dd hh:mm')
const content = ref('')
const selTime = ref(daystr)
const selState = reactive({
  selWeek: { k: 0, v: '' },
  selLev: { lev: 4, v: '常要' }
})
const shoWeeks = ref(false)
const weeks = ref(weeksarr)
const showLevels = ref(false)
const levels = ref(levelsarr)
const emit = defineEmits(['add'])

onMounted(() => {
  document.body.addEventListener('click', hidePop, false)
})
onUnmounted(() => {
  document.body.removeEventListener('click', hidePop, false)
})

function add () {
  if (!content.value) return
  emit('add', { 
    content: content.value,
    hm: selTime.value, 
    week: selState.selWeek.v ? selState.selWeek : null, 
    level: selState.selLev 
  })
  content.value = ''
  selTime.value = daystr
  selState.selWeek = { k: 0, v: '' }
  selState.selLev = levels.value[3]
}
function setDay (itm) {
  selState.selWeek = { k: itm.k, v: '每周' + itm.v }
  selTime.value = selTime.value.replace(/.+ /, '')
}
function hidePop () {
  shoWeeks.value = false
  showLevels.value = false
}
function reTimeHdl () {
  selState.selWeek.v = ''
  selTime.value = daystr
}
function showPopHdl (e, popover) {
  if (!popover) return
  shoWeeks.value = e.target.className == 'btn_sw' || (popover === 'shoWeeks' && selState.selWeek.v === '')
  showLevels.value = popover === 'showLevels'
  e.preventDefault()
  e.stopImmediatePropagation()
  return false
}
function setLev (itm) {
  showLevels.value = false
  if (!itm) {
    const sel = selState.selLev.lev - 1 < 1 ? 3 : (selState.selLev.lev - 2)
    selState.selLev = { lev: levelsarr[sel].lev, v: levelsarr[sel].v }
  } else {
    selState.selLev = itm
  }
}
</script>
<style lang="less" scoped>
button {
  height: 26px;
  color: #2532a3;
  font-weight: 600;
  border: 1px #ccc solid;
  background-color: #fff;
  &:disabled {
    color: #999;
  }
}
</style>