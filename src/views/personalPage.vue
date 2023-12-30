<script setup lang="ts">
import { ref, onMounted } from 'vue'
import createComponent from '@/components/main_right/parts/createComponent.vue';
import webInfo from '@/components/main_right/parts/webInfo.vue'
import type { TabsPaneContext } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElNotification } from 'element-plus'
import request from '@/utils/request';
import { useLoginStore } from '@/stores/loginStore';
import followUserListComponent from '@/components/personal/followUserListComponent.vue';
import fansListComponent from '@/components/personal/fansListComponent.vue'
const loginStore = useLoginStore();
// 个人信息
class Person {
    name: string;
    sex: string;
    age: number;
    birthday: string;
    description: string;
    job: string;
    touXiang: string;
    followNum: number;
    followedNum: number;
    constructor(name: string, sex: string, age: number, birthday: string, description: string, job: string, touXiang: string, followNum: number, followedNum: number) {
        this.name = name;
        this.sex = sex;
        this.age = age;
        this.birthday = birthday;
        this.description = description;
        this.job = job;
        this.touXiang = touXiang;
        this.followNum = followNum;
        this.followedNum = followedNum;
    }
}

const changeFollowNum = (num: number) => {
    person.value.followNum += num;
}

// 获取图片的url
const getImageUrl = (name: string) => {
    return new URL(`../assets/img/${name}`, import.meta.url).href;
}

// 个人信息
const person = ref<Person>(new Person('小猪佩奇', '女', 18, '2003-08-23', '我是小猪佩奇', '程序员', 'touXiang02.png', 100, 200));

onMounted(() => {
    request.get('/user/getUserInfo' + `/${localStorage.getItem('userId')}`).then(res => {
        person.value = res.data;
    })
})


// 点击关注了
const handleClickFollow = () => {
    activeName.value = '我的关注';
}

// 点击关注者
const handleClickFollowed = () => {
    activeName.value = '我的粉丝';
}

// 点击编辑个人资料
const handleEditPersonalInfo = () => {
    dialogFormVisible.value = true;
}
// 当前选中的tab
const activeName = ref('个人信息')

// 点击tab的回调
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event);

}


const dialogFormVisible = ref(false)
const formLabelWidth = '100px'

const form = ref({
    name: '',
    sex: '',
    age: 0,
    birthday: '',
    description: '',
    job: ''
})

const loadInfo = () => {
    form.value.name = person.value.name;
    form.value.sex = person.value.sex;
    form.value.age = person.value.age;
    form.value.birthday = person.value.birthday;
    form.value.description = person.value.description;
    form.value.job = person.value.job;
}

const handleSubmmit = () => {
    request.post('/user/updateUserInfo' + `/${localStorage.getItem('userId')}`, form.value).then(res => {
        if (res.code == 505) {
            ElNotification({
                title: '提示',
                message: res.msg,
                type: 'warning',
                offset: 50
            })
        } else {
            // 更新个人信息
            request.get('/user/getUserInfo' + `/${localStorage.getItem('userId')}`).then(res => {
                person.value = res.data;
                //更新localStorage
                const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
                user.name = person.value.name;
                localStorage.setItem('user', JSON.stringify(user));
                // 更新pinia
                loginStore.setUserName(person.value.name);
                loginStore.setTouXiang(person.value.touXiang);
                ElNotification({
                    title: '提示',
                    message: '修改成功',
                    type: 'success',
                    offset: 50
                })
            })

        }
    })
    dialogFormVisible.value = false;
}



