<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--默认页控制器
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Admin\Controller;

class IndexController extends CommonController {
	
	public function indexAct()
	{
		if ($this->_account['role_id']) {
			$menu_data = D("Menu")->menu_json($this->_account['role_id']);
			$res = '<ul class="nav nav-list">';
			$res .= $this->tpl_code_right_sidebar($menu_data);
			$res .= '</ul>';
			$this->assign("SUBMENU_CONFIG", $res);
		}

		layout(false);
		$this->display();
	}

	public function welcomeAct()
	{
		$this->meta_title = '管理首页';
		$this->display();
	}

}