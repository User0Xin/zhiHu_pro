import { defineStore } from "pinia";
import { computed, ref } from "vue";
// 定义store
// defineStore(仓库唯一标识,()=>{...})

export const usrQuestionsStore = defineStore('questions', () => {
    //声明数据 state
    const count = ref(15)
    //声明操作数据的方法 action  (普通函数)
    const addCount = () => {
        count.value++
    }

    const subCount = () => {
        count.value--
    }
    //声明基于数据派生的计算属性 getters (computed)

    return {
        count,
        addCount,
        subCount
    }

})