<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import request from '@/utils/request';
import router from '@/router';
const activeBox = ref(-1)//-1表示全部动态，其他表示某个作者动态
const activeAuthor = ref(-1)//-1表示全部动态，其他表示某个作者动态
const uid = ref(localStorage.getItem('userId'));//用户登录用户id
onMounted(() => {
    //获取问题上方的关注列表，按最近更新时间排序
    getFollowedAuthorList();//先调用获取关注列表，在获取到关注列表后再调用获取问题列表 ./
    //将最近更新时间存入localstorage，如果没有，则直接存，如果有，则比较时间，存入最新的时间，
    //并且对更改的作者进行标记，标记为true，表示有更新，标记为false，表示没有更新
    //获取所有问题列表，按时间排序
    // console.log('问题列表')
    // console.log(questionList.value);
})

const getFollowedQuestionList = () => {
    request.get(`/question/getQuestionById/${uid.value}`).then((res) => {
        // console.log(res.data);
        questionList.value = res.data.map((item: any) => ({
            id: item.id,
            uid: item.uid,
            title: item.title,
            coverurl: item.coverurl,
            videourl: item.videourl,
            content: item.content,
            author: authorList.value.find(author => author.id === item.uid),
            time: item.time,
            isLiked: item.isLiked,
            likeNum: item.likeNum,
            isStared: item.isStared,
            star: item.star,
            comment: item.comment,
        }));
        // console.log(questionList.value)
        originalQuestionList.value = questionList.value;//存储原始关注信息
        // console.log(originalQuestionList.value)
        // console.log(authorList.value)
    }).catch((err) => {
        console.log(err);
    })
}
const getFollowedAuthorList = () => {
    request.get(`/question/getUpdateUser/${uid.value}`).then((res) => {
        authorList.value = res.data;
        // console.log('作者列表')
        // console.log(res.data)
        // console.log(authorList.value)
        getFollowedQuestionList();
    }).catch((err) => {
        console.log(err);
    })
}

class author {
    id: number;//作者id
    name: string;//作者名字
    touXiang: string;//作者头像
    isFollowed: boolean;//当前用户是否关注了当前作者
    updateTime: Array<number>;//作者最近更新时间,localstorage存储上一次查看的时间，用以判断作者是否更新
    constructor(id: number, name: string, touXiang: string, isFollowed: boolean, updateTime: Array<number>) {
        this.id = id;
        this.name = name;
        this.touXiang = touXiang;
        this.isFollowed = isFollowed;
        this.updateTime = updateTime;
    }
}
class question {
    id: number;//问题id
    uid: number;//问题作者id
    title: string;//问题标题
    coverurl: string;//问题封面
    videourl: string;//问题是否有视频
    content: string;//问题内容
    author: author;//问题作者
    time: Array<number>;//问题发布时间
    isLiked: boolean;//当前用户是否点赞了当前问题
    likeNum: number;//当前问题点赞数
    isStared: boolean;//当前用户是否收藏了当前问题
    star: number;//当前问题收藏数
    comment: number;//当前问题评论数
    constructor(id: number, uid: number, title: string, coverurl: string, videourl: string, content: string, author: author, time: Array<number>, isLiked: boolean, likeNum: number, isStared: boolean, star: number, comment: number) {
        this.id = id;
        this.title = title;
        this.coverurl = coverurl;
        this.videourl = videourl;
        this.content = content;
        this.author = author;
        this.time = time;
        this.uid = uid;
        this.isLiked = isLiked;
        this.likeNum = likeNum;
        this.isStared = isStared;
        this.star = star;
        this.comment = comment;
    }
}
//作者列表（右侧上方，按照最近发布问题时间排序）
const authorList = ref<author[]>([])
// authorList.value = ([
//     new author(1, "作者1", "src/assets/img/touXiang03.png", [2021, 10, 10, 10, 10, 10]),
//     new author(2, "作者2", "url", [2021, 10, 10, 10, 10, 10]),
//     new author(3, "作者3", "url", [2021, 10, 10, 10, 10, 10]),
//     new author(4, "作者4", "url", [2021, 10, 10, 10, 10, 10]),
//     new author(5, "作者5", "url", [2021, 10, 10, 10, 10, 10]),
// ]);
const originalQuestionList = ref<question[]>([]);//存储原始关注信息
const questionList = ref<question[]>([]);
// questionList.value = ([
//     new question(1, 1, "问题1", "url", "videourl", "content", authorList.value[0], [2021, 10, 10, 10, 10, 10]),
//     new question(2, 1, "问题2", "url", "videourl", "content", authorList.value[1], [2021, 10, 10, 10, 10, 10]),
//     new question(3, 1, "问题3", "url", "videourl", "content", authorList.value[2], [2021, 10, 10, 10, 10, 10]),
//     new question(4, 1, "问题4", "url", "videourl", "content", authorList.value[3], [2021, 10, 10, 10, 10, 10]),
//     new question(5, 1, "问题5", "url", "videourl", "content", authorList.value[4], [2021, 10, 10, 10, 10, 10]),
// ]);


