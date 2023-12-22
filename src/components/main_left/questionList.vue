<script setup lang="ts">
import router from '@/router';
import request from '@/utils/request';
import { ElNotification } from 'element-plus'
import { h, inject, onMounted, ref, onBeforeUnmount, provide, watch, computed } from 'vue'
const count = inject('count') as any;
const loadText = inject('loadText') as any;
const hasMore = inject('hasMore') as any;
const page = ref(2);
const tab = inject('tab') as any;
const orderBy = ref('like_num')//排序方式
const method = ref('listQuestionByPage')//请求方法
const idOrFlag = ref(1)//路径参数
watch(tab, (newValue: string) => {
    if (newValue == '推荐') {
        method.value = 'listQuestionByPage';
        hasMore.value = true;
        orderBy.value = 'like_num';
        console.log(orderBy.value)
        page.value = 0;
        questions.value = [];
        load();
    } else if (newValue == '最新发布') {
        method.value = 'listQuestionByPage'
        hasMore.value = true;
        orderBy.value = 'time'
        console.log(orderBy.value)
        page.value = 0;
        questions.value = [];
        load();
    }
    else if (newValue == '我的问题') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            console.log(questions)
            return;
        }
        else {

        }
    }
});

const pleaseLogin = () => {
    ElNotification({
        title: '提示',
        message: '请先登录',
        type: 'warning',
        offset: 50
    })
}
const load = () => {
    // 发送请求获取分页
    request.get('/question/' + method.value + '/ ' + page.value + '/10/' + orderBy.value + '/' + idOrFlag.value).then((res: any) => {
        const more = res.data.page;
        if (more.length == 0) {
            hasMore.value = false;
            loadText.value = '没有更多了';
            return
        }
        questions.value = questions.value.concat(more);
    }).catch((err: any) => {
        console.log(err);
    })
    page.value++;
}
class question {
    id: number;
    uid: number;
    title: string;
    content: string;
    likeNum: number;
    comment: number;
    star: number;
    isLiked: boolean;
    isStared: boolean;
    coverurl: string;
    videourl: string;
    time: Array<number>;
    constructor(id: number, uid: number, title: string, content: string, likeNum: number, comment: number, star: number, isLiked: boolean, isStared: boolean, coverurl: string, videourl: string, time: Array<number>) {
        this.id = id;
        this.uid = uid;
        this.title = title;
        this.content = content;
        this.likeNum = likeNum;
        this.comment = comment;
        this.star = star;
        this.isLiked = isLiked;
        this.isStared = isStared;
        this.coverurl = coverurl;
        this.videourl = videourl;
        this.time = time;
    }
}
const questions = ref<question[]>([]);

// 处理点赞逻辑
const handleLike = (question: any) => {
    if (iftop && question.id == topQuestion.value.id) {
        if (!question.isLiked) question.likeNum++;
        else question.likeNum--;
        question.isLiked = !question.isLiked;
        localStorage.setItem('topQuestion', JSON.stringify(question));
    }
    else {
        if (!question.isLiked) question.likeNum++;
        else question.likeNum--;
        question.isLiked = !question.isLiked;
    }
}

// 处理评论逻辑
const handleCommend = () => {

    console.log("评论");
}

// 处理收藏逻辑
const handleCollect = (question: any) => {
    if (!question.isStared) question.star++;
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
    request.get('/question/listQuestionByPage/1/10/like_num/1').then((res: any) => {
        console.log(page.value)
        questions.value = res.data.page;
        console.log(res.data.page);
    }).catch((err: any) => {
        console.log(err);
    })
});
// 组件卸载时取消观察
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
});

const toDetail = (question: question) => {
    const lastQuestionTime = localStorage.getItem('lastQuestion');
    const arr = question.time;
    const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    if (lastQuestionTime == null) {
        localStorage.setItem('lastQuestion', date.toString());
    }
    else {
        const lastTime = new Date(lastQuestionTime);
        if (date > lastTime) {
            localStorage.setItem('lastQuestion', date.toString());
        }
    }
    router.push('/detailPage/' + question.uid + '/' + question.id)
}
const toComment = (id: number, uid: number) => {
    router.push({ path: '/detailPage/' + uid + '/' + id, query: { to: 'comment' } })
}
//设置置顶
const topQuestion = ref(localStorage.getItem('topQuestion') ? JSON.parse(localStorage.getItem('topQuestion')!) : null)
const iftop = ref(localStorage.getItem('topQuestion') ? true : false);
const setTop = (question: any) => {
    localStorage.setItem('topQuestion', JSON.stringify(question));
    topQuestion.value = localStorage.getItem('topQuestion') ? JSON.parse(localStorage.getItem('topQuestion')!) : null;
    iftop.value = true;
}

