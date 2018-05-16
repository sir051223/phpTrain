/**
 * jqGrid 相关函数
 * 
 */

/*----------------------------*/
/* ACE定义的相关函数 */
/*----------------------------*/

 				//switch element when editing inline
				function aceSwitch( cellvalue, options, cell ) {
					setTimeout(function(){
						$(cell) .find('input[type=checkbox]')
								.wrap('<label class="inline" />')
							.addClass('ace ace-switch ace-switch-5')
							.after('<span class="lbl"></span>');
					}, 0);
				}
				//enable datepicker
				function pickDate( cellvalue, options, cell ) {
					setTimeout(function(){
						$(cell) .find('input[type=text]')
								.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
					}, 0);
				}
				
				
				function style_edit_form(form) {
					//enable datepicker on "sdate" field and switches for "stock" field
					/*
					form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
						.end().find('input[name=stock]')
							  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
			        */
					
					//update buttons classes
					var buttons = form.next().find('.EditButton .fm-button');
					buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
					buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
					buttons.eq(1).prepend('<i class="icon-remove"></i>')
					
					buttons = form.next().find('.navButton a');
					buttons.find('.ui-icon').remove();
					buttons.eq(0).append('<i class="icon-chevron-left"></i>');
					buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
				}
			
				function style_delete_form(form) {
					var buttons = form.next().find('.EditButton .fm-button');
					buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
					buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
					buttons.eq(1).prepend('<i class="icon-remove"></i>')
				}
				
				function style_search_filters(form) {
					form.find('.delete-rule').val('X');
					form.find('.add-rule').addClass('btn btn-xs btn-primary');
					form.find('.add-group').addClass('btn btn-xs btn-success');
					form.find('.delete-group').addClass('btn btn-xs btn-danger');
				}
				function style_search_form(form) {
					var dialog = form.closest('.ui-jqdialog');
					var buttons = dialog.find('.EditTable')
					buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
					buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
					buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
				}
				
				function beforeDeleteCallback(e) {
					var form = $(e[0]);
					if(form.data('styled')) return false;
					
					form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
					style_delete_form(form);
					
					form.data('styled', true);
				}
				
				function beforeEditCallback(e) {
					var form = $(e[0]);
					form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
					style_edit_form(form);
				}
			
			
			
				//it causes some flicker when reloading or navigating grid
				//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
				//or go back to default browser checkbox styles for the grid
				function styleCheckbox(table) {
				/**
					$(table).find('input:checkbox').addClass('ace')
					.wrap('<label />')
					.after('<span class="lbl align-top" />')
			
			
					$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
					.find('input.cbox[type=checkbox]').addClass('ace')
					.wrap('<label />').after('<span class="lbl align-top" />');
				*/
				}
				
			
				//unlike navButtons icons, action icons in rows seem to be hard-coded
				//you can change them like this in here if you want
				function updateActionIcons(table) {
					/**
					var replacement = 
					{
						'ui-icon-pencil' : 'icon-pencil blue',
						'ui-icon-trash' : 'icon-trash red',
						'ui-icon-disk' : 'icon-ok green',
						'ui-icon-cancel' : 'icon-remove red'
					};
					$(table).find('.ui-pg-div span.ui-icon').each(function(){
						var icon = $(this);
						var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
						if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
					})
					*/
				}
				
				//replace icons with FontAwesome icons like above
				function updatePagerIcons(table) {
					var replacement = 
					{
						'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
						'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
						'ui-icon-seek-next' : 'icon-angle-right bigger-140',
						'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
					};
					$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
						var icon = $(this);
						var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
						
						if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
					})
				}
			
				function enableTooltips(table) {
					$('.navtable .ui-pg-button').tooltip({container:'body'});
					$(table).find('.ui-pg-div').tooltip({container:'body'});
				}
				


/*----------------------------*/
/* GZNC 自定义函数集  */
/*----------------------------*/				
				
function jgrid_edit_beforeInitData_callback(formid) {
	if (grid_settings.edit_reload) {
		var grid = jQuery('#' + jgrid_grid_selector(formid));

		// var selRowId = jQuery(grid_selector).jqGrid('getGridParam',
		// 'selrow');
		var selRowIds = grid.jqGrid('getGridParam', 'selarrrow');

		//console.log(selRowIds);

		unloadRowIds = [];
		for (i in selRowIds) {
			rid = selRowIds[i];
			rowdata = grid.jqGrid('getRowData', rid);

			//console.log(rowdata);
			
			if (rowdata['reloadtag']==1) {
				unloadRowIds.push(rid);
			}
		}

		if (unloadRowIds.length) {
			jgrid_edit_load_row(grid, unloadRowIds);
		}
	}
}
				
				
function jgrid_edit_afterclickPgButtons_callback(whichbutton, formid, rowid) {
	var grid_selector = jgrid_grid_selector(formid);
	var grid = jQuery('#' + grid_selector);

	var rowdata = grid.jqGrid('getRowData', rowid);
	// console.log(rowdata);

	if (grid_settings.edit_reload && rowdata['reloadtag']==1) {
		jgrid_edit_load_row(grid, rowid);
		rowdata = grid.jqGrid('getRowData', rowid);
	}

	/**
	 * What if currently in edit mode and user click navigational button?
	 */
	var richcols = jgrid_ckeditor_get_cols(grid);
	for(i in richcols){
		eval('CKEDITOR.instances.' + richcols[i].name).setData(rowdata[richcols[i].name]);
	}
}
		

function jgrid_edit_beforeSubmit_callback(postdata, formid) {
	var grid = jQuery('#' + jgrid_grid_selector(formid));

	//alert('beforeSubmit');
	
	var selRowId = grid.jqGrid('getGridParam', 'selrow');
	
	if (selRowId && selRowId.length) {
		var rowdata = grid.jqGrid('getRowData', selRowId);

		if (grid_settings.edit_reload && rowdata['reloadtag'] == 1) {
			return [ false, '数据未成功同步，请重新加载' ];
		}
	}
	
	/**
	 * CKEDITOR didn't automaticaly replace our 'keterangan' value then it
	 * need to set manually
	 */
	var richcols = jgrid_ckeditor_get_cols(grid);
	for (i in richcols) {
		postdata[richcols[i].name] = eval('CKEDITOR.instances.' + richcols[i].name)
				.getData();
	}
	
	return [ true, '' ];
}

function jgrid_edit_beforeCheckValues_callback(postdata, formid, mode){
	var grid = jQuery('#' + jgrid_grid_selector(formid));
	
	/**
	 * CKEDITOR didn't automaticaly replace our 'keterangan' value then it
	 * need to set manually
	 */
	var richcols = jgrid_ckeditor_get_cols(grid);
	for (i in richcols) {
		postdata[richcols[i].name] = eval('CKEDITOR.instances.' + richcols[i].name)
				.getData();
	}
}
			

function jgrid_edit_beforeShowForm_callback(formid) {
	var grid_selector = jgrid_grid_selector(formid);
	var grid = jQuery('#' + jgrid_grid_selector(formid));

	var form = $(formid[0]);

	// console.log(form.find('input[name=grid-table_id]').val());
	var rowid = form.find('input[name=' + grid_selector + '_id]').val();
	
	if (rowid && rowid!='_empty') {
		var rowdata = grid.jqGrid('getRowData', rowid);

		if (grid_settings.edit_reload && rowdata['reloadtag'] == 1) {
			// return[false,'数据未成功同步，请重新加载'];
			jgrid_edit_load_row(grid, rowid);
			jgrid_edit_replace_form(grid, form, rowid);
		}
	}

	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner(
			'<div class="widget-header" />');
	style_edit_form(form);
	
	form.closest('.ui-jqdialog').css('overflow', 'auto');
	form.closest('.ui-jqdialog').css('overflow-x', 'hidden');
	
	/*
	$(this).children("span").css({
	    overflow: "auto",
	    "text-align": "inherit", // overwrite 'text-align: "right"' if exist
	    display: "inline-block",
	    "max-height": "100px"
	});*/
	
	// bootstrap datepicker
	if(form.closest('.ui-jqdialog').find('input').hasClass('bootstrap-datepicker')){
		jgrid_edit_beforeShowForm_bootstrap_datepicker(form);
	}
	
	// jqueryuid datepicker
	if(form.closest('.ui-jqdialog').find('input').hasClass('jqueryui-datepicker')){
		jgrid_edit_beforeShowForm_jqueryui_datepicker(form);
	}
	if(form.closest('.ui-jqdialog').find('input').hasClass('jqueryui-datetimepicker')){
		jgrid_edit_beforeShowForm_jqueryui_datetimepicker(form);
	}
	if(form.closest('.ui-jqdialog').find('input').hasClass('jqueryui-timepicker')){
		jgrid_edit_beforeShowForm_jqueryui_timepicker(form);
	}
}