const loadQuestionByUid = (uid: number) => {
    getFollowedQuestionList();
    //根据uid获取作者的动态列表
    questionList.value = questionList.value.filter(question => question.uid === uid);
}
//关注列表
const changeActiveBox = (index: number, authorId: number) => {
    activeBox.value = index;
    activeAuthor.value = authorId;
    if (activeBox.value !== -1) {
        //获取作者的动态列表
        // loadQuestionByUid(authorId);
        questionList.value = originalQuestionList.value.filter(question => question.uid === authorId);
    }
    else {
        questionList.value = originalQuestionList.value;
    }
}
const allHasNew = ref(false);//全部动态是否有更新
const hasNew = ref((author: author) => {
    const key = uid.value + '-' + author.id + '-lastVisitTime';
    const lastVisitTime = localStorage.getItem(key);//拿到上一次访问这个作者的文章时间
    if (lastVisitTime == null) {//本地无访问该作者的最近时间
        if (author.updateTime != null) {
            allHasNew.value = true;
            return true;//当作者有最近问题发布时间且本地无访问该作者记录
        }
        else if (author.updateTime == null)
            return false;//当作者无最近问题发布时间
    } else if (lastVisitTime != null) {
        const lastVisitDate = new Date(lastVisitTime);
        const currentUpdateTime = new Date(author.updateTime[0], author.updateTime[1] - 1, author.updateTime[2], author.updateTime[3], author.updateTime[4], author.updateTime[5]);
        if (currentUpdateTime > lastVisitDate) {
            allHasNew.value = true;
            return true;
        }
        else {
            return false;
        }
    }

    // if (lastUpdateTime == null) {
    //     return true;
    // } else {
    //     const lastTime = new Date(lastUpdateTime);
    //     const date = new Date(author.updateTime[0], author.updateTime[1] - 1, author.updateTime[2], author.updateTime[3], author.updateTime[4], author.updateTime[5]);
    //     if (date > lastTime) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    //判断作者是否有更新
})

const toDetail = (question: question) => {
    const key = uid.value + '-' + question.author.id + '-lastVisitTime';
    const lastVisitTime = localStorage.getItem(key);
    const arr = question.time;

    localStorage.setItem('questionDetail', JSON.stringify(question));
    const lastQuestionTime = localStorage.getItem('lastQuestion');
    const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    if (lastVisitTime == null) {
        localStorage.setItem(key, date.toString());//在没访问过该作者文章时，设置本地最近访问时间
    }
    else {
        const lastTime = new Date(lastVisitTime);
        if (date > lastTime) {
            localStorage.setItem(key, date.toString());//在当前文章的更新时间晚于上一次访问时间时更新
        }
    }
    if (lastQuestionTime == null) {
        localStorage.setItem('lastQuestion', date.toString());
    }
    else {
        const lastTime = new Date(lastQuestionTime);
        if (date > lastTime) {
            localStorage.setItem('lastQuestion', date.toString());
        }
    }
    router.push('/detailPage/' + question.author.id + '/' + question.id)
}


//匹配文本中的img标签
const imgTagRegex = /<img\b[^>]*>/gi;
const headingRegex = /^#+\s/gm; // 匹配以#开头的行
// 匹配强调（* 或 _）
const emphasisRegex = /(?:\*|_)(.*?)(?:\*|_)/g;
const noMkContent = (content: string) => {
    return content.replace(imgTagRegex, '[图片]').replace(headingRegex, '').replace(emphasisRegex, '');
}

const toComment = (question: question) => {
    localStorage.setItem('questionDetail', JSON.stringify(question));
    router.push({ path: '/detailPage/' + question.uid + '/' + question.id, query: { to: 'comment' } })
}
// 处理收藏逻辑
const handleCollect = (question: any) => {
    console.log("收藏");
    request.post(`/question/starQuestion/${uid.value}/${question.id}/${question.uid}/${question.isStared ? -1 : 1}`)
    if (!question.isStared) question.star++;
    else question.star--;
    question.isStared = !question.isStared;
}
// 处理点赞逻辑
const handleLike = (question: any) => {
    request.post(`/question/likeQuestion/${uid.value}/${question.id}/${question.uid}/${question.isLiked ? -1 : 1}`)
    if (!question.isLiked) question.likeNum++;
    else question.likeNum--;
    question.isLiked = !question.isLiked;
}
</script>


