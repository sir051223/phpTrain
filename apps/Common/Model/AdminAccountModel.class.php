<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 用户管理员模型
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Common\Model;

class AdminAccountModel extends CommonModel
{

    protected $original = false;
    protected $after    = false;

    /*自动验证*/
    protected $_validate = [
        ['account', 'require', '用户名不能为空！', 1, 'regex', 1],
        ['account', '', '用户名已经存在！', 0, 'unique', 1],
        //array('password', 'require', '密码不能为空！', 1, 'regex', 1),
    ];

    /*自动完成*/
    protected $_auto = [
        ['password', 'md5', 3, 'function'],
        ['addtime', 'time', 1, 'function'],
        ['updatetime', 'time', 2, 'function'],
        ['logintotal', '0'],
        ['adduid', '0'],
    ];


    public function adminExists($account)
    {
        return $this->where(['account' => $account])->find();
    }

    protected function _encodePassword($password)
    {
        return md5($password);
    }

    protected function _verifyPassword($storedPassword, $inputPassword)
    {
        return !strcmp($storedPassword, $this->_encodePassword($inputPassword));
    }

    public function verifyLogin($account, $password)
    {
        $userInfo = $this->where(['account' => $account])->find();
        if (empty($userInfo)) {
            return false;
        } else if ($this->_verifyPassword($userInfo['password'], $password)) {
            $this->setInc('logintotal', 1);

            $data              = [];
            $data['lastlogin'] = time();
            $data['loginip']   = get_client_ip();
            $this->where(['uid' => $userInfo['uid']])->save($data);
            $userInfo['permissions'] = $this->_decodePermissions($userInfo['permissions']);
            unset($userInfo['password']);

            return $userInfo;
        } else {
            return [];
        }
    }

    public function lastLogin($uid)
    {
        $data               = [];
        $data['logintotal'] = ['exp', 'logintotal+1'];
        $data['lastlogin']  = time();
        $data['loginip']    = get_client_ip();
        $this->where(['uid' => $uid])->save($data);
    }

    protected function _decodePermissions($permissions)
    {
        return !empty($permissions) ? explode('|', $permissions) : [];
    }

    public function get_all_account()
    {
        $res = $this->field('uid, account, adduid, lastlogin, loginip, role_id, addtime, status')->select();
        foreach ($res AS $k => $v) {
            if ($v['adduid']) {
                $res[$k]['add_account'] = $this->where(['uid' => $v['adduid']])->getField('account');
            } else {
                $res[$k]['add_account'] = '扫码添加';
            }
            if ($v['role_id']) {
                $res[$k]['role_name'] = D('Role')->where(['id' => $v['role_id']])->getField('name');
            }
            $res[$k]['status']    = $v['status'] ? '禁用' : '启用';
            $res[$k]['addtime']   = date('Y-m-d H:i:s', $v['addtime']);
            $res[$k]['lastlogin'] = date('Y-m-d H:i:s', $v['lastlogin']);
        }
        return $res;
    }

    public function changePassword($uid, $password)
    {
        return $this->where(['uid' => $uid])->save(['password' => $this->_encodePassword($password)]);
    }

        
    /**
     * 获取用户名
     */
    public function getAccount($uid)
    {
        return $this->where([['uid' => $uid]])->getField('account');
    }
}