function jgrid_edit_beforeShowForm_bootstrap_datepicker(form){
	// datepicker
	datepicker_options = $.extend(true, {}, bootstrap_datepicker_default_options(), {});
	
	//console.log(form.closest('.ui-jqdialog').find('input.datepicker').parent());
	
	var datepicker_obj = form.closest('.ui-jqdialog').find('input.bootstrap-datepicker');
	datepicker_obj.parent().addClass('input-group');
	
	datepicker_obj.datepicker(datepicker_options);
   
	if (datepicker_obj.hasClass('show-datepicker-icon')) {
		datepicker_obj.after('<span class="input-group-addon cursor datepicker-icon" style="display:inline-table;"><i class="icon-calendar"></i></span>');
		
		datepickericon_obj = datepicker_obj.siblings('span.datepicker-icon');
		datepickericon_obj.datepicker(datepicker_options).on(
						'changeDate',
						function(event) {
							// console.log($(event.target).siblings('input.datepicker'));
							/*
							var datepicker_icon = $(event.target);
							datepicker_icon.siblings(
									'input.bootstrap-datepicker').val(
									datepicker_icon.data('date'));
							datepicker_icon.datepicker('hide');*/
							
							datepicker_obj.val(datepickericon_obj.data('date'));
							datepickericon_obj.datepicker('hide');
						});
	}
}


function jgrid_edit_beforeShowForm_jqueryui_datepicker(form){
	// datepicker
	var options = $.extend(true, {}, jqueryui_datepicker_default_options(), {});
	
	//console.log(form.closest('.ui-jqdialog').find('input.datepicker').parent());
	
	var datepicker_obj = form.closest('.ui-jqdialog').find('input.jqueryui-datepicker');
	//datepicker_obj.parent().addClass('input-group');
	
	datepicker_obj.datepicker(options);	
}

function jgrid_edit_beforeShowForm_jqueryui_datetimepicker(form){
	// datepicker
	var options = $.extend(true, {}, jqueryui_datetimepicker_default_options(), 
	{
		dateFormat: 'yy-mm-dd', 
		timeFormat: 'HH:mm:ss',
	});
	
	//console.log(form.closest('.ui-jqdialog').find('input.datepicker').parent());
	
	var datepicker_obj = form.closest('.ui-jqdialog').find('input.jqueryui-datetimepicker');
	//datepicker_obj.parent().addClass('input-group');
	
	//var date_val = datepicker_obj.val();
	
	//alert(date_val);
	
	datepicker_obj.datetimepicker(options);	
	
	//datepicker_obj.datepicker( "setDate", date_val );
}

function jgrid_edit_beforeShowForm_jqueryui_timepicker(form){
	// datepicker
	var options = $.extend(true, {}, jqueryui_timepicker_default_options(), 
	{
		timeFormat: 'HH:mm:ss',
	});
	
	//console.log(form.closest('.ui-jqdialog').find('input.datepicker').parent());
	
	var datepicker_obj = form.closest('.ui-jqdialog').find('input.jqueryui-timepicker');
	//datepicker_obj.parent().addClass('input-group');
	
	datepicker_obj.timepicker(options);	
}
				

function jgrid_edit_afterShowForm_callback(formid) {
	var grid_selector = jgrid_grid_selector(formid);
	var grid = jQuery('#' + jgrid_grid_selector(formid));
	var form = $(formid[0]);
	var selrowdata = [];
	
	// we need to get selected row in case currently we are in Edit Mode
	selID = grid.getGridParam('selrow'); // get selected row
	// I don't know how to get the current mode is, in Editing or Add new?
	// then let's find out if
	// navigational buttons are hidden for both of it and selID == null <– Add
	// mode ^0^
	/*
	if (!($('a#pData').is(':hidden') || $('a#nData').is(':hidden')
			&& selID == null)) { // then it must be edit?
	*/
	
	// anonther way to check edit mode
	var obj=form.find('input[name=' + grid_selector + '_id]');
	if(selID && obj.length && obj.val() && obj.val()!='_empty'){
		selrowdata = $('#' + grid_selector).getRowData(selID);
	}
	
	//console.log(selrowdata);
	
	var richcols = jgrid_ckeditor_get_cols(grid);
	for(i in richcols){
		jgrid_ckeditor_init(richcols[i].name, selrowdata[richcols[i].name], richcols[i].editoptions.editoroptions);
	}
}

function jgrid_edit_onclickSubmit_callback(params, posdata){
	alert('onclickSubmit');
}


function jgrid_edit_afterSubmit_callback(response, postdata) {
	// grid_selector = postdata.grid_selector;

	// alert(grid_selector2);

	var res = eval("(" + response.responseText + ")");

	grid_selector = res.grid;

	// alert(grid_selector);

	if (res.success) {
		
		if(res.message.length){
			jgrid_show_tip(res.message);
		}

		//console.log(res.data);

		/*
		if (typeof (res.data) != 'undefined' && typeof(res.id)!='undefined') {
			//jQuery(grid_selector).jqGrid('addRowData', res.id, res.data);
			//jQuery(grid_selector).jqGrid('addRowData', res.id, res.data);
		}*/
	}
	return [ res.success, res.message, res.id ];
}
				

function jgrid_afterSubmit_callback(response, postdata) {
	// grid_selector = postdata.grid_selector;

	// alert(grid_selector2);

	var res = eval("(" + response.responseText + ")");

	grid_selector = res.grid;

	// alert(grid_selector);

	if (res.success && res.message.length) {
		jgrid_show_tip(res.message);

		if (typeof (res.delcount) != 'undefined' && res.delcount) {
			var remainrows = jQuery(grid_selector).jqGrid('getDataIDs');
			if ((remainrows.length - res.delcount) <= 0) {
				jQuery(grid_selector).trigger("reloadGrid");
			}
		}
	}
	return [ res.success, res.message ];
}
						
						

function jgrid_delete_beforeShowForm_callback(formid) {
	var form = $(formid[0]);
	if (form.data('styled'))
		return false;

	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner(
			'<div class="widget-header" />');
	style_delete_form(form);

	form.data('styled', true);
}


function jgrid_beforeShowForm_callback(formid) {
	var form = $(formid[0]);
	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner(
			'<div class="widget-header" />');
	style_edit_form(form);
}

function jgrid_ckeditor_get_cols(grid_selector){
	if(typeof(grid_selector)=='object'){
		grid = grid_selector;
	}else{
		grid = $('#' + grid_selector);
	}
	var colmodel = grid.jqGrid ('getGridParam', 'colModel');
	//console.log(model);
	
	var richcols = [];
	
	for(i in colmodel){
		model = colmodel[i];
		if(typeof(model.editoptions)!='undefined' && typeof(model.editoptions.richeditor)!='undefined' && model.editoptions.richeditor){
			richcols.push(model);
		}
	}
	
	//console.log(richcols);
	
	return richcols;
}

