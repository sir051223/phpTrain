<?php
/**
 * 后台登陆退出Action
 *
 * PHP version 5
 *
 * @category	ysbang
 * @package     Admin
 * @subpackage  Action
 * @version     SVN: $Id: PublicAdmin.class.php 10 2013-10-08 01:34:05Z cengp $
 */
namespace Admin\Controller;
class PublicController extends CommonController {

    // 用户登录页面
    public function loginAct()
    {
        if (!$this->auth->isLogin()) {
        	$this->assign('msg', I("get.msg"));
        	$this->assign('redirect', get_redirect(__BASE__).'admin');
            $this->display();
        } else {
            $this->redirect(get_redirect(__BASE__).'admin');
        }
    }

    // 用户登出
    public function logoutAct()
    {
        if ($this->auth->isLogin()) {
            $this->auth->logout();
        }
        redirect(get_redirect(__BASE__).'admin', 0, TL('成功登出！'));
    }

    /**
     * 登录检测
     * 本地环境无法通过扫码登录
     * 因此绕过
     */
    public function postLoginAct()
    {
    	if (!IS_POST) {
    		$this->error('非法操作！');
    	}

    	$aClean = $this->_clean();

        // 生成认证条件
        // 如果是本地开发环境  跳过扫码登录
        $userInfo = D('AdminAccount')->verifyLogin($aClean['account'], $aClean['password']);

        // 使用用户名、密码和状态的方式进行认证
        if (false === $userInfo) {
        	$this->error('账号不存在');
        } elseif (empty($userInfo)) {
        	$this->error('密码错误');
        } else {
    		$this->auth->login($userInfo['uid'], $userInfo);
    		// 记录最后登录信息
    		D('AdminAccount')->lastLogin($userInfo['uid']);
    		$this->success('登录成功！', UC('Index/index'));
        }
    }

    /**
     * 清洁传输参数
     */
    protected function _clean()
    {
    	$aClean = array();
    	$aClean['account'] = I('post.account');
    	$aClean['password'] = I('post.password');

    	if (empty($aClean['account'])) {
    		$this->error('账号必须');
    	} elseif (empty($aClean['password'])) {
    		$this->error('密码必须');
    	}
    	return $aClean;
    }


    protected function _requireLogin()
    {
    	if(!$this->auth->isLogin()) {
    	    if (IS_POST) {
    	        $this->error('登录已过期，请重新登录！');
    	    }
    		$this->auth->redirectLogin("操作需要登录才能进行");
    	}
    }

    public function passwordAct()
    {
    	$this->_requireLogin();

    	if (IS_POST) {
    		$aClean = array();
    		$aClean['oldpass'] = I('post.oldpass');
    		$aClean['newpass'] = I('post.newpass');
    		$aClean['retypepass'] = I('post.retypepass');

    		if (!$aClean['oldpass'] || !$aClean['newpass'] || !$aClean['retypepass']) {
    			$this->error(TL("操作失败：请完整输入所有必填项"), __ACTION__);
    		}

    		$oAccount = D('AdminAccount');

    		// 验证新密码是否一致
    		if (strcmp($aClean['newpass'], $aClean['retypepass'])) {
    			$this->error(TL("操作失败：新密码两次输入不一致"), __ACTION__);
    		}

    		// 验证旧密码是否正确
    		if (!$oAccount->verifyLogin($this->_account['account'], $aClean['oldpass'])) {
    			$this->error(TL("操作失败：输入的旧密码不正确"), __ACTION__);
    		}

    		// 修改为新密码
    		$oAccount->changePassword($this->_account['uid'], $aClean['newpass']);

    		// 自动退出，要求重新登陆
    		$this->auth->logout();

    		$this->success(TL("成功修改密码！请使用新密码重新登陆。"), UC('Admin/Public/login'));
    	}
    	$this->display();
    }

}