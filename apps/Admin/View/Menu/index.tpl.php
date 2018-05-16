<div class="row">
	<div class="col-xs-12">
        <div class="well">
        	  <div class="btn-group">
              	<a class="btn btn-success dropdown-toggle" href="<?php echo UC('Admin/Menu/menu_add')?>">&nbsp;添&nbsp;&nbsp;加&nbsp;</a>
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
						<th>ID</th>
						<th class="hidden-480">菜单名称</th>
						<th>状态</th>
						<th>管理操作</th>
					</tr>
				</thead>

				<tbody>
					{$categorys}
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
	
	function remove_vote(id)
	{
		if (confirm('您确认要删除这条数据吗?'))
	    {
			$.post("<?php echo UC('Menu/del_menu');?>", {"id":id}, 
			  function(data){
				alert(data.info);
	            if (data.status == 1) {
	            	window.location.reload();
	            } 
	        },'json');
	    }
	}
</script>