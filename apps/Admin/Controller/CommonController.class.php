<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--公用控制器
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Admin\Controller;
use Think\Controller;
use \Admin\Auth as t;
defined('IN_HEAVEN') or die('Hacking Attempt!');

class CommonController extends Controller {

	protected $auth = null;
	/**
	 * 当前登录帐户信息
	 * @var array
	 */
	protected $_account = array();
	protected $_page = 0;
	protected $_pagesize = 10;

	public function _initialize()
	{
		// 模板全局变量
		$aConfVars = array(
				'TITLE', 'SITE_TITLE', 'SITE_COMPANY',
				'VAR_REDIRECT',
		);
		$aTplVars = array();
		foreach ($aConfVars as $v) {
			$aTplVars[strtolower($v)] = C($v);
		}
		$this->assign('G_VAR', $aTplVars);

		// 登录认证判断
		$oAminAuth = $this->auth = new t\AdminAuth();
		if ($oAminAuth->isLogin()) {
			$this->_account = $oAminAuth->getUser();
			$this->assign('ACCOUNT', $this->_account);
			if (!strcasecmp(CONTROLLER_NAME, 'Index')) {

			} elseif(!strcasecmp(CONTROLLER_NAME, 'Public')) {

			} else {
				if (!$this->check_access($this->_account['role_id'])) {
					$this->error("您没有访问权限！", U('Index/welcome'));
					exit();
				}
			}
		} else {
			if (strcasecmp(CONTROLLER_NAME, 'Public')) {
				$tipMsg = (strcasecmp(ACTION_NAME, 'login')) ? "操作需要登录才能进行" : '';
				$oAminAuth->redirectLogin($tipMsg);
			}
		}

	}

	/**
	 * 传入菜单结构数组
	 * 生成菜单部分html赋值到页面
	 */
	protected function tpl_code_right_sidebar($menu_data)
	{
		foreach ($menu_data as $menu) {
			unset($class);
			unset($class1);
			unset($icon);
			unset($icon1);
			if($menu['model'] == CONTROLLER_NAME && $menu['action'] == ACTION_NAME){
				$class = 'class="active"';
				$icon1 = $menu['icon']?$menu['icon']:'double-angle-right';
			}
			if(empty($menu['items'])){
				if(I('get.id')){
					$menu['url'] = $menu['url'].'/wxmp_id/'.I('get.id');
				}
				$res .= '<li '.$class.'>';
				$res .= '<a href="javascript:openapp(\''.$menu['url'].'\',\''.$menu['id'].'\',\''.$menu['name'].'\');">
    					 <i class="icon-'.$icon1.'"></i>
    					 <span class="menu-text">'.$menu['name'].'</span>
    					 </a>';
				$res .= '</li>';
			}else{
				if($menu['parent'] == '' && $menu['model'] == CONTROLLER_NAME){
					$icon = $menu['icon']?$menu['icon']:'double-angle-right';
					$class1 = 'class="active open"';
				}
				if($menu['parent'] != '' && $menu['model'] == CONTROLLER_NAME){
					$icon = $menu['icon']?$menu['icon']:'leaf';
					$class1 = 'class="open"';
				}else{
					$icon = $menu['icon']?$menu['icon']:'double-angle-right';
				}
				$res .= '<li '.$class1.'>';
				$res .= '<a href="#" class="dropdown-toggle">
    					<i class="icon-'.$icon.'"></i>
    					<span class="menu-text">'.$menu['name'].'</span>
    					<b class="arrow icon-angle-down"></b>
    					</a>
    					<ul  class="submenu">
    						'.$this->tpl_code_right_sidebar($menu['items']).'
    					</ul>';
				$res .= '</li>';
			}

		}

		return $res;
	}

	/**
	 * 后台用户操作记录
	 * @param number $datakey 涉及的数据记录id
	 * @param string $subject  日志标题
	 * @param string $summary  日志摘要
	 * return boolean
	 */
	protected function _admin_log($datakey=0, $subject=true, $summary=false, $params=null)
	{
		$aSet = array();
		$aSet['uid'] = $this->_account['uid'];
		$aSet['account'] = $this->_account['account'];
		$aSet['action'] = ACTION_NAME;
		$aSet['datakey'] = $datakey;
		$aSet['logtime'] = time();
		$aSet['logip'] = get_client_ip();
		$aSet['category'] = CONTROLLER_NAME;

		if($subject){
			$aSet['subject'] = $subject;
		}
		if($summary){
			$aSet['summary'] = $summary;
		}
		if($params){
			$aSet['params'] = $params;
		}
		debug_log('aset===='.print_r($aSet, true));
		D('AdminLog')->add($aSet);
	}

	/**
	 * 需要用到分页调用此方法对分页参数赋值
	 */
	protected function _set_page()
	{
		$this->_page = I('post.page')?I('post.page'):($this->_page+1);
		$this->_pagesize = I('post.pagesize')?I('post.pagesize'):$this->_pagesize;
		$this->_page = ($this->_page-1)*$this->_pagesize;
	}

	/**
	 * 分页方法
	 * @access protected
	 * @param array  result  分页用的数组
	 * @param string $listvar   赋给模板遍历的变量名 默认list
	 * @param string $template ajaxlist的模板名
	 * @param unknown $param
	 */
	protected function _cjax_page($param)
	{
		$this->assign($param['listvar'], $param['result']);
		$this->assign('count',  $param['count']);
		if(IS_POST){
			layout(false);
			$this->success($this->fetch($param['template']), $param['count'], ['where' => $param['str']]);
		}
	}

	private function check_access($roleid)
	{
		// 暂时放开权限，以后再限制
		return true;

		//如果用户角色是1，则无需判断
		if ($roleid == 1) {
			return true;
		}
		$role = D("Role")->field("status")->where("id=$roleid")->find();

		if (!empty($role) && $role['status']==1) {
			$group = MODULE_NAME;
			$model = CONTROLLER_NAME;
			$action = ACTION_NAME;
			if (MODULE_NAME.CONTROLLER_NAME.ACTION_NAME != "AdminIndexindex") {
				$count = D("Access")->where ( "role_id=$roleid and g='$group' and m='$model' and a='$action'")->count();
				return $count;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	// 截取utf-8中文字符串
	protected function substr_cut($str, $from, $len)
	{
	    return preg_replace('#^(?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,'.$from.'}'.
	        '((?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,'.$len.'}).*#s',
	        '$1',$str);
	}

	/**
	 * 简略标题
	 * 截取的字数长度  默认12
	 */
	protected function _shortCut($title, $len = 12)
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

}