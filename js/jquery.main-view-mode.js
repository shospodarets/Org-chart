$(document).ready(function(){
	$('#choose-box').hide();
	_pageWrapper = $('#wrapper'); // global var
	jsonToHtml('inc/orgchart.json');
});

// jsonToHtml func
function jsonToHtml(_url){
	_fader.show();
	$.ajax({
		type: "POST",
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
	setWidth();
	setHeights();
	setZindex( _columns );
	fullRedraw();
}

// refreshEmptyColumn
function refreshEmptyColumn(){
	_columns.each(function(){ // append empty element to be able to drag elements in this column
		if(!$(this).children('ul').not('.empty').length && !$(this).children('.empty').length) $(this).append('<ul class="empty" />')
		else $(this).children('.empty').remove();
	});
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