<template>
    <div class="body">
        <div class="rightbody">
            <div class="head" style="overflow: hidden;">
                <div class="box" :class="{ active: activeBox == -1 }" @click="changeActiveBox(-1, -1)">
                    <div class="cover" style="position: relative;">
                        <el-icon style="font-size: 30px;">
                            <Sunny />
                        </el-icon>
                        <el-badge :is-dot="allHasNew" class="item"
                            style="position: absolute; right: 5px; top: 0; color: rgb(0, 174, 236);">
                        </el-badge>
                    </div>
                    <div>
                        全部动态
                    </div>
                </div>
                <div class="box" v-for="author, index in authorList" :key="author.id"
                    :class="{ active: activeBox == index }" @click="changeActiveBox(index, author.id)">
                    <div class="cover" style="position: relative;">
                        <el-badge :is-dot="hasNew(author)" class="item"
                            style="position: absolute; right: 5px; top: 0; color: rgb(0, 174, 236);">
                        </el-badge>
                        <img :src=author.touXiang alt="头像"
                            style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;">
                    </div>
                    <div>
                        {{ author.name }}
                    </div>
                </div>
            </div>

            <!-- 动态列表 -->
            <div class="list">
                <div class="card" v-for="question, index in questionList" :key="index">
                    <div class="authorhead">
                        <div class="headImg">
                            <img :src=question.author.touXiang alt="头像"
                                style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;">
                        </div>
                        <div>
                            <div class="name">
                                {{ question.author.name }}
                            </div>
                            <div style="font-size: small; color: darkgray;">
                                {{ question.time.join('-') }}
                            </div>
                        </div>
                    </div>
                    <div class="content" @click="toDetail(question)">
                        <div>
                            <h3 style="font-weight: bold;">《{{ question.title }}》</h3>
                        </div>
                        <el-text line-clamp="3">
                            {{ noMkContent(question.content) }}
                        </el-text>
                    </div>
                    <div class="options">
                        <div class="optionContain">
                            <el-button link @click="handleLike(question)"><span class="iconfont icon-icon"
                                    :class="{ 'checked': question.isLiked }"></span></el-button>
                            <div class="number">{{ question.likeNum }}</div>
                        </div>
                        <div @click="toComment(question)" class="optionContain">
                            <el-button link><span class="iconfont icon-31pinglun"></span></el-button>
                            <div class="number">{{ question.comment }}</div>
                        </div>
                        <div class="optionContain">
                            <el-button link @click="handleCollect(question)"><span class="iconfont icon-shoucang"
                                    :class="{ 'checked': question.isStared }"></span></el-button>
                            <div class="number">{{ question.star }}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">没有更多了哦</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.body {
    min-height: 92vh;
}

.active {
    color: rgb(73, 197, 241);

}

.active .cover {
    box-sizing: border-box;
    border: 2px solid rgb(73, 197, 241);
}

.body {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}

.rightbody {
    margin: 0 auto;
    width: 80%;
    /* height: 92vh; */
}

/* .followList {
    width: 20%;
    background-color: #fff;
    height: 90vh;
} */

.box {
    text-align: center;
    margin-right: 20px;
}

.box:hover {
    cursor: pointer;
    color: rgb(73, 197, 241);
}

.head {
    display: flex;
    background-color: rgba(255, 255, 255, 0.8);
    height: 110px;
    border-radius: 30px;
    align-items: center;
    padding: 0 30px;
}

.head .cover {
    width: 70px;
    height: 70px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.list {
    /* background-color: #fff; */
    border-radius: 20px;
    margin-top: 10px;
    padding: 5px 15px;
}

.list .card {
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 15px 5px 5px 15px;
}

.authorhead {
    display: flex;
}

.authorhead .name {
    font-weight: 700;
    font-size: large;
}

.authorhead .name:hover,
.headImg:hover {
    cursor: pointer;
}

.headImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    text-align: center;
}

.card .content {
    padding-left: 8%;
    padding-right: 5%;
}

.followList {
    padding: 5px 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.95);
}

.authorCard {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.authorCard button {
    width: 70px;
    height: 25px;
    border-radius: 15px;
}

.bottom {
    text-align: center;
    color: darkgray;
    font-size: 20px;

}

.options {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.optionContain {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.options .optionContain:nth-child(2) .number,
.options .optionContain:nth-child(3) .number {
    padding-bottom: 3px;
}

/**iconfont */
.checked {
    color: #409eff;
}

.iconfont {
    font-size: 25px;
    margin-right: 3px;
}

.iconfont:hover {
    color: #409eff;
}

.number {
    font-size: 20px;
}
</style>
