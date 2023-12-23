<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import headerVue from '@/components/header/header.vue'

</script>

<template>
    <div class="container">
        <div class="glass"></div>
        <div class="body">
            <el-container style="height: 100%"  ref="headDom">
                <!-- 头部导航栏 -->
                <el-header style="padding: 0; position: fixed; width: 100%; z-index: 10;">
                    <headerVue></headerVue>
                </el-header>
                <el-scrollbar style="height: 100vh;">
                    <!-- 中央主体用路由跳转 -->
                    <el-main style="padding: 0;margin-top: 3.7%;">
                        <router-view></router-view>
                    </el-main>
                </el-scrollbar>
            </el-container>
        </div>
        
    </div>
</template>

<style scoped>
.mainContainer {
    margin: 0 auto;
}

.left {
    margin-left: 23%;
    width: 42%;
    background-color: #fff;
}

.right {
    position: fixed;
    right: 240px;
    top: 70px;
    width: 20%;
    height: 700px;
}

.container {
    position: relative;
}
.body{
    z-index: 3;
}
.glass{
    background-image: url('../assets/img/03.jpg');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    filter: blur(3px);
}
</style>
@/stores/loginStore