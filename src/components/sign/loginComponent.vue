<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '@/stores/loginStore';
import request from '@/utils/request';
import router from '@/router';
const loginStore = useLoginStore();
const hidedialogForm = inject('hidedialogForm') as any;
import { ElMessage } from 'element-plus';

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
      console.log(ruleForm)
      // 发送请求，后端返回token，把token放到localstorage中，后面每次请求带上token
      request.post('/admin/login', ruleForm).then(res => {
        if (res.code == 505) {
          ElMessage.error(res.msg);
        } else {
          if (ruleForm.type.includes('记住账号')) {
            const RememberAccount = localStorage.getItem("RememberAccount") ? JSON.parse(localStorage.getItem("RememberAccount") as string) as string[] : null;
            if (RememberAccount) {
              RememberAccount.push(ruleForm.account);
              localStorage.setItem('RememberAccount', JSON.stringify(RememberAccount));
            } else {
              localStorage.setItem('RememberAccount', JSON.stringify([ruleForm.account]));
            }
          }
          if (ruleForm.type.includes('自动登录')) {
            localStorage.setItem('AutoLogin', 'true');
          }
          // 保存token
          localStorage.setItem('user', JSON.stringify(res.data));
          // 保存userId
          localStorage.setItem('userId', res.data.userId);

          // 保存登录状态
          loginStore.Login();
          //存储用户名和头像
          loginStore.setUserName(res.data.name);
          loginStore.setTouXiang(res.data.touXiang);
          router.push('/');
        }
      })
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
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" show-password />
    </el-form-item>
    <el-form-item prop="type" style="margin-bottom: 0;">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox label="记住账号" name="type" />
        <el-checkbox label="自动登录" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item style="margin-top: 10px;">
      <el-button type="primary" @click="submitForm(ruleFormRef, ruleForm)" style="margin-left: 20px;">
        登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)" style="margin-left: 30px;">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
/* 主体 */
</style>