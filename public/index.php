<?php
define('IN_HEAVEN', true);

/**
 * 药师帮接口入口
 *
 * PHP version 5.5
 *
 * @category	qrug
 * @package     Pharmacist
 * @copyright   2014 GZSD
 * @version     SVN: $Id: index.php 43 2014-12-04 10:23:59 Cengp $
 */

if (empty($APP_SETTING)) {
	$APP_SETTING = auto_check_app_setting('wap', substr(dirname(__FILE__), 0, -6) . 'apps/Common/Conf/');
}

/**
 * 自动检测环境设置
 * debug--本地开发环境配置
 * test -- 测试环境配置
 * prod -- 正式环境配置
 */ 
function auto_check_app_setting($app_name, $conf_dir) {
	$conf_options = array(
			'debug.php' => true,
			'test.php' => 'test',
			'prod.php' => false,
	);
	foreach ($conf_options as $f => $d) {
		if (file_exists($conf_dir . $f)) {
			$app_debug = $d;
			$conf_file = $f;
			break;
		}
	}

	if (!$conf_file) {
		die("Config file not exists!");
	}

	include $conf_dir . $conf_file;
	$arr = explode('.', $conf_file);
	
	$setting = array(
			'EXT_CONFIG' => $arr[0],
			'APP_DEBUG' => $app_debug,
			'APP_NAME' => $app_name,
			'APP_ROOT' => constant('APP_ROOT'),
			'APP_LIB' => constant('APP_LIB'),
	);

	return $setting;
}


// 定义扩展配置文件
defined('EXT_CONFIG') or define('EXT_CONFIG', $APP_SETTING['EXT_CONFIG']);

// 是否开启调试模式
defined('APP_DEBUG') or define('APP_DEBUG', $APP_SETTING['APP_DEBUG']);

//定义项目名称
defined('APP_NAME') or define('APP_NAME', $APP_SETTING['APP_NAME']);

// 定义项目根路径
defined('APP_PATH') or define('APP_PATH', $APP_SETTING['APP_ROOT'] . '/apps/');

// 定义运行路径
defined('RUNTIME_PATH') or define('RUNTIME_PATH', $APP_SETTING['APP_ROOT'] . '/data/_runtime/');

// 加载框架入口文件
require($APP_SETTING['APP_LIB'] . 'ThinkPHP.php');	
