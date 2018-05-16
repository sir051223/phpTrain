<div class="row">
	<div class="col-xs-12">
        <div class="well">
        	  <div class="btn-group ">
              	<a class="btn btn-success dropdown-toggle" href="<?php echo UC('Admin/Rbac/role_add')?>">&nbsp;添&nbsp;&nbsp;加&nbsp;</a>
              </div>
        </div>   
		<div class="table-responsive">
			<table id="sample-table-2" class="table table-striped table-bordered table-hover">
				<thead>
					<tr>
						<th class="center">
							<label>
								<input type="checkbox" class="ace" />
								<span class="lbl"></span>
							</label>
						</th>
						<th>角色名称</th>
						<th class="hidden-480">角色描述</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					<volist name="list" id="vo">
					<tr id="div_{$vo.id}">
						<td class="center">
							<label>
								<input type="checkbox" class="ace" name="{$vo.id}" />
								<span class="lbl"></span>
							</label>
						</td>
						<td>{$vo.name}</td>
						<td class="hidden-480">{$vo.remark}</td>
						<td><if condition="$vo.status eq 1">启用<else />禁止</if></td>
						<td>
							<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons">
								<a class="green" href="<?php echo UC('Admin/Rbac/role_edit')?>?id={$vo.id}" title="编辑">
									<i class="icon-pencil bigger-130"></i>
								</a>
								<a class="red" href="javascript:;" onclick="remove_vote({$vo.id}, '您确认要删除这条数据吗?')" title="删除">
									<i class="icon-trash bigger-130"></i>
								</a>
								<a class="blue" href="<?php echo UC('Admin/Rbac/authorize')?>?id={$vo.id}" title="权限设置">
									<i class="icon-comment bigger-130"></i>
								</a>					
							</div>
						</td>
					</tr>
					</volist>
				</tbody>
			</table>
		</div>
	</div>
</div>
<script src="__STATIC__/theme/ace/assets/js/jquery.dataTables.min.js"></script>
<script src="__STATIC__/theme/ace/assets/js/jquery.dataTables.bootstrap.js"></script>

<script type="text/javascript">
	jQuery(function($) {
		var oTable1 = $('#sample-table-2').dataTable( {
			"aoColumns": [
		      { "bSortable": false },
		      null, null,null,
			  { "bSortable": false }
		     ],
		     "bProcessing": true, 
		     'bStateSave': true,
	         "sPaginationType": "bootstrap",
		     "oLanguage": {
	             "oPaginate": {
	                 "sFirst": "首页",
	                 "sLast": "末页",
	                 "sNext": "下页",
	                 "sPrevious": "上页"
	             },
	             "sEmptyTable": "表格是空的",
	             "sZeroRecords": "没有符合条件的数据",
	             "sInfo": "总共_TOTAL_条数据（当前为第_START_条到第_END_条）",
	             "sInfoEmpty": "没有符合条件的数据",
	             "sInfoFiltered": "（从_MAX_条数据中过滤）",
	             "sLengthMenu": "显示_MENU_条数据",
	             "sProcessing": "数据处理中……",
	             "sSearch": "搜索："
	         }
      	} );
	})
	
	function remove_vote(id, cfm)
	{
		if (confirm(cfm))
	    {
			$.post("<?php echo UC('Admin/Rbac/del_role')?>", {"id":id}, 
			  function(data){
				alert(data.info);
	            if (data.status == 1) {
	            	window.location.reload();
	            } 
	        },'json');
	    }
	}
</script>