function jgrid_ckeditor_init(name, value, options){
	/**
	 * we want to use CKEDITOR, then we need to replace it field before form edit shown
	 */
	var ckinstance = eval('CKEDITOR.instances.' + name);
	if (ckinstance) {
		try {
			ckinstance.destroy(true);
		} catch (e) {
			CKEDITOR.remove(ckinstance);
		}
		
		ckinstance = null;
	}
	
	ckfinder_base_path = __G_STATIC__ + '/js/lib/ckfinder2/';
	//ckfinder_base_path = __G_STATIC__ + 'js/lib/ckfinder2.4/';
	ckfinder_connector_path = __G_GROUP__ + '/public/ckfinder';
	
	ckoptions = $.extend(true, {}, 
	{
		height : 250,
		/*
		toolbar : [ [ 'Bold', 'Italic', 'Underline', 'Strike', '-',
				'Subscript', 'Superscript' ] ],
		removePlugins : 'maximize,resize,scayt',*/
		
		//toolbar : 'Basic',
		//toolbar : 'Full',
		
		// CK3
		/*
		toolbar: [
		          ['Styles','Format','Font','FontSize'],
		          ['NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
		          '/',
		          ['Bold','Italic','Underline','StrikeThrough','-','Undo','Redo','-','Cut','Copy','Paste','-','Outdent','Indent'],
		          ['Image','Table','-','Link','Smiley','TextColor','BGColor','Source']
		       ],
		*/
		
		// CK4
		toolbar :
			[
			
			['Source','-','Save','NewPage','Preview','-','Templates'],
			['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
			['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
			//['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
			'/',
			['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
			['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
			['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
			['Link','Unlink','Anchor'],
			['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
			'/',
			['Styles','Format','Font','FontSize'],
			['TextColor','BGColor']
			
			],
		
        //uiColor : '#9AB8F3',
		       
		toolbarCanCollapse : false,
		language : 'zh-cn',
		 
		// CKFinder
		//filebrowserBrowseUrl : ckfinder_base_path + 'ckfinder.html',
		//filebrowserImageBrowseUrl : ckfinder_base_path + 'ckfinder.html?type=Images',
		//filebrowserFlashBrowseUrl : ckfinder_base_path + 'ckfinder.html?type=Flash',
		filebrowserUploadUrl : ckfinder_connector_path + '?command=QuickUpload&type=Files',
		filebrowserImageUploadUrl : ckfinder_connector_path + '?command=QuickUpload&type=Images',
		filebrowserFlashUploadUrl : ckfinder_connector_path + '?command=QuickUpload&type=Flash',
		
	}, options || {});
	
	ckinstance = CKEDITOR.replace(name, ckoptions);
	
	// enable CKFinder
	ckfoptions = {
			basePath: ckfinder_base_path, 
			connectorPath : ckfinder_connector_path,
	};
	CKFinder.setupCKEditor( ckinstance, ckfoptions ) ;
	
	//var ckinstance = eval('CKEDITOR.instances.' + name);
	
	if(typeof(value)!='undefined'){
		ckinstance.setData(value);
	}
}

function jgrid_ckeditor_check_value(value, colname){
	//alert('ckeditor check value');
	
	//alert(value);
	//console.log(colname);
	
	/*
	colval = eval('CKEDITOR.instances.' + colname).getData();

	if(!colval.length){
		return [false,"此字段必需"];
	}else{
		return [true,""];
	}*/
	
	return [true,""];
}
				

function jgrid_grid_selector(formid) {
	form_selector = formid.selector;
	grid_id = form_selector.replace(/^.*#FrmGrid_(.*)$/ig, "$1");

	return grid_id;
}
				

function jgrid_edit_load_row(grid, rowid) {
	if (typeof (rowid) != 'object' && typeof (rowid) != 'array') {
		rowids = [ rowid ];
	} else {
		rowids = rowid;
	}
	$.ajax({
		url : grid_settings.grid_url,
		type : "POST",
		data : {
			oper : 'get',
			'id' : rowids.join(',')
		},
		dataType : "json",
		async : false,
		success : function(response, textStatus, jqXHR) {
			if (response.data) {
				for (rid in response.data) {
					rowdata = response.data[rid];
					rowdata['reloadtag'] = 0;
					// console.log(rowdata);
					grid.jqGrid('setRowData', rid, rowdata);
				}
			}

		},
	});
}
				

function jgrid_edit_replace_form(grid, form, rowid) {
	var rowdata = grid.jqGrid('getRowData', rowid);
	// console.log(rowdata);
	for (k in rowdata) {
		if ((obj = form.find('#' + k)) && obj.length) {
			obj.val(rowdata[k]);
		}
	}
}
				
function jgrid_element_testcontent(value, options) {
	var el = document.createElement("textarea");
	el.value = value;
	el.id = 'testcontent';
	el.name = 'testcontent';
	el.className = 'ckeditor';
	return el;
}

function jgrid_element_value(elem, operation, value) {
	if (operation === 'get') {
		return $(elem).val();
	} else if (operation === 'set') {
		$('input', elem).val(value);
	}
}

function jgrid_search_form(grid_selector, form_selector, field_selector, gridOp) {
	if(typeof(grid_selector)=='undefined'){
		grid_selector = '#grid-table';
	}
	
	if(typeof(form_selector)=='undefined'){
		form_selector = '#grid-search-form';
	}
	
	if(typeof(field_selector)=='undefined'){
		field_selector = '.grid-search-field';
	}
	
	if(typeof(gridOp)=='undefined'){
		gridOp = 'OR';
	}
	
	var rules = "";
	$(field_selector, form_selector).each(
			function(i) {// (1)从multipleSearchDialog对话框中找到各个查询条件行
				var searchField = $(".searchString", this).length?$(".searchField", this).val():$(".searchField", this).attr('name');// (2)获得查询字段
				var searchOper = $(".searchOper", this).length?$(".searchOper", this).val():'cn';// (3)获得查询方式
				var searchString = $(".searchString", this).length?$(".searchString", this).val():$(".searchField", this).val();// (4)获得查询值
				
				if (searchField && searchOper && searchString) {// (5)如果三者皆有值且长度大于0，则将查询条件加入rules字符串
					var fields = searchField.split(',');
					for ( var j in fields) {
						f = fields[j];
						f = jQuery.trim(f);
						if (f && f.length) {
							rules += ',{"field":"' + f + '","op":"'
									+ searchOper + '","data":"' + searchString
									+ '"}';
						}
					}
				}
			});
	if (rules) {// (6)如果rules不为空，且长度大于0，则去掉开头的逗号
		rules = rules.substring(1);
	}
	
	// (7)串联好filtersStr字符串
	var filtersStr = '{"groupOp":"' + gridOp + '","rules":[' + rules + ']}';
	var postData = $(grid_selector).jqGrid("getGridParam", "postData");
	// (8)将filters参数串加入postData选项
	$.extend(postData, {
		filters : filtersStr
	});
	$(grid_selector).jqGrid("setGridParam", {
		search : true
	// (9)将jqGrid的search选项设为true
	}).trigger("reloadGrid", [ {
		page : 1
	} ]);//(10)重新载入Grid表格
}

function jgrid_loadComplete_callback(data){
	var table = this;
	setTimeout(function(){
		styleCheckbox(table);
		
		updateActionIcons(table);
		updatePagerIcons(table);
		enableTooltips(table);
	}, 0);
	
	
	//console.log(data);
	
	// check if empty records
	if(data.records<=0){
		jgrid_show_tip("没有搜索到任何记录", false, 0);
	}
}

//enable datepicker
function jgrid_pickDate_callback( cellvalue, options, cell ) {

	options = $.extend(true, {}, datepicker_default_options, {});
	
	setTimeout(function(){
		$(cell) .find('input[type=text]')
				.datepicker(options); 
	}, 0);
}


function jgrid_show_tip(tip, success, time) {

	if (typeof (success) == 'undefined') {
		success = true;
	}
	
	if (typeof (time) == 'undefined') {
		time = 2;
	}
	
	$('#gridTipIndicator div.alert').removeClass('alert-block alert-success').addClass('alert-warning');
	$('#gridTipIndicator div.alert i.icon-ok').hide();
	
	if(!success){
		$('#gridTipIndicator div.alert').removeClass('alert-block alert-success').addClass('alert-warning');
		$('#gridTipIndicator div.alert i.icon-ok').hide();
	}else{
		$('#gridTipIndicator div.alert').removeClass('alert-warning').addClass('alert-block alert-success');
		$('#gridTipIndicator div.alert i.icon-ok').show();
	}

	$('#gridTipIndicator .alert-text').html(tip);
	
	if (time>0) {
		$('#gridTipIndicator').css({'z-index':'2000', 'position':'fixed'});
		
		setTimeout(function() {
			$('#gridTipIndicator').fadeOut();
		}, (time * 1000));
	}else{
		$('#gridTipIndicator').css({'z-index':'auto', 'position':'relative'});
	}
	
	$('#gridTipIndicator').show();
}

function jgrid_get_default_options(){
	var default_options = {
			//direction: "rtl",
			
			datatype: "jsonstring",
			datastr: grid_init_data,
			
			//pgtext : " {0} 共 " + grid_init_data.total + " 页",
            //recordtext:  "{0} - " + grid_init_data.total + " 共 " + grid_init_data.records + " 条",
			
			//url:'__URL__/ajax_jqgrid?oper=list',
			//datatype: "json",
				mtype: "GET",
			
			loadonce:false,
			
			forceFit: false,
			shrinkToFit:true,

			height: "auto",
			//height: 396,
			autowidth : jgrid_mobile()===true?false:true,
			
			viewrecords : true,
			//rowNum:-1,
			rowNum: typeof(grid_init_data.rownum)!='undefined' && grid_init_data.rownum? grid_init_data.rownum : '-1',
			//rowTotal: 200,
			//rowList:[10,20,30],
			pager : grid_settings.pager_selector,
			altRows: true,
			//toppager: true,
			
			rownumbers: true,

			multiselect: true,
			//multikey: "ctrlKey",
	        multiboxonly: true,
			
			sortorder: 'desc', // desc or asc, default asc
			
			loadComplete : jgrid_loadComplete_callback,	
	};
	
	return default_options;
}

function jgrid_mobile(){
	if(typeof(jQuery.browser)==='undefined' || typeof(jQuery.browser.mobile)==='undefined'){
		/**
		 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
		 *
		 * jQuery.browser.mobile will be true if the browser is a mobile device
		 *
		 **/
		(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
	}
	
	return jQuery.browser.mobile;
}

function jgrid_width(w){
	if(jgrid_mobile()===true){
		return 'auto';
	}else{
		return w;
	}
}

function jgrid_height(h){
	if(jgrid_mobile()===true){
		return 'auto';
	}else{
		return h;
	}
}

function jgrid_get_default_form_options(){
	var default_form_options = {
			'add': {
					//new record form
					height:jgrid_height(450), 
					width:jgrid_width(650),
					
					closeAfterAdd: true,
					recreateForm: true,
					reloadAfterSubmit: false,
					
					viewPagerButtons: false,
					
					beforeShowForm : jgrid_edit_beforeShowForm_callback,
					//beforeSubmit: jgrid_edit_beforeSubmit_callback,
					afterShowForm: jgrid_edit_afterShowForm_callback,
					beforeCheckValues: jgrid_edit_beforeCheckValues_callback,
					afterSubmit :  jgrid_edit_afterSubmit_callback,
				},
				
			'edit': {
					//edit record form
					height:jgrid_height(450), 
					width:jgrid_width(650),

					closeAfterEdit: true,
					recreateForm: true,
					reloadAfterSubmit: false,
					
					addedrow: 'first',
					//checkOnSubmit: true,
					//checkOnUpdate: false,
					
					beforeShowForm : jgrid_edit_beforeShowForm_callback,
					beforeSubmit: jgrid_edit_beforeSubmit_callback,
					beforeInitData: jgrid_edit_beforeInitData_callback,
					afterclickPgButtons: jgrid_edit_afterclickPgButtons_callback,
					afterShowForm: jgrid_edit_afterShowForm_callback,
					afterSubmit :  jgrid_edit_afterSubmit_callback,
					beforeCheckValues: jgrid_edit_beforeCheckValues_callback,
				},
				
				'delete': 
				{
					//delete record form
					recreateForm: true,
					reloadAfterSubmit: false,
					beforeShowForm : jgrid_delete_beforeShowForm_callback,
					afterSubmit : jgrid_afterSubmit_callback,
					
				},
				
				'search' :
				{
					//search form
					recreateForm: true,
					closeAfterSearch: true,
					showOnLoad: false,
					afterShowSearch: function(e){
						var form = $(e[0]);
						form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
						style_search_form(form);
					},
					afterRedraw: function(){
						style_search_filters($(this));
					},
					multipleSearch: false,
					
					//multipleGroup:true,
					//showQuery: true
					
					onSearch: function(f){
						//console.log(f);
					},
					
				},
				
				'view' :
				{
					//view record form
					recreateForm: true,
					beforeShowForm: function(e){
						var form = $(e[0]);
						form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
					}
				},
		
		
		};
	
	return default_form_options;
}

function jgrid_reset_pager(g_settings, g_data){
	grid_settings = g_settings || grid_settings;
	grid_init_data = g_data || grid_init_data;
	
	$($(grid_settings.pager_selector + ' td#grid-pager_center td input.ui-pg-input').siblings()[0]).html(grid_init_data.total);
	$(grid_settings.pager_selector + ' td#grid-pager_right div.ui-paging-info').html("1 - " + grid_init_data.rownum + " 共 " + grid_init_data.records + " 条");
	
	// use remote data from server in more pages
	jQuery(grid_settings.grid_selector).jqGrid('setGridParam', {
	  	datatype: 'json', 
	  	url: grid_settings.grid_url, 
	  	editurl: grid_settings.grid_url, 
	  	//pgtext: "{0} 共 {1} 页", 
	  	//recordtext:  "{0} - {1} 共 {2} 条",
	  });
}


// 搜索表单绑定回车提交
function jgrid_search_form_bind(g_settings) {
	grid_settings = g_settings || grid_settings;

	$(grid_settings.search_form_selector + ' input[type=text]').each(
			function() {
				$(this).keydown(function(event) {
					if (event.which == 13) {
						event.preventDefault();
						jgrid_search_form_submit();
					}
				});
			});
}

//提交自定义搜索表单
function jgrid_search_form_submit(g_settings, g_data){
	grid_settings = g_settings || grid_settings;
	grid_init_data = g_data || grid_init_data;
	
	jgrid_search_form(grid_settings.grid_selector, grid_settings.search_form_selector, grid_settings.search_field_selector, grid_settings.search_group_op);
}

// 重置自定义搜索表单
function jgrid_search_form_reset(){
	$(grid_settings.search_form_selector + ' input[type=text]').each(function(){
		$(this).val('');
	});
	
	$(grid_settings.search_form_selector +" select option").filter(function() {
		return $(this).val() == ''; 
	}).prop('selected', true);
	
	grid_set_caption(false);
	
	jgrid_search_form_submit();
}

function grid_set_caption(caption, grid){
	grid_id = grid || grid_settings.grid_selector;

	var grid = $(grid_id);
	grid.jqGrid('setCaption', caption);
	
	if(!caption || !caption.length){
		$(grid[0].grid.cDiv).hide();
	}else{
		$(grid[0].grid.cDiv).show();
	}
}

function jgrid_modal_align_center(o){
	if(!o.top && !o.left) {
		if (window.innerWidth !== undefined) {
			o.left = window.innerWidth;
			o.top = window.innerHeight;
		} else if (document.documentElement !== undefined && document.documentElement.clientWidth !== undefined && document.documentElement.clientWidth !== 0) {
			o.left = document.documentElement.clientWidth;
			o.top = document.documentElement.clientHeight;
		} else {
			o.left=1024;
			o.top=768;
		}
		o.left = o.left/2 - parseInt(o.width,10)/2;
		o.top = o.top/2-25;
	}
	
	return o;
}

function jgrid_create_alert_modal(grid_id, modal_name, options){
	o = $.extend(true, {
		width : 250,
		height : 'auto',
		top: null,
		left: null,
		
		zIndex : null,
		caption: '消息提示',
		text: '',
	}, options || {});
	
	var alertIDs = {themodal: modal_name + 'mod_' + grid_id, modalhead: modal_name + 'hd_' + grid_id,modalcontent: modal_name + 'cnt_' + grid_id};
	
	var frmtxt_id = modal_name + 'txt_' + grid_id;
	
	if ($("#"+alertIDs.themodal)[0] === undefined) {
        o = jgrid_modal_align_center(o);
		
		$.jgrid.createModal(alertIDs,
			"<div id='" + frmtxt_id + "'>"+o.text+"</div><span tabindex='0'><span tabindex='-1' id='" + modal_name + "jqg_alrt'></span></span>",
			{ 
				gbox:"#gbox_"+grid_id,
				jqModal:true,
				drag:true,
				resize:true,
				caption:o.caption,
				top:o.top,
				left:o.left,
				width:o.width,
				height: o.height,
				closeOnEscape:o.closeOnEscape, 
				zIndex: o.zIndex
			},
			"#gview_"+grid_id,
			$("#gbox_"+grid_id)[0],
			true
		);
	}else{
		$("#" + frmtxt_id).html(o.text);
	}
}

function jgrid_view_alert_modal(grid_id, modal_name, alert_caption, alert_text){
	if(typeof(alert_caption)!='undefined' && typeof(alert_text)!='undefined'){
		options = {caption:alert_caption, text:alert_text};
	}else {
		if(typeof(modal_name)=='string'){
			options = {text:modal_name};
		}else{
			options = modal_name;
		}
		modal_name = 'cus_alert';
	}
	
	grid_id = jgrid_selector_name(grid_id);   
	jgrid_create_alert_modal(grid_id, modal_name, options);
	jQuery.jgrid.viewModal("#" + modal_name + "mod_" + grid_id,{gbox:"#gbox_"+grid_id,jqm:true});
	$("#" + modal_name + "jqg_alrt").focus();
}

function jgrid_selector_name(grid_id){
	if(grid_id.indexOf('#')==0){
		grid_id = grid_id.substr(1, grid_id.length-1);
	}
	
	return grid_id;
}

function jgrid_create_custom_modal(grid_id, modal_name, data, modal_options){
	p = $.extend(true, {}, {
		top : 0,
		left: 0,
		width: 0,
		datawidth: 'auto',
		height: 'auto',
		dataheight: 'auto',
		modal: false,
		overlay: 30,
		drag: true,
		resize: true,
		jqModal: true,
		closeOnEscape : false,
		labelswidth: '30%',
		closeicon: [],
		onClose: null,
		beforeShowForm : null,
		beforeInitData : null,
		viewPagerButtons : false,
		recreateForm : false
	}, modal_options || {});

	gID = grid_id;

	frmgr = modal_name + "Grid_" + gID, frmtb = modal_name + "Tbl_" + gID,
			frmgr_id = modal_name + "Grid_" + gID, frmtb_id = modal_name
					+ "Tbl_" + gID, frmctn_id = modal_name
					+ "Ctn_" + gID;
	
	IDs = {
				themodal : modal_name + 'mod' + gID,
				modalhead : modal_name + 'hd' + gID,
				modalcontent : modal_name + 'cnt' + gID,
				scrollelm : frmgr
			};
	
	function appendData(frm, ctn, data){
		if(typeof(data)=='string'){
			$(ctn).append(data);
		}else{
			var tbl = $("<table id='"
					+ frmtb_id
					+ "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");

			$(ctn).append(tbl);
			var dc = '<tr rowpos="1" style="display:none" class="FormData"><td class="CaptionTD form-view-label ui-widget-content" width="' + p.labelswidth + '"><b>标记</b></td><td class="DataTD form-view-data ui-helper-reset ui-widget-content">&nbsp;<span>0</span></td></tr>';
			for(i in data){
				data_caption = i;
				data_value = data[i];
				dc += '<tr rowpos="2" class="FormData"><td class="CaptionTD form-view-label ui-widget-content" width="' + p.labelswidth + '"><b>' + data_caption + '</b></td><td class="DataTD form-view-data ui-helper-reset ui-widget-content">' + data_value + '</td></tr>';
			}
			
			$(tbl).append($(dc));
		}
	}

	if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] === undefined ) {
		jgrid_modal_align_center(p);

		showFrm = true, maxCols = 1, maxRows = 0;

		var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight + "px";
		var dw = isNaN(p.datawidth) ? p.datawidth
				: p.datawidth + "px", frm = $("<form name='FormPost' id='"
				+ frmgr_id + "' class='FormGrid' style='width:" + dw
				+ ";overflow:auto;position:relative;height:" + dh
				+ ";'></form>");
		var ctn = $("<div id='" + frmctn_id + "'></div>");
		$(frm).append(ctn);
		
		// createData(rowid, $t, tbl, maxCols);
		appendData(frm, ctn, data);
		
		var rtlb = p.direction == "rtl" ? true : false, bp = rtlb ? "nData"
				: "pData", bn = rtlb ? "pData" : "nData",

		// buttons at footer
		bP = "<a href='javascript:void(0)' id='"
				+ bp
				+ "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>", bN = "<a href='javascript:void(0)' id='"
				+ bn
				+ "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>", bC = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"
				+ p.bClose + "</a>";

		p.gbox = "#gbox_" + $.jgrid.jqID(gID);
		var bt = $("<div></div>")
				.append(frm)
				.append(
						"<table border='0' class='EditTable' id='"
								+ frmtb
								+ "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"
								+ p.labelswidth + "'>"
								+ (rtlb ? bN + bP : bP + bN)
								+ "</td><td class='EditButton'>" + bC
								+ "</td></tr></tbody></table>");
	
		$.jgrid.createModal(IDs, bt, p, "#gview_" + grid_id, $("#gbox_"+ grid_id)[0], true);
		
		if (rtlb) {
			$("#pData, #nData", "#" + frmtb + "_2").css("float", "right");
			$(".EditButton", "#" + frmtb + "_2").css("text-align", "left");
		}
	}else{
		$("#" + frmctn_id).empty();
		appendData($('#'+frmgr_id), $("#" + frmctn_id), data);
	}
}

function jgrid_view_custom_modal(grid_id, modal_name, data, modal_options){
	grid_id = jgrid_selector_name(grid_id); 
	jgrid_create_custom_modal(grid_id, modal_name, data, modal_options);
	jQuery.jgrid.viewModal("#" + modal_name + "mod" + grid_id,{gbox:"#gbox_"+grid_id,jqm:true});
	//$("#" + modal_name + "jqg_alrt").focus();
}

function jgrid_view_modal(grid_id, modal_name, p){
	p = $.extend(true, {
		id : jgrid_selector_name(grid_id),
		top : 0,
		left: 0,
		width: 0,
		datawidth: 'auto',
		height: 'auto',
		dataheight: 'auto',
		modal: false,
		overlay: 30,
		drag: true,
		resize: true,
		jqModal: true,
		closeOnEscape : false,
		labelswidth: '30%',
		closeicon: [],
		navkeys: [false,38,40],
		onClose: null,
		beforeShowForm : null,
		beforeInitData : null,
		viewPagerButtons : false,
		recreateForm : false
	}, $.jgrid.view, p || {});
	
	var $t = {p:p};
	var rp_ge = {};
	rp_ge[$t.p.id] = p;
	
	jgrid_modal_align_center(p);
	
	//return this.each(function(){
		
		var gID = $t.p.id,
		frmgr = modal_name + "ViewGrid_"+$.jgrid.jqID( gID  ), frmtb = modal_name + "ViewTbl_" + $.jgrid.jqID( gID ),
		frmgr_id = modal_name + "ViewGrid_"+gID, frmtb_id = modal_name + "ViewTbl_"+gID,
		IDs = {themodal:modal_name + 'viewmod'+gID,modalhead: modal_name + 'viewhd'+gID,modalcontent: modal_name + 'viewcnt'+gID, scrollelm : frmgr},
		onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
		showFrm = true,
		maxCols = 1, maxRows=0;
		if(p.recreateForm===true && $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined) {
			$("#"+$.jgrid.jqID(IDs.themodal)).remove();
		}
		
		function focusaref(){ //Sfari 3 issues
			if(rp_ge[$t.p.id].closeOnEscape===true || rp_ge[$t.p.id].navkeys[0]===true) {
				setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(IDs.modalhead)).focus();},0);
			}
		}
		function createData(rowid,obj,tb,maxcols){
			var nm, hc,trdata, cnt=0,tmp, dc, retpos=[], ind=false, i,
			tdtmpl = "<td class='CaptionTD form-view-label ui-widget-content' width='"+p.labelswidth+"'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", tmpl="",
			tdtmpl2 = "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>",
			fmtnum = ['integer','number','currency'],max1 =0, max2=0 ,maxw,setme, viewfld;
			for (i=1;i<=maxcols;i++) {
				tmpl += i == 1 ? tdtmpl : tdtmpl2;
			}
			// find max number align rigth with property formatter
			$(obj.p.colModel).each( function() {
				if(this.editrules && this.editrules.edithidden === true) {
					hc = false;
				} else {
					hc = this.hidden === true ? true : false;
				}
				if(!hc && this.align==='right') {
					if(this.formatter && $.inArray(this.formatter,fmtnum) !== -1 ) {
						max1 = Math.max(max1,parseInt(this.width,10));
					} else {
						max2 = Math.max(max2,parseInt(this.width,10));
					}
				}
			});
			maxw  = max1 !==0 ? max1 : max2 !==0 ? max2 : 0;
			ind = $(obj).jqGrid("getInd",rowid);
			$(obj.p.colModel).each( function(i) {
				nm = this.name;
				setme = false;
				// hidden fields are included in the form
				if(this.editrules && this.editrules.edithidden === true) {
					hc = false;
				} else {
					hc = this.hidden === true ? true : false;
				}
				dc = hc ? "style='display:none'" : "";
				viewfld = (typeof this.viewable !== 'boolean') ? true : this.viewable;
				if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && viewfld) {
					if(ind === false) {
						tmp = "";
					} else {
						if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
							tmp = $("td:eq("+i+")",obj.rows[ind]).text();
						} else {
							tmp = $("td:eq("+i+")",obj.rows[ind]).html();
						}
					}
					setme = this.align === 'right' && maxw !==0 ? true : false;
					var frmopt = $.extend({},{rowabove:false,rowcontent:''}, this.formoptions || {}),
					rp = parseInt(frmopt.rowpos,10) || cnt+1,
					cp = parseInt((parseInt(frmopt.colpos,10) || 1)*2,10);
					if(frmopt.rowabove) {
						var newdata = $("<tr><td class='contentinfo' colspan='"+(maxcols*2)+"'>"+frmopt.rowcontent+"</td></tr>");
						$(tb).append(newdata);
						newdata[0].rp = rp;
					}
					trdata = $(tb).find("tr[rowpos="+rp+"]");
					if ( trdata.length===0 ) {
						trdata = $("<tr "+dc+" rowpos='"+rp+"'></tr>").addClass("FormData").attr("id","trv_"+nm);
						$(trdata).append(tmpl);
						$(tb).append(trdata);
						trdata[0].rp = rp;
					}
					$("td:eq("+(cp-2)+")",trdata[0]).html('<b>'+ (frmopt.label === undefined ? obj.p.colNames[i]: frmopt.label)+'</b>');
					$("td:eq("+(cp-1)+")",trdata[0]).append("<span>"+tmp+"</span>").attr("id","v_"+nm);
					if(setme){
						$("td:eq("+(cp-1)+") span",trdata[0]).css({'text-align':'right',width:maxw+"px"});
					}
					retpos[cnt] = i;
					cnt++;
				}
			});
			if( cnt > 0) {
				var idrow = $("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+ (maxcols*2-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='"+rowid+"'/></td></tr>");
				idrow[0].rp = cnt+99;
				$(tb).append(idrow);
			}
			return retpos;
		}
		function fillData(rowid,obj){
			var nm, hc,cnt=0,tmp, opt,trv;
			trv = $(obj).jqGrid("getInd",rowid,true);
			if(!trv) {return;}
			$('td',trv).each( function(i) {
				nm = obj.p.colModel[i].name;
				// hidden fields are included in the form
				if(obj.p.colModel[i].editrules && obj.p.colModel[i].editrules.edithidden === true) {
					hc = false;
				} else {
					hc = obj.p.colModel[i].hidden === true ? true : false;
				}
				if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn') {
					if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
						tmp = $(this).text();
					} else {
						tmp = $(this).html();
					}
					opt = $.extend({},obj.p.colModel[i].editoptions || {});
					nm = $.jgrid.jqID("v_"+nm);
					$("#"+nm+" span","#"+frmtb).html(tmp);
					if (hc) {$("#"+nm,"#"+frmtb).parents("tr:first").hide();}
					cnt++;
				}
			});
			if(cnt>0) {$("#id_g","#"+frmtb).val(rowid);}
		}
		function updateNav(cr,posarr){
			var totr = posarr[1].length-1;
			if (cr===0) {
				$("#pData","#"+frmtb+"_2").addClass('ui-state-disabled');
			} else if( posarr[1][cr-1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr-1])).hasClass('ui-state-disabled')) {
				$("#pData",frmtb+"_2").addClass('ui-state-disabled');
			} else {
				$("#pData","#"+frmtb+"_2").removeClass('ui-state-disabled');
			}
			if (cr==totr) {
				$("#nData","#"+frmtb+"_2").addClass('ui-state-disabled');
			} else if( posarr[1][cr+1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr+1])).hasClass('ui-state-disabled')) {
				$("#nData",frmtb+"_2").addClass('ui-state-disabled');
			} else {
				$("#nData","#"+frmtb+"_2").removeClass('ui-state-disabled');
			}
		}
		function getCurrPos() {
			var rowsInGrid = $($t).jqGrid("getDataIDs"),
			selrow = $("#id_g","#"+frmtb).val(),
			pos = $.inArray(selrow,rowsInGrid);
			return [pos,rowsInGrid];
		}

		if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
			if(onBeforeInit) {
				showFrm = onBeforeInit.call($t,$("#"+frmgr));
				if(showFrm === undefined) {
					showFrm = true;
				}
			}
			if(showFrm === false) {return;}
			$(".ui-jqdialog-title","#"+$.jgrid.jqID(IDs.modalhead)).html(p.caption);
			$("#FormError","#"+frmtb).hide();
			//fillData(rowid,$t);
			if($.isFunction(rp_ge[$t.p.id].beforeShowForm)) {rp_ge[$t.p.id].beforeShowForm.call($t,$("#"+frmgr));}
			$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, jqM: false, overlay: p.overlay, modal:p.modal});
			focusaref();
		} else {
			var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px",
			dw = isNaN(p.datawidth) ? p.datawidth : p.datawidth+"px",
			frm = $("<form name='FormPost' id='"+frmgr_id+"' class='FormGrid' style='width:"+dw+";overflow:auto;position:relative;height:"+dh+";'></form>"),
			tbl =$("<table id='"+frmtb_id+"' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
			if(onBeforeInit) {
				showFrm = onBeforeInit.call($t,$("#"+frmgr));
				if(showFrm === undefined) {
					showFrm = true;
				}
			}
			if(showFrm === false) {return;}
			/*
			$($t.p.colModel).each( function() {
				var fmto = this.formoptions;
				maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
				maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
			});*/
			// set the id.
			$(frm).append(tbl);
			//createData(rowid, $t, tbl, maxCols);
			var rtlb = $t.p.direction == "rtl" ? true :false,
			bp = rtlb ? "nData" : "pData",
			bn = rtlb ? "pData" : "nData",

			// buttons at footer
			bP = "<a href='javascript:void(0)' id='"+bp+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
			bN = "<a href='javascript:void(0)' id='"+bn+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
			bC  ="<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"+p.bClose+"</a>";
			/*
			if(maxRows >  0) {
				var sd=[];
				$.each($(tbl)[0].rows,function(i,r){
					sd[i] = r;
				});
				sd.sort(function(a,b){
					if(a.rp > b.rp) {return 1;}
					if(a.rp < b.rp) {return -1;}
					return 0;
				});
				$.each(sd, function(index, row) {
					$('tbody',tbl).append(row);
				});
			}*/

			p.gbox = "#gbox_"+$.jgrid.jqID(gID);
			var bt = $("<div></div>").append(frm).append("<table border='0' class='EditTable' id='"+frmtb+"_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"+p.labelswidth+"'>"+(rtlb ? bN+bP : bP+bN)+"</td><td class='EditButton'>"+bC+"</td></tr></tbody></table>");
			$.jgrid.createModal(IDs,bt,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gview_"+$.jgrid.jqID($t.p.id))[0]);
			
			if(rtlb) {
				$("#pData, #nData","#"+frmtb+"_2").css("float","right");
				$(".EditButton","#"+frmtb+"_2").css("text-align","left");
			}
			//if(!p.viewPagerButtons) {$("#pData, #nData","#"+frmtb+"_2").hide();}
			
			bt = null;
			/*
			$("#"+IDs.themodal).keydown( function( e ) {
				if(e.which === 27) {
					if(rp_ge[$t.p.id].closeOnEscape) {$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:p.gbox,jqm:p.jqModal, onClose: p.onClose});}
					return false;
				}
				if(p.navkeys[0]===true) {
					if(e.which === p.navkeys[1]){ //up
						$("#pData", "#"+frmtb+"_2").trigger("click");
						return false;
					}
					if(e.which === p.navkeys[2]){ //down
						$("#nData", "#"+frmtb+"_2").trigger("click");
						return false;
					}
				}
			});*/
			p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
			if(p.closeicon[0]===true) {
				$("#cData","#"+frmtb+"_2").addClass(p.closeicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
				.append("<span class='ui-icon "+p.closeicon[2]+"'></span>");
			}
			if($.isFunction(p.beforeShowForm)) {p.beforeShowForm.call($t,$("#"+frmgr));}
			$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,overlay: p.overlay, modal:p.modal});
			$(".fm-button:not(.ui-state-disabled)","#"+frmtb+"_2").hover(
				function(){$(this).addClass('ui-state-hover');},
				function(){$(this).removeClass('ui-state-hover');}
			);
			focusaref();
			
			
			$("#cData", "#"+frmtb+"_2").click(function(){
				$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: p.onClose});
				return false;
			});
			
			/*
			$("#nData", "#"+frmtb+"_2").click(function(){
				$("#FormError","#"+frmtb).hide();
				var npos = getCurrPos();
				npos[0] = parseInt(npos[0],10);
				if(npos[0] != -1 && npos[1][npos[0]+1]) {
					if($.isFunction(p.onclickPgButtons)) {
						p.onclickPgButtons.call($t,'next',$("#"+frmgr),npos[1][npos[0]]);
					}
					fillData(npos[1][npos[0]+1],$t);
					$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
					if($.isFunction(p.afterclickPgButtons)) {
						p.afterclickPgButtons.call($t,'next',$("#"+frmgr),npos[1][npos[0]+1]);
					}
					updateNav(npos[0]+1,npos);
				}
				focusaref();
				return false;
			});
			$("#pData", "#"+frmtb+"_2").click(function(){
				$("#FormError","#"+frmtb).hide();
				var ppos = getCurrPos();
				if(ppos[0] != -1 && ppos[1][ppos[0]-1]) {
					if($.isFunction(p.onclickPgButtons)) {
						p.onclickPgButtons.call($t,'prev',$("#"+frmgr),ppos[1][ppos[0]]);
					}
					fillData(ppos[1][ppos[0]-1],$t);
					$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
					if($.isFunction(p.afterclickPgButtons)) {
						p.afterclickPgButtons.call($t,'prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
					}
					updateNav(ppos[0]-1,ppos);
				}
				focusaref();
				return false;
			});*/
		}
		//var posInit =getCurrPos();
		//updateNav(posInit[0],posInit);
		
	//});
		
		$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:true});
}

