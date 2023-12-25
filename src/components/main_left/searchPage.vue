<script setup lang="ts">
import questionList from './questionList.vue';
import { onMounted, ref, watch } from 'vue'
import { useQuestionStore } from '@/stores/questionStore';
import router from '@/router';
import reques from '@/utils/request';
const questionStore = useQuestionStore()
const loadText = ref('加载更多')
const hasMore = ref(true)
onMounted(() => {
  console.log(questionStore.searchKey)
  // reques.get(`/question/searchQuestionByPage`)
})


class question {
  id: number;
  authorId: number;
  title: string;
  content: string;
  constructor(id: number, authorId: number, title: string, content: string) {
    this.id = id;
    this.authorId = authorId;
    this.title = title;
    this.content = content;
  }
}
const questions = ref<question[]>([
  {
    id: 1,
    authorId: 1,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },
  {
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },
  {
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  }
  ,{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  }
  ,{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  }
  ,{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  }
  ,{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  },{
    id: 2,
    authorId: 2,
    title: '这是一个问题',
    content: '这是一个问题这是一个问'
  }
]);
const toDetail = (id: number, authorId: number) => {
  console.log(id)
  router.push('/detailPage/' + authorId + '/' + id)
}
const toComment = (id: number, authorId: number) => {
  router.push({ path: '/detailPage/' + authorId + '/' + id, query: { to: 'comment' } })
}
</script>

<template>
  <div class="contain">
    <div class="body">
      <div v-for="question in questions" :key="question.id" class="questionCard">
        <div class="title" link @click="toDetail(question.id, question.authorId)">
          <h2>{{ question.title }}</h2>
        </div>
        <div class="content" @click="toDetail(question.id, question.authorId)">
          <el-text line-clamp="3">
            {{ question.content }}
          </el-text>
        </div>
      </div>
      <div class="bottom">
        已经到底了哦
      </div>
    </div>
  </div>
</template>

<style scoped>
.contain{
  min-height: 91vh;
}
.body {
  background-color: rgba(255, 255, 255, 0.5);
  width: 60%;
  margin: 0 auto;
  border-radius: 10px;
}

.questionCard {
  /* margin-bottom: 5px; */
  padding-left: 10px;
  border-radius: 5px;
  transition: all 0.5s;
  width: 99%;
  margin: 5px auto;
}

.questionCard:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px) scale(1.01);
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.bottom {
  height: 30px;
  text-align: center;
  padding-bottom: 10px;
  color: #000;
}</style>
