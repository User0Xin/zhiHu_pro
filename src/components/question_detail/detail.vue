<script setup lang="ts">
import router from '@/router';
import { inject, onMounted, ref } from 'vue';
import request from '@/utils/request';
const currentAriticleId = router.currentRoute.value.params.id;
const currentAuthorId = router.currentRoute.value.params.authorId;
const to = router.currentRoute.value.query.to;
const commentDom = ref<HTMLElement | null>(null);
onMounted(() => {
    console.log('作者id ' + currentAuthorId);
    console.log('文章id ' + currentAriticleId);
    if (to == 'comment') {
        commentDom.value?.scrollIntoView({ behavior: "smooth", block: 'start' });
    }
})

const comment = ref([])

class detailInfo {
    name: string; // 作者名字
    articleNum: number; // 作者文章数
    followNum: number; // 作者粉丝数
    answerNum: number; // 作者回答数
    url: string; // 作者头像
    isFollowed: boolean; // 当前用户是否关注了当前作者
    likeNum: number; // 当前文章获赞数
    star: number; // 当前文章收藏数
    isLiked: boolean; // 当前文章是否被当前用户点赞
    isStared: boolean; // 当前文章是否当前用户被收藏
    time: string; // 当前文章发布时间
    constructor(name: string, articleNum: number, followNum: number, answerNum: number, url: string, isFollowed: boolean, likeNum: number, star: number, isLiked: boolean, isStared: boolean, time: string) {
        this.name = name;
        this.articleNum = articleNum;
        this.followNum = followNum;
        this.answerNum = answerNum;
        this.url = url;
        this.isFollowed = isFollowed;
        this.likeNum = likeNum;
        this.star = star;
        this.isLiked = isLiked;
        this.isStared = isStared;
        this.time = time;
    }
}
const url = '../../assets/img/touXiang02.png';
const info = ref<detailInfo>(new detailInfo('小猪佩奇3号', 100, 200, 0, '../../assets/img/touXiang03.png', false, 300, 400, false, false, '2021-08-23 12:00:00'));

const followTheAuthor = () => {
    console.log('关注作者');
    info.value.isFollowed = !info.value.isFollowed;
}

const handleLike = () => {
    if (!info.value.isLiked) {
        info.value.likeNum++;
    } else {
        info.value.likeNum--;
    }
    info.value.isLiked = !info.value.isLiked;
    console.log("点赞");
}
const handleCollect = () => {
    if (!info.value.isStared) {
        info.value.star++;
    } else {
        info.value.star--;
    }
    info.value.isStared = !info.value.isStared;
    console.log("收藏");
}
const commentText = ref('');
import { Search } from '@element-plus/icons-vue'
</script>

<template>
    <div class="body">
        <div class="article">
            <div class="context" style="height: 1500px">
                <span>&nbsp;&nbsp;&nbsp;&nbsp;问题内容</span>
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
                    <div class="number">{{ info.followNum }}</div>
                </div>
                <div>
                    <div>问题</div>
                    <div class="number">{{ info.articleNum }}</div>
                </div>
                <div>
                    <div>回答</div>
                    <div class="number">{{ info.answerNum }}</div>
                </div>
            </div>
            <div class="articleInfo">
                <span>正在阅读：</span>
                <div class="title">
                    问题标题问题标题问题
                </div>
                <div style="padding-left: 10px;">
                    <span style="color:darkgrey">{{ info.time }}</span>
                </div>
                <div class="likestar">
                    <div class="likecontain">
                        <el-button link @click="handleLike"><span class="iconfont icon-icon"
                                :class="{ 'already': info.isLiked }"></span></el-button>
                        <span class="number">{{ info.likeNum }}</span>
                    </div>
                    <div>
                        <el-button link @click="handleCollect"><span class="iconfont icon-shoucang"
                                :class="{ 'already': info.isStared }"></span></el-button>
                        <span class="number">{{ info.star }}</span>
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
}

.article {
    width: 68%;
    position: left;
    background-color: #fff;
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
}

.icon-icon {
    transform: translateX(-1px);
}

.icon-shoucang {
    transform: translateX(-3px);
}

.iconfont:hover {
    /* font-size: 30px; */
    transform: scale(1.5);
    color: cadetblue;
}

.number {
    display: block;
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

</style>