<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElNotification } from 'element-plus'

class FollowUser {
    id: number;
    name: string;
    description: string;
    touXiang: string;
    constructor(id: number, name: string, description: string, touXiang: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.touXiang = touXiang;
    }
}
const followUserList = ref<FollowUser[]>([])


// 取消关注用户
const handleFollowUser = (id: number) => {
    request.post('/user/followUser/' + `${localStorage.getItem('userId')}` + '/' + id + '/-1').then(res => {
        if (res.code == 505) {
            ElNotification({
                title: '提示',
                message: res.msg,
                type: 'warning',
                offset: 50
            })
        } else {
            ElNotification({
                title: '提示',
                message: '取消关注成功',
                type: 'success',
                offset: 50
            })
            request.get('/user/getFollowedUidList' + `/${localStorage.getItem('userId')}`).then(res => {
                followUserList.value = res.data;
            })
        }
    })
}

onMounted(() => {
    request.get('/user/getFollowedUidList' + `/${localStorage.getItem('userId')}`).then(res => {
        followUserList.value = res.data;
    })
})
</script>



<template>
    <el-card>
        <template #header>
            <div slot="header" class="clearfix">
                <span style="font-size: 16px; font-weight: 600;">关注的用户</span>
            </div>
        </template>

        <div class="follow-user-list">

            <div v-for="item in followUserList" :key="item.id">
                <el-card shadow="hover" class="follow-user-card">
                    <div class="card-body">
                        <div style="display: flex; gap: 10px;">
                            <img :src="item.touXiang" alt="头像"
                                style="object-fit: cover; width: 50px; height: 50px; border-radius: 50%;">
                            <div class="follow-user-card-body">
                                <div class="follow-user-card-body-name">
                                    <span style="font-size: 18px; font-weight: 500;">{{ item.name }}</span>
                                </div>
                                <div class="follow-user-card-body-intro">
                                    <span style="font-size: 14px; font-weight: 300;">{{ item.description }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="follow-user-card-footer">
                            <el-button type="primary" size="mini" @click="handleFollowUser(item.id)">取消关注</el-button>
                        </div>
                    </div>

                </el-card>
            </div>

        </div>
    </el-card>
</template>


<style scoped>
.follow-user-card {
    width: 100%;
    margin-bottom: 10px;
}

.card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
