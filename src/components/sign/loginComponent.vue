<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '@/stores/loginStore';
import request from '@/utils/request';
import router from '@/router';
const loginStore = useLoginStore();
const hidedialogForm = inject('hidedialogForm') as any;
import { ElMessage } from 'element-plus';
import { Md5 } from 'ts-md5';
import { ru } from 'element-plus/lib/locale/index.js';


// 定义MD5对象
const md5: any = new Md5()

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

//错误次数，达到十次冻结账号一分钟
const errNum = ref(0);

//提交表单(登录)
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断账号是否被冻结
      const Frozen = localStorage.getItem('Frozen') ? JSON.parse(localStorage.getItem('Frozen') as string) as string[] : null;
      if (Frozen && Frozen.includes(ruleForm.account)) {
        ElMessage.error("账号已被冻结一分钟");
        return;
      }
      //没被冻结，发送请求
      //发送请求，后端返回token，把token放到localstorage中，后面每次请求带上token
      //使用md5对密码进行加密
      md5.appendStr(ruleForm.password);
      ruleForm.password = md5.end().toString();
      request.post('/admin/login', ruleForm).then(res => {
        if (res.code == 505) {
          ruleForm.password = '';
          ElMessage.error(res.msg);
          errNum.value++;
          // 如果错误次数达到十次，冻结账号一分钟
          if (errNum.value == 10) {
            ElMessage.error("您已连续十次输入错误密码，账号已被冻结一分钟");
            // 在localstorage中存储冻结的账号
            const Frozen = localStorage.getItem('Frozen') ? JSON.parse(localStorage.getItem('Frozen') as string) as string[] : null;
            if (Frozen) {
              Frozen.push(ruleForm.account);
              localStorage.setItem('Frozen', JSON.stringify(Frozen));
            } else {
              localStorage.setItem('Frozen', JSON.stringify([ruleForm.account]));
            }
            setTimeout(() => {
              errNum.value = 0;
              const Frozen = localStorage.getItem('Frozen') ? JSON.parse(localStorage.getItem('Frozen') as string) as string[] : null;
              if (Frozen) {
                // 冻结一分钟后，删除冻结的账号
                Frozen.splice(Frozen.indexOf(ruleForm.account), 1);
                localStorage.setItem('Frozen', JSON.stringify(Frozen));
              }
            }, 60000);
          }
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