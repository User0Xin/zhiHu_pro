<script setup lang="ts">
import { ref, reactive } from 'vue';
import router from '@/router';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
import request from '@/utils/request';
const activeStep = ref(1);
import { ElMessage } from 'element-plus';
import { Md5 } from 'ts-md5';


// 定义MD5对象
const md5: any = new Md5()

const carouselHeight = ref('220px');

const totalForm = ref({
    account: '',
    password: '',
    userName: '',
    email: ''
})


// 注册表单
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


//验证账号是否存在
const validateAccount = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入账号'))
    } else if (value.length < 6 || value.length > 12) {
        callback(new Error('账号长度为6-12位'))
    } else {
        request.post('/admin/checkAccount' + `/${value}`).then(res => {
            if (res.code == 505) {
                callback(new Error(res.msg))
            } else {
                callback()
            }
        })
    }
}

//验证密码
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else if (value.length < 8 || value.length > 16) {
        callback(new Error('密码长度为8-16位'))
    } else {
        if (ruleForm.password !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('password', () => null)
        }
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
        { validator: validateAccount, required: true, trigger: 'blur' }
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


//提交表单
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            totalForm.value.account = ruleForm.account;
            totalForm.value.password = ruleForm.password;
            carouselHeight.value = '180px';
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

const validateUserName = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (value.length > 10) {
        callback(new Error('用户名长度不能大于10位'))
    } else {
        request.post('/admin/checkUserName' + `/${value}`).then(res => {
            if (res.code == 505) {
                callback(new Error(res.msg))
            } else {
                callback()
            }
        })
    }
}

//表单验证规则
const emailRules = reactive<FormRules<EmailRuleForm>>({
    userName: [
        { validator: validateUserName, required: true, trigger: 'blur' }
    ],
    email: [
        {
            required: true,
            message: '请输入QQ邮箱',
            trigger: 'blur'
        },
    ]
})


// 收到的验证码
const receiveCode = ref(0)
// 重新发送时间
const reSendTime = ref(60);
//倒计时
const countDown = () => {
    if (reSendTime.value == 0) {

    } else {
        reSendTime.value--;
        setTimeout(() => {
            countDown();
        }, 1000);
    }
}

//发送验证码
const sendCode = () => {
    request.post('/admin/sendCode' + `/${totalForm.value.email}@qq.com`).then(res => {
        if (res.code == 505) {
            ElMessage.error(res.msg);
        } else {
            receiveCode.value = res.data;
            reSendTime.value = 60;
            countDown();
        }
    })
}

const submitEmailForm = async (formEl: FormInstance | undefined, emailRuleForm: EmailRuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 发送请求,后端发送验证码到邮箱
            request.post('/admin/sendCode' + `/${emailRuleForm.email}@qq.com`).then(res => {
                if (res.code == 505) {
                    ElMessage.error(res.msg);
                } else {
                    receiveCode.value = res.data;
                    reSendTime.value = 60;
                    countDown();
                }
            })
            totalForm.value.userName = emailRuleForm.userName;
            totalForm.value.email = emailRuleForm.email + '@qq.com';
            carouselHeight.value = '180px';
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

const validateCode = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入验证码'))
    } else {
        if (value != receiveCode.value) {
            callback(new Error('验证码错误'))
        } else {
            callback()
        }
    }
}

//表单验证规则
const codeRules = reactive<FormRules<CodeRuleForm>>({
    code: [
        { validator: validateCode, required: true, trigger: 'blur' }
    ]

})


const submitCodeForm = async (formEl: FormInstance | undefined, codeRuleForm: CodeRuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 发送请求，注册用户
            //使用md5对密码进行加密
            md5.appendStr(totalForm.value.password);
            totalForm.value.password = md5.end().toString();
            request.post('/admin/sign', totalForm.value).then(res => {
                if (res.code == 505) {
                    ElMessage.error(res.msg);
                } else {
                    alert('注册成功');
                    window.location.reload();
                }
            })
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
                <el-form-item label="用户名" prop="userName" style="margin-top: 45px;">
                    <el-input v-model="emailRuleForm.userName" type="text" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="emailRuleForm.email" type="text">
                        <template #append>
                            <div style="width: 45px;margin-left: -15px;">@qq.com</div>
                        </template>
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
                :size="formSize" status-icon style="width: 90%; margin-top:20px;margin-left: 20px">
                <div style="display: flex; justify-content: center; margin-top: 30px;">正在向{{ totalForm.email
                }}发送验证码！<el-button link @click="sendCode" :disabled="reSendTime > 0"><span v-if="reSendTime > 0">{{
    reSendTime
}}秒</span><span v-if="reSendTime == 0">再次发送</span></el-button></div>
                <el-form-item label="验证码" prop="code" style="margin-top: 30px">
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
