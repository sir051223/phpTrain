
window.AJAX_LOADING_TIP =  window.AJAX_DEFAULT_TIP = "处理中...";	
function ajax_start_loading(){
	$('#ajaxInditext').html(ajax_loading_tip());
	$('#ajaxIndicator').show();
	$("BODY").append('<div class="dialog_bg"></div>');
}

function ajax_stop_loading(){
	$('#ajaxInditext').html("");
	$('#ajaxIndicator').hide();
	$(".dialog_bg").remove();
}

function ajax_loading_tip(tip){
	if(typeof(tip)=='undefined'){
		return window.AJAX_LOADING_TIP;
	}
	window.AJAX_LOADING_TIP = tip;
}

function ajax_reset_default_tip(is_reset){
	if(typeof(is_reset)!='undefined' && is_reset==true)
	{
		window.AJAX_LOADING_TIP = window.AJAX_DEFAULT_TIP;
	}else{
		return window.AJAX_DEFAULT_TIP;
	}
	
}

//ajax_start_loading();

jQuery(function($) {
	$( document ).ajaxStart(function() {
  		ajax_start_loading();
	}).ajaxStop(function() {
  		ajax_stop_loading();
	}).ajaxError(function() {
  		ajax_stop_loading();
	});

	$('#gridTipIndicator button.close').click(function(){
			$('#gridTipIndicator').hide();
	});
	
	$("body").click(function(){     
		$('#gridTipIndicator').hide();
	 });
	 
	 
});


//输入长度提示
function strlen_verify(obj, checklen, maxlen) {
    var v = obj.value,
        charlen = 0,
        maxlen = !maxlen ? 200 : maxlen,
        curlen = maxlen,
        len = strlen(v);
    var charset = 'utf-8';
    for (var i = 0; i < v.length; i++) {
        if (v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
            curlen -= charset == 'utf-8' ? 2 : 1;
        }
    }
    if (curlen >= len) {
        $('#' + checklen).html(curlen - len);
    } else {
        obj.value = mb_cutstr(v, maxlen, true);
    }
}

//长度统计
function strlen(str) {
    return str.length;
}
function mb_cutstr(str, maxlen, dot) {
    var len = 0;
    var ret = '';
    var dot = !dot ? '...' : '';

    maxlen = maxlen - dot.length;
    for (var i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
        if (len > maxlen) {
            ret += dot;
            break;
        }
        ret += str.substr(i, 1);
    }
    return ret;
}





				