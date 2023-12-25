<script setup lang="ts">
import router from '@/router';
import request from '@/utils/request';
import { ElNotification } from 'element-plus'
import { h, inject, onMounted, ref, onBeforeUnmount, provide, watch, computed } from 'vue'
const count = inject('count') as any;
const loadText = inject('loadText') as any;
const hasMore = inject('hasMore') as any;
const page = ref(1);
const tab = inject('tab') as any;
const orderBy = ref('like_num')//排序方式
const method = ref('listQuestionByPage')//请求方法
const idOrFlag = ref(1)//路径参数
const userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : 0;
watch(tab, (newValue: string) => {
    if (newValue == '推荐') {
        method.value = 'listQuestionByPage';
        hasMore.value = true;
        orderBy.value = 'like_num';
        page.value = 1;
        idOrFlag.value = 1;
        questions.value = [];
        // load();
    } else if (newValue == '最新发布') {
        method.value = 'listQuestionByPage'
        hasMore.value = true;
        orderBy.value = 'time'
        page.value = 1;
        idOrFlag.value = 1;
        questions.value = [];
        // load();
    }
    else if (newValue == '我的收藏') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            return;
        }
        else {
            method.value = 'listQuestionByUidByPage'
            hasMore.value = true;
            orderBy.value = 'time'
            idOrFlag.value = 1;
            page.value = 1;
            questions.value = [];
            // load();
        }
    }
    else if (newValue == '我的问题') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            return;
        }
        else {
            method.value = 'listQuestionByUidByPage'
            hasMore.value = true;
            orderBy.value = 'time'
            idOrFlag.value = 1;
            page.value = 1;
            questions.value = [];
            // load();
        }
    }
    else if (newValue == '草稿箱') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            return;
        }
        else {
            method.value = 'listQuestionByUidByPage'
            hasMore.value = true;
            orderBy.value = 'time'
            page.value = 1;
            idOrFlag.value = 0;
            questions.value = [];
            // load();
        }
    }
    else if (newValue == '我的问题') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            return;
        }
        else {
            method.value = 'listQuestionByUidByPage'
            hasMore.value = true;
            orderBy.value = 'time'
            idOrFlag.value = 1;
            page.value = 1;
            questions.value = [];
            // load();
        }
    }
    else if (newValue == '草稿箱') {
        if (localStorage.getItem('isLogin') == null) {
            //先作是否登录的处理
            pleaseLogin();
            questions.value = [];
            hasMore.value = false;
            return;
        }
        else {
            method.value = 'listQuestionByUidByPage'
            hasMore.value = true;
            orderBy.value = 'time'
            page.value = 1;
            idOrFlag.value = 0;
            questions.value = [];
            // load();
        }
    }
    setTimeout(() => {
        if (questions.value.length == 0) load();
    }, 300);
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
    request.get('/question/' + method.value + '/ ' + page.value + '/10/' + orderBy.value + '/' + idOrFlag.value + '/' + userId).then((res: any) => {
        const more = res.data.page;
        if (more.length == 0) {
            hasMore.value = false;
            loadText.value = '没有更多了';
            return
        }
        if (more.length < 10) {
            hasMore.value = false;
            loadText.value = '没有更多了';
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
    request.post(`/question/likeQuestion/${userId}/${question.id}/${question.uid}/${question.isLiked ? -1 : 1}`)
        .then(res => {
            let exists = topQuestion.value.some((questionItem: question) => questionItem.id == question.id);
            if (iftop.value && exists) {//如果置顶的问题在问题列表中且在置顶列表中
                if (!question.isLiked) question.likeNum++;
                else question.likeNum--;
                question.isLiked = !question.isLiked;
                topQuestion.value = topQuestion.value.map((questionItem: question) =>
                    questionItem.id === question.id ? question : questionItem
                );
                localStorage.setItem('topQuestion', JSON.stringify(topQuestion.value));
            }
            else {
                if (!question.isLiked) question.likeNum++;
                else question.likeNum--;
                question.isLiked = !question.isLiked;
            }
        })
}

// 处理评论逻辑
const handleCommend = () => {

    console.log("评论");
}

// 处理收藏逻辑
const handleCollect = (question: any) => {
    console.log("收藏");
    request.post(`/question/starQuestion/${userId}/${question.id}/${question.uid}/${question.isStared ? -1 : 1}`)
        .then(res => {
            let exists = topQuestion.value.some((questionItem: question) => questionItem.id == question.id);
            if (iftop.value && exists) {
                if (!question.isStared) question.star++;
                else question.star--;
                question.isStared = !question.isStared;
                topQuestion.value = topQuestion.value.map((questionItem: question) =>
                    questionItem.id === question.id ? question : questionItem
                );
                localStorage.setItem('topQuestion', JSON.stringify(topQuestion.value));
            }
            else {
                if (!question.isStared) question.star++;
                else question.star--;
                question.isStared = !question.isStared;
            }
        })
    if (tab.value == '我的收藏' && !question.isStared) {
        questions.value = questions.value.filter((questionItem: question) => questionItem.id !== question.id);
    }
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
        observer.observe(loadMoni.value!);
    }
    // 初始化questions
    // request.get('/question/listQuestionByPage/1/10/like_num/1/' + userId).then((res: any) => {
    //     console.log(page.value)
    //     questions.value = res.data.page;
    //     console.log(res.data.page);
    // }).catch((err: any) => {
    //     console.log(err);
    // })
    // load();
});
// 组件卸载时取消观察
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
});

