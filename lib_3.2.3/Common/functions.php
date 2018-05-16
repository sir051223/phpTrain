<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

/**
 * Think 系统函数库
 */

/**
 * 获取和设置配置参数 支持批量定义
 * @param string|array $name 配置变量
 * @param mixed $value 配置值
 * @param mixed $default 默认值
 * @return mixed
 */
function C($name=null, $value=null,$default=null) {
    static $_config = array();
    // 无参数时获取所有
    if (empty($name)) {
        return $_config;
    }
    // 优先执行设置获取或赋值
    if (is_string($name)) {
        if (!strpos($name, '.')) {
            $name = strtoupper($name);
            if (is_null($value))
                return isset($_config[$name]) ? $_config[$name] : $default;
            $_config[$name] = $value;
            return null;
        }
        // 二维数组设置和获取支持
        $name = explode('.', $name);
        $name[0]   =  strtoupper($name[0]);
        if (is_null($value))
            return isset($_config[$name[0]][$name[1]]) ? $_config[$name[0]][$name[1]] : $default;
        $_config[$name[0]][$name[1]] = $value;
        return null;
    }
    // 批量设置
    if (is_array($name)){
        $_config = array_merge($_config, array_change_key_case($name,CASE_UPPER));
        return null;
    }
    return null; // 避免非法参数
}

/**
 * 加载配置文件 支持格式转换 仅支持一级配置
 * @param string $file 配置文件名
 * @param string $parse 配置解析方法 有些格式需要用户自己解析
 * @return array
 */
function load_config($file,$parse=CONF_PARSE){
    $ext  = pathinfo($file,PATHINFO_EXTENSION);
    switch($ext){
        case 'php':
            return include $file;
        case 'ini':
            return parse_ini_file($file);
        case 'yaml':
            return yaml_parse_file($file);
        case 'xml':
            return (array)simplexml_load_file($file);
        case 'json':
            return json_decode(file_get_contents($file), true);
        default:
            if(function_exists($parse)){
                return $parse($file);
            }else{
                E(L('_NOT_SUPPORT_').':'.$ext);
            }
    }
}

/**
 * 解析yaml文件返回一个数组
 * @param string $file 配置文件名
 * @return array
 */
if (!function_exists('yaml_parse_file')) {
    function yaml_parse_file($file) {
        vendor('spyc.Spyc');
        return Spyc::YAMLLoad($file);
    }
}

/**
 * 抛出异常处理
 * @param string $msg 异常消息
 * @param integer $code 异常代码 默认为0
 * @throws Think\Exception
 * @return void
 */
function E($msg, $code=0) {
    throw new Think\Exception($msg, $code);
}

/**
 * 记录和统计时间（微秒）和内存使用情况
 * 使用方法:
 * <code>
 * G('begin'); // 记录开始标记位
 * // ... 区间运行代码
 * G('end'); // 记录结束标签位
 * echo G('begin','end',6); // 统计区间运行时间 精确到小数后6位
 * echo G('begin','end','m'); // 统计区间内存使用情况
 * 如果end标记位没有定义，则会自动以当前作为标记位
 * 其中统计内存使用需要 MEMORY_LIMIT_ON 常量为true才有效
 * </code>
 * @param string $start 开始标签
 * @param string $end 结束标签
 * @param integer|string $dec 小数位或者m
 * @return mixed
 */
function G($start,$end='',$dec=4) {
    static $_info       =   array();
    static $_mem        =   array();
    if(is_float($end)) { // 记录时间
        $_info[$start]  =   $end;
    }elseif(!empty($end)){ // 统计时间和内存使用
        if(!isset($_info[$end])) $_info[$end]       =  microtime(TRUE);
        if(MEMORY_LIMIT_ON && $dec=='m'){
            if(!isset($_mem[$end])) $_mem[$end]     =  memory_get_usage();
            return number_format(($_mem[$end]-$_mem[$start])/1024);
        }else{
            return number_format(($_info[$end]-$_info[$start]),$dec);
        }

    }else{ // 记录时间和内存使用
        $_info[$start]  =  microtime(TRUE);
        if(MEMORY_LIMIT_ON) $_mem[$start]           =  memory_get_usage();
    }
    return null;
}

/**
 * 获取和设置语言定义(不区分大小写)
 * @param string|array $name 语言变量
 * @param mixed $value 语言值或者变量
 * @return mixed
 */
function L($name=null, $value=null) {
    static $_lang = array();
    // 空参数返回所有定义
    if (empty($name))
        return $_lang;
    // 判断语言获取(或设置)
    // 若不存在,直接返回全大写$name
    if (is_string($name)) {
        $name   =   strtoupper($name);
        if (is_null($value)){
            return isset($_lang[$name]) ? $_lang[$name] : $name;
        }elseif(is_array($value)){
            // 支持变量
            $replace = array_keys($value);
            foreach($replace as &$v){
                $v = '{$'.$v.'}';
            }
            return str_replace($replace,$value,isset($_lang[$name]) ? $_lang[$name] : $name);
        }
        $_lang[$name] = $value; // 语言定义
        return null;
    }
    // 批量定义
    if (is_array($name))
        $_lang = array_merge($_lang, array_change_key_case($name, CASE_UPPER));
    return null;
}

/**
 * 添加和获取页面Trace记录
 * @param string $value 变量
 * @param string $label 标签
 * @param string $level 日志级别
 * @param boolean $record 是否记录日志
 * @return void|array
 */
function trace($value='[think]',$label='',$level='DEBUG',$record=false) {
    return Think\Think::trace($value,$label,$level,$record);
}

/**
 * 编译文件
 * @param string $filename 文件名
 * @return string
 */
function compile($filename) {
    $content    =   php_strip_whitespace($filename);
    $content    =   trim(substr($content, 5));
    // 替换预编译指令
    $content    =   preg_replace('/\/\/\[RUNTIME\](.*?)\/\/\[\/RUNTIME\]/s', '', $content);
    if(0===strpos($content,'namespace')){
        $content    =   preg_replace('/namespace\s(.*?);/','namespace \\1{',$content,1);
    }else{
        $content    =   'namespace {'.$content;
    }
    if ('?>' == substr($content, -2))
        $content    = substr($content, 0, -2);
    return $content.'}';
}

/**
 * 获取模版文件 格式 资源://模块@主题/控制器/操作
 * @param string $template 模版资源地址
 * @param string $layer 视图层（目录）名称
 * @return string
 */
function T($template='',$layer=''){

    // 解析模版资源地址
    if(false === strpos($template,'://')){
        $template   =   'http://'.str_replace(':', '/',$template);
    }
    $info   =   parse_url($template);
    $file   =   $info['host'].(isset($info['path'])?$info['path']:'');
    $module =   isset($info['user'])?$info['user'].'/':MODULE_NAME.'/';
    $extend =   $info['scheme'];
    $layer  =   $layer?$layer:C('DEFAULT_V_LAYER');

    // 获取当前主题的模版路径
    $auto   =   C('AUTOLOAD_NAMESPACE');
    if($auto && isset($auto[$extend])){ // 扩展资源
        $baseUrl    =   $auto[$extend].$module.$layer.'/';
    }elseif(C('VIEW_PATH')){
        // 改变模块视图目录
        $baseUrl    =   C('VIEW_PATH');
    }elseif(defined('TMPL_PATH')){
        // 指定全局视图目录
        $baseUrl    =   TMPL_PATH.$module;
    }else{
        $baseUrl    =   APP_PATH.$module.$layer.'/';
    }

    // 获取主题
    $theme  =   substr_count($file,'/')<2 ? C('DEFAULT_THEME') : '';

    // 分析模板文件规则
    $depr   =   C('TMPL_FILE_DEPR');
    if('' == $file) {
        // 如果模板文件名为空 按照默认规则定位
        $file = CONTROLLER_NAME . $depr . ACTION_NAME;
    }elseif(false === strpos($file, '/')){
        $file = CONTROLLER_NAME . $depr . $file;
    }elseif('/' != $depr){
        $file   =   substr_count($file,'/')>1 ? substr_replace($file,$depr,strrpos($file,'/'),1) : str_replace('/', $depr, $file);
    }
    return $baseUrl.($theme?$theme.'/':'').$file.C('TMPL_TEMPLATE_SUFFIX');
}

/**
 * 获取输入参数 支持过滤和默认值
 * 使用方法:
 * <code>
 * I('id',0); 获取id参数 自动判断get或者post
 * I('post.name','','htmlspecialchars'); 获取$_POST['name']
 * I('get.'); 获取$_GET
 * </code>
 * @param string $name 变量的名称 支持指定类型
 * @param mixed $default 不存在的时候默认值
 * @param mixed $filter 参数过滤方法
 * @param mixed $datas 要获取的额外数据源
 * @return mixed
 */
