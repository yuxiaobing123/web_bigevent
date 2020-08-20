$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类信息失败！');
                }
                // console.log(res);

                // 调用模板引擎  渲染分类的下拉列表
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 重新渲染表单
                // 不要忘记重新调用该form表单的render方法
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $("#btnChooseImage").on("click", function () {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件
    $("#coverFile").on("change", function (e) {
        // 获取到文件的列表数组
        var file = e.target.files[0];  //  拿到用户选择的文件
        // 如果用户没有选择文件就直接返回
        if (file.length === 0) {
            return;
        }
        var newImgURL = URL.createObjectURL(file); // 根据选择的文件创建一个对应的URL地址
        // 然后先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });


    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });


    // 为表单绑定submit提交事件
    $("#form-pub").on("submit", function (e) {
        // 1、阻止表单的默认提交行为
        e.preventDefault();

        // 2、基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        // 3、将文章的发布状态保存到fd中
        fd.append('state', art_state);

        /*  fd.forEach(function (value, key) {
             console.log(key, value);
         }) */

        // 4、将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将文件对象存储到fd中
                fd.append('cover_img', blob);

                publishArticle(fd);
            });

        // 6、发起ajax请求  
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的数据格式是FormData的格式的话必须包含以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章发布失败！');
                    }
                    layer.msg('文章发布成功！');
                    location.href = '/article/art_list.html';
                }
            })
        }
    });

});