<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 系统权限配置，用户角色管理模型
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */
namespace Common\Model;

class RoleModel extends CommonModel
{

	protected $connection = 'EXT_CONFIG';

	/*自动验证*/
	protected $_validate = array(
			array('name', 'require', '角色名称不能为空！', 1, 'regex', CommonModel:: MODEL_BOTH ),
	);

	/*自动完成*/
	protected $_auto = array(
			array('create_time', 'time', 1, 'function'),
			array('update_time', 'time', 2, 'function'),
	);


	public function get_role_list()
	{
		$data = $this->order(array("listorder" => "asc", "id" => "desc"))->select();
		return $data;
	}

	public function simple_role_list($currentid = null)
	{
		$cond['status'] = 1;
		$cond['id'] = array('NEQ', 1);
		$data = D('Role')->where($cond)->field('id, name')->select();
		if ($currentid && $data) {
			foreach ($data AS $k => $v) {
				if ($v['id'] == $currentid) {
					$data[$k]['current'] = 1;
				} else {
					$data[$k]['current'] = 0;
				}
			}
		}
		return $data;
	}
}