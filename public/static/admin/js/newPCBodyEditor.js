/**
 * Created by Tomokylelie on 2017/6/8.
 */
$(function() {
    // window.staticAddress = 'aaa';
    var $editor = $('#editor');
    var out;        //组件对象
    var temp;       //右键对象
    var $body = $('body');
    var $warpList_li = $('.warp-list li');
    var $pieceContainer = $('.piece-container');
    var $colorFont = $('#color-font');
    var $pRight = $('#p-right');
    var $imgRight = $('#img-right');
    var $picBtn = $('#pic-btn');
    var $componentOption = $('#component-option');
    var $seoImgInp = $('#seo-img-inp');
    var $swiperPicUp = $('#swiper-pic-btn');
    var $subSwi = $('#sub-swiper');
    var $iconfontRight = $('.iconfont-right');
    var $iconfontColor = $('#iconfont-color');
    var $iconfontDelete = $('#iconfont-delete');
    var $selectedKuang = $('#selected-kuang');
    var $tempCode = $('#temp-code');
    //预处理
    $('.component').css({'background-position': 'top center', 'background-repeat': 'no-repeat', 'min-width': '1200px', 'position': 'relative'});
    $('#editor .fix-component').css('position', 'fixed');
    $('.fix-component').css( 'min-width', 'auto');
    $('#editor .p').attr('contenteditable', true);
    if($editor.find('.sidebar')) {
        $('.ce-container').children().eq($editor.find('.sidebar').data('type')).css('border', '5px solid red');
    }
    alert('17-11-23：终于支持固定组件编辑了！新增多个固定组件，若编辑器内存在固定组件则原来的回拨框会消失\n\n17-11-13：区分内外边距\n\n');
    // alert('17-08-22：新增swiper2组件\n\n17-07-27：新增组件代码编辑功能，新增恢复一键清空功能\n\n17-07-07：部分组件新增底图黑色蒙版功能，新增一键清空编辑器功能，优化用户体验\n\n17-07-05：新增轮播组件，轮播更改为可循环，修改组件默认400电话为新版\n\n17-07-04：解决换行问题\n\n17-06-27：调整分割线显示过小问题\n\n17-06-21：新增组件见间距调整功能，增添分割线组件\n\n17-06-19：合并不同颜色探头组件，改为在组件选项内操作\n\n17-06-14：添加轮播以及地图功能，添加图标右键编辑功能\n\n17-06-13：添加侧栏功能，添加图片右键编辑seo功能\n\n17-06-12：PC落地页编辑器基本功能上线，添加组件删除撤回功能，为文本、图片添加右键菜单，添加五个基本组件，每个组件有不同的选项，有左右切换、图片调整等功能');
    //170901处理ipc链接
    $('#editor .component').each(function() {
        if($(this).data('type') == 'component3') {
            if($(this).children().children('a').length == 0) {
                $(this).children().append('<a href="http://www.miibeian.gov.cn"></a>');
                $(this).children().children('a').append($(this).children().children().eq(5));
            }
        }
    });
    //预处理结束
    //选择框逻辑
    $selectedKuang.on('mousedown', function() {
        $(this).stop().hide();
        $editor.mousedown();
        $editor.children().stop().removeClass('scaling');
        return false;
    });
    $selectedKuang.on('mousemove', function() {
        out.removeClass('scaling');
    });
    //上下边距input
    var $marTop = $('#mar-top');
    var $marBottom = $('#mar-bottom');
    var $padTop = $('#pad-top');
    var $padBottom = $('#pad-bottom');
    //被删除的组件的缓存
    var deletetemp = [];
    var deletetempall = '';
    $editor.on('mousedown', function(e) {
        binfDefault(e);
    });
    //点击tag切换
    $warpList_li.on('click', function() {
        $warpList_li.removeClass('focus');
        $(this).addClass('focus');
        $pieceContainer.css('left', $(this).index() * -395 + 'px');
        $('.show').scrollTop(0);
    });
    //收起按钮
    $('.shouqi-btn').on('click', function() {
        if($(this).parent().hasClass('off-control')) {
            $(this).html('收<br>起');
        }
        else {
            $(this).html('唤<br>出');
        }
        $(this).parent().toggleClass('off-control');
    });
    //上传背景图
    $('#photo').on('click', function() {
        if(out) {
            $('#photobtn').click();
        }
        else {
            alert('未选择任何组件，请单击目标组件后再尝试');
        }
    });
    $('#photobtn').on('change', function(event) {
        event.preventDefault();
        var options = {
            success: function (data) {
                out.css('background-image','url("' + data.photo.full_path + '")');
            }
        };
        $("#form-bgpic").ajaxForm(options);
        $('#sub').click();

//        for(i = 0; i < files.length; i++) {
//            files[i].thumb = URL.createObjectURL(files[i])
//        }
//        files = Array.prototype.slice.call(files, 0);
//        console.log(files);
    });
    //选择背景颜色
    $('#bg-color-btn').on('click', function() {
        if(out) {
            $('#bg-color').click();
        }
        else {
            alert('未选择任何组件，请单击目标组件后再尝试');
        }
    });
    $('#bg-color').on('change', function() {
        out.css('background-color', $(this).val());
    });
    //清除背景图片以及颜色
    $('#clearphoto').on('click', function() {
        out.css({'background-image': '', 'background-color': 'transparent'});
    });
    //上下边距调整
    $marTop.on('input propertychange', function() {
        if(out) {
            out.css('margin-top', $(this).val() + 'px');
        }
    });
    $marBottom.on('input propertychange', function() {
        if(out) {
            out.css('margin-bottom', $(this).val() + 'px');
        }
    });
    $padTop.on('input propertychange', function() {
        if(out) {
            out.css('padding-top', $(this).val() + 'px');
        }
    });
    $padBottom.on('input propertychange', function() {
        if(out) {
            out.css('padding-bottom', $(this).val() + 'px');
        }
    });
    //删除组件
    $('#delete-component').on('click', function() {
        if(!out) {
            alert('未选择任何组件，请单击组件后再进行相关操作');
            return;
        }
        if(confirm('确认删除组件？')) {
            out.remove();
            deletetemp.push(out);
            out = null;
            $componentOption.html('');

        }
    });
    $('#delete-component-all').on('click', function() {
        if(confirm('确认清空组件？关闭或刷新页面后将不能撤回此操作')) {
            deletetempall = $editor.html();
            $editor.html('');
            out = null;
            $componentOption.html('');
        }
    });
    $('#re-component-all').on('click', function() {
        if(deletetempall == '') {
            alert('没有可以恢复的缓存');
            return;
        }
        if(confirm('确认恢复到上次清空前？期间的编辑将被覆盖')) {
            $editor.html(deletetempall);
        }
    });
    //撤回删除
    $('#re-component').on('click', function() {
        if(deletetemp.length != 0) {
            $editor.append(deletetemp.pop());
        }
        else {
            alert('已经撤回到最初状态');
        }
    });
    //选取组件
    $('.component-container').children('li').on('click', function() {
       if(out) {
           out.after($(this).html());
       }
       else {
           $editor.append($(this).html());
       }
       $editor.find('.p').attr('contenteditable', 'true');
    });
    //选取固定组件 {
    $('.fix-component-container').children('li').on('click', function() {
        var obj = $editor.find('.fix-component');
        if(obj.length > 0) {
            if(obj.hasClass('none')) {
                obj.remove();
            }
            else {
                alert('已存在固定组件，要添加新的固定组件请先删除旧的');
                return;
            }
        }
        if(out) {
            out.after($(this).html());
        }
        else {
            $editor.append($(this).html());
        }
        $editor.find('.p').attr('contenteditable', 'true');
        $editor.find('.fix-component').each(function() {
            $(this).css('position', 'fixed');
            if($(this).data('top') || $(this).data('top') == 0) {
                $(this).css('top', $(this).data('top') + 'px');
            }
            if($(this).data('right') || $(this).data('right') == 0) {
                $(this).css('right', $(this).data('right') + 'px');
            }
            if($(this).data('bottom') || $(this).data('bottom') == 0) {
                $(this).css('bottom', $(this).data('bottom') + 'px');
            }
            if($(this).data('left') || $(this).data('left') == 0) {
                $(this).css('left', $(this).data('left') + 'px');
            }
        });
    });
    $('#no-fixed').on('click', function() {
        var obj = $editor.find('.fix-component');
        if(obj.length) {
            obj.remove();
        }
        $editor.append('<div class="fix-component none"></div>');
    });
    //编辑组件代码按钮
    $('#update-component-code').on('click', function() {
        out.html($tempCode.val());
    });
    //右键菜单
    $editor.bind("contextmenu", function(e){
        temp = e.target;
        if($(temp).hasClass('p')) {
            $pRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
            $colorFont.val(rgbto16(e.target.style.color));
        }
        if(e.target.nodeName == 'IMG') {
            if($(temp).hasClass('ex-img')) {
                return;
            }
            $imgRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
        }
        if($(temp).hasClass('iconfont')) {
            $iconfontRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
            $iconfontColor.val(rgbto16(e.target.style.color));
        }
        return false;
    });
    //改变字体颜色
    $('#p-color').on('click', function() {
       $pRight.hide();
       $colorFont.click();
    });
    $colorFont.on('change', function() {
        temp.style.color = $(this).val();
    });
    //上传图片
    $('#upload-img').on('click', function() {
        $imgRight.hide();
        $picBtn.click();
    });
    $picBtn.on('change', function(event) {
        event.preventDefault();
        var options = {
            success: function (data) {
                temp.setAttribute('src', data.photo.full_path);
            }
        };
        $("#form-pic").ajaxForm(options);
        $('#sub-pic').click();
    });
    //右键图片seo
    $('#seo-img').on('click', function(e) {
        $seoImgInp.val($(temp).attr('alt'));
        $imgRight.hide();
        $seoImgInp.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
    });
    $seoImgInp.on('input propertychange', function() {
        $(temp).attr('alt', $(this).val());
    });
    //iconfont右键图标
    $iconfontColor.on('input propertychange', function() {
        temp.style.color = $(this).val();
    });
    $iconfontDelete.on('click', function() {
        $iconfontRight.hide();
        $(temp).parent().remove();
    });
    $iconfontRight.find('li').on('click', function(e) {
        $iconfontRight.hide();
        $(temp).attr('class', $(e.target).attr('class'));
    });
    //侧栏选择
    var $celans = $('.ce-container img');
    $celans.on('click', function() {
        $celans.css('border', 'none');
        $(this).css('border', '5px solid red');
        $('.sidebar').remove();
        $editor.append('<section class="sidebar" data-type="' + $(this).data('type') + '" data-color="' + $(this).data('color') + '" style="display: none"></section>');
    });
    $('#no-ce').on('click', function() {
        $celans.css('border', 'none');
        $('.sidebar').remove();
    });
    //轮播选择 {
    var $mySwipers = $('.my-swiper-container img');
    $mySwipers.on('click', function() {
        if($('.' + $(this).data('type')).length > 0) {
            alert('不能多次使用相同的轮播组件');
            return;
        }
        if(out) {
            out.after('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
        else {
            $editor.append('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
    });
    //地图选择
    var $mymaps = $('.my-map-container img');
    $mymaps.on('click', function() {
        if($('.' + $(this).data('type')).length > 0) {
            alert('不能多次使用相同的轮播组件');
            return;
        }
        if(out) {
            out.after('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
        else {
            $editor.append('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
        if(staticAddress) {
            $('.map').attr('address', staticAddress);
        }
    });
    //分割线选择
    var $lines = $('.line-container img');
    $lines.on('click', function() {
        if(out) {
            out.after('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
        else {
            $editor.append('<section style="width: 100%;padding: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 1200px;margin: 0 auto;display: block"></section>');
        }
    });
    //这个方法暂时有不影响使用的bug。。待解决。。就是点击到组件的margin会出现堆栈溢出报错，不影响使用
    function getTemp(obj) {
        if(obj.hasClass('component')) {
            return obj;
        }
        else {
            return getTemp(obj.parent());
        }
    }
    //基础交互
    function binfDefault(e) {
        try {
            out = getTemp($(e.target));
        }
        catch(err) {}
        showCode();
        $pRight.hide();
        $imgRight.hide();
        $seoImgInp.hide();
        $iconfontRight.hide();
        $marTop.val(parseInt(out.css('margin-top')));
        $marBottom.val(parseInt(out.css('margin-bottom')));
        $padTop.val(parseInt(out.css('padding-top')));
        $padBottom.val(parseInt(out.css('padding-bottom')));
        loadComponentOption(out.data('type'));
        $body.on('mousemove', function(e) {
            if(e.which === 3) {
                return;
            }
            e.preventDefault();
            $editor.children().stop().removeClass('scaling');
            getTemp($(e.target)).addClass('scaling');
            out.css('opacity', '.2');
            $selectedKuang.stop().hide();
        });
        $editor.on('mouseup', function(e) {
            if(e.which === 3) {
                return;
            }
            $editor.off('mouseup');
            out.css('opacity', '1');
            getTemp($(e.target)).after(out);
            $editor.children().stop().removeClass('scaling');
            $selectedKuang.stop().hide();
            //选择提示框逻辑
            $selectedKuang.stop().hide();
            setTimeout(function() {
                $selectedKuang.css({'top': out.offset().top, 'width': '100%', 'height': out.outerHeight()}).fadeIn(300).fadeOut(300);
            }, 200);
        });
        $body.on('mouseup', function(e) {
            out.css('opacity', '1');
            $body.off('mousemove mouseup');
            $editor.off('mouseup');
        });
    }
    function showCode() {
        if(!out.data('type').match(/^component|line/)) {
            $tempCode.val('此组件不能编辑');
            return;
        }
        $tempCode.val(out.html());
    }
    //读取组件功能
    function loadComponentOption(str) {
        switch(str) {
            // case 'component1':
            //     $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
            //     $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
            //         out.attr('data-tag', $(this).val())
            //     });
            //     break;
            case "component2":
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag""><h3>改变图片尺寸</h3><div id="com2-size-btn-big" class="btn">大(386*500)</div><div id="com2-size-btn-mid" class="btn">中(386*386)</div><div id="com2-size-btn-small" class="btn">小(386*290)</div>');
                $("#com2-size-btn-big").on('click', function() {
                    out.find('img').css('height', '500px');
                });
                $("#com2-size-btn-mid").on('click', function() {
                    out.find('img').css('height', '388px');
                });
                $("#com2-size-btn-small").on('click', function() {
                    out.find('img').css('height', '290px');
                });
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                break;
            // case 'component3':
            //     $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
            //     $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
            //         out.attr('data-tag', $(this).val())
            //     });
            //     break;
            case 'component4':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>左右替换</h3><div id="com4-left" class="btn">左图右文</div><div id="com4-right" class="btn">左文右图</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#com4-left').on('click', function() {
                    out.children().children().eq(0).css('float', 'right');
                    out.find('p').css('text-align', 'left');
                    out.find('a').css('float', 'left');
                });
                $('#com4-right').on('click', function() {
                    out.children().children().eq(0).css('float', 'left');
                    out.find('p').css('text-align', 'right');
                    out.find('a').css('float', 'right');
                });
                break;
            case 'component5':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>左右替换</h3><div id="com4-left" class="btn">左图右文</div><div id="com4-right" class="btn">左文右图</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#com4-left').on('click', function() {
                    out.children().children().eq(0).css('float', 'right');
                });
                $('#com4-right').on('click', function() {
                    out.children().children().eq(0).css('float', 'left');
                });
                break;
            // case 'component6':
            //     $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
            //     $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
            //         out.attr('data-tag', $(this).val())
            //     });
            //     break;
            // case 'component7':
            //     $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
            //     $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
            //         out.attr('data-tag', $(this).val())
            //     });
            //     break;
            case 'swiper0':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>轮播页</h3><div class="btn" id="swi-add">加一页</div><div class="s0con"></div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                var $swiAddB = $('#swi-add');
                //轮播上传功能
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.attr('src', data.photo.full_path);
                            $('.swiper0-piece-up').eq(imgtemp.parent().attr('index')).find('.' + imgtemp.attr('state')).attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $swiAddB.on('click', function() {
                    $('.swiper0').append(' <section class="swiper0-piece-up" style="display: none"> <img src="" class="img1"> <img src="" class="img2"> </section>');
                    $('.swi-del').off('click');
                    $componentOption.find('.s0con').append('<div class="swi-inner"><input type="button" value="删除" style="position: absolute;left: 0;top: 0;" class="swi-del"><img src="" style="display:inline-block;width: 170px;height: 125px;margin-right: 5px" state="img1"><img src="" style="display:inline-block;width: 125px;height: 125px;" state="img2"></div>');
                    $('.swi-del').each(function(index) {
                        bingSwiDelete0(index, $(this));
                    });
                    $('.swi-inner img').off('click');
                    $('.swi-inner img').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                });
                if($('.swiper0 .swiper0-piece-up')) {
                    var lll = $('.swiper0 .swiper0-piece-up').length;
                    for(var i=0;i < lll; i++) {
                        var str = '<div class="swi-inner"><input type="button" value="删除" style="position: absolute;left: 0;top: 0;" class="swi-del"><img src="';
                        str += $('.swiper0-piece-up').eq(i).find('.img1').attr('src');
                        str += '" style="display:inline-block;width: 170px;height: 125px;margin-right: 5px" state="img1"><img src="';
                        str += $('.swiper0-piece-up').eq(i).find('.img2').attr('src');
                        str += '" style="display:inline-block;width: 125px;height: 125px;" state="img2"></div>'
                        $componentOption.find('.s0con').append(str);
                    }
                    $('.swi-inner img').off('click');
                    $('.swi-inner img').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    $('.swi-del').each(function(index) {
                        bingSwiDelete0(index, $(this));
                    });
                }
                function bingSwiDelete0(index, obj) {
                    obj.parent().attr('index', index);
                    obj.on('click', function() {
                        obj.parent().remove();
                        // console.log(index);
                        $('.swiper0-piece-up').eq(index).remove();
                        $('.swi-del').off('click');
                        $('.swi-del').each(function(index) {
                            bingSwiDelete0(index, $(this));
                        });
                    })
                }
                break;
            case 'map':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>项目地址</h3><textarea type="text" placeholder="请输入项目地址" id="address" style="width: 250px;height: 200px">');
                $('#address').val(staticAddress || $('.map').attr('address')).on('input propertychange', function() {
                    staticAddress = '';
                    $('.map').attr('address', $(this).val());
                });
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                break;
            case 'component8':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>添加下方图标</h3><div class="btn" id="add-icon">添加</div><h3>背景黑幕</h3><div class="btn" id="mask">添加/取消</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val());
                });
                $('#add-icon').on('click', function() {
                    out.children().children(':last-child').append('<section style="display: inline-block;padding:0 20px;width: 90px;text-align: center"> <i class="iconfont icon-shangye2" style="font-size:92px;color: #ffde00;"></i> <div class="p" style="padding-top:16px;font-size: 18px;color: #ffde00;font-family: Microsoft YaHei, Arial" contenteditable="true">商圈基地</div> </section>');
                });
                $('#mask').on('click', function() {
                    if(out.find('.mask').length) {
                        out.find('.mask').remove();
                    }
                    else {
                        out.children().eq(0).before('<div class="mask" style="position:absolute;top:0; left:0;width: 100%;height: 580px;background: -webkit-gradient(linear,center bottom,center 66%,from(#303030), to(transparent));"></div>');
                    }
                });
                break;
            case 'component9':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>添加下方图标</h3><div class="btn" id="add-icon">添加</div><h3>背景黑幕</h3><div class="btn" id="mask">添加/取消</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val());
                });
                $('#add-icon').on('click', function() {
                    out.children().children(':last-child').append('<section style="display: inline-block;padding:0 20px;width: 90px"><i class="iconfont icon-shuijue" style="color: #ffde00;font-size: 92px"></i><div class="p" style="padding-top:16px;font-size: 18px;color: #ffde00;font-family: Microsoft YaHei, Arial" contenteditable="true">可住家</div></section>');
                });
                $('#mask').on('click', function() {
                    if(out.find('.mask').length) {
                        out.find('.mask').remove();
                    }
                    else {
                        out.children().eq(0).before('<div class="mask" style="position:absolute;top:0; left:0;width: 100%;height: 308px;background: -webkit-gradient(linear,center bottom,center 45%,from(#303030), to(transparent));"></div>');
                    }
                });
                break;
            case 'component10':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>探头底色</h3><div class="btn" id="white">白色</div><div class="btn" id="yellow">米黄色</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#white').on('click', function() {
                    out.children().css('background-color', '#fff');
                });
                $('#yellow').on('click', function() {
                    out.children().css('background-color', '#fff3d7');
                });
                break;
            case 'component11':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>探头底色</h3><div class="btn" id="white">白色</div><div class="btn" id="yellow">米黄色</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#white').on('click', function() {
                    out.children().css('background-color', '#fff');
                });
                $('#yellow').on('click', function() {
                    out.children().css('background-color', '#fff3d7');
                });
                break;
            case 'line':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                break;
            case 'swiper1':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>轮播页</h3><div class="btn" id="swi-add">加一页</div><div class="s0con"></div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                var $swiAddB = $('#swi-add');
                //轮播上传功能
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.attr('src', data.photo.full_path);
                            $('.swiper1-piece-up').eq(imgtemp.parent().attr('index')).find('.' + imgtemp.attr('state')).attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $swiAddB.on('click', function() {
                    $('.swiper1').append(' <section class="swiper1-piece-up" style="display: none"> <img src="" class="img1"> <img src="" class="img2"> </section>');
                    $('.swi-del').off('click');
                    $componentOption.find('.s0con').append('<div class="swi-inner"><input type="button" value="删除" style="position: absolute;left: 0;top: 0;" class="swi-del"><img src="" style="display:inline-block;width: 170px;height: 125px;margin-right: 5px" state="img1"><img src="" style="display:inline-block;width: 125px;height: 125px;" state="img2"><input type="text" placeholder="请输入分页标签名称" style="position: absolute;top;0;right:0" class="swi1tag"></div>');
                    $('.swi-del').each(function(index) {
                        bingSwiDelete1(index, $(this));
                    });
                    $('.swi-inner img').off('click');
                    $('.swi-inner img').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    //绑定输入事件
                    $('.swi1tag').off('input propertychange').on('input propertychange', function() {
                        $('.swiper1-piece-up').eq($(this).parent().attr('index')).attr('tag', $(this).val());
                    });
                });
                if($('.swiper1 .swiper1-piece-up')) {
                    var lll = $('.swiper1 .swiper1-piece-up').length;
                    for(var i=0;i < lll; i++) {
                        var str = '<div class="swi-inner"><input type="button" value="删除" style="position: absolute;left: 0;top: 0;" class="swi-del"><img src="';
                        str += $('.swiper1-piece-up').eq(i).find('.img1').attr('src');
                        str += '" style="display:inline-block;width: 170px;height: 125px;margin-right: 5px" state="img1"><img src="';
                        str += $('.swiper1-piece-up').eq(i).find('.img2').attr('src');
                        str += '" style="display:inline-block;width: 125px;height: 125px;" state="img2"><input type="text" placeholder="请输入分页标签名称" style="position: absolute;top;0;right:0" class="swi1tag"></div>';
                        $componentOption.find('.s0con').append(str);
                    }
                    $('.swi-inner img').off('click');
                    $('.swi-inner img').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    $('.swi-del').each(function(index) {
                        bingSwiDelete1(index, $(this));
                    });
                    $('.swi1tag').each(function() {
                        $(this).val($('.swiper1-piece-up').eq($(this).parent().attr('index')).attr('tag'));
                    });
                    //绑定输入事件
                    $('.swi1tag').off('input propertychange').on('input propertychange', function() {
                        $('.swiper1-piece-up').eq($(this).parent().attr('index')).attr('tag', $(this).val());
                    });
                }
                function bingSwiDelete1(index, obj) {
                    obj.parent().attr('index', index);
                    obj.on('click', function() {
                        obj.parent().remove();
                        $('.swiper1-piece-up').eq(index).remove();
                        $('.swi-del').off('click');
                        $('.swi-del').each(function(index) {
                            bingSwiDelete1(index, $(this));
                        });
                    })
                }
                break;
            case 'swiper2':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>内容编辑</h3><div class="btn" id="s2add">加一页</div>');
                if(out.find('.piece').length) {
                    var loadstr = '';
                    out.find('.piece').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s2img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<h6>第一行文案</h6><input type="text" class="word1" value="' + $(this).find('.word1').text() + '"><h6>第二行文案</h6><input type="text" class="word2" value="' + $(this).find('.word2').text() + '"><h6>第三行文案</h6><input type="text" class="word3" value="' + $(this).find('.list-title').text() + '"><h6>标签（不能超过六个字，没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="taginp" style="width: 80px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '">';
                        });
                        loadstr += '<input type="button" value="删除" class="s2delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-4);
                    });
                    binds2function();
                }
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper2').find('.piece').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s2add').on('click', function() {
                    $('.swiper2').append('<div class="piece" style="display: none"><img src="/static/PCLandingPageComponent/example_img/500x500.jpg"> <div class="info"> <p class="word1">01 精彩空间</p> <p class="word2">【三房两厅一卫】建筑面积85m² </p> <p class="list-title">户型点评</p> <hr style="margin-top: 22px;border-top: 1px solid #dddddd"> <ul class="list"> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> </ul> </div></div>');
                    var str = '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s2img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<h6>第一行文案</h6><input type="text" class="word1"><h6>第二行文案</h6><input type="text" class="word2"><h6>第三行文案</h6><input type="text" class="word3"><h6>标签（不能超过六个字，没有请留空）</h6>';
                    for(var i=0; i<12; i++) {
                        str += '<input type="text" class="taginp" style="width: 80px;margin-right: 10px" listcount="' + i + '">';
                    }
                    str += '<input type="button" value="删除" class="s2delete"></div>';
                    $componentOption.append(str);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-4);
                    });
                    binds2function();
                });
                function binds2function() {
                    $('.s2delete').off('click').on('click', function() {
                        $(this).parent().remove();
                        $componentOption.children('div').each(function() {
                            $(this).attr('count', $(this).index()-4);
                        });
                        $('.swiper2').find('.piece').eq($(this).parent().attr('count')).remove();
                    });
                    $('.s2img').off('click').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    $('.taginp').off('input propertychange').on('input propertychange', function() {
                        $('.swiper2').find('.piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                    });
                    $componentOption.find('.word1').off('input propertychange').on('input propertychange', function() {
                        $('.swiper2').find('.piece').eq($(this).parent().attr('count')).find('.word1').text($(this).val());
                    });
                    $componentOption.find('.word2').off('input propertychange').on('input propertychange', function() {
                        $('.swiper2').find('.piece').eq($(this).parent().attr('count')).find('.word2').text($(this).val());
                    });
                    $componentOption.find('.word3').off('input propertychange').on('input propertychange', function() {
                        $('.swiper2').find('.piece').eq($(this).parent().attr('count')).find('.list-title').text($(this).val());
                    });
                }
                break;
            case 'swiper3':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>内容编辑</h3><div class="btn" id="s3add">加一页</div>');
                if(out.find('.piece').length) {
                    var loadstr = '';
                    out.find('.piece').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s3img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<h6>第一行文案</h6><input type="text" class="word1" value="' + $(this).find('.word1').text() + '"><h6>第二行文案</h6><input type="text" class="word2" value="' + $(this).find('.word2').text() + '"><h6>第三行文案</h6><input type="text" class="word3" value="' + $(this).find('.list-title').text() + '"><h6>标签（没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="taginp" style="width: 320px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '"><br>';
                        });
                        loadstr += '<input type="button" value="删除" class="s3delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-4);
                    });
                    binds3function();
                }
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper3').find('.piece').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s3add').on('click', function() {
                    $('.swiper3').append('<div class="piece" style="display: none"><img src="/static/PCLandingPageComponent/example_img/500x500.jpg"> <div class="info"> <p class="word1">01 精彩空间</p> <p class="word2">【三房两厅一卫】建筑面积85m² </p> <p class="list-title">户型点评</p> <hr style="margin-top: 22px;border-top: 1px solid #dddddd"> <ul class="list"> <li></li> <li></li> <li></li> <li></li> </ul> </div></div>');
                    var str = '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s3img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<h6>第一行文案</h6><input type="text" class="word1"><h6>第二行文案</h6><input type="text" class="word2"><h6>第三行文案</h6><input type="text" class="word3"><h6>标签（不能超过六个字，没有请留空）</h6>';
                    for(var i=0; i<4; i++) {
                        str += '<input type="text" class="taginp" style="width: 320px;margin-right: 10px" listcount="' + i + '"><br>';
                    }
                    str += '<input type="button" value="删除" class="s3delete"></div>';
                    $componentOption.append(str);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-4);
                    });
                    binds3function();
                });
            function binds3function() {
                $('.s3delete').off('click').on('click', function() {
                    $(this).parent().remove();
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-4);
                    });
                    $('.swiper3').find('.piece').eq($(this).parent().attr('count')).remove();
                });
                $('.s3img').off('click').on('click', function() {
                    imgtemp = $(this);
                    $swiperPicUp.click();
                });
                $('.taginp').off('input propertychange').on('input propertychange', function() {
                    $('.swiper3').find('.piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                });
                $componentOption.find('.word1').off('input propertychange').on('input propertychange', function() {
                    $('.swiper3').find('.piece').eq($(this).parent().attr('count')).find('.word1').text($(this).val());
                });
                $componentOption.find('.word2').off('input propertychange').on('input propertychange', function() {
                    $('.swiper3').find('.piece').eq($(this).parent().attr('count')).find('.word2').text($(this).val());
                });
                $componentOption.find('.word3').off('input propertychange').on('input propertychange', function() {
                    $('.swiper3').find('.piece').eq($(this).parent().attr('count')).find('.list-title').text($(this).val());
                });
            }
                break;
            case 'swiper4':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="s4blue" style="background-color: #0550a4">蓝色</div><div class="btn"id="s4red"  style="background-color: #c91523">红色</div><div class="btn" id="s4gold" style="background-color: #eca432">金色</div><div class="btn" id="s4green" style="background-color: #076250">绿色</div><h3>体型</h3><div id="s4tall" class="btn">高</div><div id="s4short" class="btn">矮</div><h3>内容编辑</h3><div class="btn" id="s4add">加一页</div>');
                $('#s4blue').on('click',function() {
                    $('.swiper4').attr('s4color', 'blue');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4blue2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4blue.jpg');
                    }
                });
                $('#s4red').on('click',function() {
                    $('.swiper4').attr('s4color', 'red');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4red2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4red.jpg');
                    }
                });
                $('#s4green').on('click',function() {
                    $('.swiper4').attr('s4color', 'green');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4green2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4green.jpg');
                    }
                });
                $('#s4gold').on('click',function() {
                    $('.swiper4').attr('s4color', 'gold');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4gold2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper4/s4gold.jpg');
                    }
                });
                $('#s4tall').on('click', function() {
                    out.attr('needtall', true);
                    $('#s4' + $('.swiper4').attr('s4color')).click();
                });
                $('#s4short').on('click', function() {
                    out.attr('needtall', false);
                    $('#s4' + $('.swiper4').attr('s4color')).click();
                });
                if(out.find('.s4-piece').length) {
                    var loadstr = '';
                    out.find('.s4-piece').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s4img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<h6>标题</h6><input type="text" class="s4title" value="' + $(this).find('.lindex').text() + '"><h6>副标题</h6><input type="text" class="s4exinp" value="' + $(this).find('.title').text() + '"><br><h6>分条文案（没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="s4liinp" style="width: 320px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '"><br>';
                        });
                        loadstr += '<input type="button" value="删除" class="s4delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-12);
                    });
                    binds4function();
                }
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $swiperPicUp.off('change').on('change', function() {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper4').find('.s4-piece').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s4add').on('click', function() {
                    $('.swiper4').append('<div class="s4-piece" style="display: none"><img src="/static/PCLandingPageComponent/swiper4/s4example.jpg"><p class="lindex"></p><div class="info"><p class="title">副标题</p><ul class="list"><li></li><li></li><li></li><li></li><li></li></ul></div></div>');
                    var str = '<section style="margin-bottom: 20px;"><h6>图片</h6><div class="s4img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<h6>标题</h6><input type="text" class="s4title"><h6>副标题</h6><input type="text" class="s4exinp"><br><h6>分条文案（没有请留空）</h6>';
                    for(var i=0; i<5; i++) {
                        str += '<input type="text" class="s4liinp" style="width: 320px;margin-right: 10px" listcount="' + i + '"><br>';
                    }
                    str += '<input type="button" value="删除" class="s4delete"></section>';
                    $componentOption.append(str);
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-12);
                    });
                    binds4function();
                });
                function binds4function() {
                    $('.s4delete').off('click').on('click', function() {
                        $(this).parent().remove();
                        $componentOption.find('section').each(function() {
                            $(this).attr('count', $(this).index()-12);
                        });
                        $('.swiper4').find('.s4-piece').eq($(this).parent().attr('count')).remove();
                    });
                    $('.s4img').off('click').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    $('.s4title').off('input propertychange').on('input propertychange', function() {
                        $('.swiper4').find('.s4-piece').eq($(this).parent().attr('count')).find('.lindex').text($(this).val());
                    });
                    $('.s4exinp').off('input propertychange').on('input propertychange', function() {
                        $('.swiper4').find('.s4-piece').eq($(this).parent().attr('count')).find('.title').text($(this).val());
                    });
                    $('.s4liinp').off('input propertychange').on('input propertychange', function() {
                        $('.swiper4').find('.s4-piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                    });
                }
                break;
            case 'swiper5':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="s5blue" style="background-color: #0550a4">蓝色</div><div class="btn"id="s5red"  style="background-color: #c91523">红色</div><div class="btn" id="s5gold" style="background-color: #eca432">金色</div><div class="btn" id="s5green" style="background-color: #076250">绿色</div><h3>体型</h3><div id="s5tall" class="btn">高</div><div id="s5short" class="btn">矮</div><h3>内容编辑</h3><div class="btn" id="s5add">加一页</div>');
                $('#s5blue').on('click',function() {
                    $('.swiper5').attr('s5color', 'blue');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5blue2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5blue.jpg');
                    }
                });
                $('#s5red').on('click',function() {
                    $('.swiper5').attr('s5color', 'red');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5red2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5red.jpg');
                    }
                });
                $('#s5green').on('click',function() {
                    $('.swiper5').attr('s5color', 'green');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5green2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5green.jpg');
                    }
                });
                $('#s5gold').on('click',function() {
                    $('.swiper5').attr('s5color', 'gold');
                    if(out.attr('needtall') == 'true') {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5gold2.jpg');
                    }
                    else {
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper5/s5gold.jpg');
                    }
                });
                $('#s5tall').on('click', function() {
                    out.attr('needtall', true);
                    $('#s5' + $('.swiper5').attr('s5color')).click();
                });
                $('#s5short').on('click', function() {
                    out.attr('needtall', false);
                    $('#s5' + $('.swiper5').attr('s5color')).click();
                });
                if(out.find('.s5-piece').length) {
                    var loadstr = '';
                    out.find('.s5-piece').each(function() {
                        loadstr += '<section style="margin-bottom: 20px;"><h6>图片</h6><div class="s5img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<h6>标题</h6><input type="text" class="s5title" value="' + $(this).find('.lindex').text() + '"><h6>副标题</h6><input type="text" class="s5exinp" value="' + $(this).find('.title').text() + '"><br><h6>分段文案（没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="s5liinp" style="width: 320px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '"><br>';
                        });
                        loadstr += '<input type="button" value="删除" class="s5delete"></section>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('section').each(function() {
                        $(this).attr('count', $(this).index()-12);
                    });
                    binds5function();
                }
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $swiperPicUp.off('change').on('change', function() {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper5').find('.s5-piece').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s5add').on('click', function() {
                    $('.swiper5').append('<div class="s5-piece" style="display: none"><img src="/static/PCLandingPageComponent/swiper5/s5example.jpg"><p class="lindex"></p><div class="info"><p class="title">副标题</p><ul class="list"><li></li><li></li><li></li></ul></div></div>');
                    var str = '<section style="margin-bottom: 20px;"><h6>图片</h6><div class="s5img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<h6>标题</h6><input type="text" class="s5title"><h6>副标题</h6><input type="text" class="s5exinp"><br><h6>分段文案（没有请留空）</h6>';
                    for(var i=0; i<3; i++) {
                        str += '<input type="text" class="s5liinp" style="width: 320px;margin-right: 10px" listcount="' + i + '"><br>';
                    }
                    str += '<input type="button" value="删除" class="s5delete"></section>';
                    $componentOption.append(str);
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-12);
                    });
                    binds5function();
                });
            function binds5function() {
                $('.s5delete').off('click').on('click', function() {
                    $(this).parent().remove();
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-12);
                    });
                    $('.swiper5').find('.s5-piece').eq($(this).parent().attr('count')).remove();
                });
                $('.s5img').off('click').on('click', function() {
                    imgtemp = $(this);
                    $swiperPicUp.click();
                });
                $('.s5title').off('input propertychange').on('input propertychange', function() {
                    $('.swiper5').find('.s5-piece').eq($(this).parent().attr('count')).find('.lindex').text($(this).val());
                });
                $('.s5exinp').off('input propertychange').on('input propertychange', function() {
                    $('.swiper5').find('.s5-piece').eq($(this).parent().attr('count')).find('.title').text($(this).val());
                });
                $('.s5liinp').off('input propertychange').on('input propertychange', function() {
                    $('.swiper5').find('.s5-piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                });
            }
                break;
            case 'swiper6':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="s6blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="s6red"  style="background-color: #c91523">红色</div><div class="btn" id="s6gold" style="background-color: #eca432">金色</div><div class="btn" id="s6green" style="background-color: #076250">绿色</div><h3>内容编辑</h3><div class="btn" id="s6add">加一页</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#s6blue').on('click',function() {
                    $('.swiper6').attr('s6color', 'blue');
                        out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper6/s6blue.jpg');
                });
                $('#s6red').on('click',function() {
                    $('.swiper6').attr('s6color', 'red');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper6/s6red.jpg');
                });
                $('#s6gold').on('click',function() {
                    $('.swiper6').attr('s6color', 'gold');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper6/s6gold.jpg');
                });
                $('#s6green').on('click',function() {
                    $('.swiper6').attr('s6color', 'green');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper6/s6green.jpg');
                });
                if(out.find('.s6-piece').length) {
                    var loadstr = '';
                    out.find('.s6-piece').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>索引背景图片</h6><img class="s6img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgl" src="' + $(this).find('.imgl').attr('src') + '"><h6>展示图片</h6><img class="s6img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgr" src="' + $(this).find('.imgr').attr('src') + '">';
                        loadstr += '<h6>标题</h6><input type="text" class="s6title" value="' + $(this).find('.lindex').text() + '"><h6>副标题</h6><input type="text" class="s6exinp" value="' + $(this).find('.title').text() + '"><br><h6>分条文案（没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="s6liinp" style="width: 320px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '"><br>';
                        });
                        loadstr += '<input type="button" value="删除" class="s6delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-9);
                    });
                    binds6function();
                }
                $swiperPicUp.off('change').on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.attr('src', data.photo.full_path);
                            $('.swiper6 .s6-piece').eq(imgtemp.parent().attr('count')).find('.' + imgtemp.attr('state')).attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s6add').on('click', function() {
                    $('.swiper6').append('<div class="s6-piece" style="display: none"><section> <img src="/static/PCLandingPageComponent/swiper6/s6example.jpg" class="imgl"> <p><span class="lindex">项目概况</span></p> </section><div class="s6-info"><p class="title">副标题</p><ul class="list"><li></li><li></li><li></li><li></li><li></li></ul></div><img src="/static/PCLandingPageComponent/swiper6/s6example.jpg" class="imgr"></div>');
                    var str = '<section style="margin-bottom: 20px;"><h6>索引背景图片</h6><img class="s6img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgl"><h6>展示图片</h6><img class="s6img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgr">';
                    str += '<h6>标题</h6><input type="text" class="s6title"><h6>副标题</h6><input type="text" class="s6exinp"><br><h6>分条文案（没有请留空）</h6>';
                    for(var i=0; i<5; i++) {
                        str += '<input type="text" class="s6liinp" style="width: 320px;margin-right: 10px" listcount="' + i + '"><br>';
                    }
                    str += '<input type="button" value="删除" class="s6delete"></section>';
                    $componentOption.append(str);
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-9);
                    });
                    binds6function();
                });
                function binds6function() {
                    $('.s6delete').off('click').on('click', function() {
                        $(this).parent().remove();
                        $componentOption.find('section').each(function() {
                            $(this).attr('count', $(this).index()-9);
                        });
                        $('.swiper6').find('.s6-piece').eq($(this).parent().attr('count')).remove();
                    });
                    $('.s6img').off('click').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                    $('.s6title').off('input propertychange').on('input propertychange', function() {
                        $('.swiper6').find('.s6-piece').eq($(this).parent().attr('count')).find('.lindex').text($(this).val());
                    });
                    $('.s6exinp').off('input propertychange').on('input propertychange', function() {
                        $('.swiper6').find('.s6-piece').eq($(this).parent().attr('count')).find('.title').text($(this).val());
                    });
                    $('.s6liinp').off('input propertychange').on('input propertychange', function() {
                        $('.swiper6').find('.s6-piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                    });
                }
                break;
            case 'swiper7':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="s7blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="s7red"  style="background-color: #c91523">红色</div><div class="btn" id="s7gold" style="background-color: #eca432">金色</div><div class="btn" id="s7green" style="background-color: #076250">绿色</div><h3>内容编辑</h3><div class="btn" id="s7add">加一页</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#s7blue').on('click',function() {
                    $('.swiper7').attr('s7color', 'blue');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper7/s7blue.jpg');
                });
                $('#s7red').on('click',function() {
                    $('.swiper7').attr('s7color', 'red');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper7/s7red.png');
                });
                $('#s7gold').on('click',function() {
                    $('.swiper7').attr('s7color', 'gold');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper7/s7gold.png');
                });
                $('#s7green').on('click',function() {
                    $('.swiper7').attr('s7color', 'green');
                    out.find('.ex-img').attr('src', '/static/PCLandingPageComponent/swiper7/s7green.png');
                });
                if(out.find('.s7-piece').length) {
                    var loadstr = '';
                    out.find('.s7-piece').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>索引背景图片</h6><img class="s7img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgl" src="' + $(this).find('.imgl').attr('src') + '"><h6>展示图片</h6><img class="s7img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgr" src="' + $(this).find('.imgr').attr('src') + '">';
                        loadstr += '<h6>标题</h6><input type="text" class="s7title" value="' + $(this).find('.lindex').text() + '"><h6>副标题</h6><input type="text" class="s7exinp" value="' + $(this).find('.title').text() + '"><br><h6>分段文案（没有请留空）</h6>';
                        $(this).find('li').each(function() {
                            loadstr += '<input type="text" class="s7liinp" style="width: 320px;margin-right: 10px" listcount="' + $(this).index() + '" value="' + $(this).text() + '"><br>';
                        });
                        loadstr += '<input type="button" value="删除" class="s7delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-9);
                    });
                    binds7function();
                }
                $swiperPicUp.off('change').on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.attr('src', data.photo.full_path);
                            $('.swiper7 .s7-piece').eq(imgtemp.parent().attr('count')).find('.' + imgtemp.attr('state')).attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s7add').on('click', function() {
                    $('.swiper7').append('<div class="s7-piece" style="display: none"><section> <img src="/static/PCLandingPageComponent/swiper7/s7example.jpg" class="imgl"> <p><span class="lindex">项目概况</span></p> </section><div class="s7-info"><p class="title">副标题</p><ul class="list"><li></li><li></li><li></li></ul></div><img src="/static/PCLandingPageComponent/swiper7/s7example.jpg" class="imgr"></div>');
                    var str = '<section style="margin-bottom: 20px;"><h6>索引背景图片</h6><img class="s7img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgl"><h6>展示图片</h6><img class="s7img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer" state="imgr">';
                    str += '<h6>标题</h6><input type="text" class="s7title"><h6>副标题</h6><input type="text" class="s7exinp"><br><h6>分段文案（没有请留空）</h6>';
                    for(var i=0; i<3; i++) {
                        str += '<input type="text" class="s7liinp" style="width: 320px;margin-right: 10px" listcount="' + i + '"><br>';
                    }
                    str += '<input type="button" value="删除" class="s7delete"></section>';
                    $componentOption.append(str);
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-9);
                    });
                    binds7function();
                });
            function binds7function() {
                $('.s7delete').off('click').on('click', function() {
                    $(this).parent().remove();
                    $componentOption.find('section').each(function() {
                        $(this).attr('count', $(this).index()-9);
                    });
                    $('.swiper7').find('.s7-piece').eq($(this).parent().attr('count')).remove();
                });
                $('.s7img').off('click').on('click', function() {
                    imgtemp = $(this);
                    $swiperPicUp.click();
                });
                $('.s7title').off('input propertychange').on('input propertychange', function() {
                    $('.swiper7').find('.s7-piece').eq($(this).parent().attr('count')).find('.lindex').text($(this).val());
                });
                $('.s7exinp').off('input propertychange').on('input propertychange', function() {
                    $('.swiper7').find('.s7-piece').eq($(this).parent().attr('count')).find('.title').text($(this).val());
                });
                $('.s7liinp').off('input propertychange').on('input propertychange', function() {
                    $('.swiper7').find('.s7-piece').eq($(this).parent().attr('count')).find('li').eq($(this).attr('listcount')).text($(this).val());
                });
            }
                break;
            case 'component12':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="c12blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="c12red"  style="background-color: #c91523">红色</div><div class="btn" id="c12gold" style="background-color: #eca432">金色</div><div class="btn" id="c12green" style="background-color: #076250">绿色</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#c12blue').on('click', function() {
                    out.attr('data-color', ' #0853c3');
                    out.css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12blue.jpg)');
                    out.find('.p').eq(0).css('color', '#fff').find('span').css('color', '#ffcc00');
                    var obj = out.find('.c12out').children();
                    obj.eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12gifgold.gif)');
                    obj.eq(1).css('color', '#ffcc00');
                    obj.eq(2).find('img').attr('src', '/static/PCLandingPageComponent/staticimgs/component12/c12codeblue.jpg');
                    obj.eq(2).find('.p').css('color', '#083c8d');
                });
                $('#c12red').on('click', function() {
                    out.attr('data-color', ' #c91523');
                    out.css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12red.jpg)');
                    out.find('.p').eq(0).css('color', '#fff').find('span').css('color', '#ffcc00');
                    var obj = out.find('.c12out').children();
                    obj.eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12gifgold.gif)');
                    obj.eq(1).css('color', '#ffcc00');
                    obj.eq(2).find('img').attr('src', '/static/PCLandingPageComponent/staticimgs/component12/c12codered.jpg');
                    obj.eq(2).find('.p').css('color', '#c91523');
                });
                $('#c12gold').on('click', function() {
                    out.attr('data-color', '#ffa200');
                    out.css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12gold.jpg)');
                    out.find('.p').eq(0).css('color', '#5e4207').find('span').css('color', '#c91523');
                    var obj = out.find('.c12out').children();
                    obj.eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12gifred.gif)');
                    obj.eq(1).css('color', '#c91523');
                    obj.eq(2).find('img').attr('src', '/static/PCLandingPageComponent/staticimgs/component12/c12codegold.jpg');
                    obj.eq(2).find('.p').css('color', '#5e4207');
                });
                $('#c12green').on('click', function() {
                    out.attr('data-color', '#076250');
                    out.css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12green.jpg)');
                    out.find('.p').eq(0).css('color', '#fff').find('span').css('color', '#55ffde');
                    var obj = out.find('.c12out').children();
                    obj.eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component12/c12gifgreen.gif)');
                    obj.eq(1).css('color', '#55ffde');
                    obj.eq(2).find('img').attr('src', '/static/PCLandingPageComponent/staticimgs/component12/c12codegreen.jpg');
                    obj.eq(2).find('.p').css('color', '#076250');
                });
                break;
            case 'component15':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="c15blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="c15red"  style="background-color: #c91523">红色</div><div class="btn" id="c15gold" style="background-color: #eca432">金色</div><div class="btn" id="c15green" style="background-color: #076250">绿色</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#c15blue').on('click', function() {
                    out.css('background-color', '#d5e6fa');
                    out.children().children().eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15blue.png)').find('.p').css('color', '#666666').find('span').css('color', '#ffba00');
                    out.find('.c15btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15bluebtn.jpg)').css('color', '#ffffff');
                    out.find('.c15til').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15bluetitle.jpg)').css('color', '#ffffff');
                });
                $('#c15red').on('click', function() {
                    out.css('background-color', '#fde9eb');
                    out.children().children().eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15red.png)').find('.p').css('color', '#666666').find('span').css('color', '#ffba00');
                    out.find('.c15btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15redbtn.jpg)').css('color', '#ffffff');
                    out.find('.c15til').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15redtitle.jpg)').css('color', '#ffffff');
                });
                $('#c15gold').on('click', function() {
                    out.css('background-color', '#faeedb');
                    out.children().children().eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15gold.png)').find('.p').css('color', '#5e4207').find('span').css('color', '#c91523');
                    out.find('.c15btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15goldbtn.jpg)').css('color', '#5e4207');
                    out.find('.c15til').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15goldtitle.jpg)').css('color', '#5e4207');
                });
                $('#c15green').on('click', function() {
                    out.css('background-color', '#d9f1ec');
                    out.children().children().eq(0).css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15green.png)').find('.p').css('color', '#666666').find('span').css('color', '#ffba00');
                    out.find('.c15btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15greenbtn.jpg)').css('color', '#ffffff');
                    out.find('.c15til').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/component15/c15greentitle.jpg)').css('color', '#ffffff');
                });
                break;
            case 'componentfix1':
                $componentOption.html('<h3>颜色</h3><div class="btn" id="cf1blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="cf1red"  style="background-color: #c91523">红色</div><div class="btn" id="cf1gold" style="background-color: #eca432">金色</div><div class="btn" id="cf1green" style="background-color: #076250">绿色</div>');
                $('#cf1blue').on('click', function() {
                    out.find('.cf1btn').css({'background-image': 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/bluebtn.jpg)'});
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/bluefinger.gif)');
                    out.find('.cf1code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/bluecode.jpg').next().css('color', '#0853c3');
                });
                $('#cf1red').on('click', function() {
                    out.find('.cf1btn').css({'background-image': 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/redbtn.jpg)'});
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/redfinger.gif)');
                    out.find('.cf1code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/redcode.jpg').next().css('color', '#ca1826');
                });
                $('#cf1gold').on('click', function() {
                    out.find('.cf1btn').css({'background-image': 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/goldbtn.jpg)'});
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/goldfinger.gif)');
                    out.find('.cf1code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/goldcode.jpg').next().css('color', '#ffa200');
                });
                $('#cf1green').on('click', function() {
                    out.find('.cf1btn').css({'background-image': 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/greenbtn.jpg)'});
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/greenfinger.gif)');
                    out.find('.cf1code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/greencode.jpg').next().css('color', '#076250');
                });
                break;
            case 'componentfix2' :
                $componentOption.html('<h3>颜色</h3><div class="btn" id="cf2blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="cf2red"  style="background-color: #c91523">红色</div><div class="btn" id="cf2gold" style="background-color: #eca432">金色</div><div class="btn" id="cf2green" style="background-color: #076250">绿色</div>');
                $('#cf2blue').on('click', function() {
                    out.children().children().eq(0).find('.p').css('color', '#1752a9');
                    out.find('.cf2btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/bluebtn.jpg)');
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/bluefinger.gif)');
                    out.find('.cf2code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/bluecode.jpg').next().css('color', '#1752a9');
                });
                $('#cf2red').on('click', function() {
                    out.children().children().eq(0).find('.p').css('color', '#b80d1a');
                    out.find('.cf2btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/redbtn.jpg)');
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/redfinger.gif)');
                    out.find('.cf2code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/redcode.jpg').next().css('color', '#be101f');
                });
                $('#cf2gold').on('click', function() {
                    out.children().children().eq(0).find('.p').css('color', '#ffa200');
                    out.find('.cf2btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/goldbtn.jpg)');
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/goldfinger.gif)');
                    out.find('.cf2code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/goldcode.jpg').next().css('color', '#ffa200');
                });
                $('#cf2green').on('click', function() {
                    out.children().children().eq(0).find('.p').css('color', '#076250');
                    out.find('.cf2btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/greenbtn.jpg)');
                    out.find('.gif').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/greenfinger.gif)');
                    out.find('.cf2code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/greencode.jpg').next().css('color', '#076250');
                });
                break;
            case 'componentfix3' :
                $componentOption.html('<h3>颜色</h3><div class="btn" id="cf3blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="cf3red"  style="background-color: #c91523">红色</div><div class="btn" id="cf3gold" style="background-color: #eca432">金色</div><div class="btn" id="cf3green" style="background-color: #076250">绿色</div>');
                $('#cf3blue').on('click', function() {
                    out.find('.cf3btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/bluebtn.jpg)');
                    out.find('.cf3code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/bluecode.jpg').next().css('color', '#1752a9');
                });
                $('#cf3red').on('click', function() {
                    out.find('.cf3btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/redbtn.jpg)');
                    out.find('.cf3code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/redcode.jpg').next().css('color', '#be101f');
                });
                $('#cf3gold').on('click', function() {
                    out.find('.cf3btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/goldbtn.jpg)');
                    out.find('.cf3code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/goldcode.jpg').next().css('color', '#ffa200');
                });
                $('#cf3green').on('click', function() {
                    out.find('.cf3btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component123/greenbtn.jpg)');
                    out.find('.cf3code').attr('src', '/static/PCLandingPageComponent/staticimgs/fix-component123/greencode.jpg').next().css('color', '#076250');
                });
                break;
            case 'componentfix4':
                $componentOption.html('<h3>颜色</h3><div class="btn" id="cf4blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="cf4red"  style="background-color: #c91523">红色</div><div class="btn" id="cf4gold" style="background-color: #eca432">金色</div><div class="btn" id="cf4green" style="background-color: #076250">绿色</div>');
                $('#cf4blue').on('click', function() {
                    out.children().css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component4/blue.gif)');
                    out.find('.cf4btn').css({'background-color': '#f69b0b', 'border': '1px solid #ffff16'});
                });
                $('#cf4red').on('click', function() {
                    out.children().css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component4/red.gif)');
                    out.find('.cf4btn').css({'background-color': '#c91523', 'border': '1px solid #ff2a46'});
                });
                $('#cf4gold').on('click', function() {
                    out.children().css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component4/gold.gif)');
                    out.find('.cf4btn').css({'background-color': '#eca432', 'border': '1px solid #ffff64'});
                });
                $('#cf4green').on('click', function() {
                    out.children().css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component4/green.gif)');
                    out.find('.cf4btn').css({'background-color': '#06614F', 'border': '1px solid #0AC3A0'});
                });
                break;
            case 'component16':
                $componentOption.html('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag"><h3>颜色</h3><div class="btn" id="c16blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="c16red"  style="background-color: #c91523">红色</div><div class="btn" id="c16gold" style="background-color: #eca432">金色</div><div class="btn" id="c16green" style="background-color: #076250">绿色</div>');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                $('#c16blue').on('click', function() {
                    var obj = out.children().eq(0).children();
                    out.css('background-color', '#ebf0fa');
                    obj.eq(0).css({'border-top': '4px solid #054fa1', 'border-bottom': '2px solid #054fa1'});
                    obj.eq(1).css('color', '#1852a9');
                    obj.eq(2).css({'border-top': '4px solid #054fa1', 'border-bottom': '2px solid #054fa1'});
                });
                $('#c16red').on('click', function() {
                    var obj = out.children().eq(0).children();
                    out.css('background-color', '#fbf3f4');
                    obj.eq(0).css({'border-top': '4px solid #c91523', 'border-bottom': '2px solid #c91523'});
                    obj.eq(1).css('color', '#c91523');
                    obj.eq(2).css({'border-top': '4px solid #c91523', 'border-bottom': '2px solid #c91523'});
                });
                $('#c16gold').on('click', function() {
                    var obj = out.children().eq(0).children();
                    out.css('background-color', '#fbf8f2');
                    obj.eq(0).css({'border-top': '4px solid #5e4207', 'border-bottom': '2px solid #5e4207'});
                    obj.eq(1).css('color', '#5e4207');
                    obj.eq(2).css({'border-top': '4px solid #5e4207', 'border-bottom': '2px solid #5e4207'});
                });
                $('#c16green').on('click', function() {
                    var obj = out.children().eq(0).children();
                    out.css('background-color', '#f3fdfb');
                    obj.eq(0).css({'border-top': '4px solid #076250', 'border-bottom': '2px solid #076250'});
                    obj.eq(1).css('color', '#076250');
                    obj.eq(2).css({'border-top': '4px solid #076250', 'border-bottom': '2px solid #076250'});
                });
                break;
            case 'componentfix5':
                $componentOption.html('<h3>颜色</h3><div class="btn" id="cf5blue" style="background-color: #0550a4">蓝色</div><div class="btn" id="cf5red"  style="background-color: #c91523">红色</div><div class="btn" id="cf5gold" style="background-color: #eca432">金色</div><div class="btn" id="cf5green" style="background-color: #076250">绿色</div>');
                $('#cf5blue').on('click', function() {
                    console.log(out.find('.cf5btn'));
                    out.find('.cf5btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component5/bluebtn.jpg)');
                });
                $('#cf5red').on('click', function() {
                    out.find('.cf5btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component5/redbtn.jpg)');
                });
                $('#cf5gold').on('click', function() {
                    out.find('.cf5btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component5/goldbtn.jpg)');
                });
                $('#cf5green').on('click', function() {
                    out.find('.cf5btn').css('background-image', 'url(/static/PCLandingPageComponent/staticimgs/fix-component5/greenbtn.jpg)');
                });
                break;
            default:
                $componentOption.html('未知组件');
                $componentOption.append('<h3>侧栏tag（没有请留空）</h3><input type="text" id="com-tag">');
                $('#com-tag').val(out.attr('data-tag')).on('input propertychange', function() {
                    out.attr('data-tag', $(this).val())
                });
                break;
        }
    }
    /*RGB颜色转换为16进制*/
    function rgbto16(str) {
        if(str) {
            var temp = str.replace(/(?:||rgb\(|RGB\()*/g,"").split(",");
            var result = '#';
            for(var i=0; i<temp.length; i++) {
                temp[i] = parseInt(temp[i]);
                if(temp[i]<16) {
                    result += '0';
                }
                result += temp[i].toString(16);
            }
            return result;
        }
        else {
            return '';
        }
    }
    //更新日志
    // $('#log').on('click', function() {
    //     alert('17-07-07：部分组件新增底图黑色蒙版功能，优化用户体验\n\n17-07-05：新增轮播组件，轮播更改为可循环，修改组件默认400电话为新版\n\n17-07-04：解决换行问题\n\n17-06-27：调整分割线显示过小问题\n\n17-06-21：新增组件见间距调整功能，增添分割线组件\n\n17-06-19：合并不同颜色探头组件，改为在组件选项内操作\n\n17-06-14：添加轮播以及地图功能，添加图标右键编辑功能\n\n17-06-13：添加侧栏功能，添加图片右键编辑seo功能\n\n17-06-12：PC落地页编辑器基本功能上线，添加组件删除撤回功能，为文本、图片添加右键菜单，添加五个基本组件，每个组件有不同的选项，有左右切换、图片调整等功能');
    // });
    //调试用的方法
    // window.showtemp = function() {
    //     console.log(out);
    // }
    //提交
    $('#btn').on('click', function() {
        $('p').attr('contenteditable', 'false');
    })
});