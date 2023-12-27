<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { type Ref } from 'vue';
import type { ElCarousel, FormInstance, FormRules } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import draggable from 'vuedraggable';
import request from '@/utils/request'
import router from '@/router';
const articleContent = ref('');
const questionDraft = ref(localStorage.getItem('questionDraft') ? JSON.parse(localStorage.getItem('questionDraft')!) : null);

onMounted(() => {
    loadDraft()
})

onUnmounted(() => {
    localStorage.removeItem('questionDraft')
})

const draftId = ref(-1);

const loadDraft = () => {
    console.log(questionDraft.value)
    if (questionDraft.value) { //如果不为空说明是从草稿箱跳转过来
        draftId.value = questionDraft.value.id;//设置一下草稿id
        ruleForm.title = questionDraft.value.title;
        ruleForm.content = questionDraft.value.content;
        ruleForm.coverurl = questionDraft.value.coverurl;
        ruleForm.videourl = questionDraft.value.videourl;
        imageUrl.value = questionDraft.value.coverurl;
        if (ruleForm.videourl != '') {
            fileList.value.push({
                name: questionDraft.value.videourl,
                url: questionDraft.value.videourl
            })
        }
    }

}
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





// 表单
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
            request.post('/question/addQuestion' + `/${localStorage.getItem('userId')}` + '/1' + `/${draftId.value}`, ruleForm).then((res: any) => {
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

// 存为草稿
const storeAsDedraft = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            request.post('/question/addQuestion' + `/${localStorage.getItem('userId')}` + '/0/-1', ruleForm).then((res: any) => {
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
    // if (rawFile.type !== 'image/jpeg') {   // 限制上传图片格式
    //     ElMessage.error('Avatar picture must be JPG format!')
    //     return false
    // } else if (rawFile.size / 1024 / 1024 > 2) {  // 限制上传图片大小
    //     ElMessage.error('Avatar picture size can not exceed 2MB!')
    //     return false
    // }
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


const addImgTableVisable = ref(false)
//点击添加图片
const handleCommand = (command: string | number | object) => {
    addImgTableVisable.value = true;
}

class Img {
    id: number;
    name: string;
    imgUrl: string;
    sortNum: number;
    constructor(id: number, name: string, imgUrl: string, sortNum: number) {
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.sortNum = sortNum;
    }

}
const imageListArr = ref<Img[]>([])

const dataDragEnd = (event: any) => {
    // 拖拽图片更换位置 并重新从1开始排序
    imageListArr.value.forEach((item, index) => {
        item.sortNum = index + 1
    })
    //过滤一下imgUrl为空的数据
    imageListArr.value = imageListArr.value.filter(item => {
        return item.imgUrl != ''
    });
    console.log(imageListArr.value)
}

const imgfileList = ref<UploadUserFile[]>([])

// 上传图片成功
const handleImgSuccess = (response: any, file: any, fileList: any) => {
    // 添加图片到图片列表
    imageListArr.value.push(new Img(imageListArr.value.length + 1, 'content' + file.name, response.data, imageListArr.value.length + 1))
}

// 删除图片
const handleRemoveImg = (sortNum: number) => {
    // 删除oss服务器上的图片
    request.delete('/question/deleteFile/' + imageListArr.value[sortNum - 1].name).then((res: any) => {
        // 删除图片列表中的图片
        imgfileList.value.splice(sortNum - 1, 1)
        imageListArr.value.splice(sortNum - 1, 1)
        // 拖拽图片更换位置 并重新从1开始排序
        imageListArr.value.forEach((item, index) => {
            item.sortNum = index + 1
        })
        //过滤一下imgUrl为空的数据
        imageListArr.value = imageListArr.value.filter(item => {
            return item.imgUrl != ''
        });

    })

}

// 关闭图片上传弹窗
const closeUploadImg = () => {
    // 关闭图片上传弹窗时，遍历删除刚刚上传的图片
    imageListArr.value.forEach((item, index) => {
        request.delete('/question/deleteFile/' + item.name).then((res: any) => {
        })
    })
    imageListArr.value = [];
    addImgTableVisable.value = false;
}

// 确定上传图片
const handleUploadImg = () => {
    //遍历上传的图片
    imageListArr.value.forEach((item, index) => {
        ruleForm.content += '<img src=\"' + item.imgUrl + '\">\n'
    }
    )
    // 清空上传图片列表
    imageListArr.value = [];
    imgfileList.value = [];
    //关闭弹窗
    addImgTableVisable.value = false;
}

const toolbars = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: false, // 图片链接
    code: false, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: true, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true, // 预览
}

</script>

<template>
    <div class="mainContainer">

        <div class="img-btn" @click="handleCommand" link><el-icon>
                <Picture />
            </el-icon></div>
        <el-dialog v-model="addImgTableVisable" title="添加图片" @close="closeUploadImg">
            <div style="position: relative;">
                <ul class="image-upload">
                    <draggable :list="imageListArr" @update="dataDragEnd" item-key="sortNum" handle=".handle"
                        animation="200">
                        <template #item="{ element, index }">
                            <li class="handle">
                                <img v-if="element.imgUrl" style="width:100% ;height: 90px" :src="element.imgUrl">
                                <div class="icon-container"
                                    style="display: flex; justify-content: center; align-items: center;">
                                    <el-button v-if="element.imgUrl" @click="handleRemoveImg(element.sortNum)" link>
                                        <el-icon>
                                            <CloseBold />
                                        </el-icon>
                                    </el-button>
                                </div>
                            </li>
                        </template>
                    </draggable>
                </ul>

                <el-upload v-model:file-list="imgfileList" class="upload-demo"
                    action="http://localhost:8081/question/uploadContentImg" multiple :on-preview="handlePreview"
                    :on-remove="handleRemove" :before-remove="beforeRemove" :on-success="handleImgSuccess"
                    :show-file-list="false">
                    <el-button type="primary">上传图片</el-button>
                </el-upload>
                <el-button type="primary" style="position: absolute; bottom: 0px; left: 110px;"
                    @click="handleUploadImg">确定</el-button>
            </div>
        </el-dialog>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="Rules" label-position="top">
            <el-form-item prop="content">
                <mavon-editor v-model="ruleForm.content" :toolbars="toolbars" @save="saveArticle" class="editor" />
            </el-form-item>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>发布设置</span>
                    </div>
                </template>
                <el-form-item label="设置标题" prop="title">
                    <el-input placeholder="请输入标题" v-model="ruleForm.title" maxlength="9" show-word-limit></el-input>
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
    <el-dialog v-model="dialogTableVisible" title="视频预览">
        <video :src="videourl" width="100%" height="100%" controls="true"></video>
    </el-dialog>
</template>

<style scoped>
/* 主体 */
.mainContainer {
    position: relative;
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

.img-btn {
    position: absolute;
    display: flex;
    justify-self: center;
    align-items: center;
    padding-left: 7px;
    z-index: 2;
    width: 28px;
    height: 28px;
    top: 0.8%;
    left: 55.3%;
    border: 0;

}

.img-btn:hover {
    cursor: pointer;
    background-color: #e9e9eb;
    color: #2f2f2f;
    border: 0;
}

.img-btn:active {
    background-color: #e9e9eb;
    color: #606266;
    border: 0;
}


.image-upload {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
}

.image-upload li {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 10px;
}
</style>


@/utils/request.js