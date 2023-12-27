<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElNotification } from 'element-plus'

class Fans {
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
const FansList = ref<Fans[]>([])


onMounted(() => {
    request.get('/user/getFansUidList' + `/${localStorage.getItem('userId')}`).then(res => {
        FansList.value = res.data;
    })
})
</script>



<template>
    <el-card>
        <template #header>
            <div slot="header" class="clearfix">
                <span style="font-size: 16px; font-weight: 600;">我的粉丝</span>
            </div>
        </template>

        <div class="follow-user-list">

            <div v-for="item in FansList" :key="item.id">
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
