import { defineStore } from "pinia";
import { computed, ref } from "vue";
// 定义store
// defineStore(仓库唯一标识,()=>{...})

export const useLoginStore = defineStore('loginStore', () => {
    //声明数据 state

    //是否登录
    const isLogin = ref(false);
    const userName = ref('');
    const touXiang = ref('');
    //声明操作数据的方法 action  (普通函数)
    const Login = () => {
        localStorage.setItem('isLogin', 'true')
        isLogin.value = true
    }

    const Logout = () => {
        localStorage.removeItem('isLogin')
        isLogin.value = false
    }

    const setUserName = (name: string) => {
        userName.value = name
    }

    const setTouXiang = (url: string) => {
        touXiang.value = url
    }
    //声明基于数据派生的计算属性 getters (computed)

    return {
        isLogin,
        Login,
        Logout,
        userName,
        touXiang,
        setUserName,
        setTouXiang
    }

})