function jgrid_gen_action_html(opts){
	options = $.extend(true, {}, {
		url: '',
		target: 'self',
		method: 'get',
		confirm: false,
		position: 'after',
		onclick: '',
		title: '',
		icon: '',
	}, opts || {});
	

	if (!options.onclick || options.onclick.length <= 0) {
		options.onclick = "open_window(\"" + options.url + "\", \"\", \"get\", \""
				+ options.target + "\");";

		if (options.confirm && options.confirm.length) {
			options.onclick = "if(confirm(\"" + options.confirm + "\")) " + options.onclick;
		}
	}
	
	var add_html = "<div title='" + options.title + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-edit' onclick='" + options.onclick + "'; onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon " + options.icon + "'></span></div>";
	
	return add_html;
}

function jgrid_add_action(action_html, action_url, action_title, action_target, action_icon, action_confirm, action_pos)
{
	if(typeof(action_url)=='string'){
		opts = [{
				url: action_url,
				target: action_target,
				method: 'get',
				confirm: action_confirm,
				position: action_pos,
				onclick: '',
				title: '',
				icon: action_icon,	
		}];
	}else{
		if(typeof(action_url[0])=='undefined'){
			opts = [action_url];
		}else{
			opts = action_url;
		}	
	}
	
	//console.log(opts);
	
	action_obj = $(action_html);
	
	for ( var i in opts) {
		options = opts[i];
		//console.log(options);
		add_html = jgrid_gen_action_html(options);
		
		//console.log(add_html);
		
		if (options.position == 'before') {
			action_obj.before($(add_html));
		} else {
			action_obj.append($(add_html));
		}
	}
	
	return action_obj.html();
}

