<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '@/stores/loginStore';
const loginStore = useLoginStore();
const hidedialogForm = inject('hidedialogForm') as any;

// 登录表单
interface RuleForm {
    account: string,
    password: string,
    type: string[]
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    account: '',
    password: '',
    type: []
})

const rules = reactive<FormRules<RuleForm>>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        {
            required: true,
            message: '请输入密码'
        },
    ],
})

//提交表单(登录)
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            console.log("发送请求")
            // 发送请求，后端返回token，把token放到localstorage中，后面每次请求带上token
            loginStore.Login();
            hidedialogForm();
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}





</script>

<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" :size="formSize"
        status-icon style="padding-right: 25px;">
        <el-form-item label="账号" prop="account">
            <el-input v-model="ruleForm.account" type="text" />
        </el-form-item>
        <el-form-item label="邮箱" prop="password">
            <el-input v-model="ruleForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="验证码" prop="password">
            <el-input v-model="ruleForm.password" type="password" show-password>
                <template #prepend>
                    <el-button>发送验证码</el-button>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px;">
            <el-button type="primary" @click="submitForm(ruleFormRef, ruleForm)" style="margin-left: 20px;">
                提交
            </el-button>
            <el-button @click="resetForm(ruleFormRef)" style="margin-left: 30px;">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped>
/* 主体 */
</style>
