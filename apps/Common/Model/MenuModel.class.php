<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 右侧菜单模型
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Common\Model;

class MenuModel extends CommonModel
{

    protected $connection = 'EXT_CONFIG';

    /*自动验证*/
    protected $_validate = array(
        array('name', 'require', '菜单名称不能为空！', 1, 'regex', CommonModel:: MODEL_BOTH ),
        array('app', 'require', '应用不能为空！', 1, 'regex', CommonModel:: MODEL_BOTH ),
        array('model', 'require', '模块名称不能为空！', 1, 'regex', CommonModel:: MODEL_BOTH ),
        array('action', 'require', '方法名称不能为空！', 1, 'regex', CommonModel:: MODEL_BOTH ),
        array('app,model,action,data', 'checkAction', '同样的记录已经存在！', 1, 'callback', CommonModel:: MODEL_INSERT   ),
    	array('id,app,model,action,data', 'checkActionUpdate', '同样的记录已经存在！', 1, 'callback', CommonModel:: MODEL_UPDATE   ),
        array('parentid', 'checkParentid', '菜单只支持四级！', 1, 'callback', 1),
    );

    /*自动完成*/
    protected $_auto = array(

    );

    /*验证菜单是否超出三级*/
    public function checkParentid($parentid)
    {
        $find = $this->where(array("id" => $parentid))->getField("parentid");
        if ($find) {
            $find2 = $this->where(array("id" => $find))->getField("parentid");
            if ($find2) {
                $find3 = $this->where(array("id" => $find2))->getField("parentid");
                if ($find3) {
                    return false;
                }
            }
        }
        return true;
    }

    /*验证action是否重复添加*/
    public function checkAction($data)
    {
        $find = $this->where($data)->find();
        if ($find) {
            return false;
        }
        return true;
    }

    /*验证action是否重复添加*/
    public function checkActionUpdate($data)
    {
    	$id=$data['id'];
    	unset($data['id']);
    	$find = $this->field('id')->where($data)->find();
    	if (isset($find['id']) && $find['id']!=$id) {
    		return false;
    	}
    	return true;
    }


    /**
     * 按父ID查找菜单子项
     * @param integer $parentid   父菜单ID
     * @param integer $with_self  是否包括他自己
     */
    public function admin_menu($parentid, $with_self = false)
    {
        // 父节点ID
        $parentid = (int) $parentid;
        $cond['parentid'] = $parentid;
        $cond['status'] = 1;
//        $cond['owner'] = CONTROLLER_NAME=='Weixin'?'weixin':'normal';
//        $cond['owner'] = CONTROLLER_NAME=='Weixin'?'weixin':(CONTROLLER_NAME=='Project'?'Project':'normal');
        if (CONTROLLER_NAME=='Weixin') {
            $cond['owner'] = 'Weixin';
        } else if (CONTROLLER_NAME=='Project') {
            $cond['owner'] = 'Project';
        } else if (CONTROLLER_NAME=='Property') {
            $cond['owner'] = 'Property';
        } else {
            $cond['owner'] = 'normal';
        }
        $result = $this->where($cond)->order(array("listorder" => "ASC"))->select();
        if ($with_self) {
            $result2[] = $this->where(array('id' => $parentid))->find();
            $result = array_merge($result2, $result);
        }
        /*权限检查*/
        $sesion = session();
        if ($sesion['user']["role_id"] == 1) {
            /*如果角色为 1 直接通过*/
            return $result;
        }
        $array = array();
        $privdb = D("Access");
        foreach ($result as $v) {

            $action = $v['action'];

            /*public开头的通过*/
            if (preg_match('/^public_/', $action)) {
                $array[] = $v;
            } else {

                if (preg_match('/^ajax_([a-z]+)_/', $action, $_match)){

                	$action = $_match[1];
                }

                $r = $privdb->where(array('g' => $v['app'], 'm' => $v['model'], 'a' => $action, 'role_id' => $sesion['user']["role_id"]))->find();

                if ($r){
                	$array[] = $v;
                }

            }
        }
        return $array;
    }

    /**
     * 获取菜单 头部菜单导航
     * @param $parentid 菜单id
     */
    public function submenu($parentid = '', $big_menu = false)
    {
        $array = $this->admin_menu($parentid, 1);
        $numbers = count($array);
        if ($numbers == 1 && !$big_menu) {
            return '';
        }
        return $array;
    }

    /**
     * 菜单树状结构集合
     */
    public function menu_json()
    {
        $items['0changyong'] = array(
            "id" => "",
            "name" => "常用菜单",
            "parent" => "changyong",
            "url" => U("Menu/public_changyong"),
        );

        $changyong = array(
            "changyong" => array(
                "icon" => "",
                "id" => "changyong",
                "name" => "常用",
                "parent" => "",
                "url" => "",
                "items" => $items
            )
        );
        $data = $this->get_tree(0);

        return $data;
    }

    /*取得树形结构的菜单*/
    public function get_tree($myid, $parent = "", $Level = 1)
    {
        $data = $this->admin_menu($myid);
        $Level++;
        if (is_array($data)) {
            foreach ($data as $a) {
                $id = $a['id'];
                $name = ucwords($a['app']);
                $model = ucwords($a['model']);
                $action = $a['action'];

              $fu = "";
                if ($a['data']) {
                    $fu = "?" . htmlspecialchars_decode($a['data']);
                }
                $array = array(
                    "icon" => $a['icon'],
                    "id" => $id . $name,
                    "name" => $a['name'],
                    "parent" => $parent,
                    "url" => U("{$name}/{$model}/{$action}{$fu}", array("menuid" => $id)),
                );



                $ret[$id . $name] = $array;
                $child = $this->get_tree($a['id'], $id, $Level);
                /*由于后台管理界面只支持三层，超出的不层级的不显示*/
                if ($child && $Level <= 3) {
                    $ret[$id . $name]['items'] = $child;
                }

            }
            return $ret;
        }

        return false;
    }

    /**
     * 更新缓存
     * @param type $data
     * @return type
     */
    public function menu_cache($data = null)
    {
        if (empty($data)) {
            $data = $this->select();
            F("Menu", $data);
        } else {
            F("Menu", $data);
        }
        return $data;
    }

    /**
     * 后台有更新/编辑则删除缓存
     * @param type $data
     */
    public function _before_write(&$data)
    {
        parent::_before_write($data);
        F("Menu", NULL);
    }

    /*删除操作时删除缓存*/
    public function _after_delete($data, $options)
    {
        parent::_after_delete($data, $options);
        $this->_before_write($data);
    }

    public function menu($parentid, $with_self = false)
    {
    	$parentid = (int) $parentid;
    	$result = $this->where(array('parentid' => $parentid))->select();
    	if ($with_self) {
    		$result2[] = $this->where(array('id' => $parentid))->find();
    		$result = array_merge($result2, $result);
    	}
    	return $result;
    }

    /**
     * 检测当前菜单是否为微信菜单
     * @return boolean
     */
    public function checkIsWeixin()
    {
    	$cond['model'] = CONTROLLER_NAME;
    	$cond['action'] = ACTION_NAME;
    	$cond['owner'] = 'weixin';
    	$count = $this->where($cond)->count();
    	if ($count == 0) {
    		return false;
    	}
    	return true;
    }
}

?>