<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 总用户数
const totalUser = ref(20);
// 当前页
const currentPage = ref(1);
// 每页显示的条数
const pageSize = ref(4);
// 改变页码
const changePage = (val: number) => {
    recommendUser.value = receieveRecommendUser.value.slice((val - 1) * pageSize.value, val * pageSize.value);
}

// 推荐的用户
class RecommendUser {
    name: string;
    followedNum: number;
    touXiang: string;
    constructor(name: string, followedNum: number, touXiang: string) {
        this.name = name;
        this.followedNum = followedNum;
        this.touXiang = touXiang;
    }
}

const receieveRecommendUser = ref<RecommendUser[]>([]);

// 先给一个初始值不然会报错
const recommendUser = ref<RecommendUser[]>([{
    name: '小猪佩奇',
    followedNum: 100,
    touXiang: 'touXiang01.png'
}, {
    name: '小猪佩奇',
    followedNum: 100,
    touXiang: 'touXiang01.png'
}, {
    name: '小猪佩奇',
    followedNum: 100,
    touXiang: 'touXiang01.png'
}, {
    name: '小猪佩奇',
    followedNum: 100,
    touXiang: 'touXiang01.png'
}, {
    name: '小猪佩奇',
    followedNum: 100,
    touXiang: 'touXiang01.png'
}])

onMounted(() => {
    // 发请求获取要推荐的用户
    // 向后端发送请求参数为(currentPage,pageSize)
    //... (currentPage,pageSize)
    receieveRecommendUser.value = [
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇2',
            followedNum: 200,
            touXiang: 'touXiang02.png'
        },
        {
            name: '小猪佩3',
            followedNum: 100,
            touXiang: 'touXiang03.png'
        },
        {
            name: '小猪佩奇4',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇5',
            followedNum: 600,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇6',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang02.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang03.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang02.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang03.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang02.png'
        },
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang03.png'
        }
        ,
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang03.png'
        }
        ,
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang02.png'
        }
        ,
        {
            name: '小猪佩奇',
            followedNum: 100,
            touXiang: 'touXiang01.png'
        }
    ]
    recommendUser.value = receieveRecommendUser.value.slice(0, 4);
    totalUser.value = 20;
})


const handleFollow = () => {
    // 向后端发送请求，参数为当前用户和被关注的用户
    //... (currentUser, followedUser)
    console.log("关注");
}

const handleToPersonalPage = () => {
    // 跳转到他的个人主页
    console.log("跳转到他的个人主页");
}

// 获取图片的url
const getImageUrl = (name: string) => {
    console.log(name)
    return new URL(`../../../assets/img/${name}`, import.meta.url).href;
}

</script>

<template>
    <!-- 右侧卡片：创作中心 -->
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <div style="display: flex; align-items:normal;">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span style="margin-left: 7px;">推荐关注</span>
                </div>
            </div>

        </template>
        <!-- 推荐列表 -->
        <div class="recommendUser" v-for="i in 4">
            <div style="display: flex; align-items: center;">
                <el-avatar size="large" :src="getImageUrl(recommendUser[i - 1].touXiang)" style="margin-right: 10px;"
                    @click="handleToPersonalPage"></el-avatar>
                <div>
                    <div style="font-size: 16px; font-weight: bold;" @click="handleToPersonalPage">{{ recommendUser[i -
                        1].name }}</div>
                    <div style="font-size: 12px; color: #999;" @click="handleToPersonalPage">被{{ recommendUser[i -
                        1].followedNum }}人关注</div>
                </div>
            </div>
            <el-button class="start-btn" type="primary" @click="handleFollow">关注</el-button>
        </div>
        <!-- 分页 -->
        <div class="example-pagination-block">
            <el-pagination layout="prev, pager, next" :total="totalUser" @current-change="changePage"
                v-model:page-size="pageSize" v-model:current-page="currentPage" />
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
</style>