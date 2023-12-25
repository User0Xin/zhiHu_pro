<script setup lang="ts">
import { h, provide, ref, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import questionList from '@/components/main_left/questionList.vue'
import request from '@/utils/request';

// 问题列表的数量
const count = ref(15);
// 是否还有更多
const hasMore = ref(true);
// 加载更多的文字
const loadText = ref('加载更多');
// 当前选中的tab
const activeName = ref('推荐')
// 提供给子组件的数据
provide('count', count);
provide('hasMore', hasMore);
provide('loadText', loadText);
provide('tab', activeName);
// 初始化问题列表的数量
const initCount = (num: number) => {
    count.value = num;
}

// 点击tab的回调
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event);
    // console.log(tab.props.name);
    // 初始化   
    initCount(15);
    hasMore.value = true;
    loadText.value = '加载更多';

    if (tab.props.name === '推荐') {

    }
}

const hasNew = ref(false);


// setInterval(() => {
//     const last = localStorage.getItem('lastQuestion')
//     if (last == null) {
//         hasNew.value = true;
//         return;
//     }
//     request.get('/question/lastQuestion').then((res: any) => {
//         const arr = res;
//         const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
//         const lastDate = new Date(last);
//         if (date > lastDate) {
//             hasNew.value = true
//             console.log(date, lastDate)
//             return;
//         }
//         else {
//             hasNew.value = false;
//             return;
//         }
//     })
// }, 3000)
</script>

<template>
    <el-card class="box-card">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="热门推荐" name="推荐">
            </el-tab-pane>
            <el-tab-pane label="最新发布" name="最新发布">
                <template #label>
                    <el-badge :is-dot="hasNew" class="item">最新发布</el-badge>
                </template>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="我的收藏">
            </el-tab-pane>
            <el-tab-pane label="我的问题" name="我的问题">
            </el-tab-pane>
            <el-tab-pane label="草稿箱" name="草稿箱">
            </el-tab-pane>
        </el-tabs>
        <questionList></questionList>
    </el-card>
</template>


<style scoped>
.box-card {
    background-color: rgba(255, 255, 255, 0.9);
    filter: blur(0.5px);
    width: 100%;
}

</style>