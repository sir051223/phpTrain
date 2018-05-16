// ACE主题自定义JS

/** 
* 浮动DIV定时显示提示信息,如操作成功, 失败等 
* @param string tips (提示的内容) 
* @param int height 显示的信息距离浏览器顶部的高度 
* @param int time 显示的时间(按秒算), time > 0 
* @sample <a href="javascript:void(0);" onclick="showTips( '操作成功', 100, 3 );">点击</a> 
* @sample 上面代码表示点击后显示操作成功3秒钟, 距离顶部100px 
* @copyright ZhouHr 2010-08-27 
*/ 
function show_auto_tip( tip, height, time ){ 
var windowWidth = document.documentElement.clientWidth; 
var tipDiv = '<div class="tipsClass">' + tip + '</div>'; 

if(typeof(height)=='undefined'){
	var height = document.documentElement.clientHeight/2 - 50;
}

if(typeof(time)=='undefined'){
	var time = 2;
}

$( 'body' ).append( tipDiv ); 
$( 'div.tipsClass' ).css({ 
'top' : height + 'px', 
'left' : ( windowWidth / 2 ) - ( tip.length * 13 / 2 ) + 'px', 
'position' : 'absolute', 
'padding' : '3px 5px', 
'background': '#8FBC8F', 
'font-size' : 12 + 'px', 
'margin' : '0 auto', 
'text-align': 'center', 
'width' : 'auto', 
'color' : '#fff', 
'opacity' : '0.8',
'z-index': 2000,
}).show();
$('div.tipsClass').html(tip).show();

setTimeout( function(){$('div.tipsClass').fadeOut();}, ( time * 1000 ) ); 
} 

/**
 * Bootstrap版日历控件默认参数
 * 
 * @returns object
 */
function bootstrap_datepicker_default_options(){
	var default_options = {
			showOtherMonths: true,
			selectOtherMonths: false,
			//isRTL:true,
	
			format: "yyyy-mm-dd",
			language: "zh-CN",
			autoclose: true,

			changeMonth: true,
			changeYear: true,
			
			showButtonPanel: true,
			beforeShow: function() {
				//change button colors
				var datepicker = $(this).datepicker( "widget" );
				setTimeout(function(){
					var buttons = datepicker.find('.ui-datepicker-buttonpane')
					.find('button');
					buttons.eq(0).addClass('btn btn-xs');
					buttons.eq(1).addClass('btn btn-xs btn-success');
					buttons.wrapInner('<span class="bigger-110" />');
				}, 0);
			}
	 
		};
	
	return default_options;
}
/**
 * Bootstrap版日历控件初始化
 * 
 * @param date_selector
 * @param options
 * @param merge_default_options
 */

function bootstrap_datepicker_init(date_selector, options, merge_default_options){
	if(typeof(options)=='undefined'){
		var options = {};
	}

	if(typeof(merge_default_options)=='undefined'){
		merge_default_options = bootstrap_datepicker_default_options();
	}
	
	if (!$.isEmptyObject(merge_default_options)) {
		options = $.extend(true, {}, merge_default_options, options);
	}
	
	$(date_selector).datepicker(options);
	
	if($(date_selector).hasClass('show-datepicker-icon')){
		$(date_selector).after('<span class="input-group-addon cursor datepicker-icon"><i class="icon-calendar"></i></span>');
		
		var datepicker_icon = $(date_selector).parent().find('.datepicker-icon');
		datepicker_icon.datepicker(options).on('changeDate', function(event) {
			$(date_selector).val(datepicker_icon.data('date'));
			datepicker_icon.datepicker('hide');
		});
	}
}


function jqueryui_datepicker_default_options(){
	var default_options = {
			dateFormat: "yy-mm-dd",
			showOn: "both",
		    buttonImage: __G_STATIC__ + "/admin/img/calendar.gif",
		    buttonImageOnly: true,

		};
	return default_options;
}

