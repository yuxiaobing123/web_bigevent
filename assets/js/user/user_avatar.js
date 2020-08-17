$(function () {


    var layer = layui.layer;


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1 / 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮绑定点击事件
    // 文件选择框是隐藏的，
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    });

    // 给隐藏的文件选择框绑定change事件
    $("#file").on("change", function (e) {
        // console.log(e);
        // 获取用户选择的文件
        var filelist = e.target.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择图片！');
        }

        // 否则表示用户选择了图片
        // 然后更换裁剪区域的图片
        // 1、拿到用户选择的图片
        var file = e.target.files[0];
        // 2、根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域的图片，再重新设置裁剪区域的图片，之后再创建新的裁剪区域的图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });


    // 给确定按钮绑定点击事件   实现更换头像的功能
    $("#btnUpload").on('click', function () {
        // 1、要拿到用户裁剪好的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2、调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                // 调用父窗口的渲染用户信息的函数
                window.parent.getUserInfo();
            }
        })
    })
});