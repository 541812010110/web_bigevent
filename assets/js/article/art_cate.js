$(function() {
    var layer = layui.layer
    var form = layui.form


    initArtCateList()
        //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var htmStr = template('tpl-table', res)
                $('tbody').html(htmStr)
            }
        })
    }
    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            });

        })
        //因为这个表单不是直接写出来的，是经过上面的点击事件以后动态拼接出来的
        //通过代理的方式，为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                url: '/my/article/addcates',
                method: 'post',
                data: $('#form-add').serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章失败！')
                    }
                    layer.msg('添加文章成功！')
                        // 重新渲染文章列表
                    initArtCateList()
                        // 根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                }
            })
        })
        //通过代理的方式，为btn-edit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
            // 弹出一个修改文章信息的弹出层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章类别',
                content: $('#dialog-edit').html()
            });
            var id = $(this).attr('data-Id')
                //发起请求获取对应分类的数据
            $.ajax({
                url: '/my/article/cates/' + id,
                type: 'get',
                data: id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })
        })
        //通过代理的方式，为form-edit绑定点击事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({

            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式，为btn-delete按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'get',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });

    })
})