function I($name,$default='',$filter=null,$datas=null) {
	static $_PUT	=	null;
	if(strpos($name,'/')){ // 指定修饰符
		list($name,$type) 	=	explode('/',$name,2);
	}elseif(C('VAR_AUTO_STRING')){ // 默认强制转换为字符串
        $type   =   's';
    }
    if(strpos($name,'.')) { // 指定参数来源
        list($method,$name) =   explode('.',$name,2);
    }else{ // 默认为自动判断
        $method =   'param';
    }
    switch(strtolower($method)) {
        case 'get'     :
        	$input =& $_GET;
        	break;
        case 'post'    :
        	$input =& $_POST;
        	break;
        case 'put'     :
        	if(is_null($_PUT)){
            	parse_str(file_get_contents('php://input'), $_PUT);
        	}
        	$input 	=	$_PUT;
        	break;
        case 'param'   :
            switch($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $input  =  $_POST;
                    break;
                case 'PUT':
                	if(is_null($_PUT)){
                    	parse_str(file_get_contents('php://input'), $_PUT);
                	}
                	$input 	=	$_PUT;
                    break;
                default:
                    $input  =  $_GET;
            }
            break;
        case 'path'    :
            $input  =   array();
            if(!empty($_SERVER['PATH_INFO'])){
                $depr   =   C('URL_PATHINFO_DEPR');
                $input  =   explode($depr,trim($_SERVER['PATH_INFO'],$depr));
            }
            break;
        case 'request' :
        	$input =& $_REQUEST;
        	break;
        case 'session' :
        	$input =& $_SESSION;
        	break;
        case 'cookie'  :
        	$input =& $_COOKIE;
        	break;
        case 'server'  :
        	$input =& $_SERVER;
        	break;
        case 'globals' :
        	$input =& $GLOBALS;
        	break;
        case 'data'    :
        	$input =& $datas;
        	break;
        default:
            return null;
    }
    if(''==$name) { // 获取全部变量
        $data       =   $input;
        $filters    =   isset($filter)?$filter:C('DEFAULT_FILTER');
        if($filters) {
            if(is_string($filters)){
                $filters    =   explode(',',$filters);
            }
            foreach($filters as $filter){
                $data   =   array_map_recursive($filter,$data); // 参数过滤
            }
        }
    }elseif(isset($input[$name])) { // 取值操作
        $data       =   $input[$name];
        $filters    =   isset($filter)?$filter:C('DEFAULT_FILTER');
        if($filters) {
            if(is_string($filters)){
                if(0 === strpos($filters,'/')){
                    if(1 !== preg_match($filters,(string)$data)){
                        // 支持正则验证
                        return   isset($default) ? $default : null;
                    }
                }else{
                    $filters    =   explode(',',$filters);
                }
            }elseif(is_int($filters)){
                $filters    =   array($filters);
            }

            if(is_array($filters)){
                foreach($filters as $filter){
                    if(function_exists($filter)) {
                        $data   =   is_array($data) ? array_map_recursive($filter,$data) : $filter($data); // 参数过滤
                    }else{
                        $data   =   filter_var($data,is_int($filter) ? $filter : filter_id($filter));
                        if(false === $data) {
                            return   isset($default) ? $default : null;
                        }
                    }
                }
            }
        }
        if(!empty($type)){
        	switch(strtolower($type)){
        		case 'a':	// 数组
        			$data 	=	(array)$data;
        			break;
        		case 'd':	// 数字
        			$data 	=	(int)$data;
        			break;
        		case 'f':	// 浮点
        			$data 	=	(float)$data;
        			break;
        		case 'b':	// 布尔
        			$data 	=	(boolean)$data;
        			break;
                case 's':   // 字符串
                default:
                    $data   =   (string)$data;
        	}
        }
    }else{ // 变量默认值
        $data       =    isset($default)?$default:null;
    }
    is_array($data) && array_walk_recursive($data,'think_filter');
    return $data;
}

function array_map_recursive($filter, $data) {
    $result = array();
    foreach ($data as $key => $val) {
        $result[$key] = is_array($val)
         ? array_map_recursive($filter, $val)
         : call_user_func($filter, $val);
    }
    return $result;
 }

/**
 * 设置和获取统计数据
 * 使用方法:
 * <code>
 * N('db',1); // 记录数据库操作次数
 * N('read',1); // 记录读取次数
 * echo N('db'); // 获取当前页面数据库的所有操作次数
 * echo N('read'); // 获取当前页面读取次数
 * </code>
 * @param string $key 标识位置
 * @param integer $step 步进值
 * @param boolean $save 是否保存结果
 * @return mixed
 */
function N($key, $step=0,$save=false) {
    static $_num    = array();
    if (!isset($_num[$key])) {
        $_num[$key] = (false !== $save)? S('N_'.$key) :  0;
    }
    if (empty($step)){
        return $_num[$key];
    }else{
        $_num[$key] = $_num[$key] + (int)$step;
    }
    if(false !== $save){ // 保存结果
        S('N_'.$key,$_num[$key],$save);
    }
    return null;
}

/**
 * 字符串命名风格转换
 * type 0 将Java风格转换为C的风格 1 将C风格转换为Java的风格
 * @param string $name 字符串
 * @param integer $type 转换类型
 * @return string
 */
function parse_name($name, $type=0) {
    if ($type) {
        return ucfirst(preg_replace_callback('/_([a-zA-Z])/', function($match){return strtoupper($match[1]);}, $name));
    } else {
        return strtolower(trim(preg_replace("/[A-Z]/", "_\\0", $name), "_"));
    }
}

/**
 * 优化的require_once
 * @param string $filename 文件地址
 * @return boolean
 */
function require_cache($filename) {
    static $_importFiles = array();
    if (!isset($_importFiles[$filename])) {
        if (file_exists_case($filename)) {
            require $filename;
            $_importFiles[$filename] = true;
        } else {
            $_importFiles[$filename] = false;
        }
    }
    return $_importFiles[$filename];
}

/**
 * 区分大小写的文件存在判断
 * @param string $filename 文件地址
 * @return boolean
 */
function file_exists_case($filename) {
    if (is_file($filename)) {
        if (IS_WIN && APP_DEBUG) {
            if (basename(realpath($filename)) != basename($filename))
                return false;
        }
        return true;
    }
    return false;
}

/**
 * 导入所需的类库 同java的Import 本函数有缓存功能
 * @param string $class 类库命名空间字符串
 * @param string $baseUrl 起始路径
 * @param string $ext 导入的文件扩展名
 * @return boolean
 */
function import($class, $baseUrl = '', $ext=EXT) {
    static $_file = array();
    $class = str_replace(array('.', '#'), array('/', '.'), $class);
    if (isset($_file[$class . $baseUrl]))
        return true;
    else
        $_file[$class . $baseUrl] = true;
    $class_strut     = explode('/', $class);
    if (empty($baseUrl)) {
        if ('@' == $class_strut[0] || MODULE_NAME == $class_strut[0]) {
            //加载当前模块的类库
            $baseUrl = MODULE_PATH;
            $class   = substr_replace($class, '', 0, strlen($class_strut[0]) + 1);
        }elseif ('Common' == $class_strut[0]) {
            //加载公共模块的类库
            $baseUrl = COMMON_PATH;
            $class   = substr($class, 7);
        }elseif (in_array($class_strut[0],array('Think','Org','Behavior','Com','Vendor')) || is_dir(LIB_PATH.$class_strut[0])) {
            // 系统类库包和第三方类库包
            $baseUrl = LIB_PATH;
        }else { // 加载其他模块的类库
            $baseUrl = APP_PATH;
        }
    }
    if (substr($baseUrl, -1) != '/')
        $baseUrl    .= '/';
    $classfile       = $baseUrl . $class . $ext;
    if (!class_exists(basename($class),false)) {
        // 如果类不存在 则导入类库文件
        return require_cache($classfile);
    }
    return null;
}

/**
 * 基于命名空间方式导入函数库
 * load('@.Util.Array')
 * @param string $name 函数库命名空间字符串
 * @param string $baseUrl 起始路径
 * @param string $ext 导入的文件扩展名
 * @return void
 */
function load($name, $baseUrl='', $ext='.php') {
    $name = str_replace(array('.', '#'), array('/', '.'), $name);
    if (empty($baseUrl)) {
        if (0 === strpos($name, '@/')) {//加载当前模块函数库
            $baseUrl    =   MODULE_PATH.'Common/';
            $name       =   substr($name, 2);
        } else { //加载其他模块函数库
            $array      =   explode('/', $name);
            $baseUrl    =   APP_PATH . array_shift($array).'/Common/';
            $name       =   implode('/',$array);
        }
    }
    if (substr($baseUrl, -1) != '/')
        $baseUrl       .= '/';
    require_cache($baseUrl . $name . $ext);
}

/**
 * 快速导入第三方框架类库 所有第三方框架的类库文件统一放到 系统的Vendor目录下面
 * @param string $class 类库
 * @param string $baseUrl 基础目录
 * @param string $ext 类库后缀
 * @return boolean
 */
function vendor($class, $baseUrl = '', $ext='.php') {
    if (empty($baseUrl))
        $baseUrl = VENDOR_PATH;
    return import($class, $baseUrl, $ext);
}

/**
 * 实例化模型类 格式 [资源://][模块/]模型
 * @param string $name 资源地址
 * @param string $layer 模型层名称
 * @return Think\Model
 */
function D($name='',$layer='') {
    if(empty($name)) return new Think\Model;
    static $_model  =   array();
    $layer          =   $layer? : C('DEFAULT_M_LAYER');
    if(isset($_model[$name.$layer]))
        return $_model[$name.$layer];
    $class          =   parse_res_name($name,$layer);
    if(class_exists($class)) {
        $model      =   new $class(basename($name));
    }elseif(false === strpos($name,'/')){
        // 自动加载公共模块下面的模型
        if(!C('APP_USE_NAMESPACE')){
            import('Common/'.$layer.'/'.$class);
        }else{
            $class      =   '\\Common\\'.$layer.'\\'.$name.$layer;
        }
        $model      =   class_exists($class)? new $class($name) : new Think\Model($name);
    }else {
        Think\Log::record('D方法实例化没找到模型类'.$class,Think\Log::NOTICE);
        $model      =   new Think\Model(basename($name));
    }
    $_model[$name.$layer]  =  $model;
    return $model;
}

/**
 * 实例化一个没有模型文件的Model
 * @param string $name Model名称 支持指定基础模型 例如 MongoModel:User
 * @param string $tablePrefix 表前缀
 * @param mixed $connection 数据库连接信息
 * @return Think\Model
 */
function M($name='', $tablePrefix='',$connection='') {
    static $_model  = array();
    if(strpos($name,':')) {
        list($class,$name)    =  explode(':',$name);
    }else{
        $class      =   'Think\\Model';
    }
    $guid           =   (is_array($connection)?implode('',$connection):$connection).$tablePrefix . $name . '_' . $class;
    if (!isset($_model[$guid]))
        $_model[$guid] = new $class($name,$tablePrefix,$connection);
    return $_model[$guid];
}

/**
 * 解析资源地址并导入类库文件
 * 例如 module/controller addon://module/behavior
 * @param string $name 资源地址 格式：[扩展://][模块/]资源名
 * @param string $layer 分层名称
 * @param integer $level 控制器层次
 * @return string
 */
function parse_res_name($name,$layer,$level=1){
    if(strpos($name,'://')) {// 指定扩展资源
        list($extend,$name)  =   explode('://',$name);
    }else{
        $extend  =   '';
    }
    if(strpos($name,'/') && substr_count($name, '/')>=$level){ // 指定模块
        list($module,$name) =  explode('/',$name,2);
    }else{
        $module =   defined('MODULE_NAME') ? MODULE_NAME : '' ;
    }
    $array  =   explode('/',$name);
    if(!C('APP_USE_NAMESPACE')){
        $class  =   parse_name($name, 1);
        import($module.'/'.$layer.'/'.$class.$layer);
    }else{
        $class  =   $module.'\\'.$layer;
        foreach($array as $name){
            $class  .=   '\\'.parse_name($name, 1);
        }
        // 导入资源类库
        if($extend){ // 扩展资源
            $class      =   $extend.'\\'.$class;
        }
    }
    return $class.$layer;
}

