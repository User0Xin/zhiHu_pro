<script setup lang="ts">
import router from '@/router';
import request from '@/utils/request';
import { h, inject, onMounted, ref, onBeforeUnmount, provide, watch } from 'vue'
const count = inject('count') as any;
const loadText = inject('loadText') as any;
const hasMore = inject('hasMore') as any;
const page = ref(1);
const tab = inject('tab') as any;
const orderBy = ref('like_num')//排序方式
const method = ref('listQuestionByPage')//请求方法
const idOrFlag = ref(1)//路径参数
watch(tab, (newValue:string) => {
   if(newValue == '推荐'){
    method.value = 'listQuestionByPage';
    hasMore.value = true;
    orderBy.value = 'like_num';
    console.log(orderBy.value)
    page.value = 0;
    questions.value = [];
    load();
   }else if(newValue == '最新发布'){
    method.value = 'listQuestionByPage'
    hasMore.value = true;
    orderBy.value = 'time'
    console.log(orderBy.value)
    page.value = 0;
    questions.value = [];
    load();
   }
   else if(newValue == '我的问题'){
    //先作是否登录的处理
    questions.value = [];
    hasMore.value = false;
    console.log(questions)
    return;
    // method.value = 'listQuestionByUidByPage';
    // orderBy.value = 'time';
    // console.log(orderBy.value)
    // page.value = 0;
    // questions.value = [];
    // load();
   }
});
const load = () => {
    // 发送请求获取分页
    request.get('/question/' + method.value + '/ '+ page.value + '/8/' + orderBy.value + '/' + idOrFlag.value).then( (res:any) => {
        const more = res.data.page;
        if(more.length == 0){
            hasMore.value = false;
            loadText.value = '没有更多了';
            return
        }
        questions.value = questions.value.concat(more);
    }).catch( (err:any) => {
        console.log(err);
    })
    page.value++;
}
class question{
    id: number;
    authorId: number;
    title: string;
    content: string;
    likeNum: number;
    comment: number;
    star: number;
    isLiked: boolean;
    isStared:boolean;
    constructor(id: number,  authorId: number, title: string, content: string, likeNum: number, comment: number, star: number, isLiked: boolean, isStared:boolean){
        this.id = id;
        this.authorId = authorId;
        this.title = title;
        this.content = content;
        this.likeNum = likeNum;
        this.comment = comment;
        this.star = star;
        this.isLiked = isLiked;
        this.isStared = isStared;
    }
}
const questions = ref<question[]>([]);

// 处理点赞逻辑
const handleLike = (question: any) => {
    if(!question.isLiked) question.like++;
    else question.like--;
    question.isLiked = !question.isLiked;
    console.log("点赞");
}

// 处理评论逻辑
const handleCommend = () => {
    
    console.log("评论");
}

// 处理收藏逻辑
const handleCollect = (question: any) => {
    if(!question.isStared) question.star++;
    else question.star--;
    question.isStared = !question.isStared;
    console.log("收藏");
}


const loadMoni = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;


onMounted(() => {
    // 监听元素是否出现在视图中
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && hasMore.value) { //如果在视图中
                load();
            } else {  //如果不在视图中 
                
            }
        });
    });
    // 开始观察
    if (loadMoni.value) {
        observer.observe(loadMoni.value);
    }
    // 初始化questions
    request.get('/question/listQuestionByPage/0/8/like_num/1').then( (res:any) => {
        questions.value = res.data.page;
        console.log(res.data);
    }).catch( (err:any) => {
        console.log(err);
    })
});
// 组件卸载时取消观察
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
});

const toDetail = (id: number, authorId: number) => {
    console.log(id)
    router.push('/detailPage/' + authorId + '/' + id)
}
const toComment = (id: number, authorId: number) => {
    router.push({path: '/detailPage/' + authorId + '/' + id, query: {to: 'comment'}})
}
</script>

<template>
    <!-- 遍历问题列表渲染 -->
    <div v-for="question in questions" :key="question.id" class="questionCard">
        <el-button class="title" link @click="toDetail(question.id, question.authorId)">{{ question.title }}</el-button>
        <div class="content" @click="toDetail(question.id, question.authorId)">
            <el-text line-clamp="3"> 
                {{ question.content }}
            </el-text>
        </div>
        <div class="optitions">
            <div>
                <el-button link @click="handleLike(question)"><span class="iconfont icon-icon" :class="{'checked' : question.isLiked}"></span></el-button>
                <span class="number">{{ question.likeNum }}</span>
            </div>
            <div @click="toComment(question.id, question.authorId)">
                <el-button link @click="handleCommend"><span class="iconfont icon-31pinglun"></span></el-button>
                <span class="number">{{ question.comment }}</span>
            </div>
            <div>
                <el-button link @click="handleCollect(question)"><span class="iconfont icon-shoucang" :class="{'checked' : question.isStared}"></span></el-button>
                <span class="number">{{ question.star }}</span>
            </div>
        </div>
    </div>
    <div class="loadMore" ref="loadMoni">
        <el-button @click="load" link :disabled="!hasMore">{{ loadText }}</el-button>
    </div>
</template>


<style scoped>
a {
    color: inherit;
    text-decoration: none;
}

.questionCard {
    padding: 20px;
    border-bottom: 1px solid rgb(212, 212, 212);
    padding-bottom: 10px;
}
.questionCard:hover{
    cursor: pointer;
}


.title {
    font-size: 18px;
    line-height: 1.6;
    color: inherit;
}

.content {
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 96%;
    margin-left: 2%;
}

.optitions {
    display: flex;
    justify-content: space-between;
}

.loadMore {
    display: flex;
    justify-content: center;
}
/** iconfont样式 */
.iconfont {
    font-size: 20px;
    margin-right: 3px;
}
.iconfont:hover {
    color: #409eff;
}
.number{
    font-size: 15px;
}
.icon-shoucang{
    margin-bottom: 2px;
}
.icon-icon{
    margin-bottom: 5px;
}


.checked{
    color: #409eff;
}
.loadMore{
    margin-top: 15px;
}
</style>