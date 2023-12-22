<script setup lang="ts">

</script>

<template>
    <div class="info-box">
        <div>
            <el-icon>
                <QuestionFilled />
            </el-icon>
            &nbsp;帮助中心
        </div>
        <span>隐私</span>
        <span>保护指引</span>
        <span>申请开通机构号</span>
        <span>联系我们</span>
        <div>
            <el-icon>
                <WarnTriangleFilled />
            </el-icon>
            &nbsp;举报中心
        </div>
        <span>涉未成年举报</span>
        <span>网络谣言举报</span>
        <span>涉企虚假举报</span>
        <div>
            <el-icon>
                <InfoFilled />
            </el-icon>
            &nbsp; 关于我们
        </div>
        <span>下载应用</span>
        <span>相关招聘</span>
        <span>使用指南</span>
        <span>用户协议</span>
        <div class="more-info">
            京 ICP 证 110745 号 · 京 ICP 备 13052560 号 - 1 · 京公网安备 11010802020088 号 · 京网文[2022]2674-081 号 ·
            <br>药品医疗器械网络信息服务备案（京）网药械信息备字（2022）第00334号
            <br>广播电视节目制作经营许可证:（京）字第06591号 ·
            <br>服务热线：400-919-0001 · Investor Relations ·
            <br>© 2023 产品论坛 北京智者天下科技有限公司版权所有 · 违法和不良信息举报：010-82716601 · 举报邮箱：jubao.com
        </div>

    </div>
</template>


<style scoped>
.info-box {
    padding-left: 3px;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}
span{
    font-size: small;
}
span:hover{
    color: #409eff;
    cursor: pointer;
}
.info-box div {
    margin-top: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    color: #000;
    font-size: 15px;
}

.info-box span {
    margin-left: 10px;
}

.info-box .more-info {
    margin-top: 30px;
    font-size: 13px;
    line-height: 2;
}
</style>