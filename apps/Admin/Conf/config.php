<?php
return array(
		
	'ACTION_SUFFIX'  => 'Act', // 控制器方法后缀
	'APP_FILE_CASE'  => true, // 检查文件大小写
	
	/* 模版 */
	'TMPL_DETECT_THEME' => 	false, // 自动侦测模板主题
	'URL_HTML_SUFFIX' => '',
	'TMPL_TEMPLATE_SUFFIX' => '.tpl.php', // 模版后缀名
	
	'TMPL_PARSE_STRING'  =>array(
			'__UPLOAD__' => __BASE__.'uploads', // 增加新的上传路径替换规则
			'__STATIC__' => 'http://'.$_SERVER['HTTP_HOST'].'/'.'static',
	),
	
	'LAYOUT_ON' => 1, //  启用模版布局
	'LAYOUT_NAME' => 'layout', // 布局文件名称
	'TMPL_LAYOUT_ITEM' => '{__CONTENT__}', // 布局模板的内容替换标识
	'TMPL_ACTION_ERROR' => 'Public:dispatch_jump', //默认错误跳转对应的模板文件
	'TMPL_ACTION_SUCCESS' => 'Public:dispatch_jump', //默认成功跳转对应的模板文件
	
	/* SESSION 和 COOKIE 配置 */
	'COOKIE_PREFIX'  => 'zhian_wap', // Cookie前缀 避免冲突
	
    'SESSION_OPTIONS'=>array(
        'expire' => 28800,
        'prefix' => 'd8c51c829',
    ),
    
	/* 自定义参数 */
	'SITE_TITLE' => '开发者中心',
	'TITLE' => '实训管理系统',
	'SITE_COMPANY' => 'guoping cen',
);