<div class="navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="light-blue">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								<img class="nav-user-photo" src="__STATIC__/admin/img/user.jpg" alt="Jason's Photo" />
								<span class="user-info" style="line-height:30px;">
									欢迎:) <b><?php echo $ACCOUNT['account']; ?></b>
								</span>

								<i class="icon-caret-down"></i>
							</a>

							<ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="/Admin/Public/selection">
										<i class="icon-reply"></i>
										返回登录中心
									</a>
								</li>
								<li class="divider"></li>
								<li>
									<a href="#">
										<i class="icon-cog"></i>
										个人设置
									</a>
								</li>

								<li style="display:none;">
									<a href="javascript:openapp('<?php echo UC('Admin/Public/password'); ?>','254Admin','修改密码'); ">
										<i class="icon-user"></i>
										修改密码
									</a>
								</li>

								<li class="divider"></li>

								<li>
									<a href="<?php echo UC('Admin/Public/logout'); ?>">
										<i class="icon-off"></i>
										退出
									</a>
								</li>
							</ul>
						</li>
					</ul><!-- /.ace-nav -->
				</div>