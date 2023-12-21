<script setup lang="ts">
import router from '@/router';

const back = () => {
  router.back();
}
const top = () => {
  alert('top');
  window.scrollTo(0, 0);
}



</script>

<template>
  <router-view></router-view>
  <div class="back" @click="back"></div>
</template>

<style scoped>
.back{
  width: 40px;
  height: 40px;
  background-color: rgb(223, 229, 237);
  position: absolute;
  top: 70px;
  left: 50px;
  border-radius: 50%;
  box-shadow: inset 4px 4px 4px rgba(80, 80, 80, 0.3), 
              inset -4px -4px 4px rgba(255, 255, 255, 0.7),
              -5px -5px 5px rgba(0,0,0,0.5);
  transition: all 0.3s;
}
.back:hover{
  transform: translate(2px, 2px) scale(1.08, 1.08);
  box-shadow: -15px -15px 10px rgba(0,0,0,0.1),
              inset 6px 6px 6px rgba(99, 94, 94, 0.3), 
              inset -6px -6px 4px rgba(255, 255, 255, 0.9),;
  cursor: pointer;
}
.back:active{
  background-color: #ebe2cd;
  transform: translateY(-1px);
}



</style>
@/stores/loginStore