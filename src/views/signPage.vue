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
        <img alt="LOGO" class="logo" src="https://pic2.zhimg.com/80/v2-f6b1f64a098b891b4ea1e3104b5b71f6_720w.png">
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
                <span>知乎专栏</span><span>圆桌</span><span>发现</span><span>移动应用</span><span>联系我们</span><span>来知乎工作</span><span>注册机构号InvestorRelations</span>
            </div>
            <div>
                <span> © 2023 知乎</span>
                <span>京 ICP 证 110745 号京 ICP 备 13052560 号 -</span>
                <span>京公网安备 11010802020088 号</span>
                <span>京网文[2022]2674-081号</span>
                <span> 出版物经营许可证</span>
                <span> 药品医疗器械网络信息服务备案（京）网药械信息备字（2022）第00334号</span>
            </div>
            <div>广播电视节目制作经营许可证:（京）字第06591号</div>
            <div>
                <span>侵权举报</span>
                <span>网上有害信息举报专区</span>
                <span>儿童色情信息举报专区</span>
                <span>互联网算法推荐举报专区</span>
                <span> 违法和不良信息举报：010-82716601</span>
                <span>举报邮箱：jubao@zhihu.com</span>
            </div>

        </div>
    </div>
</template>

<style scoped>
.signPage {
    position: relative;
    /* 设置背景图片 */
    background-image: url('../assets/img/bgImg02.jpg');
    /* 设置背景图片铺满整个元素 */
    background-size: cover;
    /* 设置背景图片居中 */
    background-position: center;
    /* 防止背景图片重复 */
    background-repeat: no-repeat;
    /* 设置元素的高度为视口的高度 */
    height: 100vh;

}

.logo {
    position: absolute;

    top: 10%;
    left: 46%;
    height: 81px;
    margin-bottom: 24px;
    width: 128px;
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
    left: 8%;
    bottom: 12%;
    color: #8590a6;
    text-align: center;
}

.footer span {
    margin: 0 5px;
}
</style>
