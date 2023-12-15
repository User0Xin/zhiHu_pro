<script setup lang="ts">
import createComponent from '@/components/main_right/parts/createComponent.vue'
import recommendStarComponnet from '@/components/main_right/parts/recommendStarComponnet.vue'
import webInfo from '@/components/main_right/parts/webInfo.vue'
</script>

<template>
    <div class="partsBox">
        <createComponent></createComponent>
    </div>
    <div class="partsBox">
        <recommendStarComponnet></recommendStarComponnet>
    </div>
    <div class="partsBox">
        <webInfo></webInfo>
    </div>
</template>


<style scoped>
.partsBox {
    margin-bottom: 2px
}
</style>