import { defineStore } from "pinia";
import { ref } from "vue";

export const useQuestionStore = defineStore('questionStore', () => {
    const searchKey = ref('');
    const setSearchKey = (key: string) => {
        searchKey.value = key
    }



    return{
        searchKey,
        setSearchKey
    }
})