<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import headerVue from '@/components/header/header.vue'


</script>

<template>
  <el-container style="height: 100%">
    <!-- 头部导航栏 -->
    <el-header style="padding: 0; position: fixed; width: 100%; z-index: 10;">
      <headerVue></headerVue>
    </el-header>
    <el-scrollbar style="height: 100vh;">
      <!-- 中央主题用路由跳转 -->
      <el-main style="padding: 0;margin-top: 3.7%;">
        <router-view></router-view>
      </el-main>
    </el-scrollbar>
  </el-container>
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
</style>
@/stores/loginStore