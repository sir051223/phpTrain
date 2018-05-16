/**
 * Created by Tomokylelie on 2017/6/8.
 */
$(function() {
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
    var $iconfontRight = $('.iconfont-right');
    var $iconfontColor = $('#iconfont-color');
    var $iconfontDelete = $('#iconfont-delete');
    var $selectedKuang = $('#selected-kuang');
    var $tempCode = $('#temp-code');
    var $inputRight = $('#inp-right');
    var $inpPhInpu = $('#inp-ph-btn');
    var $placeholderInp = $('#inp-placehoder');
    var $bottomComponents = $('.bottom-component').find('li');
    var $noBottomComponent = $('#no-bottom-component');
    var $swiperPicUp = $('#swiper-pic-btn');
    var $subSwi = $('#sub-swiper');
    // 读取缓存
    if (window.cache) {
        if (confirm('你有尚未提交的内容,是否加载？')) {
            $('#editor').html(window.cache);
        } else {
            $('#editor').html(window.content);
        }
    } else {
        $('#editor').html(window.content);
    }
    $editor.prepend('<img src="" style="display:block;width: 100%" class="headimg">');
    var $headImg = $('.headimg').attr('src', window.headImg);
    alert('17-10-30：新增底部浮动组件四个\n\n17-09-15：新增合推组件\n\n17-09-04：添加新轮播组件\n\n17-08-29：完成开发，上线\n\n');
    //预处理
    $('.component').css({'background-position': 'top center', 'background-repeat': 'no-repeat', 'position': 'relative'});
    $('#editor .p').attr('contenteditable', true);
    $('.component3 ul').remove();
    $('.component').each(function() {
        $(this).addClass($(this).data('type'));
    });
    if($('.body-bottom-component').length) {
        $('.bottom-component li').eq($('#editor .body-bottom-component').data('type')).addClass('focus');
    }
    //检测是否pc跳转拨打页面
    if(phptype) {
        $('.headimg').remove();
    }
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
            out.css('margin-top', $(this).val()/100 + 'rem');
        }
    });
    $marBottom.on('input propertychange', function() {
        if(out) {
            out.css('margin-bottom', $(this).val()/100 + 'rem');
        }
    });
    $padTop.on('input propertychange', function() {
        if(out) {
            out.css('padding-top', $(this).val()/100 + 'rem');
        }
    });
    $padBottom.on('input propertychange', function() {
        if(out) {
            out.css('padding-bottom', $(this).val()/100 + 'rem');
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
            $headImg.remove();
            deletetempall = $editor.html();
            $editor.html('').append($headImg);
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
            $editor.html('').append($headImg).append(deletetempall);
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
    //编辑组件代码按钮
    $('#update-component-code').on('click', function() {
        out.html($tempCode.val());
    });
    //选取底部组件
    $bottomComponents.on('click', function() {
        $bottomComponents.removeClass('focus');
        $editor.find('.body-bottom-component').remove();
        $editor.append($(this).addClass('focus').html());
        $editor.find('.body-bottom-component').hide();
    });
    $noBottomComponent.on('click', function() {
        $bottomComponents.removeClass('focus');
        $editor.find('.body-bottom-component').remove();
    });
    //轮播选择 {
    var $mySwipers = $('.my-swiper-container img');
    $mySwipers.on('click', function() {
        if($('.' + $(this).data('type')).length > 0) {
            alert('不能多次使用相同的轮播组件');
            return;
        }
        if(out) {
            out.after('<section style="width: 7.5rem;padding: .4rem 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 7.5rem;margin: 0 auto;display: block"></section>');
        }
        else {
            $editor.append('<section style="width: 7.5rem;padding: .4rem 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="width: 7.5rem;margin: 0 auto;display: block"></section>');
        }
    });
    //右键菜单
    $editor.bind("contextmenu", function(e){
        temp = e.target;
        if($(temp).hasClass('p')) {
            $pRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
            $colorFont.val(rgbto16(e.target.style.color));
        }
        if(e.target.nodeName == 'IMG') {
            if($(temp).hasClass('ex-img') || $(temp).hasClass('headimg')) {
                return;
            }
            $imgRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
        }
        if($(temp).hasClass('iconfont')) {
            $iconfontRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
            $iconfontColor.val(rgbto16(e.target.style.color));
        }
        if(e.target.nodeName == 'INPUT') {
            $inputRight.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
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
    //改变输入框提示词
    $inpPhInpu.on('click', function(e) {
        $placeholderInp.css({'left': e.pageX + 'px', 'top': e.pageY + 'px'}).show();
        $inputRight.hide();
    });
    $placeholderInp.on('input propertychange', function() {
       $(temp).attr('placeholder', $(this).val());
    });
    //分割线选择
    var $lines = $('.line-container img');
    $lines.on('click', function() {
        if(out) {
            out.after('<section style="width: 100%;margin: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="display: block;width: 100%"></section>');
        }
        else {
            $editor.append('<section style="width: 100%;margin: 40px 0" class="component ' + $(this).data('type') + '" data-type="' + $(this).data('type') + '"><img class="ex-img" src="' + $(this).attr('src') + '" style="display: block;width: 100%;"></section>');
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
        $pRight.hide();
        $imgRight.hide();
        $inputRight.hide();
        $seoImgInp.hide();
        $iconfontRight.hide();
        $placeholderInp.hide();
        showCode();
        $marTop.val(parseFloat(out.get(0).style.marginTop)*100);
        $marBottom.val(parseFloat(out.get(0).style.marginBottom)*100);
        $padTop.val(parseFloat(out.get(0).style.paddingTop)*100);
        $padBottom.val(parseFloat(out.get(0).style.paddingBottom)*100);
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
                $selectedKuang.css({'top': out.offset().top, 'width': out.outerWidth(), 'height': out.outerHeight()}).fadeIn(300).fadeOut(300);
            }, 200);
        });
        $body.on('mouseup', function(e) {
            out.css('opacity', '1');
            $body.off('mousemove mouseup');
            $editor.off('mouseup');
        });
    }
    function showCode() {
        try {
            if(!out.data('type').match(/^component|line/)) {
                $tempCode.val('此组件不能编辑');
                return;
            }
            $tempCode.val(out.html());
        }
        catch (e) {}
    }
    //读取组件功能
    function loadComponentOption(str) {
        switch(str) {
            case 'component1': case 'component2':
                $componentOption.html('<h3>推荐主题颜色</h3>');
                $componentOption.append('<div class="btn c1color" style="background-color: #003c41" data-tc="#003c41" data-bc="#00a7af" data-sc="#00a7af">绿色</div>');
                $componentOption.append('<div class="btn c1color" style="background-color: #c91523" data-tc="#c91523" data-bc="#c91523" data-sc="#ffa800">红色</div>');
                $componentOption.append('<div class="btn c1color" style="background-color: #f1c791" data-tc="url(/static/PortableLandingPageComponent/example_img/gold_img.jpg)" data-bc="url(/static/PortableLandingPageComponent/example_img/gold_btn.jpg)" data-sc="#9a624a">金色</div>');
                $componentOption.append('<div class="btn c1color" style="background-color: #002153" data-tc="#002153" data-bc="#ffa800" data-sc="#ffa800">蓝色</div>');
                $componentOption.append('<h3>嘉玲诚意推荐内嵌高度，应该不会挡到电话按钮</h3><div class="btn" id="recommendmargin">应用</div>');
                $componentOption.append('<h3>背景颜色</h3>');
                $componentOption.append('<div class="btn c1bgcolor" data-c="rgba(0, 0, 0, 0.6)">透明黑</div>');
                $componentOption.append('<div class="btn c1bgcolor" data-c="rgba(255, 255, 255, 0.5)">透明白</div>');
                $componentOption.append('<div class="btn c1bgcolor" data-c="transparent">透明</div>');
                $componentOption.append('<h3>自定义颜色</h3>');
                $componentOption.append('<h5>头部颜色</h5><input type="color" id="s1DiyTitle">');
                $componentOption.append('<h5>数字背景颜色</h5><input type="color" id="s1Diyspan">');
                $componentOption.append('<h5>拨打按钮颜色</h5><input type="color" id="s1dail">');
                $componentOption.append('<h5>按钮颜色</h5><input type="color" id="s1DiyBtn">');
                $componentOption.append('<h3>圆角</h3><div class="btn" id="c1radiu">圆角</div><div class="btn" id="c1noradiu">清除圆角</div>');
                var $s1DiyTitle = $('#s1DiyTitle');
                var $s1Diyspan = $('#s1Diyspan');
                var $s1DiyBtn = $('#s1DiyBtn');
                var $s1Dial = $('#s1dail');
                $s1DiyTitle.val(rgbto16(out.find('.p').eq(0).css('background')));
                $s1Diyspan.val(rgbto16(out.find('span').css('background')));
                $s1DiyBtn.val(rgbto16(out.find('.p').eq(1).css('background')));
                $s1Dial.val(rgbto16(out.find('.allphonebtn').css('color')));
                $('.c1color').on('click', function() {
                    out.find('.p').eq(0).css({'background': $(this).data('tc'), 'background-size': '100% 100%'}).find('span').css('background', $(this).data('sc'));
                    $s1DiyTitle.val($(this).data('tc'));
                    $s1Diyspan.val($(this).data('sc'));
                    out.find('.p').eq(1).css({'background': $(this).data('bc'), 'background-size': '100% 100%'});
                    $s1DiyBtn.val($(this).data('bc'));
                });
                $('.c1bgcolor').on('click', function() {
                    out.children().eq(0).css({'background': $(this).data('c')});
                });
                $s1DiyTitle.on('change', function() {
                    out.find('.p').eq(0).css('background', $(this).val())
                });
                $s1Diyspan.on('change', function() {
                    out.find('span').css('background', $(this).val())
                });
                $s1DiyBtn.on('change', function() {
                    out.find('.p').eq(1).css('background', $(this).val())
                });
                $('#c1radiu').on('click', function() {
                    out.children().eq(0).css('border-radius', '0.08rem').find('.p').css('border-radius', '0.08rem');
                    out.find('input').css('border-radius', '0.08rem');
                    out.find('.allphonebtn').css('border-radius', '0.08rem');
                });
                $('#c1noradiu').on('click', function() {
                    out.children().eq(0).css('border-radius', '0').find('.p').css('border-radius', '0');
                    out.find('input').css('border-radius', '0');
                    out.find('.allphonebtn').css('border-radius', '0');
                });
                $('#recommendmargin').on('click', function() {
                    out.css('margin-top', '-4.2rem');
                });
                $s1Dial.on('change', function() {
                    out.find('.allphonebtn').css({'border': '1px solid '+$(this).val(), color: $(this).val()}).find('.iconfont').css('color', $(this).val());
                });
                break;
            case 'component8': case 'component10':
                $componentOption.html('<h3>关联项目</h3>');
                var optionStr = '<select id="proselect">';
                var now;
                for(var i in window.prolist) {
                    optionStr += '<option value = ' + i + '>' + prolist[i].name  +'</option>';
                    if(out.find('.btn').attr('lid') == prolist[i].lid) {
                        now = i;
                    }
                }
                optionStr += '</select>';
                $componentOption.append(optionStr);
                $componentOption.append('<h3>价格显示隐藏</h3><div class="btn" id="togglePrice">显示/隐藏</div>');
                $componentOption.append('<h3>按钮颜色</h3><div class="btn c6btn" data-color="#c91523" style="background-color: #c91523">红色</div>');
                $componentOption.append('<div class="btn c6btn" data-color="#002153" style="background-color: #002153">蓝色</div>');
                $componentOption.append('<div class="btn c6btn" data-color="#00a7af" style="background-color: #00a7af">绿色</div>');
                $componentOption.append('<div class="btn c6btn" style="background-color: #f1c791" data-color="url(/static/PortableLandingPageComponent/example_img/gold_img.jpg)">金色</div>');
                $componentOption.append('<h5>自定义</h5><input type="color" id="c6btnColor">');
                $componentOption.append('<h3>按钮圆角</h3><div class="btn" id="c6radiu">圆角</div><div class="btn" id="c6noradiu">不要圆角</div>');
                $componentOption.append('<h3>文案控制</h3><div class="btn" id="c6add">增加</div><div class="btn" id="c6delete">删除</div>');
                $('#proselect').val(now).on('change', function() {
                    out.find('a').eq(0).attr('data-href', prolist[$(this).val()].url);
                    out.find('a').eq(1).attr('data-href', 'tel:' + prolist[$(this).val()]['phone_num']);
                    out.find('.btn').attr('pid', prolist[$(this).val()].pid).attr('lid', prolist[$(this).val()].lid);
                });
                $('#togglePrice').on('click', function() {
                    out.find('.price').toggle();
                });
                $('.c6btn').on('click', function() {
                    out.find('.btn').css('background', $(this).data('color')).css('background-size', '100% 100%');
                });
                $('#c6radiu').on('click', function() {
                    out.find('.btn').css('border-radius', '0.05rem');
                });
                $('#c6noradiu').on('click', function() {
                    out.find('.btn').css('border-radius', '0');
                });
                $('#c6add').on('click', function() {
                    out.find('.inp').before('<div class="p" style="float:left;margin-right: .2rem;margin-bottom:.25rem;width: 1.3rem;height: .5rem;font-size: .26rem;line-height:.5rem;text-align: center;color: #666666;background-color: #eeeeee;white-space: nowrap">通透户型</div>');
                });
                $('#c6delete').on('click', function() {
                    out.find('.inp').prev().remove();
                });
                $('#c6btnColor').val(rgbto16(out.find('.btn').css('background-color'))).on('change', function() {
                    out.find('.btn').css('background-color', $(this).val());
                });
                $('#c6btnColor').val(rgbto16(out.find('.btn').css('background-color'))).on('change', function() {
                    out.find('.btn').css('background-color', $(this).val());
                });
                break;
            case 'component11': case 'component12':
            $componentOption.html('<h3>关联项目</h3>');
            var optionStr = '<select id="proselect">';
            var now;
            for(var i in window.prolist) {
                optionStr += '<option value = ' + i + '>' + prolist[i].name  +'</option>';
                if(out.find('.btn').attr('lid') == prolist[i].lid) {
                    now = i;
                }
            }
            optionStr += '</select>';
            $componentOption.append(optionStr);
            $componentOption.append('<h3>价格显示隐藏</h3><div class="btn" id="togglePrice">显示/隐藏</div>');
            $componentOption.append('<h3>按钮颜色</h3><div class="btn c6btn" data-color="#c91523" style="background-color: #c91523">红色</div>');
            $componentOption.append('<div class="btn c6btn" data-color="#002153" style="background-color: #002153">蓝色</div>');
            $componentOption.append('<div class="btn c6btn" data-color="#00a7af" style="background-color: #00a7af">绿色</div>');
            $componentOption.append('<div class="btn c6btn" style="background-color: #f1c791" data-color="url(/static/PortableLandingPageComponent/example_img/gold_img.jpg)">金色</div>');
            $componentOption.append('<h5>自定义</h5><input type="color" id="c6btnColor">');
            $componentOption.append('<h3>按钮圆角</h3><div class="btn" id="c6radiu">圆角</div><div class="btn" id="c6noradiu">不要圆角</div>');
            $('#proselect').val(now).on('change', function() {
                out.find('a').eq(0).attr('data-href', prolist[$(this).val()].url);
                out.find('a').eq(1).attr('data-href', 'tel:' + prolist[$(this).val()]['phone_num']);
                out.find('.btn').attr('pid', prolist[$(this).val()].pid).attr('lid', prolist[$(this).val()].lid);
            });
            $('#togglePrice').on('click', function() {
                out.find('.price').toggle();
            });
            $('.c6btn').on('click', function() {
                out.find('.btn').css('background', $(this).data('color')).css('background-size', '100% 100%');
            });
            $('#c6radiu').on('click', function() {
                out.find('.btn').css('border-radius', '0.05rem');
            });
            $('#c6noradiu').on('click', function() {
                out.find('.btn').css('border-radius', '0');
            });
            $('#c6btnColor').val(rgbto16(out.find('.btn').css('background-color'))).on('change', function() {
                out.find('.btn').css('background-color', $(this).val());
            });
            $('#c6btnColor').val(rgbto16(out.find('.btn').css('background-color'))).on('change', function() {
                out.find('.btn').css('background-color', $(this).val());
            });
            break;
            case 'component7': case 'component9':
                $componentOption.html('<h3>关联项目</h3>');
                var optionStr = '<select id="proselect">';
                var now;
                for(var i in window.prolist) {
                    optionStr += '<option value = ' + i + '>' + prolist[i].name  +'</option>';
                    if(out.find('.btn').attr('lid') == prolist[i].lid) {
                        now = i;
                    }
                }
                optionStr += '</select>';
                $componentOption.append(optionStr);
                $componentOption.append('<h3>价格显示隐藏</h3><div class="btn" id="togglePrice">显示/隐藏</div>');
                $componentOption.append('<h3>按钮颜色</h3><div class="btn c6btn" data-color="#c91523" style="background-color: #c91523">红色</div>');
                $componentOption.append('<div class="btn c6btn" data-color="#002153" style="background-color: #002153">蓝色</div>');
                $componentOption.append('<div class="btn c6btn" data-color="#00a7af" style="background-color: #00a7af">绿色</div>');
                $componentOption.append('<div class="btn c6btn" style="background-color: #f1c791" data-color="url(/static/PortableLandingPageComponent/example_img/gold_img.jpg)">金色</div>');
                $componentOption.append('<h5>自定义</h5><input type="color" id="c6btnColor">');
                $componentOption.append('<h3>按钮圆角</h3><div class="btn" id="c6radiu">圆角</div><div class="btn" id="c6noradiu">不要圆角</div>');
                $componentOption.append('<h3>文案控制</h3><div class="btn" id="c6add">增加</div><div class="btn" id="c6delete">删除</div>');
                $('#proselect').val(now).on('change', function() {
                    out.find('a').eq(0).attr('data-href', prolist[$(this).val()].url);
                    out.find('a').eq(1).attr('data-href', 'tel:' + prolist[$(this).val()]['phone_num']);
                    out.find('.btn').attr('pid', prolist[$(this).val()].pid).attr('lid', prolist[$(this).val()].lid);
                });
                $('#togglePrice').on('click', function() {
                    out.find('.price').toggle();
                });
                $('.c6btn').on('click', function() {
                    out.find('.btn').css('background', $(this).data('color')).css('background-size', '100% 100%');
                });
                $('#c6radiu').on('click', function() {
                    out.find('.btn').css('border-radius', '0.05rem');
                });
                $('#c6noradiu').on('click', function() {
                    out.find('.btn').css('border-radius', '0');
                });
                $('#c6add').on('click', function() {
                    out.find('.inp').before('<div style="overflow:hidden;padding: .2rem 0"><div style="float:left;margin: .12rem .16rem 0;width: .12rem;height: .12rem;border-radius: 50%;background-color: #999999"></div><div class="p" style="float:left;overflow:hidden;width: 5.6rem;font-size: .26rem;color: #666666;white-space: nowrap;text-overflow: ellipsis">通透户型保证空气能够流通起来通来通来通透户型保证</div></div>');
                });
                $('#c6delete').on('click', function() {
                    out.find('.inp').prev().remove();
                });
                $('#c6btnColor').val(rgbto16(out.find('.btn').css('background-color'))).on('change', function() {
                    out.find('.btn').css('background-color', $(this).val());
                });
                break;
            case 'swiper0' :
                $componentOption.html('<h3>内容编辑</h3><div class="btn" id="s0add">加一页</div>');
                if(out.find('.swiper-slide').length) {
                    var loadstr = '';
                    out.find('.swiper-slide').each(function() {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s0img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<h6>标题</h6><input type="text" class="title" value="' + $(this).find('.title').text() + '"><h6>第一行文案（没有请留空）</h6><input type="text" class="word1" value="' + $(this).find('.word1').text() + '"><h6>第二行文案（没有请留空）</h6><input type="text" class="word2" value="' + $(this).find('.word2').text() + '"><h6>第三行文案（没有请留空）</h6><input type="text" class="word3" value="' + $(this).find('.word3').text() + '"><h6>第四行文案（没有请留空）</h6><input type="text" class="word4" value="' + $(this).find('.word4').text() + '">';

                        loadstr += '<input type="button" value="删除" class="s0delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-2);
                    });
                    binds2function();
                }
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper0').find('.swiper-slide').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s0add').on('click', function() {
                    $('.swiper0').append('<div class="swiper-slide" style="display: none"><img src="/static/PortableLandingPageComponent/example_img/750x750.jpg" style="display: block;width: 7.5rem;height: 7.5rem"><p class="title" style="padding-top:.5rem;padding-bottom: .1rem;font-size: .4rem;color: #666666;text-align: center;"></p> <div style="margin: 0 auto .3rem;width: 1.5rem;border-top: 2px solid #aaa"></div> <p class="word1" style="font-size: .28rem;line-height: 1.8;color: #999999;text-align: center"></p> <p class="word2" style="font-size: .28rem;line-height: 1.8;color: #999999;text-align: center"></p> <p class="word3" style="font-size: .28rem;line-height: 1.8;color: #999999;text-align: center"></p> <p class="word4" style="font-size: .28rem;line-height: 1.8;color: #999999;text-align: center"></p></div>');
                    var str = '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s0img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<h6>标题</h6><input type="text" class="title"><h6>第一行文案（没有请留空）</h6><input type="text" class="word1"><h6>第二行文案（没有请留空）</h6><input type="text" class="word2"><h6>第三行文案（没有请留空）</h6><input type="text" class="word3"><h6>第四行文案（没有请留空）</h6><input type="text" class="word4">';
                    str += '<input type="button" value="删除" class="s0delete"></div>';
                    $componentOption.append(str);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-2);
                    });
                    binds2function();
                });
            function binds2function() {
                $('.s0delete').off('click').on('click', function() {
                    $(this).parent().remove();
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-2);
                    });
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).remove();
                });
                $('.s0img').off('click').on('click', function() {
                    imgtemp = $(this);
                    $swiperPicUp.click();
                });
                $componentOption.find('.title').off('input propertychange').on('input propertychange', function() {
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).find('.title').text($(this).val());
                });
                $componentOption.find('.word1').off('input propertychange').on('input propertychange', function() {
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).find('.word1').text($(this).val());
                });
                $componentOption.find('.word2').off('input propertychange').on('input propertychange', function() {
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).find('.word2').text($(this).val());
                });
                $componentOption.find('.word3').off('input propertychange').on('input propertychange', function() {
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).find('.word3').text($(this).val());
                });
                $componentOption.find('.word4').off('input propertychange').on('input propertychange', function() {
                    $('.swiper0').find('.swiper-slide').eq($(this).parent().attr('count')).find('.word4').text($(this).val());
                });
            }
                break;
            case 'swiper1':
                $componentOption.html('<h3>内容编辑</h3><div class="btn" id="s1add">加一页</div>');
                if(out.find('.swiper-slide').length) {
                    var loadstr = '';
                    out.find('.swiper-slide').each(function () {
                        loadstr += '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s1img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer;background-image: url(' + $(this).find('img').attr('src') + ')"></div>';
                        loadstr += '<input type="button" value="删除" class="s1delete"></div>';
                    });
                    $componentOption.append(loadstr);
                    $componentOption.children('div').each(function () {
                        $(this).attr('count', $(this).index() - 2);
                    });
                    binds1function();
                }
                $swiperPicUp.off('change');
                $swiperPicUp.on('change', function(event) {
                    event.preventDefault();
                    var options = {
                        success: function (data) {
                            imgtemp.css('background-image', 'url(' + data.photo.full_path + ')');
                            $('.swiper1').find('.swiper-slide').eq(imgtemp.parent().attr('count')).find('img').attr('src', data.photo.full_path);
                        }
                    };
                    $("#swiper-pic-up").ajaxForm(options);
                    $subSwi.click();
                });
                $('#s1add').on('click', function() {
                    $('.swiper1').append('<div class="swiper-slide" style="display: none"><img src="/static/PortableLandingPageComponent/example_img/750x750.jpg" style="display: block;width: 7.5rem;"></div>');
                    var str = '<div style="margin-bottom: 20px;"><h6>图片</h6><div class="s1img" style="width: 80px;height: 80px;border: 1px solid #000000;background-size: 100% 100%;cursor: pointer"></div>';
                    str += '<input type="button" value="删除" class="s1delete"></div>';
                    $componentOption.append(str);
                    $componentOption.children('div').each(function() {
                        $(this).attr('count', $(this).index()-2);
                    });
                    binds1function();
                });
                function binds1function() {
                    $('.s1delete').off('click').on('click', function() {
                        $(this).parent().remove();
                        $componentOption.children('div').each(function() {
                            $(this).attr('count', $(this).index()-2);
                        });
                        $('.swiper1').find('.swiper-slide').eq($(this).parent().attr('count')).remove();
                    });
                    $('.s1img').off('click').on('click', function() {
                        imgtemp = $(this);
                        $swiperPicUp.click();
                    });
                }
                break;
            default:
                $componentOption.html('未知组件');
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
    //提交
    $('#btn').on('click', function() {
        //检测是否关联好项目
        var $as = $('#editor a');
        for(var ai=0;ai<$as.length;ai++) {
            if(!$as.eq(ai).data('href')) {
                alert('仍有需要关联项目的组件未关联项目，请检查');
                return;
            }
        }
        //end
        $('.p').attr('contenteditable', 'false');
        var htmlobj = $('#editor').clone();
        htmlobj.find('.headimg').remove();
        var html = htmlobj.html();
        $.post('/Admin/Visit/wxEditor', {'id':window.id, 'content':html, 'templet':'new'}, function(data){
            alert(data.info);
            location.href = data.url;
        });
    });
    //保存
    $('#save, #watch').click(function(){
        $('.p').attr('contenteditable', 'false');
        var val = $(this).attr('id');
        var type = $(this).attr('type');
        save(val, type);
    });
    function save(val, type) {
        var htmlobj = $('#editor').clone();
        htmlobj.find('.headimg').remove();
        var html = htmlobj.html();
        if (!html) {
            return;
        }
        if (val == 'save') {
            $.post('/Admin/Visit/weCache', {'page_id':id, 'content':html, 'type':1}, function(data){
                layer.msg('保存成功');
            });
        } else {
            $.post('/Admin/Visit/qrcode', {'pid':id}, function(data){
                $('#qrcode').find('img').attr('src', '/'+data.info);
                setTimeout(function(){
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        area: '320px',
                        shadeClose: true,
                        content: $('#qrcode')
                    });
                }, 100);
            });
        }

    }
    //提交
    $('#pc-btn').on('click', function() {
        //end
        $('.p').attr('contenteditable', 'false');
        var htmlobj = $('#editor').clone();
        htmlobj.find('.headimg').remove();
        var html = htmlobj.html();
        $.post('/Admin/Visit/callEditor', {'id':window.id, 'qrcode_html':html}, function(data){
            alert(data.info);
            location.href = data.url;
        });
    });
    //定时保存
    // setInterval(function() {
    //     save('save');
    // }, 10000);
});