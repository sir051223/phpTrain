<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 用户菜单权限模型
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-24
 *  +----------------------------------------------------------------------
 */
namespace Common\Model;

class AccessModel extends CommonModel
{

    protected $connection = 'EXT_CONFIG';

    /*自动验证*/
    protected $_validate = array(
        array('role_id', 'require', '角色不能为空！', 1, 'regex', 3),
        array('g', 'require', '项目不能为空！', 1, 'regex', 3),
        array('m', 'require', '模块不能为空！', 1, 'regex', 3),
        array('a', 'require', '方法不能为空！', 1, 'regex', 3),
    );

    /**
     * 角色授权
     * @param type $roleid
     * @param type $addauthorize 是一个数组 array(0=>array(...))
     * @return boolean
     */
    public function rbac_authorize($roleid, $addauthorize) {
        if(!$roleid || !$addauthorize || !is_array($addauthorize)){
            return false;
        }
        $this->where(array("role_id" => $roleid))->delete();
        return $this->addAll($addauthorize);
    }

    protected function _before_write(&$data) {
    	parent::_before_write($data);
    }

}

?>