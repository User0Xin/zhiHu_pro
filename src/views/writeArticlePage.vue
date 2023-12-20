<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type Ref } from 'vue';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { tr } from 'element-plus/es/locale/index.mjs';
import request from '@/utils/request'
import router from '@/router';
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
    content: string,
    title: string,
    coverurl: string,
    videourl: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    content: '',
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

// 提交表单
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {  // 表单校验通过
            request.post('/question/addQuestion' + '/1' + '/1', ruleForm).then((res: any) => {
                console.log(res)
                if (res.code == 200) {
                    ElMessage.success('发布成功')
                    router.push('/'); // 回到首页
                } else {
                    ElMessage.error('发布失败')
                }
            })
        }
    })
}

const storeAsDedraft = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            request.post('/question/addQuestion' + '/1' + '/0', ruleForm).then((res: any) => {
                console.log(res)
                if (res.code == 200) {
                    ElMessage.success('发布成功')
                    router.push('/'); // 回到首页
                } else {
                    ElMessage.error('发布失败')
                }
            })

        }
    })
}



const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    ruleForm.coverurl = response.data;  // 上传成功后，将返回的阿里oss图片地址赋值给表单
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {   // 限制上传图片格式
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {  // 限制上传图片大小
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}


const fileList = ref<UploadUserFile[]>([
])


// 是否显示进度条
const showProgress = ref(false);
// 进度条百分比
const percentage = ref(0);
// 进度条状态
const progressStatus = ref('');
// 进度条条纹
const stripedFlow = ref(true);
// 进度条
const handleProgress: UploadProps['onProgress'] = (event, uploadFile, uploadFiles) => {
    console.log(event, uploadFile, uploadFiles)
    percentage.value = event.percent
}

// 上传视频前
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    showProgress.value = true;  // 上传视频前，将进度条显示
    stripedFlow.value = true;  // 上传视频前，将进度条条纹显示
    return true
}

// 上传成功
const handleVideoSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    console.log(response.data)
    ruleForm.videourl = response.data;  // 上传成功后，将返回的阿里oss视频地址赋值给表单
    progressStatus.value = 'success';  // 上传成功后，进度条状态改为成功
    stripedFlow.value = false;  // 上传成功后，将进度条条纹隐藏
}

// 删除视频前的确认
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `要删除 ${uploadFile.name} 吗?`
    ).then(
        () => true,
        () => false
    )
}

// 删除视频
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file.name)
    ruleForm.videourl = '';  // 删除视频后，将表单中的视频地址清空
    percentage.value = 0;  // 删除视频后，将进度条百分比清零
    progressStatus.value = '';  // 删除视频后，将进度条状态清空
    showProgress.value = false;  // 删除视频后，将进度条隐藏
    request.delete('/question/deleteFile/' + file.name).then((res: any) => {
    })
}

// 是否显示预览视频弹窗
const dialogTableVisible = ref(false);
const videourl = ref('');

// 预览视频
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log((uploadFile.response as any).data)
    videourl.value = (uploadFile.response as any).data;
    dialogTableVisible.value = true;
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        '只能上传一个视频'
    )
}


const format = (percentage: number) => (percentage === 100 ? 'wait' : `${percentage}%`)

</script>

<template>
    <div class="mainContainer">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="Rules" label-position="top">
            <el-form-item prop="content">
                <mavon-editor v-model="ruleForm.content" @imgAdd="imgAdd" @save="saveArticle" class="editor" />
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
                    <el-upload class="avatar-uploader" action="http://localhost:8081/question/uploadFile"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="添加视频" prop="videourl" style="position: relative;">
                    <el-upload v-model:file-list="fileList" class="upload-demo"
                        action="http://localhost:8081/question/uploadFile" multiple :on-preview="handlePreview"
                        :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                        :on-progress="handleProgress" :on-success="handleVideoSuccess" :before-upload="beforeUpload">
                        <el-button type="default">点击上传视频</el-button>

                    </el-upload>
                    <el-progress v-if="showProgress" :percentage="percentage" :format="format" :stroke-width="15"
                        :striped="stripedFlow" striped-flow :duration="15" :status="progressStatus" />
                </el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef, ruleForm)">发布文章</el-button>
                <el-button type="default" @click="storeAsDedraft(ruleFormRef, ruleForm)">存为草稿</el-button>
            </el-card>
        </el-form>
    </div>
    <el-dialog v-model="dialogTableVisible" title="Shipping address">
        <video :src="videourl" width="100%" height="100%" controls="true"></video>
    </el-dialog>
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

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.el-progress--line {
    position: absolute;
    top: 10px;
    left: 150px;
    width: 80%;
}
</style>


@/utils/request.js