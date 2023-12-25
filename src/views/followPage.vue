<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import router from '@/router';
const activeBox = ref(-1)//-1表示全部动态，其他表示某个作者动态
const activeAuthor = ref(-1)//-1表示全部动态，其他表示某个作者动态
const uid = ref(localStorage.getItem('userId'));//用户登录用户id
onMounted(() => {
    //获取问题上方的关注列表，按最近更新时间排序
    getFollowedAuthorList();
    //将最近更新时间存入localstorage，如果没有，则直接存，如果有，则比较时间，存入最新的时间，
    //并且对更改的作者进行标记，标记为true，表示有更新，标记为false，表示没有更新
    //获取所有问题列表，按时间排序
    getFollowedQuestionList();
})

const getFollowedQuestionList = () => {
    request.get(`/question/getQuestionById/${uid.value}`).then((res) => {
        questionList.value = res.data.map((item: any) => ({
            id: item.id,
            uid: item.uid,
            title: item.title,
            coverurl: item.coverurl,
            videourl: item.videourl,
            content: item.content,
            author: authorList.value.find(author => author.id === item.uid),
            time: item.time
        }));
        console.log(questionList.value);
    }).catch((err) => {
        console.log(err);
    })
}
const getFollowedAuthorList = () =>{
    request.get(`/question/getUpdateUser/${uid.value}`).then((res) => {
        authorList.value = res.data;
    }).catch((err) => {
        console.log(err);
    })
}

class author {
    id: number;//作者id
    name: string;//作者名字
    touXiang: string;//作者头像
    isFollowed = true;//当前用户是否关注了当前作者
    updateTime: Array<number>;//作者最近更新时间,localstorage存储上一次查看的时间，用以判断作者是否更新
    constructor(id: number, name: string, touXiang: string, updateTime: Array<number>) {
        this.id = id;
        this.name = name;
        this.touXiang = touXiang;
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
    constructor(id: number, uid: number, title: string, coverurl: string, videourl: string, content: string, author: author, time: Array<number>) {
        this.id = id;
        this.title = title;
        this.coverurl = coverurl;
        this.videourl = videourl;
        this.content = content;
        this.author = author;
        this.time = time;
        this.uid = uid;
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

const questionList = ref<question[]>([]);
// questionList.value = ([
//     new question(1, 1, "问题1", "url", "videourl", "content", authorList.value[0], [2021, 10, 10, 10, 10, 10]),
//     new question(2, 1, "问题2", "url", "videourl", "content", authorList.value[1], [2021, 10, 10, 10, 10, 10]),
//     new question(3, 1, "问题3", "url", "videourl", "content", authorList.value[2], [2021, 10, 10, 10, 10, 10]),
//     new question(4, 1, "问题4", "url", "videourl", "content", authorList.value[3], [2021, 10, 10, 10, 10, 10]),
//     new question(5, 1, "问题5", "url", "videourl", "content", authorList.value[4], [2021, 10, 10, 10, 10, 10]),
// ]);

const loadAllQuestion = () => {
    //获取所有问题列表，按时间排序
}
const loadQuestionByUid = (uid: number) => {
    //根据uid获取作者的动态列表
}
//关注列表
const changeActiveBox = (index: number, authorId: number) => {
    activeBox.value = index;
    activeAuthor.value = authorId;
    if (activeBox.value !== -1) {
        //获取作者的动态列表
        questionList.value = [];
        loadQuestionByUid(authorId);
    } else {
        //获取全部动态列表
        loadAllQuestion();
    }
}
const hasNew = ref((author: author) => {
    const lastUpdateTime = localStorage.getItem('lastUpdateTimeAuthor' + author.id);
    if (lastUpdateTime == null) {
        return true;
    }else{
        const lastTime = new Date(lastUpdateTime);
        const date = new Date(author.updateTime[0], author.updateTime[1] - 1, author.updateTime[2], author.updateTime[3], author.updateTime[4], author.updateTime[5]);
        if (date > lastTime) {
            return true;
        }else{
            return false;
        }
    }
    //判断作者是否有更新
})

const toDetail = (question: question) => {
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
    router.push('/detailPage/' + question.author.id + '/' + question.id)
}

</script>


<template>
    <div class="body">
        <div class="rightbody">
            <div class="head" style="overflow: hidden;">
                <div class="box" :class="{ active: activeBox == -1 }" @click="changeActiveBox(-1, -1)">
                    <div class="cover">
                        头像
                    </div>
                    <div>
                        全部动态
                    </div>
                </div>
                <div class="box" v-for="author, index in authorList" :key="author.id"
                    :class="{ active: activeBox == index }" @click="changeActiveBox(index, author.id)">
                    <div class="cover" style="position: relative;">
                        <el-badge :is-dot="hasNew(author)" class="item" style="position: absolute; right: 5px; top: 0; color: rgb(0, 174, 236);">
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
                <div class="card" v-for="question in questionList" :key="question.id">
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
                    <div class="content">
                        {{ question.content }}
                    </div>
                </div>
                <div class="bottom">没有更多了哦</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.body{
    min-height: 91vh;
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
    padding: 5px 5px;
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
}

.followList {
    padding: 5px 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.95);
}
.authorCard{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.authorCard button{
    width: 70px;
    height: 25px;
    border-radius: 15px;
}
.bottom{
    text-align: center;
    color: darkgray;
    font-size: 20px;
    
}
</style>
