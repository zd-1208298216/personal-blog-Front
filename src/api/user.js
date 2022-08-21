import request from './common/request'

const BASE_URL = '/user'

//注册
function register(data) {
    return request(BASE_URL + '/register', 'POST', data);
}

//判断手机号是否已经被注册
function judgePhone(data) {
    return request(BASE_URL + '/judgePhone', 'POST', data);
}

//获取验证码
function getCode() {
    return request(BASE_URL + '/getCode', 'GET');
}

//登录
function login(data) {
    return request(BASE_URL + '/login', 'POST', data);
}

//获取用户头像昵称
function getUserInfo(data) {
    return request(BASE_URL + '/getUserInfo', 'GET', data);
}

//更新用户头像昵称
function saveUserInfo(data) {
    return request(BASE_URL + '/saveUserInfo', 'POST', data);
}

export {
    register,
    login,
    getUserInfo,
    saveUserInfo,
    getCode,
    judgePhone
}