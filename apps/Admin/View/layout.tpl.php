<include file="Block:header" />
<style>
body {
     overflow-x : hidden;   
     /*overflow-y : hidden;*/
}
</style>
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
		
		<script src="__STATIC__/admin/js/jquery.validate.js"></script>
		<script src="__STATIC__/admin/js/jquery.metadata.js"></script>
		<script src="__STATIC__/admin/js/messages_cn.js"></script>
		<script src="__STATIC__/theme/ace/assets/js/ace-elements.min.js"></script>
        
		<div class="main-container" id="main-container">
		
			<div class="loading-modal" id="ajaxIndicator" style="display:none;">
				<p style="top:54%; left:47%; position:fixed; color:red;" id="ajaxInditext">杂技</p>
			</div>
			<div class="main-container-inner">
				
                {__CONTENT__}
                
			</div><!-- /.main-container-inner -->

		</div><!-- /.main-container -->
		<script src="__STATIC__/admin/js/common.js?a=128"></script>
		
        
<include file="Block:footer" />
