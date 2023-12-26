<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '@/stores/loginStore';
import request from '@/utils/request';


const totalForm = ref({
    account: '',
    password: '',
    email: '',
})

// 忘记密码表单
interface RuleForm {
    account: string,
    email: string,
    code: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
    account: '',
    email: '',
    code: ''
})


//验证账号
const validateAccount = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入账号'))
    } else if (value.length < 6 || value.length > 12) {
        callback(new Error('账号长度为6-12位'))
    } else {
        callback();
    }
}

//验证验证码
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


const rules = reactive<FormRules<RuleForm>>({
    account: [
        { validator: validateAccount, required: true, trigger: 'blur' }
    ],
    email: [
        {
            required: true,
            message: '请输入邮箱'
        },
    ],
    code: [
        { validator: validateCode, required: true, trigger: 'blur' }
    ]
})



//提交表单
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    console.log(ruleForm)
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            totalForm.value.account = ruleForm.account;
            totalForm.value.email = ruleForm.email;
            carousel.value?.next();
        }
    })
}

// 收到的验证码
const receiveCode = ref(0)
// 重新发送时间
const reSendTime = ref(0);
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
    request.post('/admin/checkEmail' + `/${ruleForm.account}/${ruleForm.email}@qq.com`).then(res => {
        if (res.code == 505) {
            alert(res.msg);
        } else {
            request.post('/admin/sendCode' + `/${ruleForm.email}@qq.com`).then(res => {
                if (res.code == 505) {
                    alert(res.msg);
                } else {
                    receiveCode.value = res.data;
                    reSendTime.value = 60;
                    countDown();
                }
            })
        }
    })

}


// 注册表单
interface pwRuleForm {
    password: string,
    checkPassword: string
}

const pwRuleFormRef = ref<FormInstance>()
const pwRuleForm = reactive<pwRuleForm>({
    password: '',
    checkPassword: ''
})

//验证密码
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else if (value.length < 8 || value.length > 16) {
        callback(new Error('密码长度为8-16位'))
    } else {
        if (pwRuleForm.password !== '') {
            if (!pwRuleFormRef.value) return
            pwRuleFormRef.value.validateField('password', () => null)
        }
        callback()
    }
}

//验证密码是否一致
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== pwRuleForm.password) {
        callback(new Error("两次输入密码不一致"))
    } else {
        callback()
    }
}

//表单验证规则
const pwrules = reactive<FormRules<pwRuleForm>>({
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
const submitFormPW = async (formEl: FormInstance | undefined, pwRuleFormRef: pwRuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            totalForm.value.password = pwRuleForm.password;
            request.post('/admin/resetPassword' + `/${totalForm.value.account}/${totalForm.value.password}`).then(res => {
                if (res.code == 505) {
                    alert(res.msg);
                } else {
                    alert('修改成功');
                    window.location.reload();
                }
            })

        }
    })
}



const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


const autoplay = ref(false);
const carouselHeight = ref('210px');

</script>

<template>
    <el-carousel ref='carousel' indicator-position="none" arrow="never" :autoplay=autoplay :height="carouselHeight"
        initial-index="0">
        <el-carousel-item>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm"
                :size="formSize" status-icon style="padding-right: 25px;">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="ruleForm.account" type="text" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" type="email">
                        <template #append>
                            <div style="width: 45px;margin-left: -15px;">@qq.com</div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="ruleForm.code" type="code">
                        <template #prepend>
                            <el-button @click="sendCode" @disabled="reSendTime != 0">{{ reSendTime ==
                                0 ? '发送验证码' : reSendTime }}</el-button>
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
        </el-carousel-item>
        <el-carousel-item>
            <el-form ref="pwRuleFormRef" :model="pwRuleForm" :rules="pwrules" label-width="80px" class="demo-ruleForm"
                :size="formSize" status-icon style="width: 80%; margin-top:20px;margin-left: 20px">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="pwRuleForm.password" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input v-model="pwRuleForm.checkPassword" type="password" show-password />
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                    <el-button type="primary" @click="submitFormPW(pwRuleFormRef, pwRuleForm)" style="margin-left: 20px;">
                        提交
                    </el-button>
                    <el-button @click="resetForm(pwRuleFormRef)" style="margin-left: 30px;">重置</el-button>
                </el-form-item>
            </el-form>
        </el-carousel-item>

    </el-carousel>
</template>

<style scoped>
/* 主体 */
</style>