/**
 * 用于实例化访问控制器
 * @param string $name 控制器名
 * @param string $path 控制器命名空间（路径）
 * @return Think\Controller|false
 */
function controller($name,$path=''){
    $layer  =   C('DEFAULT_C_LAYER');
    if(!C('APP_USE_NAMESPACE')){
        $class  =   parse_name($name, 1).$layer;
        import(MODULE_NAME.'/'.$layer.'/'.$class);
    }else{
        $class  =   ( $path ? basename(ADDON_PATH).'\\'.$path : MODULE_NAME ).'\\'.$layer;
        $array  =   explode('/',$name);
        foreach($array as $name){
            $class  .=   '\\'.parse_name($name, 1);
        }
        $class .=   $layer;
    }
    if(class_exists($class)) {
        return new $class();
    }else {
        return false;
    }
}

/**
 * 实例化多层控制器 格式：[资源://][模块/]控制器
 * @param string $name 资源地址
 * @param string $layer 控制层名称
 * @param integer $level 控制器层次
 * @return Think\Controller|false
 */
function A($name,$layer='',$level=0) {
    static $_action = array();
    $layer  =   $layer? : C('DEFAULT_C_LAYER');
    $level  =   $level? : ($layer == C('DEFAULT_C_LAYER')?C('CONTROLLER_LEVEL'):1);
    if(isset($_action[$name.$layer]))
        return $_action[$name.$layer];

    $class  =   parse_res_name($name,$layer,$level);
    if(class_exists($class)) {
        $action             =   new $class();
        $_action[$name.$layer]     =   $action;
        return $action;
    }else {
        return false;
    }
}


/**
 * 远程调用控制器的操作方法 URL 参数格式 [资源://][模块/]控制器/操作
 * @param string $url 调用地址
 * @param string|array $vars 调用参数 支持字符串和数组
 * @param string $layer 要调用的控制层名称
 * @return mixed
 */
function R($url,$vars=array(),$layer='') {
    $info   =   pathinfo($url);
    $action =   $info['basename'];
    $module =   $info['dirname'];
    $class  =   A($module,$layer);
    if($class){
        if(is_string($vars)) {
            parse_str($vars,$vars);
        }
        return call_user_func_array(array(&$class,$action.C('ACTION_SUFFIX')),$vars);
    }else{
        return false;
    }
}

/**
 * 处理标签扩展
 * @param string $tag 标签名称
 * @param mixed $params 传入参数
 * @return void
 */
function tag($tag, &$params=NULL) {
    \Think\Hook::listen($tag,$params);
}

/**
 * 执行某个行为
 * @param string $name 行为名称
 * @param string $tag 标签名称（行为类无需传入）
 * @param Mixed $params 传入的参数
 * @return void
 */
function B($name, $tag='',&$params=NULL) {
    if(''==$tag){
        $name   .=  'Behavior';
    }
    return \Think\Hook::exec($name,$tag,$params);
}

/**
 * 去除代码中的空白和注释
 * @param string $content 代码内容
 * @return string
 */
function strip_whitespace($content) {
    $stripStr   = '';
    //分析php源码
    $tokens     = token_get_all($content);
    $last_space = false;
    for ($i = 0, $j = count($tokens); $i < $j; $i++) {
        if (is_string($tokens[$i])) {
            $last_space = false;
            $stripStr  .= $tokens[$i];
        } else {
            switch ($tokens[$i][0]) {
                //过滤各种PHP注释
                case T_COMMENT:
                case T_DOC_COMMENT:
                    break;
                //过滤空格
                case T_WHITESPACE:
                    if (!$last_space) {
                        $stripStr  .= ' ';
                        $last_space = true;
                    }
                    break;
                case T_START_HEREDOC:
                    $stripStr .= "<<<THINK\n";
                    break;
                case T_END_HEREDOC:
                    $stripStr .= "THINK;\n";
                    for($k = $i+1; $k < $j; $k++) {
                        if(is_string($tokens[$k]) && $tokens[$k] == ';') {
                            $i = $k;
                            break;
                        } else if($tokens[$k][0] == T_CLOSE_TAG) {
                            break;
                        }
                    }
                    break;
                default:
                    $last_space = false;
                    $stripStr  .= $tokens[$i][1];
            }
        }
    }
    return $stripStr;
}

/**
 * 自定义异常处理
 * @param string $msg 异常消息
 * @param string $type 异常类型 默认为Think\Exception
 * @param integer $code 异常代码 默认为0
 * @return void
 */
function throw_exception($msg, $type='Think\\Exception', $code=0) {
    Think\Log::record('建议使用E方法替代throw_exception',Think\Log::NOTICE);
    if (class_exists($type, false))
        throw new $type($msg, $code);
    else
        Think\Think::halt($msg);        // 异常类型不存在则输出错误信息字串
}

/**
 * 浏览器友好的变量输出
 * @param mixed $var 变量
 * @param boolean $echo 是否输出 默认为True 如果为false 则返回输出字符串
 * @param string $label 标签 默认为空
 * @param boolean $strict 是否严谨 默认为true
 * @return void|string
 */
function dump($var, $echo=true, $label=null, $strict=true) {
    $label = ($label === null) ? '' : rtrim($label) . ' ';
    if (!$strict) {
        if (ini_get('html_errors')) {
            $output = print_r($var, true);
            $output = '<pre>' . $label . htmlspecialchars($output, ENT_QUOTES) . '</pre>';
        } else {
            $output = $label . print_r($var, true);
        }
    } else {
        ob_start();
        var_dump($var);
        $output = ob_get_clean();
        if (!extension_loaded('xdebug')) {
            $output = preg_replace('/\]\=\>\n(\s+)/m', '] => ', $output);
            $output = '<pre>' . $label . htmlspecialchars($output, ENT_QUOTES) . '</pre>';
        }
    }
    if ($echo) {
        echo($output);
        return null;
    }else
        return $output;
}

/**
 * 设置当前页面的布局
 * @param string|false $layout 布局名称 为false的时候表示关闭布局
 * @return void
 */
function layout($layout) {
    if(false !== $layout) {
        // 开启布局
        C('LAYOUT_ON',true);
        if(is_string($layout)) { // 设置新的布局模板
            C('LAYOUT_NAME',$layout);
        }
    }else{// 临时关闭布局
        C('LAYOUT_ON',false);
    }
}

/**
 * URL组装 支持不同URL模式
 * @param string $url URL表达式，格式：'[模块/控制器/操作#锚点@域名]?参数1=值1&参数2=值2...'
 * @param string|array $vars 传入的参数，支持数组和字符串
 * @param string|boolean $suffix 伪静态后缀，默认为true表示获取配置值
 * @param boolean $domain 是否显示域名
 * @return string
 */
function U($url='',$vars='',$suffix=true,$domain=false) {
    // 解析URL
    $info   =  parse_url($url);
    $url    =  !empty($info['path'])?$info['path']:ACTION_NAME;
    if(isset($info['fragment'])) { // 解析锚点
        $anchor =   $info['fragment'];
        if(false !== strpos($anchor,'?')) { // 解析参数
            list($anchor,$info['query']) = explode('?',$anchor,2);
        }
        if(false !== strpos($anchor,'@')) { // 解析域名
            list($anchor,$host)    =   explode('@',$anchor, 2);
        }
    }elseif(false !== strpos($url,'@')) { // 解析域名
        list($url,$host)    =   explode('@',$info['path'], 2);
    }
    // 解析子域名
    if(isset($host)) {
        $domain = $host.(strpos($host,'.')?'':strstr($_SERVER['HTTP_HOST'],'.'));
    }elseif($domain===true){
        $domain = $_SERVER['HTTP_HOST'];
        if(C('APP_SUB_DOMAIN_DEPLOY') ) { // 开启子域名部署
            $domain = $domain=='localhost'?'localhost':'www'.strstr($_SERVER['HTTP_HOST'],'.');
            // '子域名'=>array('模块[/控制器]');
            foreach (C('APP_SUB_DOMAIN_RULES') as $key => $rule) {
                $rule   =   is_array($rule)?$rule[0]:$rule;
                if(false === strpos($key,'*') && 0=== strpos($url,$rule)) {
                    $domain = $key.strstr($domain,'.'); // 生成对应子域名
                    $url    =  substr_replace($url,'',0,strlen($rule));
                    break;
                }
            }
        }
    }

    // 解析参数
    if(is_string($vars)) { // aaa=1&bbb=2 转换成数组
        parse_str($vars,$vars);
    }elseif(!is_array($vars)){
        $vars = array();
    }
    if(isset($info['query'])) { // 解析地址里面参数 合并到vars
        parse_str($info['query'],$params);
        $vars = array_merge($params,$vars);
    }

    // URL组装
    $depr       =   C('URL_PATHINFO_DEPR');
    $urlCase    =   C('URL_CASE_INSENSITIVE');
    if($url) {
        if(0=== strpos($url,'/')) {// 定义路由
            $route      =   true;
            $url        =   substr($url,1);
            if('/' != $depr) {
                $url    =   str_replace('/',$depr,$url);
            }
        }else{
            if('/' != $depr) { // 安全替换
                $url    =   str_replace('/',$depr,$url);
            }
            // 解析模块、控制器和操作
            $url        =   trim($url,$depr);
            $path       =   explode($depr,$url);
            $var        =   array();
            $varModule      =   C('VAR_MODULE');
            $varController  =   C('VAR_CONTROLLER');
            $varAction      =   C('VAR_ACTION');
            $var[$varAction]       =   !empty($path)?array_pop($path):ACTION_NAME;
            $var[$varController]   =   !empty($path)?array_pop($path):CONTROLLER_NAME;
            if($maps = C('URL_ACTION_MAP')) {
                if(isset($maps[strtolower($var[$varController])])) {
                    $maps    =   $maps[strtolower($var[$varController])];
                    if($action = array_search(strtolower($var[$varAction]),$maps)){
                        $var[$varAction] = $action;
                    }
                }
            }
            if($maps = C('URL_CONTROLLER_MAP')) {
                if($controller = array_search(strtolower($var[$varController]),$maps)){
                    $var[$varController] = $controller;
                }
            }
            if($urlCase) {
                $var[$varController]   =   parse_name($var[$varController]);
            }
            $module =   '';

            if(!empty($path)) {
                $var[$varModule]    =   implode($depr,$path);
            }else{
                if(C('MULTI_MODULE')) {
                    if(MODULE_NAME != C('DEFAULT_MODULE') || !C('MODULE_ALLOW_LIST')){
                        $var[$varModule]=   MODULE_NAME;
                    }
                }
            }
            if($maps = C('URL_MODULE_MAP')) {
                if($_module = array_search(strtolower($var[$varModule]),$maps)){
                    $var[$varModule] = $_module;
                }
            }
            if(isset($var[$varModule])){
                $module =   $var[$varModule];
                unset($var[$varModule]);
            }

        }
    }

    if(C('URL_MODEL') == 0) { // 普通模式URL转换
        $url        =   __APP__.'?'.C('VAR_MODULE')."={$module}&".http_build_query(array_reverse($var));
        if($urlCase){
            $url    =   strtolower($url);
        }
        if(!empty($vars)) {
            $vars   =   http_build_query($vars);
            $url   .=   '&'.$vars;
        }
    }else{ // PATHINFO模式或者兼容URL模式
        if(isset($route)) {
            $url    =   __APP__.'/'.rtrim($url,$depr);
        }else{
            $module =   (defined('BIND_MODULE') && BIND_MODULE==$module )? '' : $module;
            $url    =   __APP__.'/'.($module?$module.MODULE_PATHINFO_DEPR:'').implode($depr,array_reverse($var));
        }
        if($urlCase){
            $url    =   strtolower($url);
        }
        if(!empty($vars)) { // 添加参数
            foreach ($vars as $var => $val){
                if('' !== trim($val))   $url .= $depr . $var . $depr . urlencode($val);
            }
        }
        if($suffix) {
            $suffix   =  $suffix===true?C('URL_HTML_SUFFIX'):$suffix;
            if($pos = strpos($suffix, '|')){
                $suffix = substr($suffix, 0, $pos);
            }
            if($suffix && '/' != substr($url,-1)){
                $url  .=  '.'.ltrim($suffix,'.');
            }
        }
    }
    if(isset($anchor)){
        $url  .= '#'.$anchor;
    }
    if($domain) {
        $url   =  (is_ssl()?'https://':'http://').$domain.$url;
    }
    return $url;
}

