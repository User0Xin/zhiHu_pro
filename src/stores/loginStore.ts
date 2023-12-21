import { defineStore } from "pinia";
import { computed, ref } from "vue";
// 定义store
// defineStore(仓库唯一标识,()=>{...})

export const useLoginStore = defineStore('loginStore', () => {
    //声明数据 state

    //是否登录
    const isLogin = ref(false);
    //声明操作数据的方法 action  (普通函数)
    const Login = () => {
        localStorage.setItem('isLogin', 'true')
        isLogin.value = true
    }

    const Logout = () => {
        localStorage.removeItem('isLogin')
        isLogin.value = false
    }
    //声明基于数据派生的计算属性 getters (computed)

    return {
        isLogin,
        Login,
        Logout
    }

})