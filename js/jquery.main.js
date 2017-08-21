$(document).ready(function(){
	_pageWrapper = $('#wrapper'); // global var
	jsonToHtml('inc/orgchart.json');
	setTimeout(function(){
		initPage();
	}, 3000);
	
});

// htmlToJson func
function htmlToJson(){
	_fader.show();
	function setElProp(el,data){// set prop to els
		if(typeof(el)=='object' && el.length && typeof(data)=='object' && !data.length){
			if(typeof(data.styleprop)=='undefined') data.styleprop = new Object();
			if(el.hasClass('activity_rounded')) data.styleprop.activity_rounded=true;
			if(el.hasClass('head')) data.styleprop.head=true;
			if(el.hasClass('lead')) data.styleprop.lead=true;
			if(el.hasClass('qa')) data.styleprop.qa=true;
			if(el.hasClass('student')) data.styleprop.student=true;
			if(el.hasClass('probation')) data.styleprop.probation=true;
			if(el.parents('ul').eq(0).hasClass('projects_products')) data.styleprop.projects_products=true;
		}
	}
	var _orgChartHolder = _pageWrapper.find('.org-chart');
	var orgchart = new Object();
	orgchart.company = new Object();
	var _companyTitle = _orgChartHolder.children().children('span').eq(0);
	orgchart.company.name=_companyTitle.text();
	setElProp(_companyTitle,orgchart.company);
	orgchart.projects = [];
	refreshColumnNumbers();
	_columns.each(function(){// orgchart.projects each
		var _col = $(this);
		var projectsObj= new Object;
		projectsObj.title = new Object;
		var _projTitle = _col.children('span').eq(0);
		projectsObj.title.name = _projTitle.eq(0).text();
		setElProp(_projTitle,projectsObj.title);
		projectsObj.subitems = new Object;
		if(_col.children('ul').not('.projects_products').length && _col.children('ul').not(':empty').length){
			projectsObj.subitems.teams = [];//TEAMS
		}
		if(_col.children('ul.projects_products').length && _col.children('ul.projects_products').not(':empty').length){
			projectsObj.subitems.projects_products = [];//PROJECTS_PRODUCTS
		}
		_col.children('ul').each(function(){
			var _currHold = $(this);
			if(_currHold.not(':empty')){
				if(!_currHold.hasClass('projects_products')){// projectsObj.subitems.teams each
					var teamsObj = new Object;
					teamsObj.team=[];
					var headObj = new Object();// head obj
					var _currHead = _currHold.children().children('span').eq(0);
					headObj.head = new Object();
					headObj.head.name=_currHead.text();
					setElProp(_currHead,headObj.head);
					teamsObj.team.push(headObj);//head push
					
					if(_currHold.children().children('ul').eq(0).children('li').children('span').length){
						var peopleObj = new Object();// people obj
						peopleObj.people=[];
						_currHold.children().children('ul').eq(0).children('li').children('span').each(function(){// people each
							var _currPeople = $(this);
							var peopleInnerObj = new Object();
							peopleInnerObj.name=_currPeople.text();
							setElProp(_currPeople,peopleInnerObj);
							peopleObj.people.push(peopleInnerObj);//people inner push
						});
						teamsObj.team.push(peopleObj);//people push
					}
					if(typeof(projectsObj.subitems.teams)!='undefined') projectsObj.subitems.teams.push(teamsObj);//teams push
				}else{// projectsObj.subitems.projects_products each
					var projects_productsObj = new Object;
					projects_productsObj.project_product=[];
					var titleObj = new Object();// title obj
					titleObj.title = new Object();
					var _currProj = _currHold.children().children('span').eq(0);
					titleObj.title.name=_currProj.text();
					setElProp(_currProj,titleObj.title);
					projects_productsObj.project_product.push(titleObj);//title push
					
					if(_currHold.children().children('ul').eq(0).children('li').children('span').length){
						var namesObj = new Object();// names obj
						namesObj.names=[];
						_currHold.children().children('ul').eq(0).children('li').children('span').each(function(){// names each
							var _currName = $(this);
							var namesInnerObj = new Object();
							namesInnerObj.name=_currName.text();
							setElProp(_currName,namesInnerObj);
							namesObj.names.push(namesInnerObj);//names inner push
						});
						projects_productsObj.project_product.push(namesObj);//names push
					}
					if(typeof(projectsObj.subitems.projects_products)!='undefined') projectsObj.subitems.projects_products.push(projects_productsObj);//teams push
				}
			}
		});
		orgchart.projects.push(projectsObj);//project push
	});
	if(!$('body').eq(0).children('.json').length){
		$('body').eq(0).append('<div class="json">'+JSON.stringify(orgchart)+'</div>');
	}else{
		$('body').eq(0).children('.json').html(JSON.stringify(orgchart));
	}
	_fader.hide();
}