const toDetail = (question: question) => {
    if (tab.value == '草稿箱') toWritePage(question);
    else {
        localStorage.setItem('questionDetail', JSON.stringify(question));
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
}
const toComment = (question: question) => {
    localStorage.setItem('questionDetail', JSON.stringify(question));
    router.push({ path: '/detailPage/' + question.uid + '/' + question.id, query: { to: 'comment' } })
}
//设置置顶
const topQuestion = ref<question[]>(localStorage.getItem('topQuestion') ? JSON.parse(localStorage.getItem('topQuestion')!) : [])
const iftop = ref(localStorage.getItem('topQuestion') ? true : false);
const setTop = (question: any) => {
    topQuestion.value.push(question)
    localStorage.setItem('topQuestion', JSON.stringify(topQuestion.value));
    iftop.value = true;
}

const cancelTop = (question: question) => {
    let exists = questions.value.some((questionItem) => questionItem.id == question.id);
    if (exists) {
        replaceQuestion(question);
    }
    // localStorage.removeItem('topQuestion');
    topQuestion.value = topQuestion.value.filter((questionItem: question) => questionItem.id !== question.id);
    localStorage.setItem('topQuestion', JSON.stringify(topQuestion.value));
    if (topQuestion.value.length == 0) {
        localStorage.removeItem('topQuestion');
        iftop.value = false;
    }
}
//若置顶问题存在于问题列表中，更新问题
const replaceQuestion = (newQuestion: question) => {
    questions.value = questions.value.map(question =>
        question.id === newQuestion.id ? newQuestion : question
    );
};

// const filteredQuestions = computed(() => {
//     if (!iftop.value) return questions.value;
//     else
//         return questions.value.filter((question) => question.id != topQuestion.value.id);
// });
const filteredQuestions = computed(() => {
    if (!iftop.value) return questions.value;
    else
        return questions.value.filter(question =>
            !topQuestion.value.some((top: question) => top.id === question.id)
        );
});
//匹配文本中的img标签
const imgTagRegex = /< img\b[^>]*>/gi;
const headingRegex = /^#+\s/gm; // 匹配以#开头的行
// 匹配强调（* 或 _）
const emphasisRegex = /(?:\*|_)(.*?)(?:\*|_)/g;
const noMkContent = (content: string) => {
    return content.replace(imgTagRegex, '[图片]').replace(headingRegex, '').replace(emphasisRegex, '');
}
//删除问题（限我的问题与草稿箱）
const deleteQuestion = (question: question) => {
    request.delete('/question/deleteQuestion/' + question.id).then((res: any) => {
        ElNotification({
            title: '提示',
            message: '删除成功',
            type: 'success',
            offset: 50
        })
        questions.value = questions.value.filter((questionItem: question) => questionItem.id !== question.id);
    }).catch((err: any) => {
        console.log(err);
    })
}

const toWritePage = (question: question) => {
    localStorage.setItem("questionDraft", JSON.stringify(question));
    router.push("/writeArticlePage");
}

</script>

<template>
    <div class="contain">
        <div class="topQuestionCard" v-if="iftop && tab != '我的问题' && tab != '草稿箱' && tab != '我的收藏'"
            v-for="question in topQuestion">
            <el-icon class="icon01">
                <Link />
            </el-icon>
            <el-button class="title" link @click="toDetail(question)">{{ question.title }}</el-button>
            <div class="alreadeyTop" @click="cancelTop(question)">
                <el-icon>
                    <StarFilled />
                </el-icon>
            </div>
            <div class="content" @click="toDetail(question)">
                <div v-if="question.coverurl">
                    <img :src=question.coverurl alt="封面" style="width: 90px; height: 90px; margin-right: 10px;">
                </div>
                <el-text line-clamp="3">
                    {{ noMkContent(question.content) }}
                </el-text>
            </div>
            <div class="options">
                <div>
                    <el-button link @click="handleLike(question)"><span class="iconfont icon-icon"
                            :class="{ 'checked': question.isLiked }"></span></el-button>
                    <span class="number">{{ question.likeNum }}</span>
                </div>
                <div @click="toComment(question)">
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


        <!-- 遍历问题列表渲染 -->
        <div v-for="question in filteredQuestions" :key="question.id" class="questionCard">
            <el-button class="title" link @click="toDetail(question)">{{ question.title }}</el-button>
            <div class="top" @click="setTop(question)" v-if="tab != '我的问题' && tab != '草稿箱' && tab != '我的收藏'">
                <el-icon>
                    <StarFilled />
                </el-icon>
            </div>
            <div class="top" @click="deleteQuestion(question)" v-if="tab == '我的问题' || tab == '草稿箱'">
                <el-icon>
                    <Delete />
                </el-icon>
            </div>
            <div class="content" @click="toDetail(question)">
                <div v-if="question.coverurl">
                    <img :src=question.coverurl alt="封面" style="width: 90px; height: 90px; margin-right: 10px;">
                </div>
                <el-text line-clamp="3" style="align-self: self-end;">
                    {{ noMkContent(question.content) }}
                </el-text>
            </div>
            <div class="options">
                <div>
                    <el-button link @click="handleLike(question)"><span class="iconfont icon-icon"
                            :class="{ 'checked': question.isLiked }"></span></el-button>
                    <span class="number">{{ question.likeNum }}</span>
                </div>
                <div @click="toComment(question)">
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
    </div>
</template>


<style scoped>
.content {
    display: flex;
}

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

.options {
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
    padding-top: 2px;
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