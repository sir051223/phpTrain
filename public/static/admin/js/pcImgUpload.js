/**
 * Created by Tomokylelie on 2017/4/28.
 */
$(function() {
    //更新日志
    alert('17-10-09:新增组件大小贴合图片功能\n\n17-9-28:修复原尺寸功能问题\n\n17-08-09：编辑器直接将编辑结果生成为图片了，解决不同终端配置不同问题\n\n17-08-04：小组件库添加大量组件，底色修改，为了看到组件，有点丑。。\n\n17-08-01：暂时解决插入图片自适应问题，关闭图片原尺寸功能，默认宽填充\n\n17-07-25: 解决文字不能换行问题，但是之前做好的文字仍然不能换行，需要删除后再添加才可以，取消日志按钮\n\n17-06-14：debug and 添加提示所在图层功能，提升用户体验\n\n17-06-13：背景颜色选取方式改为取色板\n\n17-06-12：用户体验优化\n\n17-06-08：添加正中辅助线功能\n\n17-06-05：新增查看更新日志功能，可以查看编辑器的各种更新了\n\n17-06-02：解决更新图层功能后文案不能编辑功能');
    alert('17-06-01：调整图层功能：锁定，之前对图层功能理解有偏差，现在可以看到被隐藏的图层了，注意：删除图层会删除此图层上的元素\n\n17-05-28：新增图片等比缩放功能，进入裁切功能后，按着左shift拖动缩放能使图片等比缩放，但是会出现拖动圆点不在图片右下角的小问题，照常拖动那个圆点改变图片大小就好\n\n17-05-23：新增小组件功能\n\n17-05-19：新增图层功能\n\n17-05-16：添加字体选择功能，更新字体颜色选择功能为选色板，调整编辑面板大小，解决模板高度不符合规定问题\n\n17-05-12：调整头图尺寸至640*960，解决产出页面可编辑问题\n\n17-05-02：添加加载头图模板功能\n\n17-04-28：新增移动端头图编辑器，拥有基本功能\n\n');
    //初始化
    $('#container #inner').children().each(function() {
        if(!$(this).hasClass('new170601-z')) {
            $(this).css('z-index', parseInt($(this).css('z-index')) + 1).addClass('new170601-z');
        }
        $(this).attr('origin-z', $(this).css('z-index'));
    });
    $('#container .inner').attr('id', 'inner');
    $('#inner p').attr('contenteditable', true);
    $('#inner .p').attr('contenteditable', true);
    if (window.wxhtml) {
        if (confirm('你有尚未提交的内容，是否加载?')) {
            $('#container').html(window.wxhtml);
        }
    }
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
    var scale = 0.65;    //编辑器缩放
    var containerObj = document.getElementById('container');
    var temp;
    var $container = $('#container');
    var $body = $(document);
    var containerOffSetLeft = $container.offset().left;
    var containerOffSetTop = $container.offset().top;
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
                    $('#inner').append($(this).html());
                });
            },
            error: function() {
                alert('请求数据失败，请联系相关管理');
            }
        });
    });
    //图层数组
    var tucengArr = [];
    //图层相关变量
    var $allTuceng = $('#all-tuceng');
    var $addTuceng = $('#add-tuceng');
    var tucengState = 1;
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
    });
    //选取模板
    $components.on('click', function() {
        //清空图层信息
        $addTuceng.parent().find('li').remove();
        tucengArr = [];
        $container.html($(this).html());
        $container.css({'width': $(this).children().eq(0).width()/100 + 'rem', 'height': $(this).children().eq(0).height()/100 + 'rem'});
        $container.children().attr('id', 'inner');
        $('#inner').children().each(function() {
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
                $('#inner').css('background-image','url("' + data.photo.full_path + '")');
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
        $('#bg-color').click();
    });
    $('#bg-color').on('change', function() {
        var $inner = $('#inner');
        $inner.css('background-color', $(this).val());
    });
    //清除背景图片以及颜色
    $('#clearphoto').on('click', function() {
        var $inner = $('#inner');
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
                var $inner = $('#inner');
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
    $('#middle-btn').on('click', function() {
        $('.fuzhu').toggle();
    });
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
        var $inner = $('#inner');
        $inner.append('<div class="p" contenteditable="true" style="position: absolute;top: .50rem;left: .50rem;cursor: move;box-sizing: border-box;font-size: 0.42rem;z-index:1;color:#999999;" origin-z="1">拖拖拖拖拖拖拖拖</div>');
    });
    //添加色块
    $('#addDiv-btn').on('click', function() {
        var $inner = $('#inner');
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
    //图层按钮
    $addTuceng.on('click', function() {
        var $inner = $('#inner');
        if(!tucengArr[0]) {
            $addTuceng.before('<li><input type="button" value="2" class="tuceng-num"><input type="button" value="删除" class="tuceng-delete"></li>');
            tucengArr[0] = [];
            $inner.children().each(function() {
                tucengArr[0].push($(this));
            });
            tucengArr[1] = [];
            // $inner.html('');
            checkToTuceng(2);
            bindTucengFunc();
        }
        else {
            $addTuceng.before('<li><input type="button" value="' + (tucengArr.length + 1) + '" class="tuceng-num"><input type="button" value="删除" class="tuceng-delete"></li>');
            tucengArr.push([]);
            // tucengArr[tucengState-1] = $inner.html();
            $inner.children().each(function() {
                if($(this).hasClass('no-temp')) {
                    return;
                }
                else {
                    tucengArr[tucengState-1].push($(this));
                }
            });
            checkToTuceng(tucengArr.length);
            // $inner.html('');
            bindTucengFunc();
        }
    });
    $allTuceng.on('click', function() {
        if(tucengState) {
            tucengArr[tucengState-1] = [];
            $('#inner').children().each(function() {
                if($(this).hasClass('no-temp')) {
                    return;
                }
                else {
                    tucengArr[tucengState-1].push($(this));
                }
            });
        }
        $('#container #inner').children().each(function() {
            $(this).removeClass('no-temp');
            $(this).css('opacity', '1');
            $(this).css('z-index', $(this).attr('origin-z'));
        });
        tucengState = 0;
    });
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
        temp.style.borderRadius = parseInt($radius.val()) + '%';
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
    //改变头图尺寸
    $('#size1206').on('click', function() {
        $container.css({'width': '7.5rem', 'height': '12.06rem'});
        $('#inner').css({'width': '7.5rem', 'height': '12.06rem'});
    });
    $('#size804').on('click', function() {
        $container.css({'width': '7.5rem', 'height': '8.04rem'});
        $('#inner').css({'width': '7.5rem', 'height': '8.04rem'});
    });
    //提交按钮
    $btn.click(function(){
        saveImgandUpload();
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
    }
    function showlines() {
        var $container = $('#container');
        $lines.show();
        $topLine.css('top', temp.offsetTop * scale + $container.offset().top + 'px');
        $bottomLine.css('top', temp.offsetTop * scale + $container.offset().top + temp.clientHeight * scale + 'px');
        $leftLine.css('left', temp.offsetLeft * scale + $container.offset().left + 'px');
        $rightLine.css('left', temp.offsetLeft * scale + $container.offset().left + temp.clientWidth * scale + 'px');
    }
    function bindTucengFunc() {
        var $inner = $('#inner');
        $('.tuceng-delete').off('click');
        $('.tuceng-num').off('click');
        $('.tuceng-delete').on('click', function() {
            var todelete = $(this).siblings('.tuceng-num').val();
            if(todelete<=tucengState) {
                if(todelete == tucengState) {
                    checkToTuceng(tucengState - 1);
                }
            }
            for(var i=0; i<tucengArr[todelete-1].length; i++) {
                tucengArr[todelete-1][i].remove();
            }
            tucengArr.splice(todelete-1, 1);
            $(this).parent().remove();
            $('.tuceng-num').each(function(index) {
                $(this).val(index + 1);
            });
        });
        $('.tuceng-num').on('click', function() {
            $('.tuceng-num').removeClass('focus');
            $(this).addClass('focus');
            if(tucengState) {
                tucengArr[tucengState-1] = [];
                $inner.children().each(function() {
                    if($(this).hasClass('no-temp')) {
                        return;
                    }
                    else {
                        tucengArr[tucengState-1].push($(this));
                    }
                });
            }
            checkToTuceng($(this).val());
            // $inner.html(tucengArr[$(this).val() - 1]);
        });
    }
    function checkToTuceng(num) {
        if(tucengArr[num - 1]) {
            $('#inner').children().each(function() {
                $(this).css('opacity', '0.25').addClass('no-temp').css('z-index', '0');
            });
            for(var i=0; i<tucengArr[num - 1].length; i++) {
                tucengArr[num - 1][i].css('opacity', '1').removeClass('no-temp').css('z-index', tucengArr[num - 1][i].attr('origin-z'));
            }
            tucengState = num;
        }
        else {
            return num;
        }
    }
    function saveImgandUpload() {
        $('.inner').css('border', 'none');
        // $('.lines').remove();
        $('p').attr('contenteditable', 'false');
        $('.p').attr('contenteditable', 'false');
        var $waiting = $('.waiting');
        $waiting.show();
        var html = $('#container').css('transform', 'scale(1)').html();
        html2canvas($('#inner').get(0), {
            onrendered: function(canvas){
                var image = canvas.toDataURL("image/jpeg", 0.7);
                // var pHtml = "<img src="+image+" />";
                // $('body').append(pHtml);
                $('#container').css('transform', 'scale(0.65)');
                // console.log(image);
                $.post("/Admin/Newhouse/imgUpload", {'id':window.id, 'html':html, 'type':3, 'table':'Wapage', 'base_img': image}, function (data) {
                    alert(data.info);
                    if (data.status == 1) {
                        location.href=data.url;
                    }
                    else {
                        $('p').attr('contenteditable', 'true');
                        $('.p').attr('contenteditable', 'true');
                    }
                });
                $waiting.hide();
            }
        })
    }
    function save() {
        var html = $('#container').html();
        if (!html) {
            return;
        }
        $.post('/Admin/Newhouse/preview', {'id': id, 'html':html, 'type':3}, function(data){
            layer.msg('保存成功');
        });
    }
    function watch() {
        var html = $('#container').html();
        $.post('/Admin/Newhouse/preview', {'id': window.id, 'html':html, 'type':3}, function(data){
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
});
