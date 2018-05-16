/**
 * Created by Tomokylelie on 2017/5/25.
 */
$(function() {
    //更新日志
    alert('17-10-09:新增组件大小贴合图片功能\n\n117-09-28：更新图片原尺寸功能\n\n17-08-04：小组件库添加大量组件，底色修改，为了看到组件，有点丑。。\n\n17-07-25：解决文字换行问题，但是之前做好的文字仍然不能换行，需要删除后再添加才可以，取消日志功能\n\n17-06-13：调整图层选项位置\n\n17-06-12：用户体验优化\n\n17-06-05：新增查看更新日志功能，可以查看编辑器的各种更新了\n\n17-06-02：解决更新图层功能后文案不能编辑功能\n\n17-06-01：新增图层功能，注意：删除图层会删除图层上的元素\n\n17-05-28：新增图片等比缩放功能，进入裁切功能后，按着左shift拖动缩放能使图片等比缩放，但是会出现拖动圆点不在图片右下角的小问题，照常拖动那个圆点改变图片大小就好\n\n17-05-27：PC端头图编辑器上线，拥有除图层功能外所有移动端头图编辑器功能');
    //初始化
    $('#container #inner').children().each(function() {
        if(!$(this).hasClass('new170601-z')) {
            $(this).css('z-index', parseInt($(this).css('z-index')) + 1).addClass('new170601-z');
        }
        $(this).attr('origin-z', $(this).css('z-index'));
    });
    $('#inner p').attr('contenteditable', true);
    $('#inner .p').attr('contenteditable', true);
    $('.bg-warp').css('background-repeat', 'no-repeat');
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
    var scale = 1;    //编辑器缩放
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
                    str = str + data[i].width + 'px;height: ';
                    str = str + data[i].height + 'px;';
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
    var $tucengWarp = $('.tuceng-warp');
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
        $container.find('.inner').attr('id', 'inner');
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
                $('.bg-warp').css('background-image','url("' + data.photo.full_path + '")');
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
        var $bg = $('.bg-warp');
        $bg.css('background-color', $(this).val());
    });
    //清除背景图片以及颜色
    $('#clearphoto').on('click', function() {
        var $bg = $('#container .bg-warp');
        $bg.css({'background-image': '', 'background-color': 'transparent'});
    });
    //添加图片
    $('#addPic').on('click', function() {
        // $inner.html($inner.html() + '<div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move"> <img src="http://wx3.sinaimg.cn/mw690/a8e764e6ly1ff1aks7q83j21hc0yiqi4.jpg" style="position:absolute;top:0;left:0;cursor: move"></div>');
        $('#pic-btn').click();
    });
    $('#pic-btn').on('change', function(event) {
        event.preventDefault();
        var options = {
            success: function (data) {var $inner = $('#inner');
                var img = new Image();
                img.src = data.photo.full_path;
                $(img).on('load', function() {
                    $(this).css({'position': 'absolute', 'top': '0', 'left': '0'});
                    $inner.append($('<div style="overflow: hidden;position: absolute;top: 1rem;left: .5rem;width: 3rem;height: 3rem;cursor: move;z-index: 1;" origin-z="1"></div>').append(img));
                    $(this).attr('origin-h', $(this).height());
                    $(this).attr('origin-w', $(this).width());
                });
            }
        };
        $("#form-pic").ajaxForm(options);
        $('#sub-pic').click();
    });
    //完成上传按钮
    $btn.on('click', function() {
        finAndUpload()
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
        $inner.append('<div class="p" contenteditable="true" style="position: absolute;top: 50px;left: 50px;cursor: move;box-sizing: border-box;font-size: 42px;z-index:1;color:#999999" origin-z="1">拖拖拖拖拖拖拖拖</div>');
    });
    //添加色块
    $('#addDiv-btn').on('click', function() {
        var $inner = $('#inner');
        $inner.append('<div style="position: absolute;top: 200px;left: 200px;width: 200px;height: 100px;background-color: red;cursor: move;box-sizing: border-box;z-index:1" origin-z="1"></div>');
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
        var k = temp.getElementsByTagName('img');
        if(k.length == 0) {
            alert('不能为非图片元素设置原尺寸');
        }
        else {
            if(!k[0].getAttribute('origin-h')) {
                k[0].style.width = 'auto';
                k[0].style.height = 'auto';
                k[0].style.top = '0';
                k[0].style.left = '0';
            }
            else {
                k[0].style.height = k[0].getAttribute('origin-h') + 'px';
                k[0].style.width = k[0].getAttribute('origin-w') + 'px';
                temp.style.height = k[0].getAttribute('origin-h') + 'px';
                temp.style.width = k[0].getAttribute('origin-w') + 'px';
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
            $(temp).css({'width': $k0.width() + 'px', 'height': $k0.height() + 'px'});
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
    $('.call-tuceng').on('click', function() {
        $tucengWarp.toggleClass('off');
    });
    //样式绑定
    $fontSize.on('input propertychange', function() {
        temp.style.fontSize = $fontSize.val()+ 'px';
    });
    $width.on('input propertychange', function() {
        temp.style.width = $width.val()+ 'px';
    });
    $height.on('input propertychange', function() {
        temp.style.height = $height.val()+ 'px';
    });
    $zIndex.on('input propertychange', function() {
        if($zIndex.val() < 0) {
            $zIndex.val(0);
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
        temp.style.left = $left.val()+ 'px';
    });
    $top.on('input propertychange', function() {
        temp.style.top = $top.val()+ 'px';
    });
    $fontFamily.on('change', function() {
        temp.style.fontFamily = $fontFamily.val();
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
        $topLine.css('top', temp.offsetTop * scale + $container.offset().top + 'px');
        $bottomLine.css('top', temp.offsetTop * scale + $container.offset().top + temp.clientHeight * scale + 'px');
        $leftLine.css('left', temp.offsetLeft * scale + $('#inner').offset().left + 'px');
        $rightLine.css('left', temp.offsetLeft * scale + $('#inner').offset().left + temp.clientWidth * scale + 'px');
        $lines.show();
        temp.style.overflow = 'visible';
        img.style.opacity = '0.4';
        $(temp).append('<div id="move-temp" style="position:absolute;top:'+ (parseFloat(img.style.top) + img.clientHeight-15) + 'px;left:' + (parseFloat(img.style.left) + img.clientWidth-15) + 'px;width: 30px;height: 30px;border-radius: 50%;border: 1px solid black;background-color: #fff"></div>');

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
                $img.css('top', (ftop + (e.pageY - fy)/scale) + 'px');
                $img.css('left', (fleft + (e.pageX - fx)/scale) + 'px');
                $movetemp.css('top', (ttop + (e.pageY - fy)/scale) + 'px');
                $movetemp.css('left', (tleft + (e.pageX - fx)/scale) + 'px');
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
                console.log(adjustSwitch);
            }
        });
        $body.on('keyup', function(e) {
            adjustSwitch = 0;
            console.log(adjustSwitch);
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
                $img.css('height', (fheight + (e.pageY - fy)/scale) + 'px');
                $img.css('width', (fwidth + (e.pageX - fx)/scale) + 'px');
                $movetemp.css('top', (ttop + (e.pageY - fy)/scale) + 'px');
                $movetemp.css('left', (tleft + (e.pageX - fx)/scale) + 'px');
                if(adjustSwitch) {
                    $img.css('height', $img.width() * $img.attr('scale') + 'px');
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
            $container.on('mousedown', function(event) {
                bindingDefault(event);
            });
            $body.on('mouseup', function(e) {
                $body.off('mousemove');
                $lines.hide();
            });
        });
    }
    function finAndUpload() {
        if(temp) {
            temp.style.border = 'none';
        }
        var $inner = $('#inner');
        $('.inner').children().css('cursor','auto').children().css('cursor','auto');
        $inner.attr('id', '');
        $('p').attr('contenteditable', 'false');
        console.log($container.html());
        $inner.attr('id', 'inner');
        $('.inner').children().css('cursor','move').children().css('cursor','move');
    }
    function bindingDefault(event) {
        $infoWarp.hide();
        var $inner = $('#inner');
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
        var mouseDisX = event.pageX/scale  - temp.offsetLeft - $inner.offset().left;
        var mouseDisY = event.pageY/scale - temp.offsetTop - $inner.offset().top;
        $body.on('mousemove', function(event) {
            event.preventDefault();
            var $inner = $('#inner');
            showStyle(temp);
            showlines();
            // $infoWarp.css('top', temp.offsetTop/2 + containerOffSetTop - $infoWarp.height() - 20 + 'px');
            if(temp != containerObj) {
                if(event.pageX/scale - mouseDisX + temp.clientWidth - $inner.offset().left > $inner.width()) {
                    temp.style.left = ($inner.width() - temp.clientWidth) + 'px';
                }
                else if(event.pageX/scale - mouseDisX - $inner.offset().left < 0) {
                    temp.style.left = 0;
                }
                else {
                    temp.style.left = (event.pageX/scale - mouseDisX - $inner.offset().left) +'px';
                }
                if(event.pageY/scale - containerOffSetTop - mouseDisY + temp.clientHeight > $inner.height()) {
                    temp.style.top = ($inner.height() - temp.clientHeight) + 'px';
                }
                else if(event.pageY/scale - containerOffSetTop - mouseDisY < 0) {
                    temp.style.top = 0;
                }
                else {
                    temp.style.top = (event.pageY/scale - containerOffSetTop - mouseDisY) + 'px';
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
        $backgroundColor.val(temp.style.backgroundColor);
        if(temp.style.borderRadius) {
            $radius.val(parseInt(temp.style.borderRadius));
        }
        if(temp.style.fontSize) {
            $fontSize.val(Math.floor(parseFloat(temp.style.fontSize)));
        }
        if(temp.style.zIndex) {
            $zIndex.val(temp.style.zIndex);
        }
        $left.val(parseFloat(temp.style.left));
        $top.val(parseFloat(temp.style.top));
        $fontFamily.val(temp.style.fontFamily);
    }
    function showlines() {
        var $container = $('#container');
        var $inner = $('#inner');
        $lines.show();
        $topLine.css('top', temp.offsetTop * scale + $container.offset().top + 'px');
        $bottomLine.css('top', temp.offsetTop * scale + $container.offset().top + temp.clientHeight * scale + 'px');
        $leftLine.css('left', temp.offsetLeft * scale + $inner.offset().left + 'px');
        $rightLine.css('left', temp.offsetLeft * scale + $inner.offset().left + temp.clientWidth * scale + 'px');
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
});
