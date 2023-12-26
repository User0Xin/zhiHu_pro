<script setup lang="ts">
import { ref } from 'vue';
import type { ElCarousel } from 'element-plus'
import loginComponent from '@/components/sign/loginComponent.vue';
import signComponent from '@/components/sign/signComponent.vue';
import forgetComponent from '@/components/sign/forgetComponent.vue';
const isLoginPage = ref(true);
const cardTitle = ref('登录');
const carousel = ref<InstanceType<typeof ElCarousel> | null>(null);
//跳转到注册页面
const toSignPage = () => {
    cardTitle.value = '注册';
    isLoginPage.value = false;
    carousel.value?.next()
    buttonIndex.value++;
    carouselHeight.value = '300px';
}

const toLoginPage = () => {
    cardTitle.value = '登录';
    isLoginPage.value = true;
    carousel.value?.prev()
    carouselHeight.value = '210px';
    buttonIndex.value--;
    reloadComponent();
}

const backToSignPage = () => {
    cardTitle.value = '登录';
    buttonIndex.value++;
    carousel.value?.next()
    isLoginPage.value = true;
}

const toForgetPage = () => {
    cardTitle.value = '忘记密码';
    isLoginPage.value = false;
    buttonIndex.value--;
    carousel.value?.prev()
}




const componentKey = ref(0);

const reloadComponent = () => {
    componentKey.value++;
};


const autoplay = ref(false);
const carouselHeight = ref('210px');

const buttonIndex = ref(1);


</script>

<template>
    <div class="signPage">

      <div class="logoBar">
        <img alt="LOGO" class="logo" src="../assets/img/logo1.png">
      </div>
        <el-card class="container">
            <template #header>
                <div class="card-header">
                    <span>{{ cardTitle }}</span>
                </div>
            </template>
            <el-button link style="position: absolute; right: 15px; top: 22px;" @click="toForgetPage"
                v-if="isLoginPage">忘记密码</el-button>
            <el-carousel ref='carousel' indicator-position="none" arrow="never" :autoplay=autoplay :height="carouselHeight"
                initial-index="1">
                <el-carousel-item>
                    <forgetComponent></forgetComponent>
                </el-carousel-item>
                <el-carousel-item>
                    <loginComponent></loginComponent>
                </el-carousel-item>
                <el-carousel-item style="padding-top: 30px;">
                    <signComponent :key="componentKey"></signComponent>
                </el-carousel-item>
            </el-carousel>
            <el-button link style="position: absolute; right: 10px; bottom: 15px;" @click="backToSignPage"
                v-if="buttonIndex == 0">返回登录</el-button>
            <el-button link style="position: absolute; right: 10px; bottom: 15px;" @click="toSignPage"
                v-if="buttonIndex == 1">没有账号，去注册！</el-button>
            <el-button link style="position: absolute; right: 10px; bottom: 15px;" @click="toLoginPage"
                v-if="buttonIndex == 2">已有账号，去登录！</el-button>
        </el-card>
        <div class="footer">
            <div>
                <span> © 2023 Baidu</span>
                <span> 使用百度前必读</span>
                <span> 意见反馈</span>
                <span>京ICP证030173号</span>
                <span>京公网安备11000002000001号</span>
                <span>京网文[2023]2674-081号</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.signPage {
    position: relative;
    /* 设置背景图片 */
    background-image: url('../assets/img/bg.png');
    /* 设置背景图片铺满整个元素 */
    background-size: cover;
    /* 设置背景图片居中 */
    background-position: center;
    /* 防止背景图片重复 */
    background-repeat: no-repeat;
    /* 设置元素的高度为视口的高度 */
    height: 100vh;

}
.logoBar{
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 50%;
    width: 100%;
}
.logo {
    position: absolute;
    top: 10%;
    height: 82px;
    margin-bottom: 28px;
    width: 300px;
}

.container {
    position: relative;
    width: 400px;
    margin: 0 auto;
    top: 24%;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;
    padding-bottom: 10px;
}

.card-header {
    font-size: 24px;
}

.footer {
    position: absolute;
    min-height: 35px;
    bottom: 9%;
    width: 100%;
    color: #8590a6;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer span {
    margin: 0 5px;
}
</style>