/**
 * 渲染输出Widget
 * @param string $name Widget名称
 * @param array $data 传入的参数
 * @return void
 */
function W($name, $data=array()) {
    return R($name,$data,'Widget');
}

/**
 * 判断是否SSL协议
 * @return boolean
 */
function is_ssl() {
    if(isset($_SERVER['HTTPS']) && ('1' == $_SERVER['HTTPS'] || 'on' == strtolower($_SERVER['HTTPS']))){
        return true;
    }elseif(isset($_SERVER['SERVER_PORT']) && ('443' == $_SERVER['SERVER_PORT'] )) {
        return true;
    }
    return false;
}

/**
 * URL重定向
 * @param string $url 重定向的URL地址
 * @param integer $time 重定向的等待时间（秒）
 * @param string $msg 重定向前的提示信息
 * @return void
 */
function redirect($url, $time=0, $msg='') {
    //多行URL地址支持
    $url        = str_replace(array("\n", "\r"), '', $url);
    if (empty($msg))
        $msg    = "系统将在{$time}秒之后自动跳转到{$url}！";
    if (!headers_sent()) {
        // redirect
        if (0 === $time) {
            header('Location: ' . $url);
        } else {
            header("refresh:{$time};url={$url}");
            echo($msg);
        }
        exit();
    } else {
        $str    = "<meta http-equiv='Refresh' content='{$time};URL={$url}'>";
        if ($time != 0)
            $str .= $msg;
        exit($str);
    }
}

/**
 * 缓存管理
 * @param mixed $name 缓存名称，如果为数组表示进行缓存设置
 * @param mixed $value 缓存值
 * @param mixed $options 缓存参数
 * @return mixed
 */
function S($name,$value='',$options=null) {
    static $cache   =   '';
    if(is_array($options)){
        // 缓存操作的同时初始化
        $type       =   isset($options['type'])?$options['type']:'';
        $cache      =   Think\Cache::getInstance($type,$options);
    }elseif(is_array($name)) { // 缓存初始化
        $type       =   isset($name['type'])?$name['type']:'';
        $cache      =   Think\Cache::getInstance($type,$name);
        return $cache;
    }elseif(empty($cache)) { // 自动初始化
        $cache      =   Think\Cache::getInstance();
    }
    if(''=== $value){ // 获取缓存
        return $cache->get($name);
    }elseif(is_null($value)) { // 删除缓存
        return $cache->rm($name);
    }else { // 缓存数据
        if(is_array($options)) {
            $expire     =   isset($options['expire'])?$options['expire']:NULL;
        }else{
            $expire     =   is_numeric($options)?$options:NULL;
        }
        return $cache->set($name, $value, $expire);
    }
}

/**
 * 快速文件数据读取和保存 针对简单类型数据 字符串、数组
 * @param string $name 缓存名称
 * @param mixed $value 缓存值
 * @param string $path 缓存路径
 * @return mixed
 */
function F($name, $value='', $path=DATA_PATH) {
    static $_cache  =   array();
    $filename       =   $path . $name . '.php';
    if ('' !== $value) {
        if (is_null($value)) {
            // 删除缓存
            if(false !== strpos($name,'*')){
                return false; // TODO
            }else{
                unset($_cache[$name]);
                return Think\Storage::unlink($filename,'F');
            }
        } else {
            Think\Storage::put($filename,serialize($value),'F');
            // 缓存数据
            $_cache[$name]  =   $value;
            return null;
        }
    }
    // 获取缓存数据
    if (isset($_cache[$name]))
        return $_cache[$name];
    if (Think\Storage::has($filename,'F')){
        $value      =   unserialize(Think\Storage::read($filename,'F'));
        $_cache[$name]  =   $value;
    } else {
        $value          =   false;
    }
    return $value;
}

/**
 * 根据PHP各种类型变量生成唯一标识号
 * @param mixed $mix 变量
 * @return string
 */
function to_guid_string($mix) {
    if (is_object($mix)) {
        return spl_object_hash($mix);
    } elseif (is_resource($mix)) {
        $mix = get_resource_type($mix) . strval($mix);
    } else {
        $mix = serialize($mix);
    }
    return md5($mix);
}

/**
 * XML编码
 * @param mixed $data 数据
 * @param string $root 根节点名
 * @param string $item 数字索引的子节点名
 * @param string $attr 根节点属性
 * @param string $id   数字索引子节点key转换的属性名
 * @param string $encoding 数据编码
 * @return string
 */
function xml_encode($data, $root='think', $item='item', $attr='', $id='id', $encoding='utf-8') {
    if(is_array($attr)){
        $_attr = array();
        foreach ($attr as $key => $value) {
            $_attr[] = "{$key}=\"{$value}\"";
        }
        $attr = implode(' ', $_attr);
    }
    $attr   = trim($attr);
    $attr   = empty($attr) ? '' : " {$attr}";
    $xml    = "<?xml version=\"1.0\" encoding=\"{$encoding}\"?>";
    $xml   .= "<{$root}{$attr}>";
    $xml   .= data_to_xml($data, $item, $id);
    $xml   .= "</{$root}>";
    return $xml;
}

/**
 * 数据XML编码
 * @param mixed  $data 数据
 * @param string $item 数字索引时的节点名称
 * @param string $id   数字索引key转换为的属性名
 * @return string
 */
function data_to_xml($data, $item='item', $id='id') {
    $xml = $attr = '';
    foreach ($data as $key => $val) {
        if(is_numeric($key)){
            $id && $attr = " {$id}=\"{$key}\"";
            $key  = $item;
        }
        $xml    .=  "<{$key}{$attr}>";
        $xml    .=  (is_array($val) || is_object($val)) ? data_to_xml($val, $item, $id) : $val;
        $xml    .=  "</{$key}>";
    }
    return $xml;
}

/**
 * session管理函数
 * @param string|array $name session名称 如果为数组则表示进行session设置
 * @param mixed $value session值
 * @return mixed
 */
