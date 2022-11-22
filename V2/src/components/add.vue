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
          <span class="btn_sw" @click="(e) => { showPopHdl(e, 'shoWeeks') }">{{selWeek.v}} </span>
          <input v-model="selTime" :class="[selWeek.v ? 'short' : '']" @click="(e) => { showPopHdl(e, 'shoWeeks') }" />
        </div>
        <ul class="popover timesls" v-if="shoWeeks">
          <template v-for="(item, index) in weeks" :key="index">
            <li v-if="index < 7" @click="setDay(item)">每周{{item.v}}</li>
            <li v-else-if="selWeek.v" @click="reTimeHdl">{{item.v}}</li>
          </template>
        </ul>
      </div>
      <div class="level">
        <span class="btn" @click="(e) => { showPopHdl(e, 'showLevels') }">要次&nbsp;·&nbsp;</span>
        <span class="" @click="(e) => { showPopHdl(e, 'showLevels') }">{{selLev.v}}</span>
        <ul v-if="showLevels" class="popover levels">
          <li v-for="(item, index) in levels" :key="index" :class="'lev_' + item.lev" @click="setLev(item)">
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
<script>
import { dateFormat } from '../assets/utils'
const today = new Date()
const daystr = dateFormat(new Date(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy/MM/dd hh:mm')
export default {
  data () {
    return {
      content: '',
      selTime: daystr,
      selWeek: { k: 0, v: '' },
      shoWeeks: false,
      weeks: [
        { k: 1, v: '一'},
        { k: 2, v: '二'},
        { k: 3, v: '三'},
        { k: 4, v: '四'},
        { k: 5, v: '五'},
        { k: 6, v: '六'},
        { k: 7, v: '日'},
        { K: 8, v: '某天'}
      ],
      selLev: { lev: 4, v: '常要' },
      showLevels: false,
      levels: [
        { lev: 1, v: '紧要' },
        { lev: 2, v: '重要' },
        { lev: 3, v: '次要' },
        { lev: 4, v: '常要' }
      ]
    }
  },
  emits: ['add'],
  mounted () {
    document.body.addEventListener('click', this.hidePop, false)
  },
  destroyed() {
    document.body.removeEventListener('click', this.hidePop, false)
  },
  methods: {
    add () {
      if (!this.content) return
      this.$emit('add', { 
        content: this.content, 
        hm: this.selTime, 
        week: this.selWeek.v ? this.selWeek : null, 
        level: this.selLev 
      })
      this.content = ''
      this.selTime = daystr
      this.selWeek = { k: 0, v: '' }
      this.selLev = this.levels[3]
    },
    setDay (itm) {
      this.selWeek = { k: itm.k, v: '每周' + itm.v }
      this.selTime = this.selTime.replace(/.+ /, '')
    },
    hidePop () {
      this.shoWeeks = false
      this.showLevels = false
    },
    reTimeHdl () {
      this.selWeek.v = ''
      this.selTime = daystr
    },
    showPopHdl (e, popover) {
      if (!popover) return
      this.shoWeeks = e.target.className == 'btn_sw' || (popover === 'shoWeeks' && this.selWeek.v === '')
      this.showLevels = popover === 'showLevels'
      e.preventDefault()
      e.stopImmediatePropagation()
      return false
    },
    setLev (itm) {
      this.showLevels = false
      this.selLev = itm
    }
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