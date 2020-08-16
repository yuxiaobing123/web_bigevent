// 每次调用$.get()或$.post()或$.ajax()的时候，都会先调用下边这个函数
// 在这个函数中，我们可以得到给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);
});