function jgrid_add_view_action(action_html, grid_selector, row_id, params, action_title, action_icon, action_pos)
{
	if(typeof(action_title)=='undefined'){
		var action_title = '查看所选记录';
	}
	if(typeof(action_icon)=='undefined'){
		var action_icon = 'icon-zoom-in';
	}
	
	if(typeof(action_pos)=='undefined'){
		action_pos = 'before';
	}
	
	if(typeof(params)=='undefined'){
		params = '';
	}
	
	var onclick = "$(\"" + grid_selector + "\").jqGrid(\"viewGridRow\", \"" + row_id + "\", {" + params + "})";
	
	var add_html = "<div title='" + action_title + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' onclick='" + onclick + "'; onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon " + action_icon + "'></span></div>";
	
	action_obj = $(action_html);
	
	if(action_pos=='before'){
		action_obj.html(add_html + action_obj.html());
	}else{
		action_obj.html(action_obj.html() + add_html );
	}
	
	return action_obj.html();
}

function jgrid_truncate_formatter_callback(cellvalue, options, rowObject){
	var return_v = '<div class="truncate_text">' + cellvalue + '</div>';
	return return_v;
}

function jgrid_truncate_unformat_callback(cellvalue, options, rowObject){
	td = $(rowObject)[0];
	//console.log($(td).attr('title'));
	//return $(td).attr('title');
	
	truncate = $(td).find('.truncate_text')[0];
	
	//console.log($(truncate).html());
	$(truncate).find('a[href=#showLessContent]').remove();
	
	value = $(truncate).html();
	value = value.replace(/^(.*)<br>&nbsp;$/g, '$1');
	
	//console.log(value);
	
	return value;
}

