<script setup lang="ts">
import { h, provide, ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import questionList from '@/components/main_left/questionList.vue'

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

const hasNew = ref(true);

</script>

<template>
    <el-card class="box-card">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="热门推荐" name="推荐">
            </el-tab-pane>
            <el-tab-pane label="最新发布" name="最新发布">
                <template #label>
                    <el-badge :is-dot="hasNew" class="item" value="new">最新发布</el-badge>
                </template>
            </el-tab-pane>
            <el-tab-pane label="我的问题" name="我的问题">
            </el-tab-pane>
        </el-tabs>
        <questionList></questionList>
    </el-card>
</template>


<style scoped>
.newTabContainer{
    position: relative;
}
</style>