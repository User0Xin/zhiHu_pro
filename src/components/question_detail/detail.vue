<script setup lang="ts">
import router from '@/router';
import { inject, onMounted, ref } from 'vue';
import request from '@/utils/request';
const currentAriticleId = router.currentRoute.value.params.id;
const currentUid = router.currentRoute.value.params.uid;
const to = router.currentRoute.value.query.to;
const commentDom = ref<HTMLElement | null>(null);
const questionDetail = ref(JSON.parse(localStorage.getItem('questionDetail')!));
const userId = localStorage.getItem('userId');
onMounted(() => {
    console.log('作者id ' + currentUid);
    console.log('文章id ' + currentAriticleId);
    if (to == 'comment') {
        commentDom.value?.scrollIntoView({ behavior: "smooth", block: 'start' });
    }
    request.get(`/user/getAuthorInfo/${localStorage.getItem('userId')}/${currentUid}`)
    .then( res => {
        console.log(res.data);
        info.value = res.data
        console.log(info.value);
    })
})

const comment = ref([])

//问题作者的信息
class authorInfo {
    name: string; // 作者名字
    questionNum: number; // 作者问题数
    followedNum: number; // 作者粉丝数
    answerNum: number; // 作者回答数
    touXiang: string; // 作者头像
    isFollowed: boolean; // 当前用户是否关注了当前作者
    constructor(name: string, questionNum: number, followedNum: number, answerNum: number, touXiang: string, isFollowed: boolean) {
        this.name = name;
        this.questionNum = questionNum;
        this.followedNum = followedNum;
        this.answerNum = answerNum;
        this.touXiang = touXiang;
        this.isFollowed = isFollowed;
    }
}
const url = '../../assets/img/touXiang02.png';
const info = ref<authorInfo>(new authorInfo('小猪佩奇3号', 100, 200, 0, '../../assets/img/touXiang03.png', false));

const setLocalStorage = () => {
    localStorage.setItem('questionDetail', JSON.stringify(questionDetail.value));
}

const followTheAuthor = () => {
    console.log('关注作者');
    request.post(`/user/followUser/${localStorage.getItem('userId')}/${currentUid}/${ info.value.isFollowed ? -1 : 1}`)
    info.value.isFollowed = !info.value.isFollowed;
    setLocalStorage();
}


const handleLike = () => {
    request.post(`/question/likeQuestion/${userId}/${questionDetail.value.id}/${questionDetail.value.uid}/${questionDetail.value.isLiked ? -1 : 1}`)
    if (!questionDetail.value.isLiked) {
        questionDetail.value.likeNum++;
    } else {
        questionDetail.value.likeNum--;
    }
    questionDetail.value.isLiked = !questionDetail.value.isLiked;
    setLocalStorage();

}
const handleCollect = () => {
    request.post(`/question/starQuestion/${userId}/${questionDetail.value.id}/${questionDetail.value.uid}/${questionDetail.value.isStared ? -1 : 1}`)
    if (!questionDetail.value.isStared) {
        questionDetail.value.star++;
    } else {
        questionDetail.value.star--;
    }
    questionDetail.value.isStared = !questionDetail.value.isStared;
    setLocalStorage();
}
const commentText = ref('');
</script>

