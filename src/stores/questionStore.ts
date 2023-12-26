import { defineStore } from "pinia";
import { ref } from "vue";
import request from "../utils/request";

export const useQuestionStore = defineStore('questionStore', () => {
    const questions = ref([])

    const searchQuestion = (keyword: any, uid: any) => {
        request.get(`/question/searchQuestionByPage/1/${uid}`, { params: { keyword: keyword } })
            .then(res => {
                questions.value = res.data
                console.log(questions.value)
            })
    }

    return {
        searchQuestion,
        questions
    }
})