function jgrid_truncate(length){
	if(typeof(length)=='undefined'){
		length = 50;
	}
	
	$('.truncate_text').truncate({maxLength: length, less:'缩略', more:'更多',});
}

function jgrid_viplevel_formatter_callback(cellvalue, options, rowObject){
	// 会员卡级别：普通卡=1，银卡=2，金卡=3，白金卡=4
	var viplevels = new Array();
	viplevels[1] = '普通卡';
	viplevels[2] = '银卡';
	viplevels[3] = '金卡';
	viplevels[4] = '白金卡';
	
	return typeof(viplevels[cellvalue])!='undefined'?viplevels[cellvalue]:'';
}

function jgrid_bool_formatter_callback(cellvalue, options, rowObject){
	return cellvalue && parseInt(cellvalue)>0?'是':'否';
}

function jgrid_none_formatter_callback(cellvalue, options, rowObject){
	return '';
}

function jgrid_enable_formatter(v){
	var formatedata = {1:'启用',0:'停用'};
	return _jgrid_formatter(formatedata, v);
}

function jgrid_weixin_gender_formatter_callback(cellvalue, options, rowObject){
	// 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 
	var d = new Array();
	d[1] = '男';
	d[2] = '女';
	d[0] = '';
	
	return typeof(d[cellvalue])!='undefined'?d[cellvalue]:'';
}

