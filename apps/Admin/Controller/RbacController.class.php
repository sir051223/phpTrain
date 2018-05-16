<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 系统权限配置，用户角色管理
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Admin\Controller;
use \Common\Lib\Pclass as p;

class RbacController extends CommonController {

    /**
     * 角色管理
     */
    public function indexAct()
    {
        $data = D("Role")->get_role_list();
        $this->assign("list", $data);
        $this->display();
    }

    /**
     * 添加角色
     */
    public function role_addAct() 
    {
    	if (IS_POST) {
    		if (D("Role")->create()) {
    			$id = D("Role")->add();
    			if ($id) {				
    				$this->success("添加角色成功",UC("rbac/index"));
    			} else {
    				$this->error("添加失败！",UC("rbac/index"));
    			}
    		} else {
    			$this->error(D("Role")->getError());
    		}
    	} else {
    		$this->assign("headline", "新增角色");
    		$this->assign("action_name", ACTION_NAME);
    		$this->display("Rbac:role_oper");
    	}
    }

    /**
     * 删除角色 角色只能单个删除
     */
    public function del_roleAct() 
    {
        $id = intval(I("post.id"));
        if ($id == 1) {
            $this->error("超级管理员角色不能被删除！");
        }
        $count = D('AdminAccount')->where(array('role_id' => $id))->count();
        if ($count) {
        	$this->error("该角色已经有用户！");
        } else {
        	$status = D("Role")->delete($id);
        	if ($status !== false) {
        		$this->success("删除成功！", UC('Rbac/index'));
        	} else {
        		$this->error("删除失败！");
        	}
        }
    }

    /**
     * 编辑角色
     */
    public function role_editAct() 
    {
    	if (IS_POST) {
    		$id = intval(I("post.id"));
    		if ($id == 1) {
    			$this->error("超级管理员角色不能被修改！");
    		}
    		$data = D("Role")->create();
    		if ($data) {
	    		if (D("Role")->save($data)!== false) {
	    			$this->success("修改成功！", UC('Rbac/index'));
	    		} else {
	    			$this->error("修改失败！".D("Role")->getlastsql().print_r($data, true));
	    		}
    		} else {
    			$this->error(D("Role")->getError());
    		}
    	} else {
    		$id = intval(I("get.id"));
    		if (!$id) {
    			$this->error("非法操作！");
    		}
    		if ($id == 1) {
    			$this->error("超级管理员角色不能被修改！");
    		}
    		$data = D("Role")->field('id, status, remark, name')->where(array("id" => $id))->find();
    		if (!$data) {
    			$this->error("该角色不存在！");
    		}
    		
    		$this->assign("headline", "编辑角色");
    		$this->assign("action_name", ACTION_NAME);
    		$this->assign("info",  $data);
    		$this->display("Rbac:role_oper");
    	}
    }

    /**
     * 角色授权
     */
    public function authorizeAct() 
    {
       //角色ID
    	if (IS_POST) {
    		$roleid = intval(I("post.roleid"));
    		if (!$roleid) {
    			$this->error("需要授权的角色不存在！");
    		}
    		if (is_array($_POST['menuid']) && count($_POST['menuid'])>0) {
    			//取得菜单数据
    			$menuinfo = D("Menu")->select();
    			foreach ($menuinfo as $_v) {
    				$menu_info[$_v["id"]] = $_v;
    			}

    			C('TOKEN_ON', false);
    			$addauthorize = array();
    			//检测数据合法性
    			foreach ($_POST['menuid'] as $menuid) {
    				$info = array();
    				$info = $this->_get_menuinfo((int) $menuid, $menu_info);
    				if($info == false){
    					continue;
    				}
    				$info['role_id'] = $roleid;
    				$data = D('Access')->create($info);
    				if (!$data) {
    					$this->error(D('Access')->getError());
    				} else {
    					$addauthorize[] = $data;
    				}
    			}
    			C('TOKEN_ON', true);    			
    			if (D('Access')->rbac_authorize($roleid, $addauthorize)) {
    				$this->success("授权成功！", UC("Rbac/index"));
    			} else {
    				$this->error("授权失败！");
    			}
    		} else {
    			//当没有数据时，清除当前角色授权
    			D('Access')->where(array("role_id" => $roleid))->delete();
    			$this->error("没有接收到数据，执行清除授权成功！");
    		}
    	} else {
    		$roleid = intval(I("get.id"));
    		if (!$roleid) {
    			$this->error("参数错误！");
    		}
    		$menu = new p\Tree();
    		$menu->icon = array('│ ', '├─ ', '└─ ');
    		$menu->nbsp = '&nbsp;&nbsp;&nbsp;';
    		$result = D('Menu')->order(array("listorder" => "ASC"))->select();
    		$newmenus = array();
    		$priv_data = D('Access')->where(array("role_id" => $roleid))->select(); //获取权限表数据   		
    		foreach ($result as $m){
    			$newmenus[$m['id']]=$m;
    		}
    		
    		foreach ($result as $n => $t) {
    			$result[$n]['checked'] = ($this->_is_checked($t, $roleid, $priv_data)) ? ' checked' : '';
    			$result[$n]['level'] = $this->_get_level($t['id'], $newmenus);
    			$result[$n]['parentid_node'] = ($t['parentid']) ? ' class="child-of-node-' . $t['parentid'] . '"' : '';
    		}
    		$str = "<tr id='node-\$id' \$parentid_node>
                       <td style='padding-left:30px;'>\$spacer<input type='checkbox' name='menuid[]' value='\$id' level='\$level' \$checked onclick='javascript:checknode(this);'> \$name</td>
	    			</tr>";
    		$menu->init($result);
    		$categorys = $menu->get_tree(0, $str);
    		$this->assign('base',  __BASE__);
    		$this->assign("categorys", $categorys);
    		$this->assign("roleid", $roleid);
    		$this->display();
    	}
    }
    
    /**
     *  检查指定菜单是否有权限
     * @param array $data menu表中数组
     * @param int $roleid 需要检查的角色ID
     */
    private function _is_checked($data, $roleid, $priv_data) 
    {
    	
    	$priv_arr = array('app', 'model', 'action');
    	if ($data['app'] == '') {
    		return false;
    	}
    	
    	$mdata['role_id'] = $roleid;
    	$mdata["g"] = $data['app'];
    	$mdata["m"] = $data['model'];
    	$mdata["a"] = $data['action'];
    	
    	$info = in_array($mdata, $priv_data);
    	if ($info) {
    		return true;
    	} else {
    		return false;
    	}
    }

    /**
     * 获取菜单深度
     * @param $id
     * @param $array
     * @param $i
     */
    protected function _get_level($id, $array = array(), $i = 0) 
    {
    	if ($array[$id]['parentid']==0 || empty($array[$array[$id]['parentid']]) || $array[$id]['parentid']==$id){
    		return  $i;
    	} else {
    		$i++;
    		return $this->_get_level($array[$id]['parentid'],$array,$i);
    	}   		
    }
    
    /**
     * 获取菜单表信息
     * @param int $menuid 菜单ID
     * @param int $menu_info 菜单数据
     */
    private function _get_menuinfo($menuid, $menu_info) 
    {
        $info = $menu_info[$menuid];
        if(!$info){
            return false;
        }
        $return['g'] = $info['app'];
        $return['m'] = $info['model'];
        $return['a'] = $info['action'];
        return $return;
    }
    

}

?>