function jqueryui_datetimepicker_default_options(){
	var default_options = {
			dateFormat: "yy-mm-dd",
			showOn: "button",
		    buttonImage: __G_STATIC__ + "/admin/img/calendar.gif",
		    buttonImageOnly: false,
		    
		    timeFormat: 'HH:mm',

		};
	
	return default_options;
}

function jqueryui_timepicker_default_options(){
	var default_options = {
			timeFormat: 'HH:mm',
		};
	
	return default_options;
}


function jqueryui_datepicker_init(date_selector, options, merge_default_options){
	if(typeof(options)=='undefined'){
		var options = {};
	}

	if(typeof(merge_default_options)=='undefined'){
		merge_default_options = jqueryui_datepicker_default_options();
	}
	
	if (!$.isEmptyObject(merge_default_options)) {
		options = $.extend(true, {}, merge_default_options, options);
	}
	
	$(date_selector).datepicker(options);
	$(date_selector).datepicker( $.datepicker.regional[ "zh-CN" ] );
	
	//$(date_selector).timepicker();
	//$(date_selector).datetimepicker();

}

function open_window(url, param, method, target){
	if(typeof(method)=='undefined'){
		method = 'get';
	}
	
	if(typeof(target)=='undefined'){
		target = 'blank';
	}
	
	method = method.toLowerCase();
	target = target.toLowerCase();

	switch(method){
		case 'post':
			return open_window_by_post(url, param, target);
			break;
		case 'jquery-post':
			return open_window_by_jquery_post(url, param, target);
			break;
		case 'get':
		default:
			return open_window_by_get(url, param, target);
			break;
	}
}

function open_window_by_get(url, param, target){
	if(param && !$.isEmptyObject(param)){
		url = url + (url.indexOf('?')==-1?'?':'&') + $.param(param);
	}
	
	if(target=='blank'){
		window.open(url);
	}else if(target=='self'){
		window.location.href = url;
	}
}

function open_window_by_post(url, param, target) {
	var tempForm = $("<form>");
	tempForm.attr('method',  "post");
	tempForm.attr('action', url);
	tempForm.attr('target', (target=='blank' || target=='self')?'_' + target : target);
	
	var data = param;
	
	for(var n in data){
		var hideInput = $("<input>");
		hideInput.attr('type', "hidden");
		hideInput.attr('name', n);
		hideInput.attr('value', data[n]);
		tempForm.append(hideInput);
	}
	
    //console.log(tempForm);
	
	$(document.body).append(tempForm);
	tempForm.submit();
	//$(document.body).remove(tempForm);
} 



function open_window_by_jquery_post(url, param, target) {
	var data = param;
	$.post(view_apply_url, data, function(data) {
		var win = window.open('about:' + target);
		with (win.document) {
			open();
			write(data);
			close();
		}
	});
}

function get_now_datetime() {
	var now = new Date();
	var outStr = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate()
			+ ' ' + now.getHours() + ':' + now.getMinutes() + ':'
			+ now.getSeconds();
	return outStr;
}

function format_unix_time_stamp(time){
	var now = new Date(time*1000);
	
	var   year=now.getFullYear();     
    var   month=now.getMonth()+1;     
    var   date=now.getDate();     
    var   hour=now.getHours();     
    var   minute=now.getMinutes();     
    var   second=now.getSeconds();     
    return   year +"-"+month+"-"+date+" "+hour+":"+minute+":"+second;         
}


/** 
 * @param {String} divName 分页导航渲染到的dom对象ID 
 * @param {String} funName 点击页码需要执行后台查询数据的JS函数 
 * @param {Object} params 后台查询数据函数的参数，参数顺序就是该对象的顺序，当前页面一定要设置在里面的 
 * @param {String} total 后台返回的总记录数 
 * @param {Boolean} pageSize 每页显示的记录数，默认是10 
 */  