const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    const touXiangForm = ref({
        touXiang: ''
    })
    touXiangForm.value.touXiang = response.data;
    request.post('/user/updateUserInfo' + `/${localStorage.getItem('userId')}`, touXiangForm.value).then(res => {
        if (res.code == 505) {
            ElNotification({
                title: '提示',
                message: res.msg,
                type: 'warning',
                offset: 50
            })
        } else {
            // 更新个人信息
            request.get('/user/getUserInfo' + `/${localStorage.getItem('userId')}`).then(res => {
                person.value = res.data;
                //更新localStorage
                const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
                user.touXiang = touXiangForm.value.touXiang;
                localStorage.setItem('user', JSON.stringify(user));
                // 更新pinia
                loginStore.setTouXiang(touXiangForm.value.touXiang);
                ElNotification({
                    title: '提示',
                    message: '修改成功',
                    type: 'success',
                    offset: 50
                })
            })

        }
    })

}
</script>

<template>
    <div class="mainContainer">
        <el-card body-style="padding: 0" class="top-box">
            <!-- 背景图片 -->
            <el-image style=" width: 100%; height: 136px; background-color: #9196a1;" :src="getImageUrl('bgImg.jpg')"
                fit="cover"></el-image>
            <!-- 头像 -->
            <el-image class="touXiang" :src="person.touXiang" fit="fill" />
            <!-- IP属地 -->
            <span class="ip-addr">
                <el-icon>
                    <Location />
                </el-icon>IP属地：深圳
            </span>
            <!-- 个人信息 -->
            <div class="info-box">
                <!-- 用户名 -->
                <span class="info-userName">{{ person.name }}</span>
                <!-- 个人简介 -->
                <span class="info-description">
                    <!-- 性别 -->
                    <el-icon>
                        <Male v-if="person.sex === '男'" />
                        <Female v-else />
                    </el-icon>
                    {{ person.description }}
                </span>
            </div>
            <el-upload class="avatar-uploader" action="http://localhost:8081/question/uploadFile" :show-file-list="false"
                :on-success="handleAvatarSuccess">
                <el-button class="touxiang-button" link>修改头像</el-button>
            </el-upload>

            <el-button class="edit-button" type="default" @click="handleEditPersonalInfo">编辑个人资料</el-button>
        </el-card>
        <div class="bottom-box">
            <div class="left-box">
                <el-card>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="个人信息" name="个人信息">
                            <el-card class="personal-info-card">
                                <template #header>
                                    <div class="card-header">
                                        <span style="font-size: 16px; font-weight: 600;">个人信息</span>
                                    </div>
                                </template>
                                <div class="personal-info-box">
                                    <div class="info-box-userName">
                                        <span class="label">用户名：</span><span>{{ person.name }}</span>
                                    </div>
                                    <div class="info-box-sex">
                                        <span class="label">性别：</span><span>{{ person.sex }}</span>
                                    </div>
                                    <div class="info-box-age">
                                        <span class="label">年龄：</span><span>{{ person.age }}</span>
                                    </div>
                                    <div class="info-box-birthday">
                                        <span class="label">生日：</span><span>{{ person.birthday }}</span>
                                    </div>
                                    <div class="info-box-job">
                                        <span class="label">工作：</span><span>{{ person.job }}</span>
                                    </div>
                                    <div class="info-box-description">
                                        <span class="label">个人简介：</span><span>{{ person.description }}</span>
                                    </div>
                                </div>

                            </el-card>
                        </el-tab-pane>
                        <el-tab-pane label="我的关注" name="我的关注">
                            <followUserListComponent @changeFollowNum="changeFollowNum"></followUserListComponent>
                        </el-tab-pane>
                        <el-tab-pane label="我的粉丝" name="我的粉丝">
                            <fansListComponent></fansListComponent>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </div>
            <div class="right-box">
                <createComponent></createComponent>
                <el-button-group class="button-bar">
                    <el-button type="default" @click="handleClickFollow">
                        <div>
                            <div>关注了</div>
                            <div style="margin-top: 10%; font-size: 18px; font-weight: 750;">{{ person.followNum }}</div>
                        </div>
                    </el-button>
                    <el-button type="default" @click="handleClickFollowed">
                        <div>
                            <div>关注者</div>
                            <div style="margin-top: 10%; font-size: 18px; font-weight: 750;">{{ person.followedNum }}</div>
                        </div>
                    </el-button>
                </el-button-group>
                <webInfo></webInfo>
            </div>
        </div>
    </div>


    <el-dialog v-model="dialogFormVisible" title="编辑个人资料" @open="loadInfo" style="width: 650px;padding-right: 50px;"
        destroy-on-close>
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth">
                <el-radio-group v-model="form.sex">
                    <el-radio label="男" />
                    <el-radio label="女" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" :label-width="formLabelWidth">
                <el-input v-model="form.age" autocomplete="off" />
            </el-form-item>
            <el-form-item label="生日" :label-width="formLabelWidth">
                <el-date-picker v-model="form.birthday" type="date" placeholder="Pick a date" style="width: 100%" />
            </el-form-item>
            <el-form-item label="工作" :label-width="formLabelWidth">
                <el-input v-model="form.job" autocomplete="off" />
            </el-form-item>
            <el-form-item label="个人简介" :label-width="formLabelWidth">
                <el-input v-model="form.description" autocomplete="off" maxlength="20" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmmit">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
