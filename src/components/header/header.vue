<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import router from '@/router';
import signComponent from '@/components/sign/signComponent.vue'
import loginComponent from '@/components/sign/loginComponent.vue'
const input = ref('')
const state = reactive({
    circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    sizeList: ['small', '', 'large'] as const,
})

const { circleUrl, sizeList } = toRefs(state)


//头像下拉框
const handleClickMyPage = () => {
    router.push('/personalPage')
}

const handleClickLogout = () => {
    console.log('退出登录')
}

//返回主页
const backToMain = () => {
    router.push('/')
}

//是否登录
const isLogin = ref(false);


// 用户
class User {
    name: string;
    touXiang: string;
    constructor(name: string, touXiang: string) {
        this.name = name;
        this.touXiang = touXiang;
    }
}

//登录弹窗
const dialogFormVisible = ref(false)

const toSign = ref(false);

const handleLogin = () => {
    dialogFormVisible.value = true
}


const toSignPage = () => {
    dialogTitle.value = '注册';
    toSign.value = true;
}



const handleCloseDialog = () => {
    dialogTitle.value = '登录';
    toSign.value = false;
}

const dialogTitle = ref('登录');

const getImageUrl = (name: string) => {
    return new URL(`../../assets/img/${name}`, import.meta.url).href;
}
const user = ref<User>(new User('小猪佩奇', 'touXiang01.png'));
</script>

<template>
    <div class="topBar">
        <el-button link @click="backToMain">xxx产品论坛</el-button>
        <div class="searchInput">
            <el-input v-model="input" placeholder="Please input" class="input-with-select">
                <template #append>
                    <el-button :icon="Search" />
                </template>
            </el-input>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
            <div class="UserName" v-if="isLogin">{{ user.name }}</div>
            <el-button link v-if="!isLogin" @click="handleLogin">请登录</el-button>
            <div class="touXiang" style="margin-left: 10px;">
                <!-- 未登录 -->
                <span class="el-dropdown-link" v-if="!isLogin">
                    <el-avatar :size="40" :src="circleUrl" @click="handleLogin" />
                </span>
                <!-- 已登录 -->
                <el-dropdown trigger="click" v-if="isLogin">
                    <span class="el-dropdown-link">
                        <el-avatar :size="40" :src="getImageUrl(user.touXiang)" />
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleClickMyPage">我的主页</el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleClickLogout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="450px" @close="handleCloseDialog"
            destroy-on-close=true>
            <loginComponent v-if="!toSign"></loginComponent>
            <signComponent v-if="toSign"></signComponent>
            <el-button link style="position: absolute; right: 10px; bottom: 30px;" @click="toSignPage"
                v-if="!toSign">没有账号，去注册！</el-button>
        </el-dialog>
    </div>
</template>

<style scoped>
.topBar {

    background-color: #fff;
    display: inline-flex;
    width: 100%;
    height: 52px;
    align-items: center;
    justify-content: space-between;
    padding: 0 2%;
}

.mainContainer {
    height: 100px;
}


/* 搜索 */
.searchInput {

    width: 35%;
}



.input-with-select {
    width: 100%;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}



.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>