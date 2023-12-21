<script setup lang="ts">
import router from '@/router';

// 点击草稿箱的逻辑
const handleDraft = () => {
    console.log('草稿箱');
}

// 点击写文章的逻辑
const handleWriteArticle = () => {
    router.push('/writeArticlePage');
}

// 点击发视频的逻辑
const handlePostVideo = () => {
    console.log('发视频');
}

// 点击回答问题的逻辑
const handleAnswerQuestion = () => {
    console.log('回答问题');
}

// 点击写想法的逻辑
const handleWriteThink = () => {
    console.log('写想法');
}

// 点击开始创作的逻辑
const handleStartCreate = () => {
    console.log('开始创作');
}

</script>

<template>
    <!-- 右侧卡片：创作中心 -->
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <div style="display: flex; align-items:normal;">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                    <span style="margin-left: 7px;">创作中心</span>
                </div>
                <el-button class="button" link @click="handleDraft">草稿箱</el-button>
            </div>
        </template>
        <!-- 按钮 -->
        <div class="button-bar">
            <el-button link @click="handleWriteArticle">
                <div class="outSide">
                    <div class="icon-box" style="background-color: #e0ecff;">
                        <el-icon style="color: #0066ff;">
                            <Edit />
                        </el-icon>
                    </div>
                    <div style="margin-top: 5px;">写文章</div>
                </div>
            </el-button>
        </div>

        <!-- 小卡片 -->
        <div class="small-card">
            <div style="display: inline-block;">
                <div style="font-size: 15px;line-height: 21px;color: rgb(55, 58, 64);">开启你的创作之旅</div>
                <div style="margin: 6px 0px 0px;min-width: 0px;font-size: 12px;color: rgb(145, 150, 161);">
                    发布首篇内容，开通创作中心<br>
                    快来成为一名优秀的创作者吧！
                </div>
            </div>
            <!-- <img src="https://static.zhihu.com/heifetz/assets/kanshan.0c7f1d08.png" width="61"> -->
        </div>
        <div>
            <el-button plain class="start-btn" @click="handleStartCreate"><el-icon>
                    <Plus />
                </el-icon>&nbsp;开始创作
            </el-button>
        </div>
    </el-card>
</template>


<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

/* 按钮 */
.button-bar {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}

.el-button.is-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-button.is-link:hover {
    background: #fff;
}



/* 按钮外层盒子 */
.outSide {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

}

/* 图标盒子 */
.icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
    background-color: red;
}

/* 图标 */
.el-icon {
    font-size: 20px;
}

/* 小卡片 */
.small-card {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    background-color: #f5f5f5;
    padding: 10px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 5px;
}

/* 开始创作按钮 */
.start-btn {
    width: 95%;
    height: 40px;
    border-color: #7da5e1;
    border-width: 2px;
    color: #7da5e1;
    font-size: 16px;
    margin-top: 15px;
}
</style>