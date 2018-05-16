
<div class="page-header">
	<h1>
		{$headline}
		<a href="<?php echo UC('Admin/User/index'); ?>">
			<button class="btn btn-sm" style="float:right;margin-right:35px;">
				返回列表
			</button>
		</a>
	</h1>
</div>
<div class="row">
	<div class="col-xs-12">
		<form class="form-horizontal" role="form" method="post"  enctype="multipart/form-data" action="javascript:;" >

			<table class="table table-bordered">
			    <tbody>

			    <tr>
			      <th width="160">用户名</th>
			      <td>
			        <input type="text" style="width:400px;" name="account" required="" value="{$info.account}" class="input input_hd J_title_color" placeholder="用户名">
			        <span class="must_red">*</span>
			      </td>
			    </tr>

			    <tr>
			      <th>电话</th>
			      <td>
			        <input type="text" style="width:400px;" name="mobile" required="" value="{$info.mobile}" class="input input_hd J_title_color" placeholder="电话">
			        <span class="must_red">*</span>
			      </td>
			    </tr>
			    <tr>
			      <th>角色</th>
			      <td>
					<select name="role_id" class="col-xs-10 col-sm-2 valid" style="width:400px;">
						<volist name="role_list" id="vo">
						<if condition="$vo.current eq 1">
								<option value="{$vo.id}" selected="selected" >{$vo.name}</option>
							<else />
								<option value="{$vo.id}">{$vo.name}{$info.current}</option>
							</if>
							</volist>
			        </select>
			      </td>
			    </tr>
			    <tr>
			      <th>账号状态</th>
			      <td>
					<input type="radio" name="status" value="0" <if condition="$info.status neq 1">checked</if>>启用&nbsp;&nbsp;&nbsp;
				  	<input type="radio" name="status" value="1" <if condition="$info.status eq 1">checked</if>>禁用
			      </td>
			    </tr>
			</tbody>
			</table>
			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="button" id="tijiao">
						<i class="icon-ok bigger-110"></i>
						提交
					</button>
					&nbsp; &nbsp; &nbsp;
					<button class="btn" type="reset">
						<i class="icon-undo bigger-110"></i>
						重置
					</button>
				</div>
			</div>
			<input type="hidden" name="uid" value="{$info.uid}" />
		</form>
	</div>
</div>
<script type="text/javascript">
$(document).ready(function(){
	$('#tijiao').click(function(){
		var data = $("form").serialize();
		$.post('User/'.{$action_name}, data, 
		  function(data){
			alert(data.info);
            if (data.status == 1) {
                window.location.href = data.url;
            } 
        },'json');
	})
});
</script>
<style type="text/css">
.col-xs-5{
	width: 30% !important;
}

</style>