function session($name='',$value='') {
    $prefix   =  C('SESSION_PREFIX');
    if(is_array($name)) { // session初始化 在session_start 之前调用
        if(isset($name['prefix'])) C('SESSION_PREFIX',$name['prefix']);
        if(C('VAR_SESSION_ID') && isset($_REQUEST[C('VAR_SESSION_ID')])){
            session_id($_REQUEST[C('VAR_SESSION_ID')]);
        }elseif(isset($name['id'])) {
            session_id($name['id']);
        }
        if('common' == APP_MODE){ // 其它模式可能不支持
            ini_set('session.auto_start', 0);
        }
        if(isset($name['name']))            session_name($name['name']);
        if(isset($name['path']))            session_save_path($name['path']);
        if(isset($name['domain']))          ini_set('session.cookie_domain', $name['domain']);
        if(isset($name['expire']))          {
            ini_set('session.gc_maxlifetime',   $name['expire']);
            ini_set('session.cookie_lifetime',  $name['expire']);
        }
        if(isset($name['use_trans_sid']))   ini_set('session.use_trans_sid', $name['use_trans_sid']?1:0);
        if(isset($name['use_cookies']))     ini_set('session.use_cookies', $name['use_cookies']?1:0);
        if(isset($name['cache_limiter']))   session_cache_limiter($name['cache_limiter']);
        if(isset($name['cache_expire']))    session_cache_expire($name['cache_expire']);
        if(isset($name['type']))            C('SESSION_TYPE',$name['type']);
        if(C('SESSION_TYPE')) { // 读取session驱动
            $type   =   C('SESSION_TYPE');
            $class  =   strpos($type,'\\')? $type : 'Think\\Session\\Driver\\'. ucwords(strtolower($type));
            $hander =   new $class();
            session_set_save_handler(
                array(&$hander,"open"),
                array(&$hander,"close"),
                array(&$hander,"read"),
                array(&$hander,"write"),
                array(&$hander,"destroy"),
                array(&$hander,"gc"));
        }
        // 启动session
        if(C('SESSION_AUTO_START'))  session_start();
    }elseif('' === $value){
        if(''===$name){
            // 获取全部的session
            return $prefix ? $_SESSION[$prefix] : $_SESSION;
        }elseif(0===strpos($name,'[')) { // session 操作
            if('[pause]'==$name){ // 暂停session
                session_write_close();
            }elseif('[start]'==$name){ // 启动session
                session_start();
            }elseif('[destroy]'==$name){ // 销毁session
                $_SESSION =  array();
                session_unset();
                session_destroy();
            }elseif('[regenerate]'==$name){ // 重新生成id
                session_regenerate_id();
            }
        }elseif(0===strpos($name,'?')){ // 检查session
            $name   =  substr($name,1);
            if(strpos($name,'.')){ // 支持数组
                list($name1,$name2) =   explode('.',$name);
                return $prefix?isset($_SESSION[$prefix][$name1][$name2]):isset($_SESSION[$name1][$name2]);
            }else{
                return $prefix?isset($_SESSION[$prefix][$name]):isset($_SESSION[$name]);
            }
        }elseif(is_null($name)){ // 清空session
            if($prefix) {
                unset($_SESSION[$prefix]);
            }else{
                $_SESSION = array();
            }
        }elseif($prefix){ // 获取session
            if(strpos($name,'.')){
                list($name1,$name2) =   explode('.',$name);
                return isset($_SESSION[$prefix][$name1][$name2])?$_SESSION[$prefix][$name1][$name2]:null;
            }else{
                return isset($_SESSION[$prefix][$name])?$_SESSION[$prefix][$name]:null;
            }
        }else{
            if(strpos($name,'.')){
                list($name1,$name2) =   explode('.',$name);
                return isset($_SESSION[$name1][$name2])?$_SESSION[$name1][$name2]:null;
            }else{
                return isset($_SESSION[$name])?$_SESSION[$name]:null;
            }
        }
    }elseif(is_null($value)){ // 删除session
        if(strpos($name,'.')){
            list($name1,$name2) =   explode('.',$name);
            if($prefix){
                unset($_SESSION[$prefix][$name1][$name2]);
            }else{
                unset($_SESSION[$name1][$name2]);
            }
        }else{
            if($prefix){
                unset($_SESSION[$prefix][$name]);
            }else{
                unset($_SESSION[$name]);
            }
        }
    }else{ // 设置session
		if(strpos($name,'.')){
			list($name1,$name2) =   explode('.',$name);
			if($prefix){
				$_SESSION[$prefix][$name1][$name2]   =  $value;
			}else{
				$_SESSION[$name1][$name2]  =  $value;
			}
		}else{
			if($prefix){
				$_SESSION[$prefix][$name]   =  $value;
			}else{
				$_SESSION[$name]  =  $value;
			}
		}
    }
    return null;
}

/**
 * Cookie 设置、获取、删除
 * @param string $name cookie名称
 * @param mixed $value cookie值
 * @param mixed $option cookie参数
 * @return mixed
 */
function cookie($name='', $value='', $option=null) {
    // 默认设置
    $config = array(
        'prefix'    =>  C('COOKIE_PREFIX'), // cookie 名称前缀
        'expire'    =>  C('COOKIE_EXPIRE'), // cookie 保存时间
        'path'      =>  C('COOKIE_PATH'), // cookie 保存路径
        'domain'    =>  C('COOKIE_DOMAIN'), // cookie 有效域名
        'secure'    =>  C('COOKIE_SECURE'), //  cookie 启用安全传输
        'httponly'  =>  C('COOKIE_HTTPONLY'), // httponly设置
    );
    // 参数设置(会覆盖黙认设置)
    if (!is_null($option)) {
        if (is_numeric($option))
            $option = array('expire' => $option);
        elseif (is_string($option))
            parse_str($option, $option);
        $config     = array_merge($config, array_change_key_case($option));
    }
    if(!empty($config['httponly'])){
        ini_set("session.cookie_httponly", 1);
    }
    // 清除指定前缀的所有cookie
    if (is_null($name)) {
        if (empty($_COOKIE))
            return null;
        // 要删除的cookie前缀，不指定则删除config设置的指定前缀
        $prefix = empty($value) ? $config['prefix'] : $value;
        if (!empty($prefix)) {// 如果前缀为空字符串将不作处理直接返回
            foreach ($_COOKIE as $key => $val) {
                if (0 === stripos($key, $prefix)) {
                    setcookie($key, '', time() - 3600, $config['path'], $config['domain'],$config['secure'],$config['httponly']);
                    unset($_COOKIE[$key]);
                }
            }
        }
        return null;
    }elseif('' === $name){
        // 获取全部的cookie
        return $_COOKIE;
    }
    $name = $config['prefix'] . str_replace('.', '_', $name);
    if ('' === $value) {
        if(isset($_COOKIE[$name])){
            $value =    $_COOKIE[$name];
            if(0===strpos($value,'think:')){
                $value  =   substr($value,6);
                return array_map('urldecode',json_decode(MAGIC_QUOTES_GPC?stripslashes($value):$value,true));
            }else{
                return $value;
            }
        }else{
            return null;
        }
    } else {
        if (is_null($value)) {
            setcookie($name, '', time() - 3600, $config['path'], $config['domain'],$config['secure'],$config['httponly']);
            unset($_COOKIE[$name]); // 删除指定cookie
        } else {
            // 设置cookie
            if(is_array($value)){
                $value  = 'think:'.json_encode(array_map('urlencode',$value));
            }
            $expire = !empty($config['expire']) ? time() + intval($config['expire']) : 0;
            setcookie($name, $value, $expire, $config['path'], $config['domain'],$config['secure'],$config['httponly']);
            $_COOKIE[$name] = $value;
        }
    }
    return null;
}

/**
 * 加载动态扩展文件
 * @var string $path 文件路径
 * @return void
 */
function load_ext_file($path) {
    // 加载自定义外部文件
    if($files = C('LOAD_EXT_FILE')) {
        $files      =  explode(',',$files);
        foreach ($files as $file){
            $file   = $path.'Common/'.$file.'.php';
            if(is_file($file)) include $file;
        }
    }
    // 加载自定义的动态配置文件
    if($configs = C('LOAD_EXT_CONFIG')) {
        if(is_string($configs)) $configs =  explode(',',$configs);
        foreach ($configs as $key=>$config){
            $file   = is_file($config)? $config : $path.'Conf/'.$config.CONF_EXT;
            if(is_file($file)) {
                is_numeric($key)?C(load_config($file)):C($key,load_config($file));
            }
        }
    }
}

/**
 * 获取客户端IP地址
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @param boolean $adv 是否进行高级模式获取（有可能被伪装）
 * @return mixed
 */
function get_client_ip($type = 0,$adv=false) {
    $type       =  $type ? 1 : 0;
    static $ip  =   NULL;
    if ($ip !== NULL) return $ip[$type];
    if($adv){
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos    =   array_search('unknown',$arr);
            if(false !== $pos) unset($arr[$pos]);
            $ip     =   trim($arr[0]);
        }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip     =   $_SERVER['HTTP_CLIENT_IP'];
        }elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip     =   $_SERVER['REMOTE_ADDR'];
        }
    }else{
        if (getenv('HTTP_X_FORWARDED_FOR')) {
             $ip = getenv('HTTP_X_FORWARDED_FOR');
        } elseif (getenv('HTTP_CLIENT_ip')) {
             $ip = getenv('HTTP_CLIENT_ip');
        } else {
             $ip = getenv('REMOTE_ADDR');
        }
    }
    // IP地址合法验证
    $long = sprintf("%u",ip2long($ip));
    $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}

/**
 * 发送HTTP状态
 * @param integer $code 状态码
 * @return void
 */
function send_http_status($code) {
    static $_status = array(
            // Informational 1xx
            100 => 'Continue',
            101 => 'Switching Protocols',
            // Success 2xx
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            203 => 'Non-Authoritative Information',
            204 => 'No Content',
            205 => 'Reset Content',
            206 => 'Partial Content',
            // Redirection 3xx
            300 => 'Multiple Choices',
            301 => 'Moved Permanently',
            302 => 'Moved Temporarily ',  // 1.1
            303 => 'See Other',
            304 => 'Not Modified',
            305 => 'Use Proxy',
            // 306 is deprecated but reserved
            307 => 'Temporary Redirect',
            // Client Error 4xx
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            406 => 'Not Acceptable',
            407 => 'Proxy Authentication Required',
            408 => 'Request Timeout',
            409 => 'Conflict',
            410 => 'Gone',
            411 => 'Length Required',
            412 => 'Precondition Failed',
            413 => 'Request Entity Too Large',
            414 => 'Request-URI Too Long',
            415 => 'Unsupported Media Type',
            416 => 'Requested Range Not Satisfiable',
            417 => 'Expectation Failed',
            // Server Error 5xx
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            504 => 'Gateway Timeout',
            505 => 'HTTP Version Not Supported',
            509 => 'Bandwidth Limit Exceeded'
    );
    if(isset($_status[$code])) {
        header('HTTP/1.1 '.$code.' '.$_status[$code]);
        // 确保FastCGI模式下正常
        header('Status:'.$code.' '.$_status[$code]);
    }
}

function think_filter(&$value){
	// TODO 其他安全过滤

	// 过滤查询特殊字符
    if(preg_match('/^(EXP|NEQ|GT|EGT|LT|ELT|OR|XOR|LIKE|NOTLIKE|NOT BETWEEN|NOTBETWEEN|BETWEEN|NOTIN|NOT IN|IN)$/i',$value)){
        $value .= ' ';
    }
}

// 不区分大小写的in_array实现
function in_array_case($value,$array){
    return in_array(strtolower($value),array_map('strtolower',$array));
}



/**
 * URL添加参数
 * @param string $url
 * @param mixed $param
 * @return string
 */
function url_append_param($url, $param){
	if(empty($param)){
		return $url;
	}

	$aParse = parse_url($url);
	$aParams = array();
	parse_str($aParse['query'], $aParams);

	$aNewParams = array();
	if(is_string($param)){
		parse_str($param, $aNewParams);
	}else{
		$aNewParams = $param;
	}

	$aNewParams = array_merge($aParams, $aNewParams);

	$link = ($aParse['scheme']?$aParse['scheme'].'://':'')
	. $aParse['host']
	. $aParse['path']
	. '?' . http_build_query($aNewParams)
	. ($aParse['fragment']?'#' . $aParse['fragment']:'');

	return $link;
}

