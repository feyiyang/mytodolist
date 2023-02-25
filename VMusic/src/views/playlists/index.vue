<template>
  <a-scrollbar
    outer-class="songs"
    ref="scrollbarElem"
    :outer-style="{ width: '100%', height: '100%', overflow: 'hidden auto' }"
    style="padding: 0 40px; height: 100%; overflow: hidden auto"
  >
    <a-spin class="contain" :loading="loading">
      <a-row v-if="details" class="header" :gutter="24">
        <a-col :span="6">
          <a-image
            class="cover_img"
            :src="details.coverImgUrl || details.picUrl"
            width="100%"
            height="auto"
            fit="cover"
            show-loader
          />
        </a-col>
        <a-col :span="18">
          <strong class="title">
            <i v-once class="at">{{
              { playlist: '歌单', album: '专辑' }[lisType]
            }}</i>
            {{ details.name }}
          </strong>
          <div class="info">
            <img
              class="avatar"
              :src="details.creator?.avatarUrl || details.artist.picUrl"
              alt=""
            />
            {{ details.creator?.nickname || details.artist.name }}
            <span class="tag" v-for="(tag, index) in details.tags" :key="index">
              #{{ tag }}
            </span>
          </div>
          <div class="btns">
            <a-button class="btn_play" size="small" @click="playSongHandler()"
              >播放全部</a-button
            >
          </div>
          <div
            :class="['desc', showMore ? 'show' : '']"
            v-if="lisType === 'playlist'"
          >
            {{ details.description }}
            <component
              v-if="details.description.length > 32"
              :is="showMore ? 'icon-up' : 'icon-down'"
              class="more"
              @click="showMore = !showMore"
            />
          </div>
        </a-col>
      </a-row>
      <a-tabs
        v-if="details"
        default-active-key="1"
        :tabBarGutter="40"
        :headerPadding="false"
      >
        <a-tab-pane :title="`歌曲${listTotal || ''}`" key="1">
          <a-list
            class="songs"
            :bordered="false"
            :split="false"
            :loading="loadList"
            hoverable
          >
            <a-list-item class="head">
              <a-row>
                <a-col :span="12">歌曲</a-col>
                <a-col :span="5">歌手</a-col>
                <a-col :span="5">专辑</a-col>
                <a-col :span="2">时长</a-col>
              </a-row>
            </a-list-item>
            <a-list-item
              v-for="(song, index) in songs"
              :key="index"
              class="song_item"
              :class="song.id === playsongs.current?.id ? 'current_item' : ''"
            >
              <a-row>
                <a-col
                  :span="12"
                  class="names"
                  :title="song.name + ' ' + song.alia.join(' ')"
                >
                  &nbsp;
                  <icon-play-arrow
                    class="play_arrow"
                    @click="playSongHandler(index)"
                  />
                  <span class="name">
                    {{ song.name }}
                    <span class="extra" v-if="song.alia.length">
                      ({{ song.alia.join(',') }})
                    </span>
                  </span>
                  <span class="fee" v-if="song.fee == 1"> VIP </span>
                  <span class="add" title="下一首播" @click="addNext(song)"
                    >+</span
                  >
                </a-col>
                <a-col class="songers" :span="5">
                  <template v-for="(ar, ind) in song.ar" :key="ind">
                    {{ ar.name }}<i v-if="ind < song.ar.length - 1">/</i>
                  </template>
                </a-col>
                <a-col class="album" :span="5" :title="song.al.name">{{
                  song.al.name
                }}</a-col>
                <a-col :span="2">{{ longFmt(song.dt) }}</a-col>
              </a-row>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane
          class="comments"
          :title="`评论${
            details?.commentCount || details.info?.commentCount || ''
          }`"
          key="2"
        >
          <section class="hot" v-if="hotComments && hotComments.length">
            <p class="ctitle">精彩评论</p>
            <a-comment
              v-for="(comment, index) in hotComments"
              :key="index"
              class="comment_item"
              :content="comment.content"
              :author="comment.user.nickname"
              :avatar="comment.user.avatarUrl"
              :datetime="comment.timeStr"
            >
              <template #actions>
                <icon-thumb-up /> {{ comment.likedCount }}
              </template>
              <div v-if="comment.beReplied.length" class="comment_inner">
                <template v-for="(rep, ind) in comment.beReplied" :key="ind">
                  <p v-if="rep.status === -5" class="deleted">该评论已删除</p>
                  <a-comment
                    v-else
                    :content="rep.content"
                    :author="rep.user.nickname"
                    :avatar="rep.user.avatarUrl"
                    :datetime="rep.timeStr"
                  ></a-comment>
                </template>
              </div>
            </a-comment>
            <a-button
              class="showmore"
              v-if="hotComments.length > hotCommentsCount"
              shape="round"
              @click="hotCommentsCount += 20"
              >更多精彩评论</a-button
            >
          </section>
          <section class="newc">
            <p class="ctitle new_comment_title">
              全部评论({{
                details?.commentCount || details.info?.commentCount || 0
              }})
            </p>
            <a-comment
              v-for="(comment, index) in newComments"
              :key="index"
              class="comment_item"
              :content="comment.content"
              :author="comment.user.nickname"
              :avatar="comment.user.avatarUrl"
              :datetime="comment.timeStr"
            >
              <template #actions>
                <icon-thumb-up />
                {{ comment.likedCount ? comment.likedCount : '' }}
              </template>
              <div v-if="comment.beReplied.length" class="comment_inner">
                <template v-for="(rep, ind) in comment.beReplied" :key="ind">
                  <p v-if="rep.status === -5" class="deleted">该评论已删除</p>
                  <a-comment
                    v-else
                    :content="rep.content"
                    :author="rep.user.nickname"
                    :avatar="rep.user.avatarUrl"
                    :datetime="rep.timeStr"
                  ></a-comment>
                </template>
              </div>
            </a-comment>
            <a-pagination
              class="pages"
              v-model:current="curPage"
              size="small"
              :page-size="commentSize"
              :total="details.commentCount || details.info.commentCount || 0"
              @change="pageChg"
            />
          </section>
        </a-tab-pane>
        <a-tab-pane
          title="专辑详情"
          v-if="lisType === 'album'"
          class="descriptions"
        >
          <div class="desc" v-for="(desc, index) in descData" :key="index">
            <span class="label">{{ desc.label }}</span>
            <p class="val">{{ desc.value }}</p>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <a-result v-if="dataError" status="error" title="网络错误">
      <template #icon>
        <icon-exclamation-circle />
      </template>
    </a-result>
  </a-scrollbar>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, computed, toRefs, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { type ScrollbarInstance } from '@arco-design/web-vue'
import { audioItem } from '@/utils/types/playlist.type'
import { useDetails } from './hook/list'
import { usePlayer } from '@/utils/hooks'
import { longFmt } from '@/utils'

const route = useRoute()
const lisType = computed((): 'playlist' | 'album' => {
  if (route.query.type && /(album)/.test(route.query.type as string)) {
    return 'album'
  }
  return 'playlist'
})

const { player: playsongs } = usePlayer() // 播放器playbar
const {
  curPage,
  loading,
  loadList,
  showMore,
  dataError,
  details,
  songs,
  listTotal,
  comments,
  commentSize,
  getComments,
  getDetails
} = useDetails(lisType.value)
const { hot: hotComments, new: newComments } = toRefs(comments)
const scrollbarElem = ref<ScrollbarInstance>()
const hotCommentsCount = ref<number>(20) // 精彩评论的点击更多
const descData = computed(() => {
  console.log('details::', details)
  let info = [
    { label: '唱片公司:', value: details.value.company },
    { label: '专辑介绍:', value: details.value.description }
  ]
  return info
})

onBeforeMount(() => {
  console.log('playlist onBeforeMount')
  getDetails()
})

function pageChg(n: number) {
  const posElem = document.querySelector('.new_comment_title') as HTMLElement
  const posy = posElem?.offsetTop || 0 + 152
  // console.log(n, posElem.offsetTop)
  getComments(false)
  nextTick(() => {
    scrollbarElem.value?.scrollTop(posy)
  })
}
function playSongHandler(n?: number): void {
  playsongs.list = songs.value
  playsongs.current = { queueIndex: n || 0, ...songs.value[n || 0] }
  playsongs.playing = true
}
function addNext(song: audioItem) {
  if (playsongs.current.queueIndex === undefined) {
    playsongs.list = [song]
    playsongs.current = { queueIndex: 0, ...song }
    playsongs.playing = true
  } else if (playsongs.current.queueIndex + 1 >= playsongs.list.length) {
    playsongs.list.push(song)
  } else {
    playsongs.list.splice(playsongs.current.queueIndex + 1, 0, song)
  }
}
</script>
<style lang="scss" scoped>
.header {
  padding-bottom: 20px;
  .cover_img {
    width: 100%;
    height: auto;
  }
  strong.title {
    display: block;
    padding: 6px 0 16px;
    font-size: 24px;
    color: #444;
    i {
      display: none;
      height: 20px;
      line-height: 20px;
      font: {
        style: normal;
        weight: normal;
        size: 12px;
      }
      vertical-align: middle;
    }
  }
  img.avatar {
    width: 22px;
    border-radius: 12px;
  }
  .tag {
    margin-left: 12px;
    color: $textlight;
  }
  .btn_play {
    @include linerBg;
    color: #fff;
    border-radius: 20px;
  }
  .btns {
    padding: 20px 0;
  }
  .desc {
    position: relative;
    height: 1.2em;
    padding-right: 26px;
    overflow: hidden;
    line-height: 1.4;
    color: $textlight;
    &.show {
      height: auto;
    }
    .more {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 18px;
      color: #000;
      stroke-width: 2px;
      cursor: pointer;
    }
  }
}

.songs {
  .head,
  .extra {
    color: $textlight;
  }
  .head {
    padding: 10px 0 !important;
  }
  .song_item {
    color: #666;
    padding: 10px 0 !important;
    &.current_item {
      color: $mygreen;
    }
    .songers,
    .album {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &:hover .add {
      display: block;
    }
    :deep(.arco-list-item-main) {
      width: 100%;
      .arco-col {
        padding-right: 10px;
        &:last-of-type {
          padding: 0;
        }
      }
    }
  }
  .names {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    > * {
      vertical-align: middle;
    }
    .name {
      display: inline-block;
      margin-left: 5px;
      max-width: 85%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .extra {
      display: inline-block;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .fee {
    display: inline-block;
    padding: 2px 4px;
    transform: scale(65%);
    font-size: 10px;
    line-height: 1;
    color: $somegreen;
    border: 1px $somegreen solid;
    border-radius: 4px;
  }
  .add {
    display: none;
    position: absolute;
    right: 8px;
    top: 4px;
    width: 12px;
    height: 12px;
    text-align: center;
    line-height: 12px;
    color: #bbb;
    border: 1px #ccc solid;
    cursor: pointer;
  }
  .play_arrow {
    cursor: pointer;
  }
}
.comments {
  .ctitle {
    padding: 10px 0 30px;
  }
  .comment_item {
    border-bottom: 1px #f0f0f6 solid;
  }
  .comment_inner {
    // max-height: 4.4em;
    padding-bottom: 10px;
    overflow: hidden;
    .deleted {
      padding: 2px 0;
      background-color: #f0f0f6;
      text-align: center;
    }
  }
  .newc {
    padding: 20px 0;
  }
  .pages {
    margin-top: 20px;
  }
  :deep(.arco-comment-inner-comment) {
    margin-top: 10px;
  }
}

.descriptions {
  line-height: 2;
  padding: 10px 0;
  .desc {
    display: flex;
    .label {
      width: 72px;
      flex-shrink: 0;
      white-space: nowrap;
      color: #444;
    }
    .val {
      color: $textlight;
      white-space: pre-line;
    }
  }
}
</style>
