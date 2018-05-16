<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--管理员 用户 控制器
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Admin\Controller;

class UserController extends CommonController 
{
	/**
	 * 管理员列表
	 */
    public function indexAct()
	{
		$list = D('AdminAccount')->get_all_account();
		$this->assign('list',  $list);
		$this->display();
	}

	public function account_addAct()
	{
		if (IS_POST) {
			if (D("AdminAccount")->create()) {
				D("AdminAccount")->adduid = $this->_account['uid'];
				D("AdminAccount")->unitname = 'any';
				$insert_id = D("AdminAccount")->add();
				if ($insert_id !== false) {
					$this->_admin_log($insert_id, '添加管理员',"成功！");
					$this->success("添加成功", UC("User/index"));
				} else {
					$this->_admin_log(0, '添加管理员',"失败！");
					$this->error("添加失败！", UC("User/index"));
				}
			} else {
				$this->_admin_log(0, '添加管理员实例化时',"失败！");
				$this->error(D("AdminAccount")->getError());
			}
		} else {
			$role_list = D('Role')->simple_role_list();
			$this->assign("headline",  "新增管理员");
			$this->assign("role_list", $role_list);
			$this->assign("action_name", ACTION_NAME);
			$this->display("User:account_oper");
		}
	}
	

	/**
	 * 编辑管理员
	 */
	public function account_editAct() 
	{
		if (IS_POST) {
			$id = intval(I("post.uid"));
			$data = D("AdminAccount")->create();
			if ($data) {
				if (D("AdminAccount")->save($data) !== false) {
					$this->_admin_log($id, '修改管理员',"成功！");
					$this->success("修改成功", UC("User/index"));
				} else {
					$this->_admin_log($id, '修改管理员',"失败！");
					$this->success("修改失败！", UC("User/index"));
				}
			} else {
				$this->_admin_log($id, '修改管理员',"失败！".D("AdminAccount")->getError());
				$this->error(D("AdminAccount")->getError());
			}
		} else {
			$uid = intval(I("get.uid"));
			if (!$uid) {
				$this->error("非法操作！");
			}
			$role_id = D('AdminAccount')->where(array('uid' => $uid))->getField('role_id');
			if ($role_id == 1) {
				$this->error("超级管理员不能编辑！", UC('User/index'));
			}
			$info = D("AdminAccount")->field('uid, account, role_id, status, mobile')->where(array("uid" => $uid))->find();
			if (!$info) {
				$this->error("编辑项不存在！");
			}
			$this->assign("account_cle", 'edit');
			$role_list = D('Role')->simple_role_list($info['role_id']);
			$this->assign("headline", "编辑管理员");
			$this->assign("action_name", ACTION_NAME);
			$this->assign("info",  $info);
			$this->assign("role_list",  $role_list);
			$this->display("User:account_oper");
		}
	}

	/**
	 * 删除管理员
	 */
	public function del_accountAct() 
	{
		$id = I("post.uid");
		if (!$id) {
			$this->error("删除项不存在！", UC('User/index'));
		}
		$role_id = D('AdminAccount')->where(array('uid' => $id))->getField('role_id');
		if ($role_id == 1) {
			$this->error("超级管理员不能删除！", UC('User/index'));
		}
		$status = D("AdminAccount")->delete($id);
		if ($status !== false) {
			$this->_admin_log($id, '删除管理员',"成功！");
			$this->success("删除成功！", UC('User/index'));
		} else {
			$this->_admin_log($id, '删除管理员',"失败！");
			$this->error("删除失败！", UC('User/index'));
		}
	}

}