/* 主体 */
.mainContainer {
    width: 65%;
    margin: 0 auto;
}

/* 顶部盒子 */
.top-box {
    position: relative;
    width: 100%;
    height: 272px;
    background-color: #fff;
}

/* ip属地 */
.ip-addr {
    display: flex;
    align-items: center;
    gap: 3px;
    position: absolute;
    top: 33%;
    right: 2%;
    font-size: 15px;
    background-color: #2e2e2e46;
    color: #ececec;
    border-radius: 3px;
    font-weight: 500;
    padding: 3px;
}

/* 个人信息-用户名 */
.info-userName {
    position: absolute;
    top: 53%;
    left: 20%;
    font-size: 26px;
    font-weight: 600;
}

/* 个人信息-个人简介 */
.info-description {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 5px;
    top: 70%;
    left: 20%;
    font-size: 16px;
    color: #9ba6b6;
    font-weight: 400;
}

/* 编辑个人资料按钮 */
.edit-button {
    position: absolute;
    top: 80%;
    right: 2%;
    font-size: 14px;
    font-weight: 500;
    color: #1772f6;
    border: 1px solid #1772f6;
    border-radius: 3px;
    padding: 5px 10px;
    width: 118px;
    height: 34px;
}

.touxiang-button {
    position: absolute;
    top: 80%;
    left: 17%;
    font-size: 14px;
    font-weight: 500;
    color: #155eca;
    padding: 5px 10px;
    width: 118px;
    height: 34px;
}


.edit-button:focus,
.edit-button:active {
    background-color: #fff;
}

.edit-button:hover {
    background-color: #f1f7fe;
}

/* 头像 */
.touXiang {
    position: absolute;
    top: 25%;
    left: 3%;
    width: 168px;
    height: 168px;
    border: 6px solid #fff;
    border-radius: 10px;
}

/* 底部盒子 */
.bottom-box {
    display: flex;
    justify-content: center;
    gap: 1%;
    width: 100%;
    /* height: 100px; */
    background-color: none;
    margin-top: 1%;
}

/* 底部-左侧盒子 */
.bottom-box .left-box {
    width: 70%;
}

/* 底部-右侧盒子 */
.bottom-box .right-box {
    width: 30%;
    height: 100%;
}

/* 个人信息卡片 */
.personal-info-card {
    width: 100%;
}

/* 个人信息卡片-内容*/
.personal-info-box {
    display: flex;
    flex-direction: column;
    align-content: space-around;
    justify-content: space-around;
    height: 600px;
    padding-left: 5%;
    font-size: 16px;
    line-height: 75px;
}

.label {
    position: absolute;
    left: 0;
}

.personal-info-box div {
    position: relative;
    border-bottom: 1px solid #dbdbdb;
    text-align: center;
}

.button-bar {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}

.button-bar .el-button {

    width: 100%;
    height: 90px;
    font-size: 18px;
}

.button-bar .el-button:focus,
.button-bar .el-button:active {
    background-color: #fff;
    color: #606266;
}
</style>
