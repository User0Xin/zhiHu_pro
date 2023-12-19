<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type Ref } from 'vue';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
const articleContent = ref('');
const imgAdd = (pos: number, file: File) => {
    console.log(pos, file);
}
const markdownOption = {
    bold: true, // 粗体
}

const formData = ref({
    articleContent: ref('')
})

const saveArticle = () => {
    console.log(formData.value.articleContent);
}



// 邮箱表单

interface RuleForm {
    articleContent: string,
    title: string,
    coverurl: string,
    videourl: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    articleContent: '',
    title: '',
    coverurl: '',
    videourl: ''
})

//表单验证规则
const Rules = reactive<FormRules<RuleForm>>({
    title: [
        {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
        },
    ]
})

const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            console.log("发送请求")

        }
    })
}

const storeAsDedraft = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            console.log("存为草稿")

        }
    })
}

</script>

<template>
    <div class="mainContainer">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="Rules" label-position="top">
            <el-form-item prop="articleContent">
                <mavon-editor v-model="ruleForm.articleContent" @imgAdd="imgAdd" @save="saveArticle" class="editor" />
            </el-form-item>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>发布设置</span>
                    </div>
                </template>
                <el-form-item label="设置标题" prop="title">
                    <el-input placeholder="请输入标题" v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="添加封面" prop="coverurl">
                    <img src="../assets/img/bgImg02.jpg" alt="" style="width: 100px;">
                </el-form-item>
                <el-form-item label="添加视频" prop="videourl">
                    <img src="../assets/img/bgImg02.jpg" alt="" style="width: 100px;">
                </el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef, ruleForm)">发布文章</el-button>
                <el-button type="default" @click="storeAsDedraft(ruleFormRef, ruleForm)">存为草稿</el-button>
            </el-card>
        </el-form>
    </div>
</template>

<style scoped>
/* 主体 */
.mainContainer {

    width: 65%;
    margin: 0 auto;
}

.editor {
    z-index: 1;
    height: 80vh;
    width: 100%;
}
</style>


