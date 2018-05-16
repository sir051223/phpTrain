
<div class="page-content">
						<div class="page-header">
							<h1>
								设定
								<small>
									<i class="icon-double-angle-right"></i>
									修改密码
								</small>
							</h1>
						</div><!-- /.page-header -->

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								<form class="form-horizontal" role="form" name="passwordForm" id="passwordForm" method="post" action="<?php echo UC('Admin/Public/password');?>">
									<div class="form-group">
										<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 帐号 </label>

										<div class="col-sm-9">
											<span class="help-inline col-xs-12 col-sm-7">
												<span class="middle"><b><?php echo $ACCOUNT['account']; ?></b></span>
											</span>
										</div>
									</div>

									<div class="space-4"></div>

									<div class="form-group">
										<label class="col-sm-3 control-label no-padding-right" for="form-field-2"> 输入旧密码 </label>

										<div class="col-sm-9">
											<input name="oldpass" type="password" class="col-xs-10 col-sm-5" id="oldpass" placeholder="旧密码">
											
										</div>
									</div>
                                    
                                    <div class="form-group">
										<label class="col-sm-3 control-label no-padding-right" for="form-field-2"> 输入新密码 </label>

										<div class="col-sm-9">
											<input name="newpass" type="password" class="col-xs-10 col-sm-5" id="newpass" placeholder="新密码">
                                            <span class="help-button" data-rel="popover" data-trigger="hover" data-placement="left" data-content="新密码由字母、数字、符号或汉字组成，长度要求最少6位。" title="">?</span>
											
										</div>
									</div>

									<div class="space-4"></div>
                                    
                                    <div class="form-group">
										<label class="col-sm-3 control-label no-padding-right" for="form-field-2"> 再次输入 </label>

										<div class="col-sm-9">
											<input name="retypepass" type="password" class="col-xs-10 col-sm-5" id="retypepass" placeholder="再次输入新密码">
											
										</div>
									</div>


									<div class="clearfix form-actions">
										<div class="col-md-offset-3 col-md-9">
											<button class="btn btn-info" type="button" onClick="submitPasswordForm();">
												<i class="icon-ok bigger-110"></i>
												提交
											</button>

											&nbsp; &nbsp; &nbsp;
											<button class="btn" type="reset" onClick="resetPasswordForm();">
												<i class="icon-undo bigger-110"></i>
												重置
											</button>
										</div>
									</div>

									<div class="hr hr-24"></div>

									<!-- /row -->

								</form>
						
								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div>

		<script type="text/javascript">
			function submitPasswordForm(){
				$('#passwordForm').submit();
			}
			
			function resetPasswordForm(){
				$('input[name=oldpass]').value = '';
				$('input[name=newpass]').value = '';
				$('input[name=retypepass]').value = '';
			}
			
			
			jQuery(function($) {
				
				$('[data-rel=tooltip]').tooltip({container:'body'});
				$('[data-rel=popover]').popover({container:'body'});
				
				$('textarea[class*=autosize]').autosize({append: "\n"});
				$('textarea.limited').inputlimiter({
					remText: '%n character%s remaining...',
					limitText: 'max allowed : %n.'
				});		
			});
			
			$('#passwordForm').validate({
 				rules: {
					oldpass: {
      						required: true,
    				},
					newpass: {
      						required: true,
      						minlength: 6
    				},
					retypepass: {
      						required: true,
							equalTo: "#newpass"
    				},
				},
				messages: {
					
					oldpass: {
      						required: "请输入旧密码"
					},
				    
					newpass: {
      							required: "请输入新密码",
      							minlength: "密码要求最少6位长度！"
    			    },
					
				    retypepass: {
      							required: "请再次输入新密码",
      							equalTo: "两次输入密码不一致，请重新输入！"
    			    }
				},
				
				errorElement: 'span',
				errorClass: 'tip-error',
				validClass: 'tip-success',
			
			});	
			
			$('input[name=retypepass]').keydown(function( event ) {
  				if ( event.which == 13 ) {
   					event.preventDefault();
					submitPasswordForm();
		 		}
			});
	
		</script>   