<?php 
defined('IN_HEAVEN') or die('Hacking Attempt!');
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 扩展配置文件 样例
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $
 *  +----------------------------------------------------------------------
 */

// 项目根目录
defined('APP_ROOT') or define('APP_ROOT', substr(dirname(__FILE__), 0, -16));

// 框架路径
defined('APP_LIB') or define('APP_LIB', APP_ROOT.'lib_3.2.3/');

defined('UPLOAD_PATH') or define('UPLOAD_PATH', APP_ROOT . '/public/uploads');

//composer路径
defined('VENDER_PATH') or define('VENDER_PATH',  APP_ROOT.'apps/Common/Lib/');

// 网站根URL
defined('__BASE__') or define('__BASE__', 'http://'.$_SERVER['HTTP_HOST'].'/');

// 静态文件URL
defined('__STATIC__') or define('__STATIC__', __BASE__ . 'static/');

// 上传文件URL
defined('__UPLOAD__') or define('__UPLOAD__', __BASE__ . 'uploads/');

//--------------------------------------
// ThinkPHP配置参数
//--------------------------------------
return array(
		/*接口分页配置*/
		'PAGESIZE' => 10,
    
		'DB_TYPE'   => 'mysql',
		'DB_HOST'   => 'localhost',
		'DB_NAME'   => 'db_learn',
		'DB_USER'   => 'root',
		'DB_PWD'    => '',
		'DB_PORT'   => '3306',
		'DB_PREFIX' => 'za_',    
    
        
		/* 命令路径 */
		'BIN_MAPS' => array(
			'php' => 'D:\wamp64\bin\php\php5.6.25\php.exe -c D:\wamp64\bin\apache\apache2.4.23\bin\php.ini',
		),

);