function jgrid_color_formatter_callback(cellvalue, options, rowObject){
	return '<span style="background-color:' + cellvalue + '; display:inline-block; width:30px; height:14px;"></span>';
}

function _jgrid_formatter(formatedata, v){

	if(v===true){
		var values = new Array();
		for(var n in formatedata){
			values.push(n + ":" + formatedata[n]);	
		}
		return values.join(';');
	}else if(typeof(v)==='undefined'){
		return formatedata;
	}
	
	for(var n in formatedata){
		if(n==v){
			return formatedata[n];
		}
	}
	
	return '';
}

function _jgrid_form_selected_rows(grid_id, multi_select, confirm_msg, return_field) {
	if(typeof(multi_select)=='undefined'){
		multi_select = true;
	}
	
	if(typeof(confirm_msg)=='undefined'){
		confirm_msg = false;
	}
	
	if(typeof(return_field)=='undefined' || !return_field || return_field.length<=0){
		return_field = 'id';
	}
	
	grid_id = grid_id || grid_settings.grid_selector;
	grid_name = jgrid_selector_name(grid_id);
	
	var selRowIds = $(grid_id).jqGrid('getGridParam',
			'selarrrow');

	if (selRowIds.length <= 0) {
		jQuery.jgrid.viewModal("#alertmod_" + grid_name, {
			gbox : "#gbox_" + grid_name,
			jqm : true,
		});
		$("#jqg_alrt").focus();
		return false;
	}
	
	else if (!multi_select && selRowIds.length > 1) {
		jgrid_view_alert_modal(grid_name, 'cus_alert', "注意", "只能同时选择一条记录");
		return false;
	}else if(confirm_msg && confirm_msg.length && !confirm(confirm_msg)){
		return false;
	}

	var selectedReturns = new Array();
	
	if(return_field=='id'){
		for ( var i in selRowIds) {
			rowId = selRowIds[i];
			selectedReturns.push(selRowIds[i]);
		}
	}else if(return_field=='row'){
		for ( var i in selRowIds) {
			rowId = selRowIds[i];
			row = jQuery(grid_id).jqGrid ('getRowData', rowId);
			row['id'] = rowId;
			selectedReturns.push(row);
		}
	}else{
		for ( var i in selRowIds) {
			rowId = selRowIds[i];
			selectedReturns.push(jQuery(grid_id).jqGrid ('getCell', rowId, return_field));
		}
	}

	return selectedReturns;
}

