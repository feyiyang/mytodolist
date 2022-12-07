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
          <span class="btn_sw" @click.stop="showPopHdl('shoWeeks', true)">{{selState.selWeek.v}} </span>
          <input v-model="selTime" :class="[selState.selWeek.v ? 'short' : '']" @click.stop="showPopHdl('shoWeeks')" />
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
        <span class="" @click.stop="showPopHdl('showLevels')">{{selState.selLev.v}}</span>
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
<script setup lang="ts">
import { Ref, ref, reactive, onMounted, onUnmounted } from 'vue'
import { dateFormat, weeksarr, levelsarr } from '../assets/utils'

const today: Date = new Date()
const daystr: string = dateFormat(new Date(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy/MM/dd hh:mm')
const content: Ref<string> = ref('')
const selTime: Ref<string> = ref(daystr)
const selState = reactive<selStatus>({
  selWeek: { k: 0, v: '' },
  selLev: { lev: 4, v: '常要' }
})
const shoWeeks: Ref<boolean> = ref(false)
const weeks: Ref<selWeek[]> = ref(weeksarr)
const showLevels: Ref<boolean> = ref(false)
const levels: Ref<selLev[]> = ref(levelsarr)
const emit = defineEmits<{ (event: 'add', dosth: doItem): void }>()

onMounted(() => {
  document.body.addEventListener('click', hidePop, false)
})
onUnmounted(() => {
  document.body.removeEventListener('click', hidePop, false)
})

function add (): void {
  if (!content.value) return
  emit('add', { 
    content: content.value,
    hm: selTime.value, 
    week: selState.selWeek?.v, 
    level: selState.selLev.lev
  })
  content.value = ''
  selTime.value = daystr
  selState.selWeek = { k: 0, v: '' }
  selState.selLev = levels.value[3]
}
function setDay (itm: selWeek): void {
  selState.selWeek = { k: itm.k, v: '每周' + itm.v }
  selTime.value = selTime.value.replace(/.+ /, '')
}
function hidePop (): void {
  shoWeeks.value = false
  showLevels.value = false
}
function reTimeHdl (): void {
  selState.selWeek.v = ''
  selTime.value = daystr
}
function showPopHdl (popover: string, isBtn?: boolean): void {
  if (!popover) return
  shoWeeks.value = isBtn || (popover === 'shoWeeks' && selState.selWeek.v === '')
  showLevels.value = popover === 'showLevels'
}
function setLev (itm?: selLev): void {
  showLevels.value = false
  if (!itm) {
    const sel: number = selState.selLev.lev - 1 < 1 ? 3 : (selState.selLev.lev - 2)
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