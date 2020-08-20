$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());


        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义时间补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    };

    // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', //  文章分类的Id
        state: ''  // 文章的发布状态
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }

                // 否则就是成功获取文章列表
                // 然后使用模板引擎渲染页面的结构
                var htmlStr = template('tpl-table', res);
                // console.log(res.data);
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }



    // 初始化文章分类的方法、
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }

                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);

                // 重新调用layui的渲染方法   把所有分类重新渲染到页面
                form.render();
            }
        })
    };



    // 为筛选表单绑定submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();

        // 获取表单中选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 然后给查询对象q中的参数赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的条件重新渲染表格的数据
        initTable();
    });



    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用layPage.render() 方法来渲染页面的结构
        laypage.render({
            elem: 'pageBox',   //  分页容器的Id
            count: total,     //  总的数据条数   从服务器获得
            limit: q.pagesize,  // 每页显示几条数据 
            curr: q.pagenum,     //  设置默认被选中的分页
            // 下边是分页的参数可选项   参数的顺序是有要求的
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调函数的方式有两种
            // 1、点击页码值的时候会触发
            // 2、只要调用了laypage.render方法就会触发， 这也是造成下边死循环的原因
            // 分页发生切换时会触发jump回调函数
            jump: function (obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值赋值到 q  这个查询对象中
                // 之后就可以根据新的查询对象重新渲染页面表格的结构
                q.pagenum = obj.curr;
                // 把最新的条目数也赋值到 q 这个查询参数对象的 pagesize属性中
                q.pagesize = obj.limit;

                // 根据最新的q来获取对应的数据列表并渲染到页面
                // initTable();  //  直接在这里调用函数的话会形成死循环

                // first 是布尔值  通过第二种方式触发jump就是true
                // 通过第一种方式触发jump就是undefined
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过事件委托的方式给删除按钮绑定单击事件
    $('tbody').on('click', '.btn-delete', function () {

        // 获取当前页码值上所有删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);

        // console.log(1);
        // 询问用户是否要进行删除操作
        // 获取文章的id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 下边是用户点击确定之后做的事情
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    // 否则就是删除文章成功
                    layer.msg(res.message);

                    // 当数据删除完成后，需要判断当前页码值中是否还有剩余数据
                    // 如果当页没有数据之后就让页码值减1 然后再重新渲染数据
                    if (len === 1) {
                        // 如果len的值为1  就说明删除当前数据之后就没有剩余的数据了
                        // 此时就需要让页码值减去1
                        // 但是页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();

                    // 关闭弹出层
                    layer.close(index);
                }
            })
        });
    });


    // 通过事件委托的方式给编辑按钮绑定单击事件
    $('tbody').on('click', '#btnEdit', function () {
        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id');
    });


});