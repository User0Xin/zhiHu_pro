<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
const activeStep = ref(1);

const carouselHeight = ref('220px');

// 登录表单
interface RuleForm {
    account: string,
    password: string,
    checkPassword: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    account: '',
    password: '',
    checkPassword: ''
})


//!!!!!!!验证过程需要改进
//验证密码
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        // if (ruleForm.password !== '') {
        //     if (!ruleFormRef.value) return
        //     ruleFormRef.value.validateField('password', () => null)
        // }
        callback()
    }
}

//验证密码是否一致
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.password) {
        callback(new Error("两次输入密码不一致"))
    } else {
        callback()
    }
}

//表单验证规则
const rules = reactive<FormRules<RuleForm>>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        {
            validator: validatePass,
            required: true,
            trigger: 'blur'
        },
    ],
    checkPassword: [
        {
            validator: validatePass2,
            required: true,
            trigger: 'blur'
        },
    ],
})

const carousel = ref<InstanceType<typeof ElCarousel> | null>(null);

//提交表单(登录)
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            console.log("发送请求")
            // 发送请求，后端返回token，把token放到localstorage中，后面每次请求带上token
            carouselHeight.value = '160px';
            carousel.value?.next()
            activeStep.value = activeStep.value + 1;
        }
    })
}

//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const autoplay = ref(false)


// 邮箱表单

interface EmailRuleForm {
    userName: string,
    email: string
}
const emailRuleFormRef = ref<FormInstance>()
const emailRuleForm = reactive<EmailRuleForm>({
    userName: '',
    email: ''
})

//表单验证规则
const emailRules = reactive<FormRules<EmailRuleForm>>({
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        {
            required: true,
            message: '请输入QQ邮箱',
            trigger: 'blur'
        },
    ]
})


const submitEmailForm = async (formEl: FormInstance | undefined, emailRuleForm: EmailRuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(emailRuleForm)
            console.log("发送请求")
            // 发送请求,后端发送验证码到邮箱
            carouselHeight.value = '110px';
            carousel.value?.next()
            activeStep.value = activeStep.value + 1;
        }
    })
}


// 验证码表单
interface CodeRuleForm {
    code: string
}
const codeRuleFormRef = ref<FormInstance>()
const codeRuleForm = reactive<CodeRuleForm>({
    code: ''
})

//表单验证规则
const codeRules = reactive<FormRules<CodeRuleForm>>({
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]

})


const submitCodeForm = async (formEl: FormInstance | undefined, codeRuleForm: CodeRuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(codeRuleForm)
            console.log("发送请求")
            // 发送请求,后端发送验证码到邮箱
            activeStep.value = activeStep.value + 1;
        }
    })
}


</script>

<template>
    <el-steps :active="activeStep" align-center style="margin-top: -25px">
        <el-step title="Step 1" />
        <el-step title="Step 2" />
        <el-step title="Step 3" />
    </el-steps>

    <el-carousel ref='carousel' indicator-position="none" arrow="never" :autoplay=autoplay :height="carouselHeight">
        <el-carousel-item>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm"
                :size="formSize" status-icon style="width: 80%; margin-top:20px;margin-left: 20px">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="ruleForm.account" type="text" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input v-model="ruleForm.checkPassword" type="password" show-password />
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="submitForm(ruleFormRef, ruleForm)">
                        下一步
                    </el-button>
                    <el-button @click="resetForm(ruleFormRef)" style="margin-left: 30px;">重置</el-button>
                </el-form-item>
            </el-form>
        </el-carousel-item>
        <el-carousel-item>
            <el-form ref="emailRuleFormRef" :model="emailRuleForm" :rules="emailRules" label-width="80px"
                class="demo-ruleForm" :size="formSize" status-icon style="width: 80%; margin-top:20px;margin-left: 20px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="emailRuleForm.userName" type="text" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="emailRuleForm.email" type="text">
                        <template #append>@qq.com</template>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="submitEmailForm(emailRuleFormRef, emailRuleForm)">
                        下一步
                    </el-button>
                    <el-button @click="resetForm(emailRuleFormRef)" style="margin-left: 30px;">重置</el-button>
                </el-form-item>
            </el-form>
        </el-carousel-item>
        <el-carousel-item>
            <el-form ref="codeRuleFormRef" :model="codeRuleForm" :rules="codeRules" label-width="80px" class="demo-ruleForm"
                :size="formSize" status-icon style="width: 80%; margin-top:20px;margin-left: 20px">
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="codeRuleForm.code" type="text" />
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="submitCodeForm(codeRuleFormRef, codeRuleForm)">
                        提交
                    </el-button>
                    <el-button @click="resetForm(codeRuleFormRef)" style="margin-left: 30px;">重置</el-button>
                </el-form-item>
            </el-form>
        </el-carousel-item>
    </el-carousel>
</template>

<style scoped>
/* 主体 */
</style>
