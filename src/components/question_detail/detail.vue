<script setup lang="ts">
import router from '@/router';
import { inject, onMounted, ref, onBeforeUnmount } from 'vue';
import request from '@/utils/request';
import { tr } from 'element-plus/es/locale/index.mjs';
const currentAriticleId = router.currentRoute.value.params.id;
const currentUid = router.currentRoute.value.params.uid;
const to = router.currentRoute.value.query.to;
const commentDom = ref<HTMLElement | null>(null);
const questionDetail = ref(JSON.parse(localStorage.getItem('questionDetail')!));
const userId = localStorage.getItem('userId');
onMounted(() => {
    window.scrollTo(0, 0);
    console.log('作者id ' + currentUid);
    console.log('文章id ' + currentAriticleId);
    if (to == 'comment') {
        commentDom.value?.scrollIntoView({ behavior: "smooth", block: 'start' });
    }
    request.get(`/user/getAuthorInfo/${localStorage.getItem('userId')}/${currentUid}`)
        .then(res => {
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
// const url = '../../assets/img/touXiang02.png';
const info = ref<authorInfo>(new authorInfo('小猪佩奇3号', 100, 200, 0, '../../assets/img/touXiang03.png', false));

const setLocalStorage = () => {
    localStorage.setItem('questionDetail', JSON.stringify(questionDetail.value));
}

const followTheAuthor = () => {
    console.log('关注作者');
    request.post(`/user/followUser/${localStorage.getItem('userId')}/${currentUid}/${info.value.isFollowed ? -1 : 1}`)
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


class commentItem {
    id: string;
    userId: number;
    username: string;
    content: string;
    foreignId: number;
    targetUsername: string;
    createTime: string;
    likeNum: number;
    replyNum: number;
    isLiked: boolean;
    isTop: number;
    children: commentItem[];
    constructor(id: string, userId: number, username: string, content: string, foreignId: number, targetUsername: string, createTime: string, likeNum: number, replyNum: number, isLiked: boolean, isTop: number, children: commentItem[]) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.content = content;
        this.foreignId = foreignId;
        this.targetUsername = targetUsername;
        this.createTime = createTime;
        this.likeNum = likeNum;
        this.replyNum = replyNum;
        this.isLiked = isLiked;
        this.isTop = isTop;
        this.children = children;
    }
}

// 评论列表
const commentList = ref<commentItem[]>([]);


const loginUserInfo = ref();

onMounted(() => {
    const params = {
        sortBy: 'createTime'
    };
    request.get('/user/getUserInfo/' + `${localStorage.getItem('userId')}`).then(res => {
        console.log(res.data);
        loginUserInfo.value = res.data;

    })
})

// 发布评论
const handleComment = () => {
    request.post('/comment/add', {
        userId: localStorage.getItem('userId'),
        username: loginUserInfo.value.name,
        touXiang: loginUserInfo.value.touXiang,
        content: commentText.value,
        foreignId: questionDetail.value.id,
        children: []
    }).then(res => {
        questionDetail.value.comment++;
        localStorage.setItem('questionDetail', JSON.stringify(questionDetail.value));
        //初始化评论列表
        totalNum.value.fill(0);
        currentPage.value.fill(1);
        showPageBar.value.fill(false);
        showMoreReply.value.fill(true);
        showMoreReplyInput.value.fill(false);
        placeholder.value.fill('');
        replyCommentText.value.fill('');
        // 重新获取评论列表
        const params = {
            sortBy: 'createTime'
        };
        request.get('/comment/listRootComment/' + questionDetail.value.id + `/0/15/${localStorage.getItem('userId')}`, { params }).then(res => {
            commentList.value = res.data.page;
        })
    })
    // 重置评论框
    commentText.value = '';
}






// 置顶根评论
const handleToTopComment = (commentItem: commentItem) => {
    request.post('/comment/toTopComment' + `/${commentItem.id}/${commentItem.isTop == 1 ? 0 : 1}`).then(res => {
        //初始化评论列表
        totalNum.value.fill(0);
        currentPage.value.fill(1);
        showPageBar.value.fill(false);
        showMoreReply.value.fill(true);
        showMoreReplyInput.value.fill(false);
        placeholder.value.fill('');
        replyCommentText.value.fill('');
        // 重新获取评论列表
        const params = {
            sortBy: 'createTime'
        };
        request.get('/comment/listRootComment/' + questionDetail.value.id + `/0/15/${localStorage.getItem('userId')}`, { params }).then(res => {
            commentList.value = res.data.page;
        })
    })
}


// 删除根评论
const handleDeleteComment = (commentItem: commentItem) => {
    request.delete('/comment/deleteRoot' + `/${commentItem.id}`).then(res => {
        questionDetail.value.comment--;
        localStorage.setItem('questionDetail', JSON.stringify(questionDetail.value));
        //初始化评论列表
        totalNum.value.fill(0);
        currentPage.value.fill(1);
        showPageBar.value.fill(false);
        showMoreReply.value.fill(true);
        showMoreReplyInput.value.fill(false);
        placeholder.value.fill('');
        replyCommentText.value.fill('');
        // 重新获取评论列表
        const params = {
            sortBy: 'createTime'
        };
        request.get('/comment/listRootComment/' + questionDetail.value.id + `/0/15/${localStorage.getItem('userId')}`, { params }).then(res => {
            commentList.value = res.data.page;
        })
    })
}

// 删除回复评论
const handleDeleteReplyComment = (index: number, commentItem: commentItem, replyItem: commentItem) => {
    request.delete('/comment/deleteChild' + `/${commentItem.id}/${replyItem.id}`).then(res => {
        commentList.value[index].replyNum--;
        commentList.value[index].children = commentList.value[index].children.filter(item => item.id != replyItem.id);
        // 截取前三个children
        commentList.value[index].children = commentList.value[index].children.slice(0, 3);
        showMoreReply.value[index] = true;
        showPageBar.value[index] = false;
    })
}


const showMoreReply = ref<boolean[]>(Array(commentList.value.length).fill(true));

// 查看更多回复
const handleClickShowMoreReply = (index: number) => {
    console.log('点击查看更多回复');
    showMoreReply.value[index] = false;
    showPageBar.value[index] = true;
    // 先获取前五条，然后分页获取
    request.get('/comment/listChildrenComment' + `/${commentList.value[index].id}/0/5/${localStorage.getItem('userId')}`).then(res => {
        commentList.value[index].children = res.data.page;
        totalNum.value[index] = res.data.totalNum;
    })

}

// 回复评论的占位符
const placeholder = ref(Array(commentList.value.length).fill(''));

const setPlaceholder = (index: number, commentItem: commentItem) => {
    placeholder.value[index] = '@' + commentItem.username;
}

const showMoreReplyInput = ref<boolean[]>(Array(commentList.value.length).fill(false));

const currentReplyItem = ref();
// 打开回复评论输入框
const handleReplyComment = (index: number, commentItem: commentItem) => {
    showMoreReplyInput.value[index] = true;
    setPlaceholder(index, commentItem);
    currentReplyItem.value = commentItem;
}

// 回复评论的内容
const replyCommentText = ref<string[]>([]);

// 回复评论
const handleReply = (commentItem: commentItem, index: number) => {
    request.post('/comment/reply/' + `${commentItem.id}`, {
        userId: localStorage.getItem('userId'),
        username: loginUserInfo.value.name,
        touXiang: loginUserInfo.value.touXiang,
        content: replyCommentText.value[index],
        foreignId: questionDetail.value.id,
        targetUsername: currentReplyItem.value.username,
        children: []
    }).then(res => {
        // 重新获取回复的评论列表
        request.get('/comment/listChildrenComment' + `/${commentItem.id}/0/5/${localStorage.getItem('userId')}`).then(res => {
            commentList.value[index].children = res.data.page;
        })
        currentPage.value[index] = 1;
        totalNum.value[index] = totalNum.value[index] + 1;
    })
    // 重置评论框
    replyCommentText.value[index] = '';
}

// 分页
const showPageBar = ref(Array(commentList.value.length).fill(false));
// 当前页数
const currentPage = ref(Array(commentList.value.length).fill(1));
// 总回复数量
const totalNum = ref(Array(commentList.value.length).fill(0));
// 当前页数改变
const handleCurrentChange = (val: number, commentItem: commentItem, index: number) => {
    console.log(`当前页: ${val}`);
    console.log(commentItem);
    currentPage.value[index] = val;
    // 重新获取回复的评论列表
    request.get('/comment/listChildrenComment' + `/${commentItem.id}/${val - 1}/5/${localStorage.getItem('userId')}`).then(res => {
        commentList.value[index].children = res.data.page;
        console.log(commentList.value[index].children);
    })
}

// 格式化时间
const handleTimeFormat = (time: string) => {
    let timearr = Array(6).fill('');
    for (let i = 0; i < time.length; i++) {
        if (time[i].length == 1) {
            timearr[i] = '0' + time[i];
        } else {
            timearr[i] = time[i];
        }
    }
    const timestr = timearr[0] + '-' + timearr[1] + '-' + timearr[2] + ' ' + timearr[3] + ':' + timearr[4] + ':' + timearr[5];
    return timestr;
}

// 点赞根评论
const handleLikeRootComment = (commentItem: commentItem) => {
    request.post('/comment/likeRoot' + `/${commentItem.isLiked ? -1 : 1}` + `/${commentItem.id}/${localStorage.getItem('userId')}/${commentItem.userId}`).then(res => {
        commentItem.isLiked = !commentItem.isLiked;
        if (commentItem.isLiked) {
            commentItem.likeNum++;
        } else {
            commentItem.likeNum--;
        }
    })
}

// 点赞回复评论
const handleLikeReplyComment = (commentItem: commentItem, replyItem: commentItem) => {
    request.post('/comment/likeChildren' + `/${replyItem.isLiked ? -1 : 1}` + `/${commentItem.id}/${replyItem.id}/${localStorage.getItem('userId')}/${replyItem.userId}`).then(res => {
        replyItem.isLiked = !replyItem.isLiked;
        if (replyItem.isLiked) {
            replyItem.likeNum++;
        } else {
            replyItem.likeNum--;
        }
    })
}

// 判断是否是自己的问题
const isMyQuestion = () => {
    return localStorage.getItem('userId') == questionDetail.value.userId;
}

//加载更多
const hasMore = ref(true);
//加载次数
const count = ref(0);

const more = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

const load = () => {
    const params = {
        sortBy: 'createTime'
    };
    request.get('/comment/listRootComment/' + questionDetail.value.id + `/${count.value}/15/${localStorage.getItem('userId')}`, { params }).then(res => {
        if (res.data.page.length == 0) {
            hasMore.value = false;
        } else {
            commentList.value = commentList.value.concat(res.data.page);
        }
        count.value++;
    })
}

onMounted(() => {
    // 监听元素是否出现在视图中
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && hasMore.value) { //如果在视图中
                console.log('加载更多');
                load();
            } else {  //如果不在视图中 

            }
        });
    });
    // 开始观察
    if (more.value) {
        observer.observe(more.value);
    }
});
// 组件卸载时取消观察
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<template>
    <div class="contain">
        <div class="body">
            <div class="article">
                <div class="video" v-if="questionDetail.videourl">
                    <video :src=questionDetail.videourl width="100%" height="100%" controls="true"></video>
                </div>
                <div class="context">
                    <mavon-editor class="md-show" v-model="questionDetail.content" :value="questionDetail.content"
                        :subfield="false" :defaultOpen="'preview'" :toolbarsFlag="false" :editable="false"
                        :scrollStyle="true" :ishljs="true" />
                </div>
                <div class="comment" ref="commentDom">
                    <span style="margin-left: 2%; font-size: 22px; font-weight: 500;">评论&nbsp;<span
                            style="font-size: 16px; font-weight: 300;">{{
                                questionDetail.comment
                            }}</span></span>
                    <div class="head">
                        <el-input v-model="commentText" type="textarea" maxlength="200" :rows="2" placeholder="快来发表你的高见吧！"
                            show-word-limit>
                        </el-input>
                        <el-button style="height: 50px;" type="primary" @click="handleComment">发表</el-button>
                    </div>
                    <div class="commentList">
                        <div v-for="(commentItem, index) in commentList" :key="commentItem.id">
                            <div class="commentItem">
                                <div v-if="commentItem.isTop == 1" class="topTag">置顶</div>
                                <div class="itemHead">
                                    <img src='../../assets/img/touXiang03.png' />
                                    <div>{{ commentItem.username }}</div>
                                </div>
                                <div class="item-content">
                                    <span>{{ commentItem.content }}</span>
                                </div>
                                <div class="item-foot-bar">
                                    <span style="margin-left: 2%; margin-right: 2%;">{{
                                        handleTimeFormat(commentItem.createTime) }}</span>
                                    <el-button link @click="handleLikeRootComment(commentItem)">
                                        <span class="iconfont icon-icon" :class="{ 'already': commentItem.isLiked }"
                                            style="position: static;"></span>
                                        <span>{{ commentItem.likeNum }}</span>
                                    </el-button>
                                    <el-button link @click="handleReplyComment(index, commentItem)">
                                        <span style="margin-right: 1%;">回复</span>
                                    </el-button>
                                    <el-dropdown v-if="isMyQuestion" style="position: absolute; right: 2%;">
                                        <el-button link>
                                            <el-icon>
                                                <More />
                                            </el-icon>
                                        </el-button>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item><span @click="handleToTopComment(commentItem)">{{
                                                    commentItem.isTop == 0 ? '置顶' : '取消置顶' }}</span>
                                                </el-dropdown-item>
                                                <el-dropdown-item
                                                    @click="handleDeleteComment(commentItem)">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                                <div class="reply-comment">
                                    <div v-for="(replyItem) in commentList[index].children">
                                        <div class="replyItem">
                                            <div class="itemHead">
                                                <img src='../../assets/img/touXiang03.png' />
                                                <div>{{ replyItem.username }}</div>
                                                <div style="margin-left: 1%;">回复</div>
                                                <div>{{ replyItem.targetUsername }}</div>
                                            </div>
                                            <div class="item-content">
                                                <span>{{ replyItem.content }}</span>
                                            </div>
                                            <div class="item-foot-bar">
                                                <span style="margin-left: 2%; margin-right: 2%;">{{
                                                    handleTimeFormat(replyItem.createTime) }}</span>
                                                <el-button link @click="handleLikeReplyComment(commentItem, replyItem)">
                                                    <span class="iconfont icon-icon"
                                                        :class="{ 'already': replyItem.isLiked }"
                                                        style="position: static;"></span>
                                                    <span>{{ replyItem.likeNum }}</span>
                                                </el-button>
                                                <el-button link @click="handleReplyComment(index, replyItem)">
                                                    <span style="margin-right: 1%;">回复</span>
                                                </el-button>
                                                <el-dropdown v-if="isMyQuestion" style="position: absolute; right: 2%;">
                                                    <el-button link>
                                                        <el-icon>
                                                            <More />
                                                        </el-icon>
                                                    </el-button>
                                                    <template #dropdown>
                                                        <el-dropdown-menu>
                                                            <el-dropdown-item
                                                                @click="handleDeleteReplyComment(index, commentItem, replyItem)">删除</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="margin-top: -1%; margin-left: 2%;">
                                        <el-pagination v-if="showPageBar[index]" v-model:current-page="currentPage[index]"
                                            :page-size="5" layout="total, prev, pager, next" :total="totalNum[index]"
                                            @current-change="(val: number) => { handleCurrentChange(val, commentItem, index) }" />
                                    </div>

                                </div>
                                <div style="margin-left: 7%;margin-top: -2%; font-size: 14px;"
                                    v-if="showMoreReply[index] && commentItem.replyNum > 3">
                                    共{{ commentItem.replyNum }}条回复,<el-button link style="font-size: 14px;"
                                        @click="handleClickShowMoreReply(index)">点击查看</el-button>
                                </div>
                                <div class="replyInput" v-if="showMoreReplyInput[index]">
                                    <el-input v-model="replyCommentText[index]" type="textarea" maxlength="200" :rows="2"
                                        :placeholder="placeholder[index]" show-word-limit>
                                    </el-input>
                                    <el-button style="height: 50px;" type="primary"
                                        @click="handleReply(commentItem, index)">回复</el-button>
                                </div>
                            </div>
                        </div>
                        <div ref="more">没有更多了~</div>
                    </div>
                </div>
            </div>
            <div class=" author">
                <div class="head">
                    <img :src=info.touXiang />
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
                                <span class="iconfont icon-icon" :class="{ 'already': questionDetail.isLiked }">
                                </span>
                            </el-button>
                            <div class="number">{{ questionDetail.likeNum }}</div>
                        </div>
                        <div class="likecontain">
                            <el-button link @click="handleCollect">
                                <span class="iconfont icon-shoucang" :class="{ 'already': questionDetail.isStared }">
                                </span>
                            </el-button>
                            <div class="number">{{ questionDetail.star }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.contain{
    height: 92vh;
}
.body {
    width: 63%;
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
    width: 100%;
    word-wrap: break-word;
    padding: 15px 20px;
}

img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    border-radius: 50%;
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
    transform: translateX(-2px) scale(1.5);
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 90%;
    margin: 0 auto;
    margin-top: 1%;
    margin-bottom: 3%;


}

.commentItem {
    position: relative;
    border-bottom: 1px solid #dbdbdb;
    padding-top: 2%;
    padding-bottom: 2%;
}

.commentItem .topTag {
    position: absolute;
    top: 4%;
    right: 6%;
    width: 38px;
    height: 28px;
    text-align: center;
    border: 1px solid #4d9cee;
    border-radius: 20%;
    color: #4d9cee;
}

.commentItem .itemHead {
    display: flex;
    align-items: center;
    gap: 1%;
    padding-left: 2%;
}

.commentItem img {
    width: 40px;
    height: 40px;
    border-radius: 50%;

}

.commentItem .item-content {
    margin-left: 10%;
    font-size: 16px;
    line-height: 30px;
}

.commentItem .item-foot-bar {
    display: flex;
    align-items: center;
    position: relative;
    width: 90%;
    margin: 0 auto;

    padding-bottom: 2%;
    margin-bottom: 1%;
    margin-top: 1%;
}

.reply-comment {
    padding-left: 5%;
}

.replyInput {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 90%;
    margin: 0 auto;
    margin-top: 1%;
    margin-bottom: 3%;
}

.video {
    /* background-color: red; */
    width: 90%;
    margin: auto;
    margin-top: 10px;
}
</style>