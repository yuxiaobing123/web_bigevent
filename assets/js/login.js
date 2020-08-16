$(function () {

    // 点击“去注册账号” 的点击事件
    $("#link_reg").on("click", function () {
        /*  $(".login-box").hide();
         $(".reg-box").show(); */
        $(".login-box").hide().siblings(".reg-box").show();
    });


    // 点击“去登录”的点击事件
    $("#link_login").on("click", function () {
        /* $(".reg-box").hide();
        $(".login-box").show(); */
        $(".reg-box").hide().siblings(".login-box").show();
    });


    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个角pwd的校验规则
        // 数组第一项是规则，第二项是不符合规则的弹出框提示
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的值
            // 还需要拿到密码框中的内容
            // 然后进行一次判断
            // 如果判断失败则返回一个错误提示信息
            // [name=password] 属性选择器
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }

    });


    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        $.post(
            '/api/reguser',
            {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val()
            },
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                }
                // console.log('注册成功！');
                layer.msg('注册成功，请登录！');
                // 模拟人的点击登录的链接
                $("#link_login").click();
            }
        )
    });


    // 监听表单的登录事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // console.log(res.token);
                // 将登录成功返回的token字符串 保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    });























});