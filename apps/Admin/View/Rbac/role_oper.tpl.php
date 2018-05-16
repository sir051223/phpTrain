<div class="page-header">
	<h1>
		{$headline}
		<a href="<?php echo UC('Admin/Rbac/index')?>">
			<button class="btn btn-sm" style="float:right;margin-right:35px;">
				返回列表
			</button>
		</a>
	</h1>
</div>
<div class="row">
	<div class="col-xs-12">
		<form class="form-horizontal" role="form" method="post"  enctype="multipart/form-data" action="javascript:;" >
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">角色名称 </label>

				<div class="col-sm-9">
					<input type="text" name="name" class="required" value="{$info.name}" placeholder="角色名称" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">角色描述</label>

				<div class="col-sm-6">
					<textarea class="form-control limited" name="remark" >{$info.remark}</textarea>
				</div>
			</div>
			<div class="space-4"></div>
			<if condition="$info.id neq ''">
			<input type="hidden" name="id" value="{$info.id}" />
			</if>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">是否启用</label>

				<div class="col-sm-9">
					<if condition="$info.status eq ''">
						<input name="status" type="radio" class="ace" value="1" checked="checked" />
						<span class="lbl">开启</span>&nbsp;&nbsp;
						<input name="status" type="radio" class="ace" value="0" />
						<span class="lbl">禁止</span>
					<else />
						<if condition="$info.status eq 1">
							<input name="status" type="radio" class="ace" value="1"  checked="checked" />
							<span class="lbl">开启</span>&nbsp;&nbsp;
							<input name="status" type="radio" class="ace" value="0" />
							<span class="lbl">禁止</span>
						<else />
						    <input name="status" type="radio" class="ace" value="1" />
							<span class="lbl">开启</span>&nbsp;&nbsp;
							<input name="status" type="radio" class="ace" value="0" checked="checked" />
							<span class="lbl">禁止</span>
						</if>
					</if>
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="submit" id="tijiao">
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

			<div class="hr hr-24"></div>
		</form>
	</div>
</div>
<script type="text/javascript">
	jQuery(function($) {
		$().ready(function() {
			$("form").validate({
			   submitHandler: function(form) 
			   {      
				   var data = $("form").serialize();
					$.post("<?php echo UC('Rbac/'.$action_name)?>", data, 
					  function(data){
						alert(data.info);
			            if (data.status == 1) {
			                window.location.href = data.url;
			            } 
			        },'json');   
			   } 
			});
		});
	});
</script>

