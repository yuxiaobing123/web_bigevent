// 每次调用$.get()或$.post()或$.ajax()的时候，都会先调用下边这个函数
// 在这个函数中，我们可以得到给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);


    // 有权限的接口的url地址都是有/my结尾的
    if (options.url.indexOf('/my/') !== -1) {
        // 统一为有权限的接口设置headers请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log('执行了complete函数');
        // console.log(res);
        // 在complete回调函数中，可以通过res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token');
            // 2、强制跳转到登录页面
            location.href = '/login.html';
        }
    }
});