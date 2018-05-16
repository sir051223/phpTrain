<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 管理后台--上传文件控制器
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-18
 *  +----------------------------------------------------------------------
 */

namespace Admin\Controller;

class UploadController extends CommonController {
	
	/**
	 * 编辑器图片上传
	 * @return json
	 */
	public function keditor_uploadAct() 
	{
		$upload = new \Think\Upload (); // 实例化上传类
		$upload->maxSize = 314572800; // 设置附件上传大小
		$upload->exts = array (
				'jpg',
				'gif',
				'png',
				'jpeg' 
		); // 设置附件上传类型
		$dir = I('get.dir');
		$upload->rootPath = './'; // 保存根路径
		$upload->savePath = 'uploads/keditor/' . $dir . '/' . date ( 'Y-m' ) . '/';
		// 创建目录
		check_dir ( $upload->savePath );
		// 执行上传
		if (! $info = $upload->uploadOne ( $_FILES ['imgFile'], $upload->savePath )) {
			// 上传错误提示错误信息
			echo json_encode ( array (
					'error' => 1,
					'message' => "1" . $upload->getError () 
			) );
		} else {
			// 上传成功 获取上传文件信息
			$fileUrl = $info ['savepath'] . $info ['savename'];
			$fullPath = __BASE__ . $fileUrl;
			echo json_encode ( array (
					'error' => 0,
					'url' => $fullPath 
			) );
		}
		exit ();
	}
	
	public function img_uploadAct() 
	{
		$file = str_replace ( ' ', '+', $_POST ['Data'] );
		$Fname = $_POST ['Name'];
		$tmparr = explode ( '.', $Fname );
		$suffix = $tmparr [count ( $tmparr ) - 1];
		$imgData = base64_decode ( $file );
		$savename = uniqid () . '.' . $suffix;
		
		$p = UPLOAD_PATH . '/' . $_POST ['module'] . '/' . date ( 'Y' ) . '/' . date ( 'm' ) . '/' . date ( 'd' ) . '/';
		
		check_dir ( $p );
		$paths = $p . $savename;
		// 生成图片
		if (file_put_contents ( $paths, $imgData )) {
			$data ['url'] = 'uploads/' . $_POST ['module'] . '/' . date ( 'Y' ) . '/' . date ( 'm' ) . '/' . date ( 'd' ) . '/' . $savename;
			echo $data ['url'];
			exit ();
		}
	}

	/**
	 * 上传图片更新数据库数据
	 */
	function updateTableAct()
	{
		$id_name = I("POST.id_name");
		$id = I("POST.id");
		$table = I("POST.table");
		$primary_key = I("POST.primary_key");
		$key_value = I("POST.key_value");
		$url_name = I("POST.url_name");
		$url_value = I("POST.url_value");
		$field_name = I("POST.field_name");
		$field_value = I("POST.field_value");
		$del = I("POST.del");
/*		$str = implode('-', array($id_name,$id,$table,$primary_key,$key_value,$url_name,$url_value,$field_name,$field_value,$del));
$this->success($str);*/
		if ($del == TRUE) {
			D($table)->delete($key_value);
			$this->success("图片删除成功！");
		}else{
			if ($key_value) {
				$data = array(
					$primary_key=> $key_value,
					$id_name	=> $id,
					$url_name	=> $url_value
					);
				$result = D($table)->save($data);
				$this->success('图片修改成功！');
			}else{
				$data = array(
					$id_name	=> $id,
					$url_name	=> $url_value,
					$field_name	=> $field_value
					);
				$result = D($table)->add($data);
				$this->success($result);			
			}			
		}
	}	

	/**
	 * 删除文件
	 */
	function delAct() 
	{
		$id = I("POST.id");
		$src = APP_ROOT.'public/'.str_replace(__BASE__, '', $_POST['src']);
		debug_log('删除了文件====='.$_POST['src']);
		if (file_exists($src)){
			unlink($src);
			if($id){
				$table = I("POST.table");
				$p_key = I("POST.p_key");
				$field_name = I("POST.field_name");
				if($table && $p_key && $field_name){
					$cond[$p_key] = $id;
					$data[$field_name] = '';
					D($table)->where($cond)->save($data);
				}
			}
		}
		$this->success('删除成功');
		exit();
	}
	
	
	
}