const cancelTop = () => {
    localStorage.removeItem('topQuestion');
    iftop.value = false;
}

const filteredQuestions = computed(() => {
    if (!iftop.value) return questions.value;
    else
        return questions.value.filter((question) => question.id != topQuestion.value.id);
});

</script>

<template>
    <div class="topQuestionCard" v-if="iftop && tab != '我的问题'">
        <el-icon class="icon01">
            <Link />
        </el-icon>
        <el-button class="title" link @click="toDetail(topQuestion)">{{ topQuestion.title }}</el-button>
        <div class="alreadeyTop" @click="cancelTop()">
            <el-icon>
                <StarFilled />
            </el-icon>
        </div>
        <div class="content" @click="toDetail(topQuestion)">
            <el-text line-clamp="3">
                {{ topQuestion.content }}
            </el-text>
        </div>
        <div class="optitions">
            <div>
                <el-button link @click="handleLike(topQuestion)"><span class="iconfont icon-icon"
                        :class="{ 'checked': topQuestion.isLiked }"></span></el-button>
                <span class="number">{{ topQuestion.likeNum }}</span>
            </div>
            <div @click="toComment(topQuestion.id, topQuestion.uid)">
                <el-button link @click="handleCommend"><span class="iconfont icon-31pinglun"></span></el-button>
                <span class="number">{{ topQuestion.comment }}</span>
            </div>
            <div>
                <el-button link @click="handleCollect(topQuestion)"><span class="iconfont icon-shoucang"
                        :class="{ 'checked': topQuestion.isStared }"></span></el-button>
                <span class="number">{{ topQuestion.star }}</span>
            </div>
        </div>
    </div>


    <!-- 遍历问题列表渲染 -->
    <div v-for="question in filteredQuestions" :key="question.id" class="questionCard">
        <el-button class="title" link @click="toDetail(question)">{{ question.title }}</el-button>
        <div class="top" @click="setTop(question)"><el-icon>
                <StarFilled />
            </el-icon></div>
        <div class="content" @click="toDetail(question)">
            <el-text line-clamp="3">
                {{ question.content }}
            </el-text>
        </div>
        <div class="optitions">
            <div>
                <el-button link @click="handleLike(question)"><span class="iconfont icon-icon"
                        :class="{ 'checked': question.isLiked }"></span></el-button>
                <span class="number">{{ question.likeNum }}</span>
            </div>
            <div @click="toComment(question.id, question.uid)">
                <el-button link @click="handleCommend"><span class="iconfont icon-31pinglun"></span></el-button>
                <span class="number">{{ question.comment }}</span>
            </div>
            <div>
                <el-button link @click="handleCollect(question)"><span class="iconfont icon-shoucang"
                        :class="{ 'checked': question.isStared }"></span></el-button>
                <span class="number">{{ question.star }}</span>
            </div>
        </div>
    </div>
    <div class="loadMore" ref="loadMoni">
        <el-button @click="load" link :disabled="!hasMore">{{ loadText }}</el-button>
    </div>
</template>


<style scoped>
.icon01 {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 25px;
    color: #409eff;
}

.topQuestionCard {
    /* border: 2px solid rgb(157, 192, 231); */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
}

.alreadeyTop {
    color: #409eff;
}

a {
    color: inherit;
    text-decoration: none;
}

.questionCard,
.topQuestionCard {
    padding: 20px;
    margin-top: 5px;
    border-bottom: 1px solid rgb(212, 212, 212);
    padding-bottom: 10px;
    position: relative;
    transition: all 0.5s;
    border-radius: 10px;
}

.questionCard:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.95);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.top,
.alreadeyTop {
    position: absolute;
    right: 15px;
    top: 20px;
    width: 20px;
    height: 20px;
}

.top:hover {
    cursor: pointer;
    color: #409eff;
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

.number {
    font-size: 15px;
}

.icon-shoucang {
    margin-bottom: 2px;
}

.icon-icon {
    margin-bottom: 5px;
}


.checked {
    color: #409eff;
}

.loadMore {
    margin-top: 15px;
}
</style>