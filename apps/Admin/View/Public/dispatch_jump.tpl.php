
<div class="row">
  <div class="col-xs-12"> 
    <!-- PAGE CONTENT BEGINS -->
    
    <div class="widget-box" style="width:60%;">
      <div class="widget-header header-color-<?php if($error) echo 'red'; else echo 'green'; ?> widget-header-small">
        <h5 class="smaller"><?php echo $error?'出错了!':'消息提示'; ?></h5>
          </div>
      <div class="widget-body">
        <div class="widget-main" style="text-align:center; font-weight:bold;"><?php echo $error?$error:$message; ?>
        </div>
        
       <?php if($waitSecond>0 && $jumpUrl): ?>
        <div class="widget-main" style="text-align:center;">
页面自动 <a id="href" href="<?php echo($jumpUrl); ?>">跳转</a> 等待时间： <b id="wait"><?php echo($waitSecond); ?></b>
		</div>
       <?php endif; ?>
        
      </div>
    </div>
    
    <!-- PAGE CONTENT ENDS --> 
  </div>
  <!-- /.col --> 
</div>

<?php if($waitSecond>0 && $jumpUrl): ?>
<script type="text/javascript">
(function(){
var wait = document.getElementById('wait'),href = document.getElementById('href').href;
var interval = setInterval(function(){
	var time = --wait.innerHTML;
	if(time <= 0) {
		location.href = href;
		clearInterval(interval);
	};
}, 1000);
})();
</script>
<?php endif; ?>
