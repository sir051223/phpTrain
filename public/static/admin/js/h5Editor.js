/**
 * Created by Tomokylelie on 2017/9/28.
 */
$(function() {

    //更新日志
    // alert('');
    //初始化
    // $('#container .inner').attr('id', 'inner');
    $('#inner .p').attr('contenteditable', true);
    // if (window.wxhtml) {
    //     if (confirm('你有尚未提交的内容，是否加载?')) {
    //         $('#container').html(window.wxhtml);
    //     }
    // }
    // 测试数据
    // window.obj = {
    //     0: '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move; z-index: 1;"> <img src="http://wx3.sinaimg.cn/mw690/a8e764e6ly1ff1aks7q83j21hc0yiqi4.jpg" style="position:absolute;top:0;left:0;cursor: move;resize: both"> </div></div>',
    //     1: '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div style="position: absolute;top: 2rem;left: 2rem;width: 2.5rem;height: 1rem;background-color: red;cursor: move;box-sizing: border-box;z-index:1"></div></div>',
    //     2: '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div class="p" contenteditable="true" style="position: absolute;top: .80rem;left: .90rem;cursor: move;box-sizing: border-box;font-size: 0.42rem;color:#999999; z-index: 1;">拖拖拖拖拖拖拖拖</div></div>'
    // };
    //缓存数组
    var ache = [
        // '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move; z-index: 1;"> <img src="http://wx3.sinaimg.cn/mw690/a8e764e6ly1ff1aks7q83j21hc0yiqi4.jpg" style="position:absolute;top:0;left:0;cursor: move;resize: both"> </div></div>',
        // '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div style="position: absolute;top: 2rem;left: 2rem;width: 2.5rem;height: 1rem;background-color: red;cursor: move;box-sizing: border-box;z-index:1"></div></div>',
        // '<div class="inner" id="inner" style="position:relative;width:7.5rem; height:100%;background-size: 100% 100%;background-color: #ffffff"><div class="p" contenteditable="true" style="position: absolute;top: .80rem;left: .90rem;cursor: move;box-sizing: border-box;font-size: 0.42rem;color:#999999; z-index: 1;">拖拖拖拖拖拖拖拖</div></div>'
    ];

    var ache_state = 0;
    window.swiper_option = {};
    // op = {
    //     direction: 'vertical',
    //     autoplay: 4000,
    //     effect: "fade",
    //     pagination: ".swiper-pagination",
    //     paginationType: "progress",
    //     scrollbar: ".swiper-scrollbar"
    // };

    //字体
    var fonts = [
        {ch: '微软雅黑', en: 'Microsoft YaHei'},
        {ch: '黑体', en: 'SimHei'},
        {ch: '宋体', en: 'SimSun'},
        {ch: '新宋体', en: 'NSimSun'},
        {ch: '仿宋', en: 'FangSong'},
        {ch: '楷体', en: 'KaiTi'},
        {ch: '微软正黑体', en: 'Microsoft JhengHei'},
        {ch: '隶书', en: 'LiSu'},
        {ch: '幼圆', en: 'YouYuan'},
        {ch: '华文细黑', en: 'STXihei'},
        {ch: '华文楷体', en: 'STKaiti'},
        {ch: '华文宋体', en: 'STSong'},
        {ch: '华文中宋', en: 'STZhongsong'},
        {ch: '华文仿宋', en: 'STFangsong'},
        {ch: '方正舒体', en: 'FZShuTi'},
        {ch: '方正姚体', en: 'FZYaoti'},
        {ch: '华文彩云', en: 'STCaiyun'},
        {ch: '华文琥珀', en: 'STHupo'},
        {ch: '华文隶书', en: 'STLiti'},
        {ch: '华文行楷', en: 'STXingkai'},
        {ch: '华文新魏', en: 'STXinwei'}
    ];
    var scale = 0.6;    //编辑器缩放
    var containerObj = document.getElementById('container');
    var temp;
    var $container = $('#container');
    var $body = $(document);
    var containerOffSetLeft = $container.offset().left;
    var containerOffSetTop = $container.offset().top;
    var $sandbox = $('#sandbox .swiper-container');
    var $sandbox_in = $sandbox.find('.swiper-wrapper');
    var $show = $('.show');
    //获取小组件
    var $smPicBtn = $('#small-pic-btn');
    var $smPicList = $('#small-pic ul');
    $smPicBtn.on('click', function() {
        $.ajax({
            url: '/Admin/Newhouse/iconList',
            success: function(data) {
                var dataLength = data.length;
                var str = '';
                for(var i = 0; i<dataLength; i++) {
                    str += '<li style="position:relative;width: ' + data[i].width + 'px;height: ' + data[i].height + 'px"><div style="overflow: hidden;position: absolute;top: 0;left: 0;width: ';
                    str = str + data[i].width/100 + 'rem;height: ';
                    str = str + data[i].height/100 + 'rem;';
                    str += 'cursor: move"> <img src="';
                    str += data[i].path;
                    str += '" style="position:absolute;top:0;left:0;cursor: move;width:100%;height:100%"></div></li>';
                }
                $smPicList.html(str);
                $('#small-pic li').on('click', function() {
                    $('#container #inner').append($(this).html());
                });
            },
            error: function() {
                alert('请求数据失败，请联系相关管理');
            }
        });
    });
    //提交按钮
    var $btn = $('#btn');
    var $infoWarp = $('.info-warp');
    //数据input
    var $fontSize = $('#font-size');
    var $width = $('#width');
    var $height = $('#height');
    var $zIndex = $('#z-index');
    var $color = $('#color');
    var $backgroundColor = $('#background-color');
    var $radius = $('#radius');
    var $top = $('#top');
    var $left = $('#left');
    var $warpList_li = $('.warp-list li');
    var $pieceContainer = $('.piece-container');
    var $components = $('.component-container li');
    var $fontFamily = $('#font-family');
    var $autotime = $('#autotime');
    var $comOpa = $('#com-opa');
    //辅助线
    var $lines = $('.lines');
    var $topLine = $('.top-line');
    var $rightLine = $('.right-line');
    var $bottomLine = $('.bottom-line');
    var $leftLine = $('.left-line');
    //等比缩放提示
    var $scaleTips = $('.scale-tips');
    //点击tag切换
    $warpList_li.on('click', function() {
        $warpList_li.removeClass('focus');
        $(this).addClass('focus');
        $pieceContainer.css('left', $(this).index() * -395 + 'px');
        $show.scrollTop(0);
    });
    $('#to-animate-btn').on('click', function() {
        bindAnimation();
    });
    //选取模板
    $components.on('click', function() {
        //清空图层信息
        $container.html($(this).html());
        $container.css({'width': $(this).children().eq(0).width()/100 + 'rem', 'height': $(this).children().eq(0).height()/100 + 'rem'});
        $container.children().attr('id', 'inner');
        $('#container #inner').children().each(function() {
            if($(this).get(0).tagName == 'P') {
                $(this).attr('contenteditable', 'true');
            }
            if($(this).hasClass('p')) {
                $(this).attr('contenteditable', 'true');
            }
        });
    });
    //上传背景图
    $('#photo').on('click', function() {
        $('#photobtn').click();
    });
    $('#photobtn').on('change', function(event) {
        event.preventDefault();
        var options = {
            success: function (data) {
                $('#container #inner').css('background-image','url("' + data.photo.full_path + '")');
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
    $('#bg-pingpu').on('click', function() {
        $('#container #inner').css({
            'background-size': '',
            'background-position': 'top left',
            'background-repeat': 'repeat'
        });
    });
    $('#bg-lashen').on('click', function() {
        $('##container inner').css({
            'background-size': 'cover',
            'background-position': 'top left'
        });
    });
    $('#bg-juzhong').on('click', function() {
        $('#container #inner').css({
            'background-size': '',
            'background-position': 'center center',
            'background-repeat': 'no-repeat'
        });
    });
    //选择背景颜色
    $('#bg-color-btn').on('click', function() {
        $('#bg-color').click();
    });
    $('#bg-color').on('change', function() {
        var $inner = $('#container #inner');
        $inner.css('background-color', $(this).val());
    });
    //清除背景图片以及颜色
    $('#clearphoto').on('click', function() {
        var $inner = $('#container #inner');
        $inner.css({'background-image': '', 'background-color': 'transparent'});
    });
    //添加图片
    $('#addPic').on('click', function() {
        // $inner.html($inner.html() + '<div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move"> <img src="http://wx3.sinaimg.cn/mw690/a8e764e6ly1ff1aks7q83j21hc0yiqi4.jpg" style="position:absolute;top:0;left:0;cursor: move"></div>');
        $('#pic-btn').click();
    });
    $('#pic-btn').on('change', function(event) {
        event.preventDefault();
        var options = {
            success: function (data) {
                var $inner = $('#container #inner');
                var img = new Image();
                img.src = data.photo.full_path;
                $(img).on('load', function() {
                    $(this).css({'position': 'absolute', 'top': '0', 'left': '0'});
                    $inner.append($('<div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move;z-index: 1;" origin-z="1"></div>').append(img));
                    $(this).attr('origin-h', $(this).height()/100);
                    $(this).attr('origin-w', $(this).width()/100);
                });
            }
        };
        $("#form-pic").ajaxForm(options);
        $('#sub-pic').click();
    });
    //正中辅助线
    // $('#middle-btn').on('click', function() {
    //     $('.fuzhu').toggle();
    // });
    $container.on('mousedown', function(event) {
        // event.preventDefault();
        bindingDefault(event);
    });
    $body.on('mouseup', function(e) {
        $body.off('mousemove');
        $lines.hide();
    });
    //添加文本
    $('#addText-btn').on('click', function() {
        var $inner = $('#container #inner');
        $inner.append('<div class="p" contenteditable="true" style="position: absolute;top: .50rem;left: .50rem;cursor: move;box-sizing: border-box;font-size: 0.42rem;z-index:1;color:#999999;" origin-z="1">拖拖拖拖拖拖拖拖</div>');
    });
    //添加色块
    $('#addDiv-btn').on('click', function() {
        var $inner = $('#container #inner');
        $inner.append('<div style="position: absolute;top: 2rem;left: 2rem;width: 2.5rem;height: 1rem;background-color: red;cursor: move;box-sizing: border-box;z-index:1" origin-z="1"></div>');
    });
    //样式按钮
    $('#left-btn').on('click', function() {
        temp.style.textAlign = 'left';
    });
    $('#center-btn').on('click', function() {
        temp.style.textAlign = 'center';
    });
    $('#right-btn').on('click', function() {
        temp.style.textAlign = 'right';
    });
    $('#normal-btn').on('click', function() {
        temp.style.fontWeight = '';
    });
    $('#bold-btn').on('click', function() {
        temp.style.fontWeight = 'bold';
    });
    $('#hundred').on('click', function() {
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能为非图片元素设置填充');
        }
        else {
            k[0].style.width = '100%';
            k[0].style.height = '100%';
            k[0].style.top = '0';
            k[0].style.left = '0';
        }
    });
    $('#width-hundred').on('click', function() {
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能为非图片元素设置宽填充');
        }
        else {
            k[0].style.width = '100%';
            k[0].style.height = 'auto';
            k[0].style.top = '0';
            k[0].style.left = '0';
        }
    });
    $('#height-hundred').on('click', function() {
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能为非图片元素设置高填充');
        }
        else {
            k[0].style.width = 'auto';
            k[0].style.height = '100%';
            k[0].style.top = '0';
            k[0].style.left = '0';
        }
    });
    $('#origin').on('click', function() {
        // alert('此功能发现自适应功能，暂时关闭');
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能为非图片元素设置原尺寸');
        }
        else {
            if(!k[0].getAttribute('origin-h')) {
                alert('此图片组件为旧版组件，不能设置为原尺寸');
            }
            else {
                k[0].style.height = k[0].getAttribute('origin-h') + 'rem';
                k[0].style.width = k[0].getAttribute('origin-w') + 'rem';
                temp.style.height = k[0].getAttribute('origin-h') + 'rem';
                temp.style.width = k[0].getAttribute('origin-w') + 'rem';
                k[0].style.top = '0';
                k[0].style.left = '0';
            }
        }
    });
    $('#cut-pic').on('click', function() {
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能裁切非图片元素');
        }
        else {
            var $k0 = $(k[0]);
            if(!$k0.hasClass('no-origin')) {
                $k0.attr('scale', $k0.height()/$k0.width()).addClass('no-origin');
            }
            $container.off('mousedown');
            cutingPic(k[0]);
        }
    });
    $('#showall-pic').on('click', function() {
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能操作非图片元素');
        }
        else {
            var $k0 = $(k[0]);
            $(temp).css({'width': $k0.width()/100 + 'rem', 'height': $k0.height()/100 + 'rem'});
        }
    });
    $('#delete-btn').on('click', function() {
        removeElement(temp);
        $infoWarp.hide();
    });
    $comOpa.on('input propertychange', function() {
        $(temp).css('opacity', $(this).val()/100);
    });
    //h5选项
    $('#pagination').on('change', function() {
        if($(this).is(':checked')) {
            swiper_option.pagination = '.swiper-pagination';
            $sandbox.append('<div class="swiper-pagination"></div>');
        }
        else {
            swiper_option.pagination = '';
            $('.swiper-pagination').remove();
        }
    });
    $('#scrollbar').on('change', function() {
        if($(this).is(':checked')) {
            swiper_option.scrollbar = '.swiper-scrollbar';
            $sandbox.append('<div class="swiper-scrollbar"></div>');
        }
        else {
            swiper_option.scrollbar = '';
            $('.swiper-scrollbar').remove();
        }
    });
    $('#button-go').on('change', function() {
        if($(this).is(':checked')) {
            swiper_option.nextButton = '.swiper-button-next';
            swiper_option.prevButton = '.swiper-button-prev';
            $sandbox.append('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
        }
        else {
            swiper_option.nextButton = '';
            swiper_option.prevButton = '';
            $('.swiper-button-prev, .swiper-button-next').remove();
        }
    });
    $('#loop').on('change', function() {
        $(this).is(':checked')?swiper_option.loop = true:swiper_option.loop = '';
    });
    $('#autoplay').on('change', function() {
        var va = 0;
        if($autotime.val()) {
            va = $autotime.val()*1000;
        }
        else {
            va = 4000;
        }
        if($(this).is(':checked')) {
            swiper_option.autoplay = va;
            $autotime.removeAttr('disabled');
        }
        else {
            delete swiper_option.autoplay;
            $autotime.attr('disabled', 'disabled');
        }
    });
    $('#vertical, #no-vertical').on('change', function() {
        swiper_option.direction = $(this).val();
    });
    $('#ef-slide, #ef-fade, #ef-cube, #ef-coverflow, #ef-flip').on('change', function() {
        swiper_option.effect = $(this).val();
    });
    $('#bullets, #progress, #fraction').on('change', function() {
        swiper_option.paginationType = $(this).val();
    });
    $autotime.on('input propertychange', function() {
        swiper_option.autoplay = $(this).val()*1000;
    });

    loadAche(window.obj, window.op);
    //同步功能
    // $('#connect').on('click', function() {
    //     $('.swiper-slide').attr({'width': '', 'height': ''});
    //     ache[ache_state] = $('#container').html();
    //     var str = '';
    //     for(var i in ache) {
    //         str += '<div class="swiper-slide">';
    //         str += ache[i];
    //         str += '</div>';
    //     }
    //     if(window.mySwiper) {
    //         window.mySwiper.removeAllSlides();
    //         window.mySwiper.destroy(true, true);
    //     }
    //     if(swiper_option.effect === 'cube' || swiper_option.effect === 'flip') {
    //         if(!$('#styletemp').length) {
    //             $('body').prepend('<style id="styletemp">.swiper-slide{visibility: hidden!important;}.swiper-slide-active{visibility: visible!important;}</style>');
    //         }
    //     }
    //     else {
    //         $('#styletemp').remove();
    //     }
    //     $sandbox_in.html(str);
    //     $('.swiper-container .temp-ani').addClass('ani');
    //     var option_temp = {};
    //     for(var key in swiper_option) {
    //         option_temp[key] = swiper_option[key];
    //     }
    //     option_temp.onInit = function(swiper) {
    //         swiperAnimateCache(swiper); //隐藏动画元素
    //         swiperAnimate(swiper); //初始化完成开始动画
    //     };
    //     option_temp.onSlideChangeEnd = function(swiper){
    //         swiperAnimate(swiper);
    //     };
    //     window.mySwiper = new Swiper ('.swiper-container', option_temp);
    // });
    //样式绑定
    $fontSize.on('input propertychange', function() {
        temp.style.fontSize = $fontSize.val()/100 + 'rem';
    });
    $width.on('input propertychange', function() {
        temp.style.width = $width.val()/100 + 0.02 + 'rem';
    });
    $height.on('input propertychange', function() {
        temp.style.height = $height.val()/100 + 'rem';
    });
    $zIndex.on('input propertychange', function() {
        if($zIndex.val() < 1) {
            $zIndex.val(1);
        }
        temp.style.zIndex = $zIndex.val();
        temp.setAttribute('origin-z', $zIndex.val());
    });
    $color.on('input propertychange', function() {
        temp.style.color = $color.val();
    });
    $backgroundColor.on('input propertychange', function() {
        temp.style.backgroundColor = $backgroundColor.val();
    });
    $radius.on('input propertychange', function() {
        temp.style.borderRadius = parseInt($radius.val())/100 + 'rem';
    });
    $left.on('input propertychange', function() {
        temp.style.left = $left.val()/100 + 'rem';
    });
    $top.on('input propertychange', function() {
        temp.style.top = $top.val()/100 + 'rem';
    });
    $fontFamily.on('change', function() {
        temp.style.fontFamily = $fontFamily.val();
    });
    //提交按钮
    $btn.click(function(){
        saveUpload();
    });
    //保存按钮
    $('#save').click(function () {
        save();
    });
    //预览按钮
    $('#watch').click(function(){
        watch();
    });
    //定时保存功能
    setInterval(function() {
        save();
    }, 10000);
    //字体在这里加
    addfonts(fonts);
    function addfonts(arr) {
        var str = '';
        for(var i=0; i<arr.length; i++) {
            str += '<option value="';
            str += arr[i].en;
            str += '">';
            str += arr[i].ch;
            str += '</option>';
        }
        $fontFamily.html(str);
    }
    /*RGB颜色转换为16进制*/
    function rgbto16(str) {
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
    function cutingPic(img) {
        $infoWarp.hide();
        $scaleTips.fadeIn();
        setTimeout(function() {
            $scaleTips.fadeOut();
        }, 1500);
        var $container = $('#container');
        $lines.show();
        $topLine.css('top', temp.offsetTop * scale + $container.offset().top + 'px');
        $bottomLine.css('top', temp.offsetTop * scale + $container.offset().top + temp.clientHeight * scale + 'px');
        $leftLine.css('left', temp.offsetLeft * scale + $container.offset().left + 'px');
        $rightLine.css('left', temp.offsetLeft * scale + $container.offset().left + temp.clientWidth * scale + 'px');
        temp.style.overflow = 'visible';
        img.style.opacity = '0.4';
        $(temp).append('<div id="move-temp" style="position:absolute;top:'+ (parseFloat(img.style.top) + img.clientHeight/100 - 0.15) + 'rem;left:' + (parseFloat(img.style.left) + img.clientWidth/100 - 0.15) + 'rem;width: 30px;height: 30px;border-radius: 50%;border: 1px solid black;background-color: #fff"></div>');
        var $img = $(img);
        var $movetemp = $('#move-temp');					//这个是拖动改变大小那个组件
        $img.on('mousedown', function(event) {
            event.preventDefault();
            var fx = event.clientX;
            var fy = event.clientY;
            var ftop = parseFloat($img.css('top'));
            var fleft = parseFloat($img.css('left'));
            var ttop = parseFloat($movetemp.css('top'));
            var tleft = parseFloat($movetemp.css('left'));
            $img.on('mousemove', function(e) {
                e.preventDefault();
                $img.css('top', (ftop + (e.pageY - fy)/scale) /100 +'rem');
                $img.css('left', (fleft + (e.pageX - fx)/scale) /100 +'rem');
                $movetemp.css('top', (ttop + (e.pageY - fy)/scale) /100 +'rem');
                $movetemp.css('left', (tleft + (e.pageX - fx)/scale) /100 +'rem');
            })
        });
        $img.on('mouseup', function() {
            $img.off('mousemove');
            return false;
        });
        var adjustSwitch = 0;
        $body.on('keydown', function(e) {
            if(e.keyCode == 16) {
                adjustSwitch = 1;
            }
        });
        $body.on('keyup', function(e) {
            adjustSwitch = 0;
        });
        $movetemp.on('mousedown', function(event) {
            event.preventDefault();
            var fx = event.clientX;
            var fy = event.clientY;
            var fwidth = parseFloat($img.css('width'));
            var fheight = parseFloat($img.css('height'));
            var ttop = parseFloat($movetemp.css('top'));
            var tleft = parseFloat($movetemp.css('left'));
            $body.on('mousemove', function(e) {
                e.preventDefault();
                $img.css('height', (fheight + (e.pageY - fy)/scale) /100 +'rem');
                $img.css('width', (fwidth + (e.pageX - fx)/scale) /100 +'rem');
                $movetemp.css('top', (ttop + (e.pageY - fy)/scale) /100 +'rem');
                $movetemp.css('left', (tleft + (e.pageX - fx)/scale) /100 +'rem');
                if(adjustSwitch) {
                    $img.css('height', $img.width() * $img.attr('scale')/100 + 'rem');
                }
            });
        });
        $movetemp.on('mouseup', function() {
            $body.off('mousemove');
            return false;
        });
        $body.on('mouseup', function() {
            $movetemp.remove();
            temp.style.overflow = 'hidden';
            img.style.opacity = '1';
            $body.off('mousemove');
            $body.off('mouseup');
            $img.off('mouseup');
            $img.off('mousemove');
            $img.off('mousedown');
            $container.off('mousemove');
            $container.off('mousedown');
            $body.off('keydown keyup');
            $container.on('mousedown', function(event) {
                bindingDefault(event);
            });
            $body.on('mouseup', function(e) {
                $body.off('mousemove');
                $lines.hide();
            });
        });
    }
    function bindingDefault(event) {
        $infoWarp.hide();
        if(event.target === containerObj || event.target.getAttribute('id') == 'inner') {
            if(temp) {
                temp.style.border = 'none';
            }
            return;
        }
        if(temp) {
            temp.style.border = 'none';
        }
        temp = event.target;
        if(temp.nodeName == 'IMG') {
            temp = temp.parentNode;
        }
        if($(temp).hasClass('no-temp')) {
            return;
        }
        // temp.style.border = '1px dashed black';
        showStyle(temp);
        // $infoWarp.css('top', temp.offsetTop/2 + containerOffSetTop - $infoWarp.height() - 20 + 'px');
        $infoWarp.show();
        //拖拽逻辑
        var mouseDisX = event.pageX/scale  - temp.offsetLeft - containerOffSetLeft;
        var mouseDisY = event.pageY/scale - temp.offsetTop - containerOffSetTop;
        $body.on('mousemove', function(event) {
            event.preventDefault();
            showStyle(temp);
            showlines();
            // $infoWarp.css('top', temp.offsetTop/2 + containerOffSetTop - $infoWarp.height() - 20 + 'px');
            if(temp != containerObj) {
                if(event.pageX/scale - containerOffSetLeft - mouseDisX + temp.clientWidth > $container.width()) {
                    temp.style.left = ($container.width() - temp.clientWidth)/100 + 'rem';
                }
                else if(event.pageX/scale - containerOffSetLeft - mouseDisX < 0) {
                    temp.style.left = 0;
                }
                else {
                    temp.style.left = (event.pageX/scale - containerOffSetLeft - mouseDisX)/100 +'rem';
                }
                if(event.pageY/scale - containerOffSetTop - mouseDisY + temp.clientHeight > $container.height()) {
                    temp.style.top = ($container.height() - temp.clientHeight)/100 + 'rem';
                }
                else if(event.pageY/scale - containerOffSetTop - mouseDisY < 0) {
                    temp.style.top = 0;
                }
                else {
                    temp.style.top = (event.pageY/scale - containerOffSetTop - mouseDisY)/100 + 'rem';
                }
            }
        });
    }
    function removeElement(_element){
        var _parentElement = _element.parentNode;
        if(_parentElement){
            _parentElement.removeChild(_element);
        }
    }
    function showStyle(temp) {
        if(temp == containerObj) {
            return;
        }
//        $infoWarp.html('<input type="button" value="删除" id="delete-btn"><label for="left">左边距</label><input type="number" name="left" id="left"><label for="top">上边距</label><input type="number" name="top" id="top"><label for="font-size">字体大小</label><input type="number" name="font-size" id="font-size"> <label for="width">宽度</label><input type="number" name="width" id="width"><label for="height">高度</label><input type="number" name="height" id="height"><br><label for="z-index">层叠高度</label><input type="number" name="z-index" id="z-index"><label for="color">字体颜色</label><input type="text" name="color" id="color" style="width: 80px"><input type="button" value="左对齐" id="left-btn"><input type="button" value="居中" id="center-btn"><input type="button" value="右对齐" id="right-btn"><input type="button" value="正常" id="normal-btn"><input type="button" value="加粗" id="bold-btn"><br><label for="background-color">背景颜色</label><input type="text" name="background-color" id="background-color"><label for="radius">圆角</label><input type="number" name="radius" id="radius"><input type="button" value="填充" id="hundred"><input type="button" value="宽填充" id="width-hundred"><input type="button" value="高填充" id="height-hundred"><input type="button" value="原尺寸" id="origin"><input type="button" value="裁切" id="cut-pic">');
        $width.val(temp.clientWidth);
        $height.val(temp.clientHeight);
        if(temp.style.color) {
            $color.val(rgbto16(temp.style.color));
        }
        $backgroundColor.val(rgbto16(temp.style.backgroundColor));
        if(temp.style.borderRadius) {
            $radius.val(parseInt(temp.style.borderRadius));
        }
        if(temp.style.fontSize) {
            $fontSize.val(Math.floor(parseFloat(temp.style.fontSize)*100));
        }
        if(temp.style.zIndex) {
            $zIndex.val(temp.style.zIndex);
        }
        $left.val(parseFloat(temp.style.left)*100);
        $top.val(parseFloat(temp.style.top)*100);
        $fontFamily.val(temp.style.fontFamily);
        $comOpa.val($(temp).css('opacity')*100);
    }
    function showlines() {
        var $container = $('#container');
        $lines.show();
        $topLine.css('top', temp.offsetTop * scale + $container.offset().top + 'px');
        $bottomLine.css('top', temp.offsetTop * scale + $container.offset().top + temp.clientHeight * scale + 'px');
        $leftLine.css('left', temp.offsetLeft * scale + $container.offset().left + 'px');
        $rightLine.css('left', temp.offsetLeft * scale + $container.offset().left + temp.clientWidth * scale + 'px');
    }
    function bindPageFunc() {
        var $pagePieces = $('.page-pieces');
        $pagePieces.each(function(index) {
            $(this).attr('data-count', index);
            $(this).find('.pages-change').off('click').on('click', function() {
                var $inner = $('#container');
                ache[ache_state] = $inner.html();
                $pagePieces.removeClass('focus').eq(index).addClass('focus');
                $pagePieces.eq(ache_state).find('.pages-content').html(ache[ache_state]);
                ache_state = index;
                $inner.html(ache[ache_state]);
                $pagePieces.find('.pages-content .inner').removeAttr('id');
                bindAnimation();
                // console.log(ache_state);
            });
            $(this).find('.pages-copy').off('click').on('click', function() {
                var $inner = $('#container');
                ache[ache_state] = $inner.html();
                $('#pages-add').click();
                ache[ache.length-1] = ache[$(this).parent().parent().data('count')];
                $('.page-pieces').eq(ache.length-1).find('.pages-content').html(ache[ache.length-1]);
            });
            $(this).find('.pages-delete').off('click').on('click', function() {
                if($pagePieces.length == 1) {
                    alert('只剩一个啦');
                    return;
                }
                if(!confirm('确定要删除这一页吗？')) {
                    return;
                }
                if(ache_state == index) {
                    ache_state = 0;
                    $(this).parent().parent().remove();
                    $('.page-pieces').eq(0).addClass('focus');
                }
                if(ache_state > index) {
                    ache_state--;
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).parent().parent().remove();
                }
                ache.splice($(this).parent().parent().data('count'), 1);
                $('#container').html(ache[ache_state]);
                bindPageFunc();
                // console.log(ache_state);
            });
        });
    }
    function bindAnimation() {
        var $animateList = $('#animate-list');
        var str = '';
        var objs = $('.container .inner').children();
        objs.each(function() {
            str += '<li><h4>动画效果名称</h4><input type="text" placeholder="请填写动画名称" class="ani-name" value="' + $(this).attr('swiper-animate-effect') + '"><h4>动画持续时间(秒)</h4><input type="number" placeholder="请填写持续时间" class="ani-dur" value="' + parseFloat($(this).attr('swiper-animate-duration')) + '"><h4>动画延迟时间(秒)</h4><input type="number" placeholder="请填写延迟时间" class="ani-delay" value="' + parseFloat($(this).attr('swiper-animate-delay')) + '"></li>';
        });
        $animateList.html(str);
        //动画目标效果
        $('#animate-list li').on('mouseover', function() {
            $('.container .inner').children().removeClass('animate-focus').eq($(this).index()).addClass('animate-focus');
        }).on('mouseout', function() {
            $('.container .inner').children().removeClass('animate-focus');
        });
        //绑定输入事件
        $('.ani-name').on('input propertychange', function() {
            objs.eq($(this).parent().index()).attr('swiper-animate-effect', $(this).val());
            if($(this).val()) {
                objs.eq($(this).parent().index()).addClass('temp-ani');
            }
            else {
                objs.eq($(this).parent().index()).removeClass('temp-ani');
            }
        });
        $('.ani-dur').on('input propertychange', function() {
            objs.eq($(this).parent().index()).attr('swiper-animate-duration', $(this).val() + 's');
        });
        $('.ani-delay').on('input propertychange', function() {
            objs.eq($(this).parent().index()).attr('swiper-animate-delay', $(this).val() + 's');
        });
    }
    function saveUpload() {
        ache[ache_state] = $('#container').html();
        var uploadJson = {};
        for(var i in ache) {
            uploadJson[i] = ache[i];
        }
        delete window.swiper_option.onInit;
        delete window.swiper_option.onSlideChangeEnd;
        console.log(swiper_option.autoplay);
        $.post('/Admin/Scene/content', {id:id, content:uploadJson, configure:swiper_option}, function (data) {
            alert(data.info);
            if (data.status == 1) {
                location.href = data.url;
            }
        });
    }
    function save() {
        ache[ache_state] = $('#container').html();
        var uploadJson = {};
        for(var i in ache) {
            uploadJson[i] = ache[i];
        }
        delete window.swiper_option.onInit;
        delete window.swiper_option.onSlideChangeEnd;

        $.post('/Admin/Scene/content', {id:window.id, content:uploadJson, configure:swiper_option}, function (data) {
            if (data.status == 1) {
                layer.msg('保存成功');
            }
        });
    }
    function watch() {
        var html = $('#container').html();
        $.post('/Admin/Scene/qrcode', {'id': window.id, 'pid':window.pid}, function(data){
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
    function loadAche(obj, option) {
        if(option === null) {
            option = {};
        }
        if(obj === null) {
            obj = ['<div id="inner" class="inner" style="position: relative;width: 7.5rem;height: 100%;background-size: 100%;background-color: transparent;background-repeat: no-repeat"></div>'];
        }
        for(var key in obj) {
            ache[key] = obj[key];
        }
        $('#container').html(ache[0]);
        var $pageWarp = $('.pages-warp').html(' <h2>分页管理</h2> <div class="page-pieces focus" data-count="0"><div class="pages-content">' + ache[0] + '</div> <p> <input type="button" value="复制" class="pages-copy"> <input type="button" value="删除" class="pages-delete"> </p><div class="pages-change"></div> </div>');
        for(var i=1; i<ache.length;i++) {
            $pageWarp.append('<div class="page-pieces" data-count="' + i + '"><div class="pages-content">' + ache[i] + '</div> <p> <input type="button" value="复制" class="pages-copy"> <input type="button" value="删除" class="pages-delete"> </p><div class="pages-change"></div> </div>');
        }
        $pageWarp.append('<input type="button" value="加一页" id="pages-add">');
        bindAnimation();
        window.swiper_option = option;
        if(window.swiper_option.autoplay) {
            $autotime.val(window.swiper_option.autoplay/1000);
            $('#autoplay').click();
        }
        else {
            $autotime.attr('disabled', 'disabled');
        }
        if(window.swiper_option.nextButton) {
            $('#button-go').click();
        }
        if(window.swiper_option.scrollbar) {
            $('#scrollbar').click();
        }
        if(window.swiper_option.pagination) {
            $('#pagination').click();
        }
        if(window.swiper_option.loop) {
            $('#loop').click();
        }
        if(window.swiper_option.direction == 'vertical') {
            $('#vertical').click();
        }
        if(window.swiper_option.effect == 'fade') {
            $('#ef-fade').click();
        }
        if(window.swiper_option.effect == 'cube') {
            $('#ef-cube').click();
        }
        if(window.swiper_option.effect == 'flip') {
            $('#ef-flip').click();
        }
        if(window.swiper_option.paginationType == 'fraction') {
            $('#fraction').click();
        }
        if(window.swiper_option.paginationType == 'progress') {
            $('#progress').click();
        }
        window.swiper_option.onInit =  function(swiper) {
            swiperAnimateCache(swiper);
            swiperAnimate(swiper);
        };
        window.swiper_option.onSlideChangeEnd= function(swiper){
            swiperAnimate(swiper);
        };
        //页数控制
        bindPageFunc();
        $('#pages-add').on('click', function() {
            $(this).before('<div class="page-pieces"><div class="pages-content"></div> <p><input type="button" value="复制" class="pages-copy"> <input type="button" value="删除" class="pages-delete"> </p><div class="pages-change"></div> </div>');
            ache.push('<div id="inner" class="inner" style="position: relative;width: 7.5rem;height: 100%;background-size: 100%;background-color: transparent;background-repeat: no-repeat"></div>');
            bindPageFunc();
        });
    }
});