<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--菜单管理
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */

namespace Admin\Controller;
use \Common\Lib\Pclass as p;

class MenuController extends CommonController {

    /**
     *  显示菜单
     */
    public function indexAct() 
    {
    	$_SESSION['admin_menu_index'] = "Menu/index";
        $result = D("Menu")->order(array("listorder" => "ASC"))->select();
        $tree = new p\Tree();
        $tree->icon = array('&nbsp;&nbsp;&nbsp;│ ', '&nbsp;&nbsp;&nbsp;├─ ', '&nbsp;&nbsp;&nbsp;└─ ');
		$tree->nbsp = '&nbsp;&nbsp;&nbsp;';
		foreach ($result as $r) {
			$r['str_manage'] = '<a href="' . UC("Menu/menu_add", array("parentid" => $r['id'], "menuid" => $_GET['menuid'])) . '">添加子菜单</a> | <a href="' . UC("Menu/edit", array("id" => $r['id'], "menuid" => $_GET['menuid'])) . '">修改</a> | <a class="J_ajax_del" href="' . UC("Menu/delete", array("id" => $r['id'], "menuid" => I("get.menuid"))) . '">删除</a> ';
			$r['status'] = $r['status'] ? "显示" : "不显示";
			$array[] = $r;
		}
		
		$tree->init($array);
		
		$str = "<tr id='div_[\$id]'>
						<td class='center'>
							<label>
								<input type='checkbox' class='ace' name='[\$id]' />
								<span class='lbl'></span>
							</label>
						</td>
						<td>\$id</td>
						<td>\$spacer\$name</td>
						<td>\$status</td>
						<td>
							<div class='visible-md visible-lg hidden-sm hidden-xs action-buttons'>
								<a class='green' href='".U("Menu/menu_add")."?parentid=\$id' title='添加子菜单'>
									<i class='icon-zoom-in bigger-130'></i>
								</a>
								<a class='green' href='".U("Menu/menu_edit")."?id=\$id' title='编辑'>
									<i class='icon-pencil bigger-130'></i>
								</a>
								<a class='red' href='javascript:;' onclick='remove_vote(\$id)' title='删除'>
									<i class='icon-trash bigger-130'></i>
								</a>
							</div>
						</td>
					</tr>";
        
        
        $categorys = $tree->get_tree(0, $str);
        $this->assign("categorys", $categorys);
        $this->display();
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
    	}else{
    		$i++;
    		return $this->_get_level($array[$id]['parentid'],$array,$i);
    	}
    
    }
    
    public function lists()
    {
    	$_SESSION['admin_menu_index']="Menu/lists";
    	$result = D("Menu")->order(array("app" => "ASC","model" => "ASC","action" => "ASC"))->select();
    	$this->assign("menus",$result);
    	$this->display();
    }
	
    /**
     *  添加菜单
     */
    public function menu_addAct()
    {
    	if (IS_POST) {
    		if (D("Menu")->create()) {
    			$insert_id = D("Menu")->add();
    			if ($insert_id) {
    				$this->_admin_log($insert_id, '添加菜单',"添加菜单成功！");
    				$this->success("添加成功！", UC("Menu/index"));
    			} else {
    				$this->_admin_log(0, '添加菜单',"添加菜单失败！");
    				$this->error("添加失败！");
    			}
    		} else {
    			$this->error(D("Menu")->getError());
    		}
    	} else {
    		$result = D("Menu")->field('id,name,parentid')->order(array("listorder" => "ASC"))->select();
    		$tree = new p\Tree();
    		$parentid = intval(I("get.parentid"));
    		foreach ($result as $r) {
    			$r['selected'] = $r['id'] == $parentid ? 'selected' : '';
    			$array[] = $r;
    		}
    		$str = "<option value='\$id' \$selected>\$spacer \$name</option>";
    		$tree->init($array);
    		$select_categorys = $tree->get_tree(0, $str);
    		$this->assign("select_categorys", $select_categorys);
    		$this->assign("headline",    "添加菜单");
    		$this->assign("action_name", ACTION_NAME);
    		$this->display("Menu:menu_oper");
    	}
    }
    
    /**
     *  编辑菜单
     */
    public function menu_editAct()
    {
    	if (IS_POST) {
    		if (D("Menu")->create()) {
    			if (D("Menu")->save() !== false) {
    				$this->_admin_log(I('post.id'), '编辑菜单',"成功！");
    				$this->success("更新成功！", UC("Menu/index"));
    			} else {
    				$this->_admin_log(I('post.id'), '编辑菜单',"失败！");
    				$this->error("更新失败！");
    			}
    		} else {
    			$this->_admin_log(I('post.id'), '编辑菜单',"失败！".D("Menu")->getError());
    			$this->error(D("Menu")->getError());
    		}
    	} else {
    		$id = intval(I("get.id"));
    		if(!$id){
    			$this->error('编辑项不存在！');
    		}
    		$rs = D("Menu")->where(array("id" => $id))->find();
    		$result = D("Menu")->field('id,name,parentid')->order(array("listorder" => "ASC"))->select();
    		$tree = new p\Tree();
    		foreach ($result as $r) {
    			$r['selected'] = $r['id'] == $rs['parentid'] ? 'selected' : '';
    			$array[] = $r;
    		}
    		$str = "<option value='\$id' \$selected>\$spacer \$name</option>";
    		$tree->init($array);
    		$select_categorys = $tree->get_tree(0, $str);
    		$this->assign("info", $rs);
    		$this->assign("select_categorys", $select_categorys);
    		$this->assign("headline",    "编辑菜单");
    		$this->assign("action_name", ACTION_NAME);
    		$this->display("Menu:menu_oper");
    	}
    }
    

    /**
     *  删除
     */
    public function del_menuAct() 
    {
        $id = intval(I("post.id"));
        if(!$id){
        	$this->error("删除项不存在！");
        }
        $count = D("Menu")->where(array("parentid" => $id))->count();
        if ($count > 0) {
            $this->error("该菜单下还有子菜单，无法删除！");
        }
        if (D("Menu")->delete($id)!==false) {  
            $this->success("删除菜单成功！");
        } else {
            $this->error("删除失败！");
        }
    }
    
}

?>