/**
 *  获取回调url
 *
 *  @param string $default 默认跳转链接
 *  @return string
 *  @access public
 */
function get_redirect($default='')
{
	$rdParam = C('VAR_REDIRECT');
	if (!empty($_POST[$rdParam])){
		$redirect = $_POST[$rdParam];
	}
	else if (!empty($_GET[$rdParam])){
		$redirect = $_GET[$rdParam];
	}
	else if($default){
		$redirect = $default;
	}
	/*
	 elseif ($_SERVER['HTTP_REFERER'])
		{
	$redirect = $_SERVER['HTTP_REFERER'];
	}
	*/
	else{
		$redirect = 'http://' . $_SERVER['SERVER_NAME'];
	}

	if ((isset($_REQUEST['paramEncode']) && $_REQUEST['paramEncode']=='js')

	|| (strtolower($_REQUEST['encoding'])=='utf8' || strtolower($_REQUEST['encoding'])=='utf-8') );
	{
		if(isset($_REQUEST['paramEncode']))  unset($_REQUEST['rdEncode']);
		if(isset($_REQUEST['encoding'])) unset($_REQUEST['encoding']);
		//$redirect = Coder::unescape($redirect);
	}

	return $redirect;
}


/**
 *  翻译字符串到当前或指定语言
 * @return
 *   The translated string.
 *
 * @see st()
 * @see get_t()
 * @see format_string()
 * @ingroup sanitization
 */
function TL($string, array $args = array(), array $options = array()) {
	return $string;
}



/**
 * 检测验证码
 * @param  integer $id 验证码ID
 * @return boolean     检测结果
 */
function check_verify($code, $id = 1){
	$verify = new \Think\Verify();
	return $verify->check($code, $id);
}


/**
 * URL组装 支持不同URL模式
 * @param string $url URL表达式，格式：'[模块/控制器/操作#锚点@域名]?参数1=值1&参数2=值2...'
 * @param string|array $vars 传入的参数，支持数组和字符串
 * @param string $suffix 伪静态后缀，默认为true表示获取配置值
 * @param boolean $domain 是否显示域名
 * @return string
 */
function UC($url='',$vars='',$suffix=true,$domain=false) {
	// 解析URL
	$info   =  parse_url($url);
	$url    =  !empty($info['path'])?$info['path']:ACTION_NAME;
	if(isset($info['fragment'])) { // 解析锚点
		$anchor =   $info['fragment'];
		if(false !== strpos($anchor,'?')) { // 解析参数
			list($anchor,$info['query']) = explode('?',$anchor,2);
		}
		if(false !== strpos($anchor,'@')) { // 解析域名
			list($anchor,$host)    =   explode('@',$anchor, 2);
		}
	}elseif(false !== strpos($url,'@')) { // 解析域名
		list($url,$host)    =   explode('@',$info['path'], 2);
	}
	// 解析子域名
	if(isset($host)) {
		$domain = $host.(strpos($host,'.')?'':strstr($_SERVER['HTTP_HOST'],'.'));
	}elseif($domain===true){
		$domain = $_SERVER['HTTP_HOST'];
		if(C('APP_SUB_DOMAIN_DEPLOY') ) { // 开启子域名部署
			$domain = $domain=='localhost'?'localhost':'www'.strstr($_SERVER['HTTP_HOST'],'.');
			// '子域名'=>array('模块[/控制器]');
			foreach (C('APP_SUB_DOMAIN_RULES') as $key => $rule) {
				$rule   =   is_array($rule)?$rule[0]:$rule;
				if(false === strpos($key,'*') && 0=== strpos($url,$rule)) {
					$domain = $key.strstr($domain,'.'); // 生成对应子域名
					$url    =  substr_replace($url,'',0,strlen($rule));
					break;
				}
			}
		}
	}

	// 解析参数
	if(is_string($vars)) { // aaa=1&bbb=2 转换成数组
		parse_str($vars,$vars);
	}elseif(!is_array($vars)){
		$vars = array();
	}
	if(isset($info['query'])) { // 解析地址里面参数 合并到vars
		parse_str($info['query'],$params);
		$vars = array_merge($params,$vars);
	}

	// URL组装
	$depr       =   C('URL_PATHINFO_DEPR');
	$urlCase    =   C('URL_CASE_INSENSITIVE');
	if($url) {
		if(0=== strpos($url,'/')) {// 定义路由
			$route      =   true;
			$url        =   substr($url,1);
			if('/' != $depr) {
				$url    =   str_replace('/',$depr,$url);
			}
		}else{
			if('/' != $depr) { // 安全替换
				$url    =   str_replace('/',$depr,$url);
			}
			// 解析模块、控制器和操作
			$url        =   trim($url,$depr);
			$path       =   explode($depr,$url);
			$var        =   array();
			$varModule      =   C('VAR_MODULE');
			$varController  =   C('VAR_CONTROLLER');
			$varAction      =   C('VAR_ACTION');
			$var[$varAction]       =   !empty($path)?array_pop($path):ACTION_NAME;
			$var[$varController]   =   !empty($path)?array_pop($path):CONTROLLER_NAME;
			if($maps = C('URL_ACTION_MAP')) {
				if(isset($maps[strtolower($var[$varController])])) {
					$maps    =   $maps[strtolower($var[$varController])];
					if($action = array_search(strtolower($var[$varAction]),$maps)){
						$var[$varAction] = $action;
					}
				}
			}
			if($maps = C('URL_CONTROLLER_MAP')) {
				if($controller = array_search(strtolower($var[$varController]),$maps)){
					$var[$varController] = $controller;
				}
			}
			if($urlCase) {
				$var[$varController]   =   parse_name($var[$varController]);
			}
			$module =   '';

			if(!empty($path)) {
				$var[$varModule]    =   array_pop($path);
			}else{
				if(C('MULTI_MODULE')) {
					if(MODULE_NAME != C('DEFAULT_MODULE') || !C('MODULE_ALLOW_LIST')){
						$var[$varModule]=   MODULE_NAME;
					}
				}
			}
			if($maps = C('URL_MODULE_MAP')) {
				if($_module = array_search(strtolower($var[$varModule]),$maps)){
					$var[$varModule] = $_module;
				}
			}
			if(isset($var[$varModule])){
				$module =   $var[$varModule];
				unset($var[$varModule]);
			}

		}
	}

	if(C('URL_MODEL') == 0) { // 普通模式URL转换
		$url        =   __APP__.'?'.C('VAR_MODULE')."={$module}&".http_build_query(array_reverse($var));
		if($urlCase){
			$url    =   strtolower($url);
		}
		if(!empty($vars)) {
			$vars   =   http_build_query($vars);
			$url   .=   '&'.$vars;
		}
	}else{ // PATHINFO模式或者兼容URL模式
		if(isset($route)) {
			$url    =   __APP__.'/'.rtrim($url,$depr);
		}else{
			$module =   defined('BIND_MODULE') ? '' : $module;
			$url    =   __APP__.'/'.($module?$module.MODULE_PATHINFO_DEPR:'').implode($depr,array_reverse($var));
		}
		if($urlCase){
			$url    =   strtolower($url);
		}
		if(!empty($vars)) { // 添加参数
			foreach ($vars as $var => $val){
				if('' !== trim($val))   $url .= $depr . $var . $depr . urlencode($val);
			}
		}
		if($suffix) {
			$suffix   =  $suffix===true?C('URL_HTML_SUFFIX'):$suffix;
			if($pos = strpos($suffix, '|')){
				$suffix = substr($suffix, 0, $pos);
			}
			if($suffix && '/' != substr($url,-1)){
				$url  .=  '.'.ltrim($suffix,'.');
			}
		}
	}
	if(isset($anchor)){
		$url  .= '#'.$anchor;
	}
	if($domain) {
		$url   =  (is_ssl()?'https://':'http://').$domain.$url;
	}
	return $url;
}


/**
 * [keditor 编辑器]
 * @param   $param['name'] 字段名称英文
 * @param   $param['content'] 字段值
 * @param   $param['style'] 编辑器模式（默认完整  2简单模式）
 * @return string
 */
function keditor($param)
{
	$name = $param['name'];
	$content = $param['content'];
	$style = isset($param['style'])?$param['style']:1;
	$str='';
	$str .= "<script type='text/javascript' src='".__BASE__."static/Keditor/kindeditor-all-min.js'></script>";
	$uploadScript = U('Admin/Upload/keditor_upload');

	$toolbar = '';
	if($style==2)
	{

		$toolbar = '
            items :["source","code","fullscreen","|","forecolor", "bold", "italic", "underline",
        "removeformat", "|", "justifyleft", "justifycenter", "justifyright", "insertorderedlist",
        "insertunorderedlist", "|", "emoticons", "link"],';

	}


	$str .=<<<php
        <script type="text/javascript">
        var optionVar ='{$name}';
        KindEditor.ready(function(K) {
                var optionVar= "editor"+optionVar;
                optionVar = K.create('#{$name}', {
                    //cssPath : '../plugins/code/prettify.css',
                    //uploadJson : '__BASE__/static/Keditor/php/upload_json.php',
                    uploadJson : '{$uploadScript}',
                    fileManagerJson : '__BASE__static/Keditor/php/file_manager_json.php',
                    {$toolbar}
                    width:'99%',
                    height:'300px',
                    allowFileManager : true,
                    afterCreate : function() {
                        var self = this;
                        K.ctrl(document, 13, function() {
                            self.sync();
                            K('form[name=example]')[0].submit();
                        });
                        K.ctrl(self.edit.doc, 13, function() {
                            self.sync();
                            K('form[name=example]')[0].submit();
                        });
                    },
                    //langType:'en',
                    afterBlur: function(){this.sync();}
            });
        });
        </script>
        <textarea name="{$name}" id="{$name}" >{$content}</textarea>
php;
                    return $str;

}



/**
 * 判断目录是否存在 创建目录
 * @param unknown $dir
 * @param number $mode
 * @return boolean
 */