// jsonToHtml func
function jsonToHtml(_url){
	_fader.show();
	$.ajax({
		type: "GET",
		url: _url,
		dataType: 'json',
		success: function(data){
			jsonToHtmlSucces(data);
		}
	});
}
// jsonToHtmlSucces
function jsonToHtmlSucces(data){
	_fader.show();
	if(typeof(data)=='object'){
		function setElClass(el,data){// set class to els
			if(typeof(el)=='object' && el.length && typeof(data)=='object' && typeof(data.styleprop)=='object'){
				if(data.styleprop.activity_rounded) el.addClass('activity_rounded');
				if(data.styleprop.head) el.addClass('head');
				if(data.styleprop.lead) el.addClass('lead');
				if(data.styleprop.qa) el.addClass('qa');
				if(data.styleprop.student) el.addClass('student');
				if(data.styleprop.probation) el.addClass('probation');
				if(data.styleprop.projects_products) el.parents('ul').eq(0).addClass('projects_products');
			}
		}
		if(typeof(data.company)=='object' && typeof(data.company.name)!='undefined'){
			_pageWrapper.children('.wrapper-inner').empty().append('<ul class="org-chart" />');//append org.chart wrapper
			var orgChart = _pageWrapper.children().children('.org-chart');
			orgChart.append('<li><span id="added"></span></li>');//append company name
			var span = $('#added').addClass('title').removeAttr('id').html(data.company.name);
			setElClass(span,data.company);
			if (typeof(data.projects) == 'object') {//append projects
				span.parent().append('<ul id="added" />');//append projectsHolder
				projectsHolder = $('#added').removeAttr('id');
				$.each(data.projects, function(i,obj) {
					if(typeof(obj.title)=='object' && typeof(obj.title.name)!='undefined'){
						projectsHolder.append('<li class="column" id="added" />');//append column
						var _currCol = $('#added').removeAttr('id');
						_currCol.append('<span id="added" />');// append project title
						span = $('#added').removeAttr('id').html(obj.title.name);
						setElClass(span,obj.title);
						if(typeof(obj.subitems.teams)=='object'){// append teams
							$.each(obj.subitems.teams, function(teamsI,teamsObj){
								if(typeof(teamsObj.team)=='object' && teamsObj.team.length && typeof(teamsObj.team[0].head)=='object' && typeof(teamsObj.team[0].head.name)!='undefined'){
									_currCol.append('<ul><li id="added"></li></ul>');// append team holder
									var _currLi = $('#added').removeAttr('id').append('<span id="added" />');// append head title
									span = $('#added').removeAttr('id').html(teamsObj.team[0].head.name);
									setElClass(span,teamsObj.team[0].head);
									if(teamsObj.team.length>1){
										_currLi.append('<ul id="added" />');// append peoples holder
										var _currUl = $('#added').removeAttr('id');
										$.each(teamsObj.team[1].people, function(peopleI,peopleObj){
											if(typeof(peopleObj.name)!='undefined'){
												_currUl.append('<li id="added" />');
												_currLi = $('#added').removeAttr('id').append('<span id="added" />');// append people name
												span = $('#added').removeAttr('id').html(peopleObj.name);
												setElClass(span,peopleObj);
											}
										});
									}
								}
							});
						}
						if(typeof(obj.subitems.projects_products)=='object'){// append projects-products
							$.each(obj.subitems.projects_products, function(productsI,productsObj){
								if(typeof(productsObj.project_product)=='object' && productsObj.project_product.length && typeof(productsObj.project_product[0].title)=='object' && typeof(productsObj.project_product[0].title.name)!='undefined'){
									_currCol.append('<ul><li id="added"></li></ul>');// append project-product holder
									var _currLi = $('#added').removeAttr('id').append('<span id="added" />');// append project-product title
									span = $('#added').removeAttr('id').html(productsObj.project_product[0].title.name);
									setElClass(span,productsObj.project_product[0].title);
									if(productsObj.project_product.length>1){
										_currLi.append('<ul id="added" />');// append subproject-subproduct holder
										var _currUl = $('#added').removeAttr('id');
										$.each(productsObj.project_product[1].names, function(namesI,namesObj){
											if(typeof(namesObj.name)!='undefined'){
												_currUl.append('<li id="added" />');
												_currLi = $('#added').removeAttr('id').append('<span id="added" />');// append subproject-subproduct name
												span = $('#added').removeAttr('id').html(namesObj.name);
												setElClass(span,namesObj);
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
		initPage();
	}
	_fader.hide();
};

// initPage func
function initPage(){
	refreshColumnNumbers();
	initButtons();
	initEditMode();
	setWidth();
	setHeights();
	setZindex( _columns );
	initSortable();
	fullRedraw();
	saveCancelFunc();
}

// saveCancelFunc
function saveCancelFunc(){
if(typeof(window.alreadyRunningSaveCancelFunc)=='undefined'){// running one time only
	window.alreadyRunningSaveCancelFunc=1;
	var _btnWrapper = $('#choose-box'),
	_saveBtn = _btnWrapper.find('.save'),
	_cancelBtn = _btnWrapper.find('.cancel'),
	_firstUrl = window.location.href,
	_dataWrapper = _pageWrapper.children('.wrapper-inner');
	_saveBtn.click(function(){
		_fader.show();
		setTimeout(function(){// prevent edit mode
			htmlToJson();
		}, 1000);
		// clear html
		var _dataClone = _dataWrapper.clone();
		_dataClone.find('form,.remove,.options,.add,.popup,.empty').remove();
		_dataClone.find('*').each(function(){
			var _thisNode = $(this);
			_thisNode.removeAttr('style');
			if(typeof(_thisNode.attr('axis') != 'undefined')) _thisNode.removeAttr('axis');
			_thisNode.removeClass('raphael ui-sortable');
			// _thisNode.attr('class',_thisNode.attr('class').trim()); class trim
			if(!_thisNode.attr('class').length) _thisNode.removeAttr('class');
		});
		//_dataClone.html() - clear html 
		return false;
	});
	_cancelBtn.click(function(){
		_fader.show();
		jsonToHtml('inc/orgchart.json');
		return false;
	});
	_btnWrapper.find('.upload').click(function(){
		var _jsonWrapper = $('body').eq(0).children('.json');
		if(_jsonWrapper.length){
			var _obj = JSON.parse(_jsonWrapper.html());
			jsonToHtmlSucces(_obj);
		}
		return false;
	});
}
}

// refreshEmptyColumn
function refreshEmptyColumn(){
	_columns.each(function(){ // append empty element to be able to drag elements in this column
		if(!$(this).children('ul').not('.empty').length && !$(this).children('.empty').length) $(this).append('<ul class="empty" />')
		else $(this).children('.empty').remove();
	});
}

// initButtons
function initButtons(els){
if(typeof(window.alreadyRunningInitButtons)=='undefined'){// running one time only
	window.alreadyRunningInitButtons=1;
	// delegate add-remove btn
	var _timeToHide = 5, // in ms
	_timeToHidePopup = 100, // in ms
	_elWrapper = $('#elements-wrapper'),
	_addBtn = _elWrapper.children('.add'),
	_removeBtn = _elWrapper.children('.remove'),
	_optionsBtn = _elWrapper.children('.options'),
	_popup = _elWrapper.children('.popup');
	_pageWrapper.delegate("span", "mouseenter", function(){
		var _self = $(this);
		var _selfParentBox = _self.parent();
		var _selfParentBoxes = _self.parents('li');
		var _siblList = _self.siblings('ul');
		// _self attr
		var _selfOffsetTop = parseInt(_self.position().top);
		var _selfOffsetLeft = parseInt(_self.position().left);
		if($.browser.safari) _selfOffsetLeft += parseInt( _self.css('margin-left') ); // webkit hack
		if($.browser.msie && $.browser.version < 7) _selfOffsetLeft -= parseInt( _self.offset().left - _selfParentBox.offset().left ); // IE6 hack
		var _selfW = parseInt(_self.width())+parseInt(_self.css('padding-left'))+parseInt(_self.css('padding-right'));
		var _selfH = parseInt(_self.outerHeight(true));
		var _tRemove = 0; // timer var
		var _popupRemove = 0; // timer var
		if(!_self.data('add-remove')){ // first create
			/* CREATE */
			/* create addBtn */
			if(_selfParentBoxes.length<4) _addBtn.clone().appendTo(_selfParentBox);
			var _selfAddBtn = _self.siblings('.add').css('display','none');
			/* create removeBtn */
			if(_selfParentBoxes.length>1) _removeBtn.clone().appendTo(_selfParentBox);
			var _selfRemoveBtn = _self.siblings('.remove').css('display','none');
			/* create optionsBtn */
			if(_selfParentBoxes.length>2 ) _optionsBtn.clone().appendTo(_selfParentBox);
			var _selfOptionsBtn = _self.siblings('.options').css('display','none');
			/* create POPUP */
			_popup.clone().appendTo(_selfParentBox);
			var _selfPopup = _selfParentBox.children('.popup').css('display','none');
			var _buttons = _selfAddBtn.add(_selfRemoveBtn).add(_selfOptionsBtn); // buttons all
			/* EVENTS */
			_self // self events
			.mouseenter(function(){
				if(!_selfParentBox.hasClass('ui-sortable-helper') && !_pageWrapper.hasClass('sortable-now')){ // if box not sortable now
					if(_tRemove) clearTimeout(_tRemove);
					_buttons.css('display','block');
				}
			}).mouseleave(function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide);
				if(_popupRemove) clearTimeout(_popupRemove);
				_popupRemove = setTimeout(function(){ // popup hide with timer
					_selfPopup.css('display','none');
					_selfOptionsBtn.removeClass('visible');
				}, _timeToHidePopup);
			}).mouseup(function(){
				if(_selfParentBox.hasClass('ui-sortable-helper')){
					_buttons.css('display','none'); // hide buttons
					_selfPopup.css('display','none'); // hide popup
					_selfOptionsBtn.removeClass('visible'); // hide optionsBtn
				}
			}).bind('leave',function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide);
				if(_popupRemove) clearTimeout(_popupRemove);
				_popupRemove = setTimeout(function(){ // popup hide with timer
					_selfPopup.css('display','none');
					_selfOptionsBtn.removeClass('visible');
				}, _timeToHidePopup);
			});
			_selfRemoveBtn // remove btn events
			.mouseenter(function(){
				if(!_selfParentBox.hasClass('ui-sortable-helper') && !_pageWrapper.hasClass('sortable-now')){ // if box not sortable now
					if(_tRemove) clearTimeout(_tRemove);
				}
			})
			.mouseleave(function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide)
			})
			.click(function(){
				if(_tRemove) clearTimeout(_tRemove); // hide buttons
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide);
				/* create LIGHTBOX */
				var _itemText = ''; // sub items text
				if(_self.find('input').length) _itemText = _self.find('input').val();
				else _itemText = _self.text()
				var _subItems = ''; // sub items text
				if(_selfParentBox.find('.raphael').not(_self).length) _subItems = ' and sub-items'
				var _lightBox = $('<div style="display:none;"><div class="lightbox">Are you sure you want to remove "'+_itemText+'"'+_subItems+'?</div></div>');
				_lightBox.clone().appendTo(_selfParentBox);
				var _selfLightBox = _selfParentBox.children().children('.lightbox');
				function faderClick(e){ // function to hide dialog by fader click
					e = e || event;
					var t = e.target || e.srcElement;
					t = $(t);
					if(t.hasClass('ui-widget-overlay')) _selfLightBox.dialog('close');
				}
				_selfLightBox.dialog({ // dialog lighbox
					modal:true,
					width: 300,
					title:'Remove dialog',
					buttons: {
						"Ok": function() {
							if(!_selfParentBox.siblings().length) _selfParentBox.parent().remove();
							else _selfParentBox.remove();
							fullRedraw();
							initSortable();
							$(this).dialog("close");
							_selfLightBox.dialog('destroy');
						}, 
						"Cancel": function() { 
							$(this).dialog("close"); 
						} 
					},
					open: function(event, ui) {
						var _dialogWindow = $(this).parent();
						/* ARROW events when dialog is open */
						$(document).unbind('keydown.dialog').bind('keydown.dialog', function(event){ // init moving focus in dialog window
							if(event.keyCode==37 || event.keyCode==40){ // left+bottom arrow
								_dialogWindow.find('button').eq(0).trigger('focus'); // OK button
								return false;
							}else if(event.keyCode==39){ // right arrow
								_dialogWindow.find('button').eq(1).trigger('focus'); // CANCEL button
								return false;
							}else if(event.keyCode==38){ // up arrow
								_dialogWindow.find('.ui-dialog-titlebar-close').trigger('focus'); // CLOSE button
								return false;
							}
						});
						$(document).bind("click", faderClick); // bind hide dialog by fader click
					},
					beforeClose: function(event, ui) {
						$(document).unbind('keydown.dialog'); // unbind moving focus in dialog window
						$(document).unbind("click", faderClick); // unbind hide dialog by fader click
					}
				});
				return false;
			});
			_selfAddBtn // add btn events
			.mouseenter(function(){
				if(!_selfParentBox.hasClass('ui-sortable-helper') && !_pageWrapper.hasClass('sortable-now')){ // if box not sortable now
					if(_tRemove) clearTimeout(_tRemove);
				}
			})
			.mouseleave(function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide);
			})
			.click(function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){
					_buttons.css('display','none');
				}, _timeToHide);
				var _siblList = _self.siblings('ul');
				var _selfParentBoxes2 = _self.parents('li');
				if(_siblList.length && (_selfParentBoxes2.length>2 || _selfParentBoxes2.length==1) ){
					_siblList.eq(0).append('<li><span id="added">Edit</span></li>');
					var _added = $('#added');
					if(_selfParentBoxes2.length==1){ // if added column
						_added.addClass('activity_rounded').parent().addClass('column').append('<ul class="empty" />'); // append empty element to be able to drag elements in this column
						refreshColumnNumbers();
					}
					refreshEmptyColumn();
					fullRedraw();
					initSortable();
					_added.removeAttr('id');
					_added.trigger('click');
					_added.trigger('dblclick');
				}else{
					_selfParentBox.append('<ul><li><span id="added">Edit</span></li></ul>');
					var _added = $('#added');
					if(_selfParentBoxes2.length==1){ // if added column
						_added.parent().addClass('column');
						refreshColumnNumbers();
					}
					refreshEmptyColumn();
					fullRedraw();
					initSortable();
					_added.removeAttr('id');
					_added.trigger('click');
					_added.trigger('dblclick');
				}
				// recalc button position
				var _selfOffsetTopRecalc = parseInt(_self.position().top);
				var _selfOffsetLeftRecalc = parseInt(_self.position().left);
				if($.browser.safari) _selfOffsetLeftRecalc += parseInt( _self.css('margin-left') ); // webkit hack
				if($.browser.msie && $.browser.version < 7 && _self.css('margin-left') == 'auto' ) _selfOffsetLeftRecalc -= parseInt( _self.offset().left - _selfParentBox.offset().left ); // IE6 hack
				var _selfWRecalc = parseInt(_self.width());
				var _selfHRecalc = parseInt(_self.outerHeight(true));
				_selfAddBtn.css({ 
					top: _selfOffsetTopRecalc,
					left: _selfOffsetLeftRecalc
				});
				_selfRemoveBtn.css({
					top: _selfOffsetTopRecalc+_selfHRecalc,
					left: _selfOffsetLeftRecalc
				});
				_selfOptionsBtn.css({
					top: _selfOffsetTopRecalc,
					left: _selfOffsetLeftRecalc+_selfWRecalc
				});
				return false;
			});
			_selfOptionsBtn // remove btn events
			.mouseenter(function(){
				if(!_selfParentBox.hasClass('ui-sortable-helper') && !_pageWrapper.hasClass('sortable-now')){ // if box not sortable now
					if(_tRemove) clearTimeout(_tRemove);
					if(_popupRemove) clearTimeout(_popupRemove);
				}
			})
			.mouseleave(function(){
				if(_tRemove) clearTimeout(_tRemove);
				_tRemove = setTimeout(function(){ // buttons hide with timer
					_buttons.css('display','none');
				}, _timeToHide);
				if(_popupRemove) clearTimeout(_popupRemove);
				_popupRemove = setTimeout(function(){ // popup hide with timer
					_selfPopup.css('display','none');
					_selfOptionsBtn.removeClass('visible');
				}, _timeToHidePopup);
			})
			.mouseup(function(){
				if(_selfParentBox.hasClass('ui-sortable-helper')){
					_selfPopup.css('display','none'); // hide popup
					_selfOptionsBtn.removeClass('visible'); // hide optionsBtn
				}
			}).mousedown(function(){
				if(_selfPopup.is(":visible")){
					_selfPopup.css('display','none');
				}else{
					_selfPopup.css('display','block');
				}
			}).click(function(){
				return false;
			});
			_selfPopup // POPUP events
			.mouseenter(function(){ // popup evets
				if(!_selfParentBox.hasClass('ui-sortable-helper') && !_pageWrapper.hasClass('sortable-now')){ // if box not sortable now
					if(_popupRemove) clearTimeout(_popupRemove);
					_selfOptionsBtn.addClass('visible');
				}
			}).mouseleave(function(){
				if(_popupRemove) clearTimeout(_popupRemove);
				_popupRemove = setTimeout(function(){ // popup hide with timer
					_selfPopup.css('display','none');
					_selfOptionsBtn.removeClass('visible');
				}, _timeToHidePopup);
			}).mouseup(function(){
				if(_selfParentBox.hasClass('ui-sortable-helper')){
					_buttons.css('display','none'); // hide buttons
					_selfPopup.css('display','none'); // hide popup
					_selfOptionsBtn.removeClass('visible'); // hide optionsBtn
				}
			});
			_self.trigger('mouseenter'); // trigger mouseenter to fix first time mouseover action
			_self.data('add-remove','true'); // add "data-" to box
		}else{ // is created
			var _selfAddBtn = _self.siblings('.add');
			var _selfRemoveBtn = _self.siblings('.remove');
			var _selfOptionsBtn = _self.siblings('.options');
			var _selfPopup = _self.siblings('.popup');
		}
		if(_selfParentBoxes.eq(1).parents().hasClass('projects_products')){// if el in projects
			_selfOptionsBtn.hide();
		}
		/* popupInners events */
		var _checkBoxes = _selfParentBox.children('.popup').find('.checkbox');
		_checkBoxes.each(function(){
			var _selfCheck = $(this),
			_selfCheckVal = _selfCheck.attr('value'),
			_selfCheckNeedParent = $([]);
			/* check need parent to set class */
			if(_selfCheck.attr('name') && _selfCheck.attr('alt')){ // by attr "name" and "alt"
				if(_selfParentBoxes.length>3){ // hide block by levels
					_selfCheck.parent().css('display','none');
				}else{
					_selfCheck.parent().css('display','block');
					_selfCheckNeedParent = _selfCheck.parents(_selfCheck.attr('name')).eq(0).find(_selfCheck.attr('alt')).eq(0);
				}
			}else if(_selfCheck.attr('name')){ // by attr "name"
				if(_selfParentBoxes.length>3){ // hide block by levels
					_selfCheck.parent().css('display','none');
				}else{
					_selfCheck.parent().css('display','block');
					_selfCheckNeedParent = _selfCheck.parents(_selfCheck.attr('name')).eq(0);
				}
			}else{
				if(_selfParentBoxes.length<4){
					_selfCheck.parent().css('display','none');
				}
				_selfCheckNeedParent = _self;
			}
			if(_selfCheckNeedParent.hasClass(_selfCheckVal)) _selfCheck.attr('checked','checked'); // set checked to checkbox
			_selfCheck.bind('click',function(e){e.stopPropagation();});// prevent trigger click on parent
			_selfCheck.change(function(){
				if(_selfCheck.is(':checked')) _selfCheckNeedParent.addClass(_selfCheckVal);
				else _selfCheckNeedParent.removeClass(_selfCheckVal);
			});
			_selfCheck.parent().unbind('click').click(function(){
				if(_selfCheck.is(':checked')) _selfCheck.removeAttr('checked');
				else _selfCheck.attr('checked','checked');
				_selfCheck.trigger('change');
			});
		});
		/* SET POSITION */
		_selfAddBtn.css({ 
			top: _selfOffsetTop,
			left: _selfOffsetLeft
		});
		_selfRemoveBtn.css({
			top: _selfOffsetTop+_selfH,
			left: _selfOffsetLeft
		});
		_selfOptionsBtn.css({
			top: _selfOffsetTop,
			left: _selfOffsetLeft+_selfW
		});
		_selfPopup.css({
			top: _selfOffsetTop,
			left: _selfOffsetLeft+_selfW,
			'margin-top': -parseInt(_selfParentBox.children('.popup').height())
		});
		if(_selfPopup.is(':hidden')){ // if popup is hidden
			_selfPopup.show();
			preventTopRightOverflow(_selfPopup,_pageWrapper); // prevent popup overflow
			_selfPopup.hide();
		}else{
			preventTopRightOverflow(_selfPopup,_pageWrapper); // prevent popup overflow
		}
	});
}
}
// initSortable
function initSortable(els){
	$('*').sortable("destroy");
	// set axis to sortable
	var _projectsWrapper = $('.org-chart').children('li').children('ul').attr('axis','x'),
	_projectInner = _columns.children('ul').children('li').children('ul'),
	_projectAll = _projectsWrapper.add(_projectInner).add(_columns);
	_projectAll.sortable("destroy");
	_allRaphaelBox = _projectAll.children('li').find('span'); // global var
	// jQuery UI sortable
	_projectAll.each(function(){
		var _sortWrapper = $(this),
		_sortWrapperParent = _sortWrapper.parents('ul').eq(0),
		_connectList = $([]),
		_items = '> *';
		if(_sortWrapper.hasClass('column')){ // set column connect list and items
			_items = '>ul';
			_connectList = _columns;
		}else if(typeof(_sortWrapper.attr('axis')) == 'undefined'){ // if not first top item
			if(_sortWrapperParent.hasClass('project')){ // ban sorting project-people items
				_projectInner.each(function(){
					var _selfBox = $(this),
					_selfBoxWrapper = _selfBox.parents('ul').eq(0);
					if(_selfBoxWrapper.hasClass('project')){
						_connectList = _connectList.add(_selfBox);
					}
				});
			}else{
				_projectInner.each(function(){
					var _selfBox = $(this),
					_selfBoxWrapper = _selfBox.parents('ul').eq(0);
					if(!_selfBoxWrapper.hasClass('project')){
						_connectList = _connectList.add(_selfBox);
					}
				});
			}
		}
		_sortWrapper.sortable({
			axis:_sortWrapper.attr('axis') ? _sortWrapper.attr('axis') : '',
			containment:_pageWrapper,
			start:function(event,ui){
				_pageWrapper.addClass('sortable-now'); // add sortable class
				_sortWrapper.addClass('curr-sort');
				ui.item.children('span').trigger('leave'); // trigger hide button and popup
				if(_sortWrapper.hasClass('column')){ // set current column top z-index
					_sortWrapper.css('z-index',50);
				}else{
					_sortWrapper.parents('.column').eq(0).css('z-index',50);
				}
				ui.placeholder.css({ // set placeholder size
					'width':ui.item.width(),
					'height':ui.item.height()
				});
				_currColumnRaphael = ui.placeholder.parents('.column').find('.raphael'); // get current column raphael box
			},
			over:function(event,ui){
				_currColumnRaphael.trigger('trin');
				_currColumnRaphael = ui.placeholder.parents('.column').find('.raphael'); // get current column raphael box
			},
			out:function(event,ui){
				_currColumnRaphael.trigger('trin');
			},
			sort:function(event,ui){
				ui.item.find('span').trigger('trin');
			},
			change:function(event,ui){
				if(_sortWrapper.attr('axis')){
					_allRaphaelBox.trigger('trin'); // if column is sortable
				}else{
					ui.placeholder.parents('.column').find('.raphael').trigger('trin');
				}
				setHeights();
			},
			stop:function(event,ui){
				if(ui.item.parents('ul').eq(1).hasClass('projects_products')){// if el in projects
					var _uiEl = ui.item.find('span').eq(0);
					_uiEl.siblings('.popup').find(':checkbox').each(function(){
						$(this).removeAttr('checked');
						_uiEl.removeClass($(this).attr('value'));
					});
				}
				ui.item.css({'top':0}); // opera hack
				refreshEmptyColumn();
				if(!ui.item.parent().hasClass('curr-sort') || ui.item.hasClass('column')){
					fullRedraw(); // redraw if box change column
				}else{
					_allRaphaelBox.trigger('trin');
				}
				_pageWrapper.removeClass('sortable-now'); // remove sortable class
				_sortWrapper.removeClass('curr-sort');
				setZindex( _columns ); // set z-index to parent
			},
			placeholder: "ui-state-highlight",
			items: _items,
			connectWith: _connectList,
			opacity:!$.browser.msie ? '0.5' : false // disable opacity in IE
		});
	});
	if($.browser.msie){ // disable top sortable, when other sortable is running (IE hack)
		_projectInner.find('span').mousedown(function(){
			_columns.sortable({disabled:true});
			_projectsWrapper.sortable({disabled:true});
		});
		_columns.children('ul').mousedown(function(){
			_projectsWrapper.sortable({disabled:true});
		});
		$(document).mouseup(function(){
			_columns.sortable({disabled:false});
			_projectsWrapper.sortable({disabled:false});
		});
	}
}

// initEditMode
function initEditMode(els){
	if(typeof(window.alreadyRunningInitEditMode)=='undefined'){// running one time only
		window.alreadyRunningInitEditMode=1;
		_pageWrapper.delegate("span", "click", function(){ // delegate edit mode
			if(!$(this).data('event.editable')){ // if not editable now
				$(this).editable("string", { 
					event:"dblclick",
					style:"inherit",
					saveVal:true,
					callback : function(value, settings) { // callback
						_allRaphaelBox.trigger('trin');
						setHeights();
					}
				});
			}
		});
		$(document).bind('mousedown', function(e){ // prevent save input state by click another item
			e = e || event;
			var t = e.target || e.srcElement;
			t = $(t);
			if(t.attr('tagName').toLowerCase() != 'input'){
				$('input').trigger('blur');
			}
		});
	}
}

// preventTopRightOverflow
function preventTopRightOverflow(_selfPopup,_pageWrapper){
	var _popupOffset = _selfPopup.offset(),
	_pageWrapperOffset = _pageWrapper.offset();
	if(parseInt(_popupOffset.top)<parseInt(_pageWrapperOffset.top)){
		_selfPopup.css(
			'margin-top', parseInt( _selfPopup.css('margin-top') ) +parseInt(_pageWrapperOffset.top)-parseInt(_popupOffset.top)
		);
	}
	var _popupOffsetR = parseInt(_popupOffset.left + _selfPopup.outerWidth()),
	_pageWrapperOffsetR = parseInt(_pageWrapperOffset.left + _pageWrapper.outerWidth());
	if(_popupOffsetR>_pageWrapperOffsetR){
		_selfPopup.css(
			'margin-left', parseInt( _selfPopup.css('margin-left') ) +_pageWrapperOffsetR-_popupOffsetR
		);
	}
}

// refreshColumnNumbers
function refreshColumnNumbers(){
	_columns = $('.column'); // global var
}

// set documents height
function setWidth(){
	refreshColumnNumbers();
	var _boxToSetWidth = _columns.parent().add(_pageWrapper.children('.wrapper-inner')).add(_pageWrapper),
	_columnsWidth = 0;
	_columns.each(function(i){
		var _currCol = $(this);
		_columnsWidth += parseInt(_currCol.outerWidth(true));
	});
	_boxToSetWidth.css('width',_columnsWidth);
	if( typeof(r) != 'undefined' ){
		r.setSize( _columnsWidth, parseInt(_pageWrapper.height()) );
	}
}

// set documents height
function setHeights(){
	var _wrapInn = _pageWrapper.children('.wrapper-inner'),
	_currHeight = parseInt(_wrapInn.outerHeight(true));
	_wrapInn.css({'position':'absolute'}); // put above graph
	_pageWrapper.css('height',_currHeight); // set document height
	if( typeof(r) != 'undefined' ){
		r.setSize( parseInt(_pageWrapper.width()), parseInt(_pageWrapper.height()) );
	}
}

// full redraw
function fullRedraw(){
	if(typeof(r) != 'undefined' ){
		$('*').unbind('trin');
		if(typeof(_allRaphaelBox)!='undefined'){
			_allRaphaelBox.removeClass('raphael');
		}
		r.clear();
	}
	setWidth();
	drawGraphs();
	setHeights();
}

// draw graphs
function drawGraphs(){ // raphaelJS
	// top text
	refreshColumnNumbers();
	_columns.children('span').each(function(_boxCount){
		var _el = $(this);
		var _elRelative = _el.parents('li').eq(1).find('>span').eq(0);
		_el.relativeBoxes({
			_strokeWidth: 1,
			_strokeColor: "#0f0",
			_strokeBgColor: "#0f0",
			_wrapper: _pageWrapper,
			_relativeBox: _elRelative,
			_lineType: 'top'
		});
	});
	// other
	_columns.children('ul').find('span').each(function(_boxCount){
		var _el = $(this);
		var _elRelative = _el.parents('li').eq(1).find('>span').eq(0);
		_el.relativeBoxes({
			_strokeWidth: 1,
			_strokeColor: "#0f0",
			_strokeBgColor: "#0f0",
			_wrapper: _pageWrapper,
			_relativeBox: _elRelative,
			_shiftByX: 2.3
		});
	});
}

// set z-index
function setZindex(_els){
	if(typeof(_els)=='object' && _els.length>1){
		_els.each(function(i){
			$(this).css('z-index',_els.length-i);
		});
	}
}

// create raphael boxes and relatives
jQuery.fn.relativeBoxes = function(_options){
	// defaults options	
	var _options = jQuery.extend({
		_strokeWidth: 1,
		_strokeColor: "#000",
		_strokeBgColor: "#000",
		_wrapper:'body:eq(0)',
		_shiftByX: 'default',
		_lineType: 'default',
		_relativeBox: $([])
	}, _options);
	
	/* Raphael drag */
	Raphael.fn.connection = function (setup) {
		var obj1 = setup.obj1 || true,
			obj2 = setup.obj2 || true,
			line = setup.line || true,
			bg = setup.bg || true,
			_shiftByX = setup._shiftByX || 'default',
			_lineType = setup._lineType || 'default';
		if (obj1.line && obj1.from && obj1.to) {
			line = obj1;
			obj1 = line.from;
			obj2 = line.to;
		}
		var bb1 = obj1.getBBox(),
			bb2 = obj2.getBBox();
		if(_lineType != 'default'){ // top boxes
			var _bb1Y = bb1.y;
			var _bb2Y = bb2.y;
			var _bb2H = bb2.height;
			var _centerX1 = parseInt(bb1.x + bb1.width/2), // bottom center,
				_centerY1 = parseInt(_bb1Y + bb1.height/2),
				_centerX2 = parseInt(bb2.x + bb2.width/2), // top center
				_centerY2 = parseInt(_bb2Y + _bb2H/2),
				_interY1 = parseInt((_bb1Y-_bb2Y)/2+_bb2H/2),
				path = ["M", _centerX1, _centerY1, 'L', _centerX1, _centerY1, _centerX1, _interY1, _centerX2, _interY1, _centerX2, _centerY2].join(","); // draw path
		}else{ // other boxes
			var _bb2W = bb2.width;
			var _centerX1 = parseInt(bb1.x + bb1.width/2),
				_centerY1 = parseInt(bb1.y + bb1.height/2),
				_centerX2 = parseInt(bb2.x + _bb2W/2);
			if(_shiftByX != 'default') _centerX2 = _centerX2 - _bb2W/_shiftByX;
			var _centerY2 = parseInt(bb2.y + bb2.height/2),
				 path = ["M", _centerX1, _centerY1, 'L', _centerX1, _centerY1 ,_centerX2, _centerY1, _centerX2, _centerY2].join(","); // draw path
		}
		if (line && line.line) {
			line.bg && line.bg.attr({path: path});
			line.line.attr({path: path});
		} else {
			var color = typeof line == "string" ? line : "#000";
			return {
				bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
				line: this.path(path).attr({stroke: color, fill: "none"}),
				from: obj1,
				to: obj2
			};
		}
	};
	if(typeof(r)=='undefined'){ // set Raphael box
		if(typeof(_options._wrapper)=='string') var _raphaelWrapper = $(_options._wrapper).get(0);
		else if(typeof(_options._wrapper)=='object') var _raphaelWrapper = _options._wrapper.get(0);
		if(typeof(_raphaelWrapper) != 'undefined') r = Raphael($(_options._wrapper).get(0), parseInt($(_options._wrapper).width()), parseInt($(_options._wrapper).height()) ); // global var
	}
	return this.each(function(){ // each function
		var _box = jQuery(this);
		if(_options._relativeBox.length && !_box.hasClass('raphael') ){
			var _relBox = _options._relativeBox,
			_raphaelWrapper = $(_options._wrapper),
			// _box attr
			_boxWidth = _box.outerWidth(),
			_boxHeight = _box.outerHeight(),
			_boxOffset = _box.offset(),
			_raphaelWrapperOffset = _raphaelWrapper.offset(),
			_boxFirstTop = parseInt( _boxOffset.top - _raphaelWrapperOffset.top),
			_boxFirstLeft = parseInt( _boxOffset.left - _raphaelWrapperOffset.left),
			// relbox attr
			_relBoxWidth = _relBox.outerWidth(),
			_relBoxHeight = _relBox.outerHeight(),
			_relBoxOffset = _relBox.offset(),
			_relBoxFirstTop = parseInt( _relBoxOffset.top - _raphaelWrapper.offset().top),
			_relBoxFirstLeft = parseInt( _relBoxOffset.left - _raphaelWrapper.offset().left),
			// start drag'n drop function
			dragger = function () {
				this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
				this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
			},
			// mouse move function
			move = function (dx, dy) {
				var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
				this.attr(att);
				for (var i = connections.length; i--;) {
					var setup = {
						obj1: connections[i],
						_shiftByX: _options._shiftByX,
						_lineType: _options._lineType};
					r.connection(setup);
				}
				r.safari();
			},
			connections = [],
			_rect1 = r.rect(_boxFirstLeft, _boxFirstTop, _boxWidth, _boxHeight), // _box rect
			_rect2 = r.rect(_relBoxFirstLeft, _relBoxFirstTop, _relBoxWidth, _relBoxHeight), // relbox rect
			shapes = [_rect1,_rect2]; // shapes
			for (var i = 0, ii = shapes.length; i < ii; i++) { // draw shapes
				shapes[i].attr({
					'stroke':'none',
					'stroke-width':0
				});
				shapes[i].drag(move, dragger);
			}
			var setupFirst = { // create connections
				obj1: shapes[0],
				obj2: shapes[1],
				line: _options._stokeColor,
				bg: _options._strokeBgColor+'|'+_options._strokeWidth,
				_shiftByX: _options._shiftByX,
				_lineType: _options._lineType};
			connections.push(r.connection(setupFirst));
			// box events
			_box.bind("trin",function(){ // redraw path to box event
				var _boxCurrOffset = _box.offset(),
				_raphaelWrapperCurrOffset = _raphaelWrapper.offset(),
				_boxL = parseInt( _boxCurrOffset.left - _raphaelWrapperCurrOffset.left ),
				_boxT = parseInt( _boxCurrOffset.top - _raphaelWrapperCurrOffset.top );
				shapes[0].attr({
					x: _boxL,
					y: _boxT
				});
				for (var i = connections.length; i--;) {
					var setup = {
						obj1: connections[i],
						_shiftByX: _options._shiftByX,
						_lineType: _options._lineType};
					r.connection(setup);
				}
			});
			// relbox events
			_relBox.bind("trin",function(){ // redraw path to relbox event
				var _relBoxCurrOffset = _relBox.offset(),
				_raphaelWrapperCurrOffset = _raphaelWrapper.offset(),
				_relBoxL = parseInt( _relBoxCurrOffset.left - _raphaelWrapperCurrOffset.left ),
				 _relBoxT = parseInt( _relBoxCurrOffset.top - _raphaelWrapperCurrOffset.top );
				shapes[1].attr({
					x:_relBoxL,
					y:_relBoxT
				});
				for (var i = connections.length; i--;) {
					var setup = {
						obj1: connections[i],
						_shiftByX: _options._shiftByX,
						_lineType: _options._lineType};
					r.connection(setup);
				}
			});
			// class add
			_box.addClass('raphael');
		}
	});
};