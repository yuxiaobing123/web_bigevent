$(function () {


    var layer = layui.layer;
    var form = layui.form;

    initArticleList();


    // 获取文章的列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };


    // 给头部的添加类别按钮添加点击事件
    var indexAdd = null;
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    });


    // 通过事件委托的形式为form-add添加submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }

                layer.msg('新增分类成功！')
                initArticleList();
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 通过事件委托的形式给编辑按钮添加点击事件
    var indexEdit = null;
    $("tbody").on("click", '#btn-edit', function () {
        // 点击编辑按钮会弹出一个修改文章分类的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取对应数据的分类
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })
    });


    // 通过事件委托的形式给修改文章分类的表单添加提交事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！');
                }
                layer.msg('修改文章类别成功！');
                // 关闭弹出层
                layer.close(indexEdit);
                // 同时更新文章的列表
                initArticleList();
            }
        })
    });


    // 通过事件委托的形式给删除按钮添加点击事件 
    // 实现删除文章类别的功能
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 弹出提示框提醒用户是否进行删除操作
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    // 同时更新文章的列表
                    initArticleList();
                }
            });
        });
    });

});