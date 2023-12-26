<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import request from '@/utils/request'
// 总用户数
const totalUser = ref();
// 当前页
const currentPage = ref(1);
// 每页显示的条数
const pageSize = ref(4);
// 改变页码
const changePage = (val: number) => {
    currentPage.value = val;
    if(localStorage.getItem('userId') == null){
        getUnloginRecommendUser();
    }else{
        getloginRecommendUser();
    }
}

// 推荐的用户
class RecommendUser {
    id: number;
    name: string;
    answerNum: number;
    touXiang: string;
    isFollowed: boolean;
    constructor(id: number,name: string, answerNum: number, touXiang: string, isFollowed: boolean) {
        this.id = id;
        this.name = name;
        this.answerNum = answerNum;
        this.touXiang = touXiang;
        this.isFollowed = isFollowed;
    }
}

const receieveRecommendUser = ref<RecommendUser[]>([]);

// 先给一个初始值不然会报错
const recommendUser = ref<RecommendUser[]>([

])

onMounted(() => {
    // 发请求获取要推荐的用户
    // 向后端发送请求参数为(currentPage,pageSize)
    //... (currentPage,pageSize)
    //先判断是否登录，如果未登录，获取的推荐用户统一未关注
    const uid = localStorage.getItem('userId')
    if (uid == null) {
        getUnloginRecommendUser();
    } else {
        getloginRecommendUser();
    }
    //登录后按照实际关注情况获取
    // receieveRecommendUser.value = [
    //     {
    //         name: '小猪佩奇1',
    //         answerNum: 100,
    //         touXiang: 'touXiang01.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇2',
    //         answerNum: 100,
    //         touXiang: 'touXiang02.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇3',
    //         answerNum: 100,
    //         touXiang: 'touXiang03.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇4',
    //         answerNum: 100,
    //         touXiang: 'touXiang02.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇5',
    //         answerNum: 100,
    //         touXiang: 'touXiang03.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇3',
    //         answerNum: 100,
    //         touXiang: 'touXiang03.png',
    //         isFollowed: false
    //     },
    //     {
    //         name: '小猪佩奇4',
    //         answerNum: 100,
    //         touXiang: 'touXiang02.png',
    //         isFollowed: false
    //     }
    // ]
    // recommendUser.value = receieveRecommendUser.value.slice(0, 4);
    // totalUser.value = 7;
})

const getUnloginRecommendUser = () => {
    request.get(`/user/listRecommendUserWithoutLogin/${currentPage.value}/${pageSize.value}`)
        .then((res) => {
            console.log(res.data)
            recommendUser.value = res.data.page;
            totalUser.value = res.data.totalNum;
        })
}
const getloginRecommendUser = () => {
    const uid = localStorage.getItem('userId')
    request.get(`/user/listRecommendUser/${currentPage.value}/${pageSize.value}/${uid}`)
        .then((res) => {
            console.log("获取推荐用户")
            recommendUser.value = res.data.page
            totalUser.value = res.data.totalNum;
        })
}

const pleaseLogin = () => {
    ElNotification({
        title: '提示',
        message: '请先登录',
        type: 'warning',
        offset: 50
    })
}
const handleFollow = (user: any) => {
    // 向后端发送请求，参数为当前用户和被关注的用户
    //... (currentUser, followedUser)
    const uid = localStorage.getItem('userId')
    if (uid == null) {
        pleaseLogin();
        return;
    }
    console.log('关注作者');
    request.post('/user/followUser/' + uid + '/' + user.id + '/1')
    user.isFollowed = !user.isFollowed;
}
//取消关注
const handleUnFollow = (user: any) => {
    const uid = localStorage.getItem('userId')
    if (uid == null) {
        pleaseLogin();
        return;
    }
    console.log("取消关注");
    request.post('/user/followUser/' + uid + '/' + user.id + '/-1')
    user.isFollowed = !user.isFollowed;
}

const handleToPersonalPage = () => {
    // 跳转到他的个人主页
    console.log("跳转到他的个人主页");
}

// 获取图片的url
const getImageUrl = (name: string) => {
    return new URL(`../../../assets/img/${name}`, import.meta.url).href;
}

</script>

<template>
    <!-- 右侧卡片：创作中心 -->
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span style="margin-left: 7px;">优质博主</span>
                </div>
            </div>

        </template>
        <!-- 推荐列表 -->
        <div class="recommendUser" v-for="item in recommendUser">
            <div style="display: flex; align-items: center;">
                <el-avatar size="large" :src=item.touXiang style="margin-right: 10px;"
                    @click="handleToPersonalPage"></el-avatar>
                <div>
                    <div style="font-size: 16px; font-weight: bold;" @click="handleToPersonalPage">
                        {{ item.name }}</div>
                    <div style="font-size: 12px; color: #999;" @click="handleToPersonalPage">
                        已回答{{ item.answerNum }}个问题</div>
                </div>
            </div>
            <el-button class="start-btn" type="primary" @click="handleFollow(item)" v-if="!item.isFollowed">+ 关注</el-button>
            <el-button class="unStart-btn" type="primary" @click="handleUnFollow(item)" v-if="item.isFollowed">已关注</el-button>
        </div>
        <!-- 分页 -->
        <div class="example-pagination-block">
            <el-pagination layout="prev, pager, next" :total="totalUser" @update:current-page="changePage"
                :page-size="pageSize" :current-page="currentPage" />
            <!-- <el-pagination layout="prev, pager, next" :total="50" :current-page="currentPage"/> -->
        </div>

    </el-card>
</template>


<style scoped>
/* 右侧卡片 */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

/* 推荐的用户 */
.recommendUser {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

/* 分页 */
.example-pagination-block {
    display: flex;
    justify-content: center;
}

.example-pagination-block+.example-pagination-block {
    margin-top: 10px;
}

.example-pagination-block .example-demonstration {
    margin-bottom: 16px;
}

.unStart-btn {
    color: rgb(148, 153, 160);
    background-color: rgb(227, 229, 231);
    border: none;
}
.unStart-btn:hover{
    background-color: rgb(241, 242, 243);
}
</style>