function check_dir($dir, $mode = 0755)
{
	if (is_dir($dir) || @mkdir($dir, $mode)){
		return true;
	}
	if (!(check_dir(dirname($dir), $mode))){
		return false;
	}
	return @mkdir($dir, $mode);
}



/**
 * html5单文件上传
 * @param   $param['name'] 字段名称英文
 * @param   $param['content'] 字段值
 * @param   $param['table'] 删除时回调操作的表
 * @param   $param['p_key'] 删除时回调操作的主键
 * @param   $param['field_name'] 删除时回调操作的主键字段名
 * @return string
 */
function unifile_upload($param)
{
	$name = $param['name'];
	$content = $param['content']?$param['content']:'';
	$table = $param['table']?$param['table']:'';
	$p_key = $param['p_key']?$param['p_key']:'';
	$field_name = $param['field_name']?$param['field_name']:'';
	$module = $param['module']?$param['module']:'other';
	$id_v = $param['id_v']?$param['id_v']:'addPic';
	$up_url = UC('Admin/Upload/img_upload');
	$up_del = UC('Admin/Upload/del');
	$str='';
	$str .= "<script type='text/javascript' src='".__BASE__."static/admin/layer-v2.3/layer.js'></script>";
	$str .= "<script type='text/javascript' src='".__BASE__."static/admin/js/zxxFile_1.0.js'></script>";
	$str .= "<script type='text/javascript' src='".__BASE__."static/admin/js/mobileBUGFix.mini.js'></script>";
	$str .= '<div class="zxx_img" id="'.$id_v.'">';
	if($content){
		$str .= '<img src="'.__BASE__.$content.'" onerror="this.src=';
	}else{
		$str .= '<img src="'.__BASE__.'static/admin/img/default.gif" onerror="this.src=';
	}
	$str .= "'".__BASE__."static/admin/img/default.gif'\"";
	$str .= 'height="80" width="80" />';
	$str .= '<input type="file" id="fileImage'.$id_v.'" name="fileselect[]" multiple style="z-index:200;opacity:0;filter:alpha(opacity=0);-ms-filter:alpha(opacity=0); position:absolute; top:0; left:0; width:60px; height:60px;">';
	if(!$content){
		$str .= '<a href="javascript:;" class="cBtn spr db upload_delete" style="display:none;" data-index="2">关闭</a>';
	}else{
		$str .= '<a href="javascript:;" class="cBtn spr db upload_delete" data-index="2">关闭</a>';
	}
	$str .= '<input type="hidden" name="'.$name.'" value="'.$content.'" />
			 <input type="hidden" name="table" value="'.$table.'" />
			 <input type="hidden" name="p_key" value="'.$p_key.'" />
			 <input type="hidden" name="field_name" value="'.$field_name.'" />
          </div>';
	$str .=<<<php
	    <script type="text/javascript">
		var filelength = 0;
		var z_params = {
		resize: 1,                          //上传压缩比率
		module:'$module',
		fileInput: $("#fileImage$id_v").get(0),
		dragDrop: $("#fileDragArea").get(0),
		upButton: $("#fileSubmit").get(0),
		url: "{$up_url}",
		filter: function(files) {
			var arrFiles = [];
			for (var i = 0, file; file = files[i]; i++) {
				 if (file.size >= 5120000) {
					 alert('您这个"'+ file.name +'"文件大小过大，应小于5M');
				 } else {
					arrFiles.push(file);
				 }
			}
			return arrFiles;
		},
		onSelect: function(files,length) {
			var l=length-files.length,i=0,html='';
			var funAppendImage = function() {
			       	file=files[i];
			       	if (file) {
			       		var reader = new FileReader();
						reader.onload = function(e) {
				       		 $("#$id_v img").attr("src",e.target.result);
					       	 $("#$id_v a").show();
								i++;
							funAppendImage();
						}
						reader.readAsDataURL(file);
			       	} else {

			    	}
	 		};
	 		//加载层-风格4
			layer.msg('上传中', {icon: 16});
	 		funAppendImage();
		},
		onSuccess: function(file, response) {
			$('input[name=$name]').val(response);
			layer.closeAll('loading');
			layer.msg('上传完毕', function(){
				//关闭后的操作
			});
		},
		onFailure: function(file) {
			alert(file);
		}
	};
	$("#$id_v a").click(function(){
		var svalue = $('input[name=$name]').val();
		var id = $('input[name=id]').val();
		if(id != '' || id != null){
			var table = $('input[name=table]').val();
			var p_key = $('input[name=p_key]').val();
			var field_name = $('input[name=field_name]').val();
			var data = {"src":svalue,"id":id, "table":table, "p_key":p_key, "field_name":field_name};
		}else{
			var data = {"src":svalue};
		}
		$.post("{$up_del}", data,
				  function(res){
					alert(res.info);
		            if (res.status == 1) {
		            	$('input[name=$name]').val('');
		            	$("#$id_v img").attr("src",'__BASE__/static/admin/img/default.gif');
				       	$("#$id_v a").hide();
		            }
		        },'json');
	})
	if (window.File && window.FileList && window.FileReader && window.Blob) {
		   ZXXFILE = $.extend(ZXXFILE, z_params);
	       ZXXFILE.init();
	} else {
	    info.innerHTML = "您的浏览器不支持HTML5长传";
	   info.className="tips";
	}
</script>
php;
                    return $str;

}



/**
 * html5多图片上传
 * @param   $param['list'] 编辑时的图片列表
 * @param   $param['name'] 图片对应表中的字段名
 * @return string
 */
function unifiles_upload($param)
{
	$list = $param['list']?$param['list']:'';
	$name = $param['name'];
	if(!$name){
		echo '图片对应表中的字段名不能为空！';
		exit;
	}
	$module = $param['module']?$param['module']:'other';
	$up_url = U('Admin/Upload/img_upload');
	$up_del = U('Admin/Upload/del');
	$str='';
	$str .= "<script type='text/javascript' src='".__BASE__."static/admin/js/zxxFile_1.0.js'></script>";
	$str .= "<script type='text/javascript' src='".__BASE__."static/admin/js/mobileBUGFix.mini.js'></script>";
	$str .= '<div class="zxx_imgs" style="position:relative;"> <button type="button" class="btn btn-sm btn-success">上传图片</button>';
	$str .= '<input type="file" id="filesImage" name="fileselect[]" multiple="" style="z-index:200;opacity:0;filter:alpha(opacity=0);-ms-filter:alpha(opacity=0); position:absolute; top:0; left:0; width:78px; height:34px;" class="valid"></div>';
	$str .= '<div class="upload_preview">';
	if($list){
		$i = 1;
		foreach($list AS $k => $v){
			if($v){
				$str .= '<div id="uploadList_'.$i.'" class="upload_pre_item">';
				$str .= '<img src="'.$v.'" /><span class="btn-close btn-close-content upload_delete" title="删除图片" data-index="'.$i.'"></span>';
				$str .= '<input type="hidden" name="'.$name.'[]" id="value_'.$i.'" value="'.$v.'"></div>';
				$i++;
			}
		}
	}
	$str .= '<div id="preview"></div></div>';

	$str .=<<<php
	    <script type="text/javascript">
		var filelength = 0;
		var imglength = $('.upload_pre_item').length;
		var z_params = {
		resize: 1,                          //上传压缩比率
		module:'$module',
		fileInput: $("#filesImage").get(0),
		url: "{$up_url}",
		filter: function(files) {
			var arrFiles = [];
			for (var i = 0, file; file = files[i]; i++) {
				 if (file.size >= 5120000) {
					 alert('您这个"'+ file.name +'"文件大小过大，应小于5M');
				 } else {
					arrFiles.push(file);
				 }
			}
			return arrFiles;
		},
		onSelect: function(files,length) {
			var l=length-files.length,i=0,html='';
			var funAppendImage = function() {
			       	file=files[i];
			       	if (file) {
			       		var index=imglength+1;
			       		var reader = new FileReader();
						reader.onload = function(e) {
							html =html+ '<div id="uploadList_'+ index+'" class="upload_pre_item">'+
				             '<img src="'+e.target.result+'">'+
				             '<span class="btn-close btn-close-content upload_delete" title="删除图片" data-index="'+index+'"></span>'+
				             '<input type="hidden" name="{$name}[]" id="value_'+index+'" />'+
				             '</div>';
				       		i++;
				       		imglength ++;
							funAppendImage();
						}
						reader.readAsDataURL(file);
			       	} else {
			       		$("#preview").before(html);
			       		//删除方法
			       		$(".upload_delete").click(function() {
							var pre_id = $(this).attr("data-index");
                    		var svalue = $('#value_'+pre_id).val();
                    		var data = {"src":svalue};
                    		$.post("{$up_del}", data,
                    				  function(res){
                    					alert(res.info);
                    		            if (res.status == 1) {
                    		            	$('#uploadList_'+pre_id).remove();
                    		            }
                    		        },'json');
							return false;
						});
			    	}
	 		};
	 		funAppendImage();
		},
		onSuccess: function(file, response) {
			$('#value_'+imglength).val(response);
		},
		onFailure: function(file, response) {
		    alert(response);
		}
	};
	$(".upload_delete").click(function(){
	    var pre_id = $(this).attr("data-index");
		var svalue = $('#value_'+pre_id).val();
		var data = {"src":svalue};
		$.post("{$up_del}", data,
				  function(res){
					alert(res.info);
		            if (res.status == 1) {
		            	$('#uploadList_'+pre_id).remove();
		            }
		        },'json');
	})
	if (window.File && window.FileList && window.FileReader && window.Blob) {
		   ZXXFILE = $.extend(ZXXFILE, z_params);
	       ZXXFILE.init();
	} else {
	    info.innerHTML = "您的浏览器不支持HTML5长传";
	   info.className="tips";
	}
</script>
php;
	return $str;

}

/**
 *
 * @param unknown $param
 * @param   $param['field_name'] 搜索回调操作的字段名
 * @param   $param['field_title'] 搜索标题
 * @return string
 */
