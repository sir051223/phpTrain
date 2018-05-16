<?php 
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--公用授权类
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Admin\Auth;

class AdminAuth extends WebAuth{
	
	protected $_loginPath = '/admin/public/login';
	
	/**
	 * 判断是否登陆
	 *
	 * @return bool 已经登陆返回true, 尚未登陆返回false
	 */
	public function isLogin()
	{
		if ($this->isEmpty('uid')) return false;
	
		$uid = $this->getUid();
		$loginTime = $this->getLoginTime();
		$loginIp   = $this->getLoginIp();
		$signin = $this->read('signin');
		
		if ($signin && $uid && !strcmp($signin, crc32($uid.$loginTime.$loginIp))) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 判断是否通过第一层登陆
	 *
	 * @return bool 已经登陆返回true, 尚未登陆返回false
	 */
	public function isFirstLogin()
	{
		if ($this->isEmpty('fverify')) return false;
	
		$fverify = $this->read('fverify');
		$floginTime = $this->read('fsin_time');
		$floginIp   = $this->read('fsin_ip');
		$fsignin = $this->read('fsignin');
	
		if ($fsignin && $fverify && !strcmp($fsignin, crc32($floginTime.$floginIp))) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 跳转到登入页面
	 *
	 * 注：本函数会立即退出程序执行
	 *
	 * @param string $redirect 回跳链接
	 */
	public function redirectLogin($tips=array(), $redirect=null)
	{
		if (!$redirect) {
			$redirect = U('Admin/' . CONTROLLER_NAME . '/' . ACTION_NAME);
		}
		
		$path = parse_url($redirect, PHP_URL_QUERY);
		$pathPattern = '@^' . preg_quote($this->_loginPath, '@') . '@gi';
		if (preg_match($pathPattern, $path)) {
			$redirect = __BASE__;
		}
		
		$goto = U('admin/public/login');
		if ($redirect) {
			$goto = url_append_param($goto, array(C('VAR_REDIRECT')=>$redirect));
		}
		if (is_string($tips)) {
			$tips = array('msg'=>$tips);
		}
		if ($tips) {
			$goto = url_append_param($goto, $tips);
		}
		redirect($goto);
	}
	
	/**
	 * 写入登入session
	 *
	 * @param string $uid uid
	 * @param string $uname 登入名
	 */
	public function login($uid, $user=NULL)
	{
		$sin_time = time();
		$sin_ip = get_client_ip();
	
		$array = array(
				'platform'        => 'cengp',       
				'uid' 			  => $uid,
				'user'            => $user,
				'signin'	      => crc32($uid.$sin_time.$sin_ip),
				'loginTime'       => $sin_time,
				'loginIp'         => $sin_ip,
		        'expire'          => 28800
		);
		
		$this->write($array);
	}
	
	/**
	 * 第一层账号密码登录
	 * 记录验证字符串
	 * @param unknown $string
	 */
	public function firstLogin($string)
	{
		$sin_time = time();
		$sin_ip = get_client_ip();
		$array = [
				'fverify' => $string, 
				'fsin_time' => $sin_time, 
				'fsin_ip' => $sin_ip, 
				'fsignin' => crc32($sin_time.$sin_ip)
		];
		$this->write($array);
	}
	
	/**
	 * 加密后的cookie_id
	 */
	public function scrid()
	{
		if (!$_COOKIE['PHPSESSID']) {
			$this->error('面包屑失效，请联系管理员！');
		}
		return md5($_COOKIE['PHPSESSID']);
	}
	
	/**
	 * 销毁登入session
	 *
	 * @return void
	 * @access public
	 */
	public function logout()
	{
		$this->destroy();
	}
	
	public function getUid()
	{
		return $this->read('uid');
	}
	
	public function getUser($field=NULL)
	{
		$userInfo = $this->read('user');
		return !$field?$userInfo:$userInfo[$field];
	}
	public function getLoginTime()
	{
		return $this->read('loginTime');
	}
	public function getLoginIp()
	{
		return $this->read('loginIp');
	}
	
	public function checkAccess($type)
	{
		$allow = false;
		$userInfo = $this->getUser();
		$allow = $type && !empty($userInfo) && (in_array('all', $userInfo['permissions']) || in_array($type, $userInfo['permissions']));
		return $allow;
	}
	
	public function isSuper()
	{
		return !strcasecmp($this->getUser('type'), 'super');
	}
	
	public function isAdmin()
	{
		return !strcasecmp($this->getUser('type'), 'admin');
	}
}