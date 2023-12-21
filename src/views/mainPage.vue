<script setup lang="ts">
import leftComponent from '@/components/main_left/leftComponent.vue'
import sideComponent from '@/components/main_right/sideComponent.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue';
const observee = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const leftRef = ref<HTMLElement | null>(null);
const rightRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);

const changeDisplay = (flag: boolean) => {
    if (observee.value) {
        const rect = observee.value.getBoundingClientRect();
        if (flag) {
            if (mainRef.value && leftRef.value && rightRef.value) {
                mainRef.value.style.display = 'block';
                leftRef.value.style.marginLeft = '18.5%';
                rightRef.value.style.position = 'fixed';
                rightRef.value.style.bottom = '80vh';
                rightRef.value.style.right = '18.5%';
            }
        } else {
            if (mainRef.value && leftRef.value && rightRef.value) {
                if (rect.top > 0) { //从下面划出
                    mainRef.value.style.display = 'flex';
                    leftRef.value.style.marginLeft = '0';
                    rightRef.value.style.position = '';
                }


            }
        }
    }
}

onMounted(() => {
    // 监听元素是否出现在视图中
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { //如果在视图中
                changeDisplay(true);
            } else {  //如果不在视图中 
                changeDisplay(false);
            }
        });
    });
    // 开始观察
    if (observee.value) {
        observer.observe(observee.value);
    }
});
// 组件卸载时取消观察
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
});

</script>

<template>
    <!-- 主页的主体 -->
    <div class="mainContainer" ref="mainRef">
        <!-- 左边是核心的问题列表，右边是一些其他的功能 -->
        <div class="left" ref="leftRef">
            <leftComponent></leftComponent>
        </div>
        <div class="right" ref="rightRef">
            <sideComponent></sideComponent>
        </div>
        <div style=" position: absolute; right: 133px; top: 1259px;" ref="observee">
        </div>
    </div>
</template>

<style scoped>
.mainContainer {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 1%;
    margin: 0 auto;
}

.left {
    width: 42%;
}

.right {
    width: 20%;
    height: 700px;
}
</style>