function jgrid_form_selected_ids(grid_id, multi_select, confirm_msg, grid_id){
	return _jgrid_form_selected_rows(grid_id, multi_select, confirm_msg, 'id', grid_id);
}

function jgrid_form_selected_rows(grid_id, multi_select, confirm_msg){
	return _jgrid_form_selected_rows(grid_id, multi_select, confirm_msg, 'row');
}

function jgrid_form_selected_fields(grid_id, multi_select, confirm_msg, field){
	return _jgrid_form_selected_rows(grid_id, multi_select, confirm_msg, field);
}

function jgrid_form_button_open_url(grid_id, button_url, options) {
	var default_options = {
		method: 'get',
		target: 'self',
		field: 'id',
		param: 'id',
		multi: true,
		confirm: false,
		selected: false,
	};
	
	options = $.extend(true,{}, default_options, options);
	
	if(options.selected && options.selected.length>0){
		selected = options.selected;
	}else{
		selected = jgrid_form_selected_fields(grid_id, options.multi, options.confirm, options.field);
	}
	
	if(!selected){
		return false;
	}
	
	var params = {};
	params[options.param] = selected.join(',');

	open_window(button_url, params, options.method, options.target);
}

function jgrid_form_button_open_filter(grid_id, button_url, options){ 
	var default_options = {
			method: 'get',
			target: 'self',
			field: 'id',
			param: 'id',
			multi: true,
			confirm: false,
			selected: false,
		};
		
		options = $.extend(true,{}, default_options, options);
		
		if(options.selected && options.selected.length>0){
			selected = options.selected;
		}else{
			selected = jgrid_form_selected_fields(grid_id, options.multi, options.confirm, options.field);
		}
		
		if(!selected){
			return false;
		}
		
	  if(selected.length==1){
	 		open_window(button_url, {searchField: options.param,searchOper:'eq',searchString:selected.shift()}, 'get', 'self');
	  }else{
	 		// {"groupOp":"AND","rules":[{"field":"newsid","op":"eq","data":"3334"},{"field":"newsdate","op":"eq","data":"4445"}]}
	 	var filters = {groupOp: 'OR', rules: []};
	 	for(var i in selected){
		 	filters.rules.push({field:options.param,op:'eq',data:selected[i]});
	 	}
		open_window(button_url, {'filters': $.toJSON(filters)}, options.method, options.target);
	}
}


function jgrid_edittype_custom_element_callback(value, options) {
	var el = document.createElement(options.element);
	
	if(typeof(options['class'])!='undefined' && options['class'].length){
		el.className = options['class'];
	}
	
	if(typeof(options.style)!='undefined' && options.style.length){
		el.style = options.style;
	}

	el.innerHTML  = value;
	return el;
}

function jgrid_edittype_custom_value_callback(elem, operation, value) {
	if (operation === 'get') {
		return $(elem).html();
	} else if (operation === 'set') {
		$('input', elem).html(value);
	}
}

/**
 * formatter通用方法
 * @param v 值
 * @param name 字段名称
 * @param width 缩略图宽度
 * @param height 缩略图高度
 * @param show_thumb 是否显示原始缩略图，按width, height拼凑缩略图文件名
 * @returns
 */
function _jgrid_upload_formatter(v, name, width, height, show_thumb){
	if(!v){
		return '';
	}
	
	if(v.substr(0, 7).toLowerCase()!='http://' && v.substr(0, 8).toLowerCase()!='https://'){
		src = __G_UPLOAD__ + v;
	}else{
		src = v;
	}
	
	if(typeof(show_thumb)=='undefined'){
		show_thumb = true;
	}

	if(show_thumb){
		src += '_' + width + 'x' + height + src.substring(src.lastIndexOf('.'));
	}
	
	// 避免缓存
	src += '?' + Math.random();
	// onload="resize_image(this,' + width + ',' + height + ');"
	img  = '<img src="' + src + '" ' +  'onload="resize_image(this,' + width + ',' + height + ');"' + ' class="' + name + '_image" data="' + v + '" />';
	
	return img;
}

function _jgrid_upload_unformat( cellvalue, options, cell){
	if($(cell).length){
		return $('img', cell).attr('data');
	}else if($(cellvalue).length){
		return $(cellvalue).attr('data');
	}else{
		return '';
	}
}

function _jgrid_upload_custom_element(value, options, elemvalue) {
	
	el = $('<div />');
	if (value && value.length) {
		el.append($(value + '<br /><br />'));
	}
	
	//console.log(options);

	el.append($('<input type="file" class="FormElement" name="' + options.name
			+ '_file" id="' + options.name + '_file" onchange="if(this.value){'
			+ options.name + '_upload();}" />'));

	el.append($('<input type="hidden" name="' + options.name + '" id="'
			+ options.name + '" value="' + elemvalue + '" />'));

	return el;
}

function _jgrid_upload_custom_value(elem, operation, value, name) {
	//console.log(elem);
	//console.log($('#FrmGrid_grid-table input[name=vipcard]').fieldSerialize());
	
    if(operation === 'get') {
       return $('input[name=' + name + ']', elem).val();
    } else if(operation === 'set') {
       $('input[name=' + name + ']', elem).val(value);
    }
}

function _jgrid_upload(name, url) {

	ajax_loading_tip("图片上传中...");

	$.ajaxFileUpload({
		url : url,
		secureuri : false,
		fileElementId : name + '_file',
		async : false,
		dataType : 'json',
		data : {
			ajax : true,
			cardid : ''
		},
		success : function(response, textStatus, jqXHR) {
			if (!response.status) {
				alert(response.info);
				return false;
			}

			image = eval('response.data.' + name);
			
			$('div#' + name + ' input[name=' + name + ']').val(image);

			//console.log($('img.vipcard_image'));

			if ($('div#' + name + ' img.' + name + '_image').length > 0) {
				$('div#' + name + ' img.' + name + '_image').attr('src',
						__G_UPLOAD__ + image);
			} else {
				$('div#' + name + '').html(
						eval(name + '_formatter("' + image + '", false)')
								+ $('div#' + name + '').html());
			}

			jgrid_show_tip("上传成功!");
		}
	});

	ajax_reset_default_tip(true);
}