function supage(divId, funName, params, curPage, total, pageSize){  
    var output = '<div class="col-sm-6">';  
    var pageSize = parseInt(pageSize)>0 ? parseInt(pageSize) : 10;  
    //if(parseInt(total) == 0 || parseInt(total) == 'NaN') return;  
    var totalPage = Math.ceil(total/pageSize);  
    var curPage = parseInt(curPage)>0 ? parseInt(curPage) : 1;  

	if(curPage<totalPage){  
        output += '<div class="dataTables_info" id="sample-table-2_info">总共'+total+'条数据（当前为第'+((curPage-1)*pageSize+1)+'条到第'+curPage*pageSize+'条）</div></div>';
    }else{  
		if(parseInt(total) == 0 || parseInt(total) == 'NaN'){
			output += '<div class="dataTables_info" id="sample-table-2_info">没有符合条件的数据</div></div>';
		}else{
    		output += '<div class="dataTables_info" id="sample-table-2_info">总共'+total+'条数据（当前为第'+((curPage-1)*pageSize+1)+'条到第'+total+'条）</div></div>';
		}
    }

    output += '<div class="col-sm-6"><div class="dataTables_paginate paging_bootstrap"><ul class="pagination">';
    
    //从参数对象中解析出来各个参数  
    var param_str = '';  
    if(typeof params == 'object'){  
        for(o in params){  
            if(typeof params[o] == 'string'){  
               param_str += '\'' + params[o] + '\',';  
            }else{  
               param_str += params[o] + ',';  
            }  
        }  
        //alert(111);  
    }  
    //设置起始页码  
    if (totalPage > 5) {  
        if ((curPage - 2) > 0 && curPage < totalPage - 2) {  
            var start = curPage - 2;  
            var end = curPage + 2;  
        }else if (curPage >= (totalPage - 2)) {  
            var start = totalPage - 5;  
            var end = totalPage;  
        }else {  
            var start = 1;  
            var end = 5;  
        }  
    }else {  
        var start = 1;  
        var end = totalPage;  
    }  
      
    //首页控制  
    if(curPage>1){  
        output += '<li class="prev"><a href="javascript:'+funName+'(' + param_str + '1);"><i class="icon-double-angle-left" title="第一页"></i></a></li>';
    }else{  
    	output += '<li class="prev disabled"><a href="javascript:;"><i class="icon-double-angle-left" title="第一页"></i></a></li>';
    }  
    //上一页菜单控制  
    if(curPage>1){  
    	output += '<li class="prev"><a href="javascript:'+funName+'(' + param_str + (curPage-1)+');"><i class="icon-angle-left" title="上一页"></i></a></li>';
    }else{  
    	output += '<li class="prev disabled"><a href="javascript:;"><i class="icon-angle-left" title="上一页"></i></a></li>'; 
    }  
      
    //页码展示  
    for (i = start; i <= end; i++) {  
        if (i == curPage) {  
            output += '<li class="active"><a href="javascript:;">'+curPage+'</a></li>';
        }else {  
        	output += '<li><a href="javascript:'+funName+'(' + param_str + i + ');">'+i+'</a></li>';
        }  
    }  
    //下一页菜单控制  
    if(totalPage>1 && curPage<totalPage){ 
        output += '<li class="next"><a href="javascript:'+funName+'('+param_str + (curPage+1)+');"><i class="icon-angle-right" title="下一页"></i></a></li>'; 
    }else{  
    	output += '<li class="next disabled"><a href="javascript:;"><i class="icon-angle-right" title="下一页"></i></a></li>';
    }  
    //最后页控制  
    if(curPage<totalPage){  
        output += '<li class="next"><a href="javascript:'+funName+'('+param_str + totalPage+');"><i class="icon-double-angle-right" title="最后页"></i></a></li>'; 
    }else{  
    	output += '<li class="next disabled"><a href="javascript:;"><i class="icon-double-angle-right" title="最后页"></i></a></li>';
    }  
      
    output += '</ul></div></div>'; 
    //渲染到dom中  
    document.getElementById(divId).innerHTML = output;  
}; 

				