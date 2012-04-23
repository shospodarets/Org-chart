var _fader ={
	init: function(){
		var _html = $('html').eq(0);
		var _body = $('body').eq(0);
		var _loader = _body.children('.loader-fader');
		if(!_loader.length){
			var _loaderFader = $('<div />')
				.addClass('loader-fader')
				.css({
					'position':'absolute',
					'top':0,
					'left':0,
					'width':'100%',
					'height':_html.outerHeight(true),
					'opacity':0.5,
					'z-index':1000
				})
				.append('<div class="loader-fader-image" />');
			_body.append(_loaderFader);
		}
		_fader.resize();
	},
	resize: function(){
		if (typeof(window.alreadyRunningLoaderResize) == 'undefined') {// running one time only
			window.alreadyRunningLoaderResize = 1;
			$(window).resize(function(){
				var _html = $('html').eq(0);
				var _body = $('body').eq(0);
				var _loader = _body.children('.loader-fader');
				if (_loader.length) {
					_loader.css({
						'height': _html.outerHeight(true)
					})
				}
			});
		}
	},
	hide: function(){
		var _body = $('body').eq(0);
		var _loader = _body.children('.loader-fader');
		_loader.hide();
	},
	show: function(){
		_fader.init();
		var _body = $('body').eq(0);
		var _loader = _body.children('.loader-fader');
		_loader.show();
	}
}
