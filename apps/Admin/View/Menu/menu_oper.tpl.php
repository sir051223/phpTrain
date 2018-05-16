<div class="page-header">
	<h1>
		{$headline}
		<a href="<?php echo UC('Admin/Menu/index')?>">
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
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">上级</label>

				<div class="col-sm-9">
					<select class="col-xs-10 col-sm-2" name="parentid" >
						<option value='0'>作为一级菜单</option>
						{$select_categorys}
					</select>
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">名称 </label>

				<div class="col-sm-9">
					<input type="text" name="name" value="{$info.name}" class="required" placeholder="名称" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">项目 </label>

				<div class="col-sm-9">
					<input type="text" name="app" value="{$info.app}" class="required" placeholder="项目" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">模块 </label>

				<div class="col-sm-9">
					<input type="text" name="model" value="{$info.model}" class="required" placeholder="模块" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">方法 </label>

				<div class="col-sm-9">
					<input type="text" name="action" value="{$info.action}" class="required" placeholder="方法" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">参数 </label>

				<div class="col-sm-9" style="line-heiht:30px;">
					<input type="text" name="data" value="{$info.data}" placeholder="参数" class="col-xs-10 col-sm-5" />
					&nbsp;&nbsp;例:g=admin&m=menu&a=add；外部链接以http://开头
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">图标 </label>

				<div class="col-sm-9">
					<input type="text" name="icon" value="{$info.icon}" placeholder="图标" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">备注</label>

				<div class="col-sm-6">
					<textarea class="form-control limited" name="remark" value="{$info.remark}"></textarea>
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">状态</label>

				<div class="col-sm-9">
					<select class="col-xs-10 col-sm-2" name="status" >
						<if condition="$info.status eq 1">
							<option value='1' selected >显示</option>
							<option value='0' >不显示</option>
						<else />
							<option value='1' >显示</option>
							<option value='0' selected>不显示</option>
						</if>					
					</select>
				</div>
			</div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">菜单类别</label>
				<div class="col-sm-9">
					<select class="col-xs-10 col-sm-2" name="owner" >
						<if condition="$info.owner eq 'weixin'">
							<option value='weixin' selected >微信</option>
							<option value='normal' >普通菜单</option>
                            <option value='property'>智爱房产官网</option>
                            <option value='project'>项目</option>
                        <elseif condition="$info.owner eq 'project'"/>
                            <option value='project' selected >项目</option>
                            <option value='weixin' >微信</option>
                            <option value='property' >智爱房产官网</option>
                            <option value='normal' >普通菜单</option>
                        <elseif condition="$info.owner eq 'property'"/>
                            <option value='property' selected >智爱房产官网</option>
                            <option value='project'>项目</option>
                            <option value='weixin' >微信</option>
                            <option value='normal' >普通菜单</option>
						<else />
							<option value='weixin' >微信</option>
                            <option value='property' >智爱房产官网</option>
							<option value='normal' selected>普通菜单</option>
                            <option value='project'>项目</option>
						</if>
					</select>
				</div>
			</div>
			<div class="space-4"></div>
			<input type="hidden" name="id" value="{$info.id}" />
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">类型</label>

				<div class="col-sm-9" style="line-height:30px;">
					<select class="col-xs-10 col-sm-2" name="type" >
						<if condition="$info.type eq 1">
							<option value='1' selected >权限认证+菜单</option>
							<option value='0' >只作为菜单</option>
						<else />
							<option value='1' >权限认证+菜单</option>
							<option value='0' selected>只作为菜单</option>
						</if>
					</select>
					&nbsp;&nbsp;注意：“权限认证+菜单”表示加入后台权限管理，纯碎是菜单项请不要选择此项。
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
				$.post("<?php echo UC('Menu/'.$action_name)?>", data, 
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

