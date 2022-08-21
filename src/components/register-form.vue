<template>
    <div class="container" v-on:keyup.enter="submitForm('ruleForm')">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
            class="register=form">
            <el-form-item label="手机号" prop="phone">
                <el-input type="tel" v-model="ruleForm.phone"></el-input>
                <el-button size="mini" class="getCode" @click="getVerificationCode()" type="primary" plain :disabled='validation || is_countdown'>
                    <span v-if="!is_countdown">获取验证码</span>
                    <span v-else>{{time}}s后重新获取</span>
                </el-button>
            </el-form-item>
            <el-form-item label="验证码" prop="VerificationCode">
                <el-input type="text" v-model="ruleForm.verificationCode"></el-input>
            </el-form-item>
            <el-button type="primary" @click="checkCode()" v-show="!validation" class="verify_btns">注册</el-button>
            <div v-show="validation">
                <el-form-item label="昵称" prop="nickname">
                <el-input type="text" v-model="ruleForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="ruleForm.confirmPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import { register,judgePhone,getCode } from '../api/user';

export default {
    data() {
        let verifyPhone = (rule, value, callback) => {
            if(!value) {
                return callback(new Error('手机号不能为空'));
            }
            if(!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
                callback(new Error('手机号不合法'));
            }
            else {
                callback();
            }
        };
        let verifyNickname = (rule, value, callback) => {
            if(value.length == 0) {
                return callback(new Error('昵称不能为空'));
            }
            else {
                callback();
            }
        };
        let verifyPassword = (rule, value, callback) => {
            if(value.length == 0){
                callback(new Error('请输入密码'));
            }
            //密码强度
            let level = 0;
            if(/\d/.test(value)) {
                level++;
            }
            if(/[a-zA-Z]/.test(value)){
                level++;
            }
            if(/[^0-9a-zA-Z_]/.test(value)) {
                level++;
            }
            if(value.length < 8) {
                level = 0;
            }
            if(level < 2) {
                callback(new Error('密码强度较低，请重新设置'));
            }
            else {
                callback();
            }
        };
        let verifyConfirmPassword = (rule, value, callback) => {
            if (value.length == 0) {
                callback(new Error('请再次输入密码'));
            } 
            else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致'));
            } 
            else {
                callback();
            }
        };
        let verifyVerificationCode = (rule, value, callback) => {
            if(value.length == 0) {
                callback(new Error('请输入验证码'));
            }
        }
        return {
            ruleForm: {
                phone: '',
                nickname: '',
                password: '',
                confirmPassword: '',
                verificationCode:''
            },
            is_register:false,
            time:60,
            is_countdown:false,
            validation:false,
            rules: {
                phone: [
                    {validator: verifyPhone, trigger: 'blur'}
                ],
                nickname: [
                    {validator: verifyNickname, trigger: 'blur'}
                ],
                password: [
                    {validator: verifyPassword, trigger: 'blur'}
                ],
                confirmPassword: [
                    {validator: verifyConfirmPassword, trigger: 'blur'}
                ],
                verificationCode:[
                    {validator: verifyVerificationCode, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        getVerificationCode(){
            var re = /^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/;
            var that = this;
            console.log('phone',this.ruleForm.phone)
            judgePhone({                //判断手机号是否已经注册
                phone:that.ruleForm.phone
            }).then(res =>{
                console.log('res',res)
                if(res.code == 1){
                    that.is_register = true;
                }
                console.log('2222',that.is_register)
            })
            setTimeout(()=>{                //延后500ms执行下列操作，防止接口中的that.is_register还未修改
                if(!re.test(that.ruleForm.phone)){
                    that.$message({
                        message:'请输入正确的手机号',
                        type:'error'
                    })
                // }else if(that.is_register){     //判断手机号是否已被注册，考虑到验证码只有测试机才能接收，所以注释该部分代码
                //     that.$message({
                //         message:'该手机号已被注册',
                //         type:'error'
                //     })
                //     that.is_register = false
                }else{
                    that.is_countdown = true;
                    var countdown = setInterval(()=>{           //倒计时功能实现
                        that.time--;
                        if(that.time == 0){
                            clearInterval(countdown);
                            that.is_countdown = false;
                            that.time = 60;
                        }
                    },1000)
                    getCode().then(res => {           //获取验证码
                        sessionStorage.setItem('code',res.data.code);
                        that.$message({
                            message:'验证码已发送',
                            type:'success'
                        })
                    }).catch(err =>{
                        that.$message({
                            message:err,
                            type:'error'
                        })
                    })
                }
            },500)
            
        },
        checkCode(){                 //校验验证码是否正确
            if(this.ruleForm.verificationCode == sessionStorage.getItem('code')){
                this.is_countdown = false
                this.$message({
                    message:'验证码正确，请继续完成下列填写',
                    type:'success'
                })
                this.validation = true;
            }else{
                this.$message({
                    message:'验证码错误',
                    type:'error'
                })
                this.validation = false;
            }
            
        },
        submitForm(formName) {            //提交注册
            let that = this;
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    // console.log('成功');
                    //发起请求
                    register({
                        phone: that.ruleForm.phone,
                        nickname: that.ruleForm.nickname,
                        password: that.ruleForm.password
                    }).then(res => {
                        if(res.code == 0) {
                            that.$message({
                                message: '注册成功, 1秒后将跳转到登录界面',
                                type: 'success',
                                duration: 1000
                            });
                            setTimeout(() => {
                                that.$router.push('/login');
                            }, 1000);
                        }
                        else {
                            that.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                    }).catch(err => {
                        that.$message({
                            message: err,
                            type: 'error'
                        })
                    })
                }
                else {
                    that.$message({
                        message: '注册失败',
                        type: 'error'
                    })
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.is_countdown = false;
            this.validation = false;
            this.ruleForm.verificationCode = "";
        },
        
    }
}
</script>

<style lang="scss" scoped>
    .el-form {
        width: 340px;
        margin: 0 auto;
        padding: 30px 30px 20px 0;
        background: white;
        position: relative;
        top: -30px;
        box-shadow: 0 3px 20px gainsboro;
    }
    .getCode{
        position: absolute;
        right: 0px;
        top: 50%; /*偏移*/
        transform: translateY(-50%);
    }
    .verify_btns{
        margin-left: 50px;
    }
    .container{
        margin-bottom: 100px;
    }
</style>