<template>
    <div class="body">
        <div class="article">
            <div class="video" v-if="questionDetail.videourl">
                <video :src=questionDetail.videourl></video>
            </div>
            <div class="context">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ questionDetail.content }}
            </div>
            <div class="comment" ref="commentDom">
                <span>评论区</span>
                <div class="head">
                    <el-input v-model="commentText" autosize type="textarea" placeholder="快来发表你的高见吧！">

                    </el-input>
                </div>
            </div>
        </div>
        <div class="author">
            <div class="head">
                <img src='../../assets/img/touXiang03.png' />
            </div>
            <div class="name">
                <span>{{ info.name }}</span>
                <button @click="followTheAuthor"
                    :style="{ backgroundColor: info.isFollowed ? 'rgb(227, 229, 231)' : 'rgb(100, 150, 200)', color: info.isFollowed ? 'rgb(169, 153, 167)' : 'white' }">
                    <span v-if="!info.isFollowed">+ 关注</span>
                    <span v-if="info.isFollowed">已关注</span>
                </button>
            </div>
            <div class="authorInfo">
                <div>
                    <div>粉丝</div>
                    <div class="number">{{ info.followedNum }}</div>
                </div>
                <div>
                    <div>问题</div>
                    <div class="number">{{ info.questionNum }}</div>
                </div>
                <div>
                    <div>回答</div>
                    <div class="number">{{ info.answerNum }}</div>
                </div>
            </div>
            <div class="articleInfo">
                <span>正在阅读：</span>
                <div class="title">
                    《{{ questionDetail.title }}》
                </div>
                <div style="padding-left: 10px;">
                    <span style="color:darkgrey">{{ questionDetail.time.join('-') }}</span>
                </div>
                <div class="likestar">
                    <div class="likecontain">
                        <el-button link @click="handleLike">
                            <span class="iconfont icon-icon"
                                :class="{ 'already': questionDetail.isLiked }">
                            </span>
                        </el-button>
                        <div class="number">{{ questionDetail.likeNum }}</div>
                    </div>
                    <div class="likecontain">
                        <el-button link @click="handleCollect">
                            <span class="iconfont icon-shoucang"
                                :class="{ 'already': questionDetail.isStared }">
                            </span>
                        </el-button>
                        <div class="number">{{ questionDetail.star }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.body {
    width: 63%;
    height: 8000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    opacity: 0.9;
}

.article {
    width: 68%;
    position: left;
    background-color: #fff;
    border-radius: 10px;
}

.author {
    position: right;
    width: 300px;
    height: 500px;
    background-color: #fff;
    position: fixed;
    right: 284px;
    top: 55px;
    border-radius: 15px;
    padding-top: 10px;
    box-shadow: 0 8px 15px rgba(100, 100, 100, 0.5);
    border: 1px solid rgba(red, green, blue, alpha);
    transition: all 0.3s;
}

.context {
    /* margin-left: 30px; */
    border-radius: 10px;
    height: 1500px;
    width: 100%;
    word-wrap: break-word;
    padding: 15px 20px;
}

img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    border-radius: 30px;
}

.author .head {
    height: 60px;
    width: 60px;
    margin-left: 50%;
    margin-top: 15px;
    transform: translateX(-50%);
    position: relative;
}

.author .name {
    text-align: center;
    font-size: 20px;
    margin-top: 10px;
}

.author .name button {
    width: 70px;
    height: 25px;
    border-radius: 15px;
    border: 1px solid #fff;
    margin-left: 10px;
    transition: all 0.5s;
    font-size: small;
    padding-right: 10px;
}

.author .name button:hover {
    /* background-color: #E0E0E0; */
    border: 1px solid #000;
    cursor: pointer;
}

.author .authorInfo {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.articleInfo {
    margin-top: 20px;
}

.likestar {
    display: flex;
    justify-content: space-around;
    position: relative;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-align: left;
    margin-left: 20px;
    /* margin-bottom: 20px; */
    display: block;
}

.iconfont {
    font-size: 20px;
    transition: all 0.5s;
    position: absolute;
    transform: translateX(-2px);
}


.iconfont:hover {
    /* font-size: 30px; */
    transform:  translateX(-2px) scale(1.5);
    color: cadetblue;
}

.number {
    font-size: small;
    text-align: center;
}

.already {
    color: #409eff;
}

.likecontain {
    width: 22px;
}

/**评论区 */
.comment {
    padding-top: 50px;
}

.comment .head {
    width: 90%;
    margin: 0 auto;
    border-radius: 20px;
    border: 1px solid darkgray;
    /* display: flex; */
}
.video{
    /* background-color: red; */
    width: 90%;
    margin: auto;
    margin-top: 10px;
}
</style>