function cjax_table_top($param){
	$str = '<div class="row">
				<div class="col-sm-6">
					<div id="sample-table-2_length" class="dataTables_length">
					<label>显示
					<select size="1" id="pagesize" aria-controls="sample-table-2" onchange="cengp_Page(1)">
						<option class="Hoption" value="10" selected="selected">10</option>
						<option class="Hoption" value="25">25</option>
						<option class="Hoption" value="50">50</option>
						<option class="Hoption" value="100">100</option>
					</select>
					条数据
					</label>
					</div>
				</div>';
	if($param['field_name']){
		$str .= '<div class="col-sm-6">
						<div class="dataTables_filter" id="sample-table-2_filter">
							<label>搜索: <input style="width:180px;" type="text" name="'.$param['field_name'].'" placeholder="'.$param['field_title'].'" aria-controls="sample-table-2">&nbsp;&nbsp;
								<a href="javascript:cengp_Page(1);" class="btn btn-xs btn-success">提交</a>
							</label>
						</div>
					</div>';
	}

	$str .= '</div>';
	return $str;
}


/**
 * @param   $param['field_name'] 搜索字段名
 * @param   $param['count'] 表单数据总数
 * @param   $param['other'] 其他需要跟着ajax回调的参数 可以是数组
 * @param   $param['currentPage'] 跳到固定的页数
 * @return string
 */
function cjax_table_bottom($param){
	$url = U('Admin/'.CONTROLLER_NAME.'/'.ACTION_NAME);
	$field_name = $param['field_name'];
	if($field_name){
		$js =	'title = $("input[name='.$field_name.']").val();';
	}else{
		$js =	'title = "";';
	}
	$count = $param['count'];
	$other = $param['other'];
	$pagesize = $param['pagesize'];
	$currentPage = $param['currentPage'];
	if($currentPage){
		if($pagesize){
			$currentPageContent = 'cengp_Page('.$currentPage.',"",'.$pagesize.');';
		}else{
			$currentPageContent = 'cengp_Page('.$currentPage.');';
		}
	}else{
		if($pagesize){
			$currentPageContent = 'cengp_Page(1,1,'.$pagesize.');';
		}else{
			$currentPageContent = 'cengp_Page(1,1);';
		}
	}

	$str = '';
	$str .= '<div class="row" id="pageNav"></div>';
	$str .=<<<php
	    <script type="text/javascript">
		$(function(){
			$currentPageContent
			$("input[name='{$field_name}']").focus();
			$(document).keydown(function(e){
				if(e.keyCode == 13) {
					e.preventDefault();
					cengp_Page(1);
				}
			});
		})
		function cengp_Page(curPage, innt ,pagesizeKey){
			if(pagesizeKey){
				pagesize = pagesizeKey;
			}else{
				pagesize = $("#pagesize option:selected").val();
			}
		    if(innt != 1){
		    	$js
		    	if(title){
					data = {"page":curPage,"pagesize":pagesize,"$field_name":title,$other};
			    }else{
			    	data = {"page":curPage,"pagesize":pagesize,$other};
			    }
			    $.post("$url", data,
					  function(data){
						$("#list").html(data.info);
						supage('pageNav','cengp_Page','',curPage, data.url, pagesize);
						if(pagesizeKey){
							$(".Hoption").each(function(){
								if($(this).val() == pagesizeKey){
									$(this).attr("selected","selected");
								}
							})
						}
			        },'json');
		    }else{
		    	supage('pageNav','cengp_Page','',curPage, $count, pagesize);
		    }
		}

		</script>
php;
	return $str;
}


/**
 * 调试日志
 * @param mixed $info
 */
function debug_log($info, $file=NULL){
	check_dir(RUNTIME_PATH . 'Logs/debug');
	file_put_contents($file?$file:(RUNTIME_PATH . 'Logs/debug/'.'debug_' . date('Ymd') . '.log'), "[" . date('H:i:s') . "] " . ( (is_array($info) || is_object($info)) ?print_r($info, true):$info ) . "\n" , FILE_APPEND);
}

/**
 * 微信调试日志
 * @param mixed $info
 */
function weixin_log($info, $file=NULL){
	check_dir(RUNTIME_PATH . 'Logs/weixin');
	file_put_contents($file?$file:(RUNTIME_PATH . 'Logs/weixin/'.'weixin_' . date('Ymd') . '.log'), "[" . date('H:i:s') . "] " . ( (is_array($info) || is_object($info)) ?print_r($info, true):$info ) . "\n" , FILE_APPEND);
}

/**
 * 命令行调试日志
 * @param mixed $info
 */
function cron_log($info, $file=NULL){
    check_dir(RUNTIME_PATH . 'Logs/Cron');
    file_put_contents($file?$file:(RUNTIME_PATH . 'Logs/Cron/'.'Cron_' . date('Ymd') . '.log'), "[" . date('H:i:s') . "] " . ( (is_array($info) || is_object($info)) ?print_r($info, true):$info ) . "\n" , FILE_APPEND);
}

/**
 * 调试日志
 * @param mixed $info
 */
function call_log($info, $file=NULL)
{
    check_dir(RUNTIME_PATH . 'Logs/call');
    file_put_contents($file?$file:(RUNTIME_PATH . 'Logs/call/'.'call_' . date('Ymd') . '.log'), "[" . date('H:i:s') . "] " . ( (is_array($info) || is_object($info)) ?print_r($info, true):$info ) . "\n" , FILE_APPEND);
}

/**
 * array_column函数功能做php版本兼容 
 * @param unknown $input
 * @param unknown $columnKey
 * @param string $indexKey
 * @return multitype:Ambigous <NULL, mixed, unknown>
 */
function i_array_column($input, $columnKey, $indexKey=null){
	if(!function_exists('array_column')){
		$columnKeyIsNumber  = (is_numeric($columnKey))?true:false;
		$indexKeyIsNull            = (is_null($indexKey))?true :false;
		$indexKeyIsNumber     = (is_numeric($indexKey))?true:false;
		$result                         = array();
		foreach((array)$input as $key=>$row){
			if($columnKeyIsNumber){
				$tmp= array_slice($row, $columnKey, 1);
				$tmp= (is_array($tmp) && !empty($tmp))?current($tmp):null;
			}else{
				$tmp= isset($row[$columnKey])?$row[$columnKey]:null;
			}
			if(!$indexKeyIsNull){
				if($indexKeyIsNumber){
					$key = array_slice($row, $indexKey, 1);
					$key = (is_array($key) && !empty($key))?current($key):null;
					$key = is_null($key)?0:$key;
				}else{
					$key = isset($row[$indexKey])?$row[$indexKey]:0;
				}
			}
			$result[$key] = $tmp;
		}
		return $result;
	}else{
		return array_column($input, $columnKey, $indexKey);
	}
}

/**
 * js unescape php 实现
 * @param unknown $str
 * @return Ambigous <string, unknown>
 */
function unescape($str){
	$ret = '';
	$len = strlen($str);
	for ($i = 0; $i < $len; $i ++){
		if ($str[$i] == '%' && $str[$i + 1] == 'u'){
			$val = hexdec(substr($str, $i + 2, 4));
			if ($val < 0x7f)
				$ret .= chr($val);
			else
			if ($val < 0x800)
				$ret .= chr(0xc0 | ($val >> 6)) .
				chr(0x80 | ($val & 0x3f));
			else
				$ret .= chr(0xe0 | ($val >> 12)) .
				chr(0x80 | (($val >> 6) & 0x3f)) .
				chr(0x80 | ($val & 0x3f));
			$i += 5;
		} else
		if ($str[$i] == '%')
		{
			$ret .= urldecode(substr($str, $i, 3));
			$i += 2;
		} else
			$ret .= $str[$i];
	}
	return $ret;
}

/**
 * @param string $useragent
 * @return bool
 * 判断是网络爬虫还是人访问的
 */
function checkrobot($useragent='')
{
    static $kw_spiders = array('bot', 'crawl', 'spider' ,'slurp', 'sohu-search', 'lycos', 'robozilla');
    static $kw_browsers = array('msie', 'netscape', 'opera', 'konqueror', 'mozilla');
    $useragent = strtolower(empty($useragent) ? $_SERVER['HTTP_USER_AGENT'] : $useragent);
    if(strpos($useragent, 'http://') === false && dstrpos($useragent, $kw_browsers)) return false;
    if(dstrpos($useragent, $kw_spiders)) return true;
    return false;
}

function dstrpos($string, $arr, $returnvalue = false)
{
    if(empty($string)) return false;
    foreach((array)$arr as $v) {
        if(strpos($string, $v) !== false) {
            $return = $returnvalue ? $v : true;
            return $return;
        }
    }
    return false;
}

/**
 * 压缩html代码
 * 变成一行  网页编辑器需要使用
 * */
function compress_html($string) 
{
    return ltrim(rtrim(preg_replace(array("/> *([^ ]*) *</","//","'/\*[^*]*\*/'","/\r\n/","/\n/","/\t/",'/>[ ]+</'),array(">\\1<",'','','','','','><'),$string)));
}


/**
 * 获取客户端IP地址
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @return mixed
 */
function getClientIp($type = 0) 
{
    $ip = "";
    if (getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')) {
        $ip = getenv('HTTP_CLIENT_IP');
    } elseif (getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
        $ip = getenv('HTTP_X_FORWARDED_FOR');
    } elseif (getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
        $ip = getenv('REMOTE_ADDR');
    } elseif (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

/**
 * 密码加密算法
 */
function pwdEncrypt($string)
{
    return md5(sha1($string));
}

/**
 * 判断用户访问访问设备是否为手机
 */
function isMobile()
{
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE'])) {
        return true;
    }
    // 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA'])) {
        // 找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
    }
    // 判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT'])){
        $clientkeywords = array('nokia', 'sony', 'ericsson',
            'mot','samsung','htc','sgh','lg','sharp','sie-','philips',
            'panasonic','alcatel','lenovo','iphone','ipod','blackberry',
            'meizu','android','netfront','symbian','ucweb','windowsce',
            'palm','operamini','operamobi','openwave','nexusone','cldc',
            'midp','wap','mobile'
        );
        // 从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
            return true;
        }
    }
    // 协议法，因为有可能不准确，放到最后判断
    if (isset ($_SERVER['HTTP_ACCEPT'])) {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
            return true;
        }
    }
    return false;
}

/**
 * 简略标题
 * 截取的字数长度  默认12
 */
function shortCut($title, $len = 12)
{
    if (!$title) {
        return;
    }
    $short = mb_substr($title, 0, $len, 'utf-8');
    $length = mb_strlen($title, 'utf-8');
    if($length > $len) {
        $short = $short.'...';
    }
    return $short;
}