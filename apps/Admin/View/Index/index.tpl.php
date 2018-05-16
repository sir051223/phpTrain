<include file="Block:header" />
<div id="loading" style="display: none;"><i class="loadingicon"></i><span>正在加载...</span></div>
<div id="right_tools_wrapper">
		<!--<span id="right_tools_clearcache" title="清除缓存" onclick="javascript:openapp('/index.php?g=admin&m=setting&a=clearcache','right_tool_clearcache','清除缓存');"><i class="fa fa-trash-o right_tool_icon"></i></span>-->
		<span id="refresh_wrapper" title="刷新当前页"><i class="fa fa-refresh right_tool_icon "></i></span>
</div>
		<!-- basic scripts -->

		<!--[if !IE]> -->

		<script type="text/javascript">
			window.jQuery || document.write("<script src='__STATIC__/theme/ace/assets/js/jquery-2.0.3.min.js'>"+"<"+"/script>");
		</script>

		<!-- <![endif]-->

		<!--[if IE]>
<script type="text/javascript">
 window.jQuery || document.write("<script src='__STATIC__/theme/ace/assets/js/jquery-1.10.2.min.js'>"+"<"+"/script>");
</script>
<![endif]-->


		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='__STATIC__/theme/ace/assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="__STATIC__/theme/ace/assets/js/bootstrap.min.js"></script>
		<script src="__STATIC__/theme/ace/assets/js/typeahead-bs2.min.js"></script>
        

        

<div class="navbar navbar-default" id="navbar">
			<script type="text/javascript">
				try{ace.settings.check('navbar' , 'fixed')}catch(e){}
			</script>

			<div class="navbar-container" id="navbar-container">
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<i class="icon-leaf"></i>
							<?php echo $G_VAR['site_title']; ?>
						</small>
					</a><!-- /.brand -->
				</div><!-- /.navbar-header -->
				
				<?php if(C('SITE_VERSION')){?>
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<?php echo C('SITE_VERSION'); ?>
						</small>
					</a><!-- /.brand -->
				</div><!-- /.navbar-header -->
				<?php }?>
                <include file="Block:navbar" />
				<!-- /.navbar-header -->
			</div><!-- /.container -->
		</div>

		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>

			<div class="main-container-inner">
				<a class="menu-toggler" id="menu-toggler" href="#">
					<span class="menu-text"></span>
				</a>

				<div class="sidebar" id="sidebar">
					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
					</script>

					<div class="sidebar-shortcuts" id="sidebar-shortcuts">
						<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
							<button class="btn btn-success">
								<i class="icon-signal"></i>
							</button>

							<button class="btn btn-info">
								<i class="icon-pencil"></i>
							</button>

							<button class="btn btn-warning">
								<i class="icon-group"></i>
							</button>

							<button class="btn btn-danger">
								<i class="icon-cogs"></i>
							</button>
						</div>

						<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
							<span class="btn btn-success"></span>

							<span class="btn btn-info"></span>

							<span class="btn btn-warning"></span>

							<span class="btn btn-danger"></span>
						</div>
					</div><!-- #sidebar-shortcuts -->
                    
                    {$SUBMENU_CONFIG}
						
                    <!-- /.nav-list -->

					<div class="sidebar-collapse" id="sidebar-collapse">
						<i class="icon-double-angle-left" data-icon1="icon-double-angle-left" data-icon2="icon-double-angle-right"></i>
					</div>

					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
					</script>
				</div>

                <div class="main-content">
                <div class="breadcrumbs" id="breadcrumbs">
						<script type="text/javascript">
							try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
						</script>
						<a id="task-pre" class="task-changebt" style="display: none;">←</a>
						<div id="task-content" style="width: 118px;">
							<ul class="macro-component-tab" id="task-content-inner" style="width: 118px;margin:0px;padding:0px;">
								<li class="macro-component-tabitem noclose" app-id="0" app-name="首页">
									<span class="macro-tabs-item-text">首页</span>
								</li>
							</ul>
							<div style="clear:both;"></div>
						</div>
						{$__BREADCRUMB__}
						
                        <!-- .breadcrumb -->

						<!-- <div class="nav-search" id="nav-search">
							<form class="form-search">
								<span class="input-icon">
									<input type="text" placeholder="搜索 ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />
									<i class="icon-search nav-search-icon"></i>
								</span>
							</form>
						</div> -->
						<!-- #nav-search -->
					</div>
                    
                <div class="page-content" style="padding:8px 0px 2px;">
               	 		
               	 		<div class="page-content" id="content">
							<iframe src="<?php echo UC('Admin/Index/welcome'); ?>" style="width:100%;height: 100%;" scrolling="yes" frameborder="0" id="appiframe-0" class="appiframe"></iframe>
						</div>
                        
                        <!-- custom footbar -->
                		<div class="footbar footbar-default">
                			<div class="footbar-container">&copy;<?php date('Y'); ?>&nbsp;&nbsp;<?php echo $G_VAR['site_company']; ?></div>
                		</div>
               	 </div><!-- /.page-content -->
     
            </div> <!-- /.main-content -->

			</div><!-- /.main-container-inner -->

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="icon-double-angle-up icon-only bigger-110"></i>
			</a>
		</div><!-- /.main-container -->

		<!-- ace scripts -->
		<script src="__STATIC__/theme/ace/assets/js/jquery.js"></script>
		<script src="__STATIC__/theme/ace/assets/js/index.js"></script>
        
<include file="Block:footer" />