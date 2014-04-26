/*
 * Jeditable - jQuery in place edit plugin
 *
 * Copyright (c) 2006-2009 Mika Tuupola, Dylan Verheul
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Based on editable by Dylan Verheul <dylan_at_dyve.net>:
 *    http://www.dyve.net/jquery/?editable
 *
 */

/*
 Version 1.7.1
 */
function replaceAllBy(string, value, replaceValue) {
    if (string && typeof(string) == 'string' && value && typeof(value) == 'string' && replaceValue && typeof(replaceValue) == 'string') {
        while (string.indexOf(value) != -1) {
            string = string.replace(value, replaceValue);
        }
        return string;
    }
}

(function ($) {
    $.fn.editable = function (_1, _2) {
        if ("disable" == _1) {
            $(this).data("disabled.editable", true);
            return;
        }
        if ("enable" == _1) {
            $(this).data("disabled.editable", false);
            return;
        }
        if ("destroy" == _1) {
            $(this).unbind($(this).data("event.editable")).removeData("disabled.editable").removeData("event.editable");
            return;
        }
        var _3 = $.extend({}, $.fn.editable.defaults, {target: _1}, _2);
        var _4 = $.editable.types[_3.type].plugin || function () {
        };
        var _5 = $.editable.types[_3.type].submit || function () {
        };
        var _6 = $.editable.types[_3.type].buttons || $.editable.types["defaults"].buttons;
        var _7 = $.editable.types[_3.type].content || $.editable.types["defaults"].content;
        var _8 = $.editable.types[_3.type].element || $.editable.types["defaults"].element;
        var _9 = $.editable.types[_3.type].reset || $.editable.types["defaults"].reset;
        var _a = _3.callback || function () {
        };
        var _b = _3.onedit || function () {
        };
        var _c = _3.onsubmit || function () {
        };
        var _d = _3.onreset || function () {
        };
        var _e = _3.onerror || _9;
        if (_3.tooltip) {
            $(this).attr("title", _3.tooltip);
        }
        _3.autowidth = "auto" == _3.width;
        _3.autoheight = "auto" == _3.height;
        return this.each(function () {
            var _f = this;
            var _10 = $(_f).width();
            var _11 = $(_f).height();
            $(this).data("event.editable", _3.event);
            if (!$.trim($(this).html())) {
                $(this).html(_3.placeholder);
            }
            $(this).bind(_3.event, function (e) {
                if (true === $(this).data("disabled.editable")) {
                    return;
                }
                if (_f.editing) {
                    return;
                }
                if (false === _b.apply(this, [_3, _f])) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                if (_3.tooltip) {
                    $(_f).removeAttr("title");
                }
                if (0 == $(_f).width()) {
                    _3.width = _10;
                    _3.height = _11;
                } else {
                    if (_3.width != "none") {
                        _3.width = _3.autowidth ? $(_f).width() : _3.width;
                    }
                    if (_3.height != "none") {
                        _3.height = _3.autoheight ? $(_f).height() : _3.height;
                    }
                }
                if ($(this).html().toLowerCase().replace(/(;|")/g, "") == _3.placeholder.toLowerCase().replace(/(;|")/g, "")) {
                    $(this).html("");
                }
                _f.editing = true;
                _f.revert = $(_f).html();
                $(_f).html("");
                var _12 = $("<form />");
                if (_3.cssclass) {
                    if ("inherit" == _3.cssclass) {
                        _12.attr("class", $(_f).attr("class"));
                    } else {
                        _12.attr("class", _3.cssclass);
                    }
                }
                if (_3.style) {
                    if ("inherit" == _3.style) {
                        _12.attr("style", $(_f).attr("style"));
                        _12.css("display", $(_f).css("display"));
                    } else {
                        _12.attr("style", _3.style);
                    }
                }
                var _13 = _8.apply(_12, [_3, _f]);
                var _14;
                if (_3.loadurl) {
                    var t = setTimeout(function () {
                        _13.disabled = true;
                        _7.apply(_12, [_3.loadtext, _3, _f]);
                    }, 100);
                    var _15 = {};
                    _15[_3.id] = _f.id;
                    if ($.isFunction(_3.loaddata)) {
                        $.extend(_15, _3.loaddata.apply(_f, [_f.revert, _3]));
                    } else {
                        $.extend(_15, _3.loaddata);
                    }
                    $.ajax({type: _3.loadtype, url: _3.loadurl, data: _15, async: false, success: function (_16) {
                        window.clearTimeout(t);
                        _14 = _16;
                        _13.disabled = false;
                    }});
                } else {
                    if (_3.data) {
                        _14 = _3.data;
                        if ($.isFunction(_3.data)) {
                            _14 = _3.data.apply(_f, [_f.revert, _3]);
                        }
                    } else {
                        _14 = _f.revert;
                    }
                }
                _7.apply(_12, [_14, _3, _f]);
                _13.attr("name", _3.name);
                _6.apply(_12, [_3, _f]);
                $(_f).append(_12);
                _4.apply(_12, [_3, _f]);
                $(":input:visible:enabled:first", _12).focus().select();
                if (_3.select) {
                    _13.select();
                }
                _13.keydown(function (e) {
                    if (e.keyCode == 27) {
                        e.preventDefault();
                        _9.apply(_12, [_3, _f]);
                    }
                });
                _13.keypress(function (e) {
                    if (e.keyCode == 27) {
                        e.preventDefault();
                        _9.apply(_12, [_3, _f]);
                    }
                });
                var t;
                if ("cancel" == _3.onblur) {
                    _13.blur(function (e) {
                        t = setTimeout(function () {
                            _9.apply(_12, [_3, _f]);
                        }, 500);
                    });
                } else {
                    if ("submit" == _3.onblur) {
                        _13.blur(function (e) {
                            t = setTimeout(function () {
                                _12.submit();
                            }, 200);
                        });
                    } else {
                        if ($.isFunction(_3.onblur)) {
                            _13.blur(function (e) {
                                _3.onblur.apply(_f, [_13.val(), _3]);
                            });
                        } else {
                            _13.blur(function (e) {
                            });
                        }
                    }
                }
                _12.submit(function (e) {
                    if (t) {
                        clearTimeout(t);
                    }
                    e.preventDefault();
                    if (false !== _c.apply(_12, [_3, _f])) {
                        if (false !== _5.apply(_12, [_3, _f])) {
                            if ($.isFunction(_3.target)) {
                                var str = _3.target.apply(_f, [_13.val(), _3]);
                                $(_f).html(str);
                                _f.editing = false;
                                _a.apply(_f, [_f.innerHTML, _3]);
                                if (!$.trim($(_f).html())) {
                                    $(_f).html(_3.placeholder);
                                }
                            } else {
                                var _17 = {};
                                _17[_3.name] = _13.val();
                                _17[_3.id] = _f.id;
                                if ($.isFunction(_3.submitdata)) {
                                    $.extend(_17, _3.submitdata.apply(_f, [_f.revert, _3]));
                                } else {
                                    $.extend(_17, _3.submitdata);
                                }
                                if ("PUT" == _3.method) {
                                    _17["_method"] = "put";
                                }
                                $(_f).html(_3.indicator);
                                var onError = function (xhr, _1b, _1c) {
                                    _e.apply(_12, [_3, _f, xhr]);
                                    if (_3.saveVal) {
                                        if (!_17[_3.name].length) {
                                            $(_f).html(_f.innerHTML);
                                        } else {
                                            _17[_3.name] = replaceAllBy(_17[_3.name], '<', '&#60;');
                                            _17[_3.name] = replaceAllBy(_17[_3.name], '>', '&#62;');
                                            /*
                                             _17[_3.name]=replaceAllBy(_17[_3.name],';','&#59;');
                                             _17[_3.name]=replaceAllBy(_17[_3.name],':','&#58;');
                                             _17[_3.name]=replaceAllBy(_17[_3.name],'=','&#61;');
                                             _17[_3.name]=replaceAllBy(_17[_3.name],'/','&#47;');
                                             _17[_3.name]=replaceAllBy(_17[_3.name],'&','&#38;');
                                             _17[_3.name]=replaceAllBy(_17[_3.name],'#','&#35;');
                                             */
                                            $(_f).html(_17[_3.name]);
                                        }
                                        _a.apply();
                                    }
                                };
//                                var _18 = {type: "POST", data: _17, dataType: "html", url: _3.target, success: function (_19, _1a) {
//                                    if (_18.dataType == "html") {
//                                        $(_f).html(_19);
//                                    }
//                                    _f.editing = false;
//                                    _a.apply(_f, [_19, _3]);
//                                    if (!$.trim($(_f).html())) {
//                                        $(_f).html(_3.placeholder);
//                                    }
//                                    if (_3.saveVal) {
//                                        if (!_17[_3.name].length) {
//                                            $(_f).html(_f.innerHTML);
//                                        } else {
//                                            $(_f).html(_17[_3.name]);
//                                        }
//                                        _a.apply();
//                                    }
//                                }, error: onError};
//                                $.extend(_18, _3.ajaxoptions);
//                                $.ajax(_18);
                                // Do't send ajax on submit
                                onError();
                            }
                        }
                    }
                    $(_f).attr("title", _3.tooltip);
                    return false;
                });
            });
            this.reset = function (_1d) {
                if (this.editing) {
                    if (false !== _d.apply(_1d, [_3, _f])) {
                        $(_f).html(_f.revert);
                        _f.editing = false;
                        if (!$.trim($(_f).html())) {
                            $(_f).html(_3.placeholder);
                        }
                        if (_3.tooltip) {
                            $(_f).attr("title", _3.tooltip);
                        }
                    }
                }
            };
        });
    };
    $.editable = {types: {defaults: {element: function (_1e, _1f) {
        var _20 = $("<input type=\"hidden\"></input>");
        $(this).append(_20);
        return (_20);
    }, content: function (_21, _22, _23) {
        $(":input:first", this).val(_21);
    }, reset: function (_24, _25) {
        _25.reset(this);
    }, buttons: function (_26, _27) {
        var _28 = this;
        if (_26.submit) {
            if (_26.submit.match(/>$/)) {
                var _29 = $(_26.submit).click(function () {
                    if (_29.attr("type") != "submit") {
                        _28.submit();
                    }
                });
            } else {
                var _29 = $("<button type=\"submit\" />");
                _29.html(_26.submit);
            }
            $(this).append(_29);
        }
        if (_26.cancel) {
            if (_26.cancel.match(/>$/)) {
                var _2a = $(_26.cancel);
            } else {
                var _2a = $("<button type=\"cancel\" />");
                _2a.html(_26.cancel);
            }
            $(this).append(_2a);
            $(_2a).click(function (_2b) {
                if ($.isFunction($.editable.types[_26.type].reset)) {
                    var _2c = $.editable.types[_26.type].reset;
                } else {
                    var _2c = $.editable.types["defaults"].reset;
                }
                _2c.apply(_28, [_26, _27]);
                return false;
            });
        }
    }}, text: {element: function (_2d, _2e) {
        var _2f = $("<input />");
        if (_2d.width != "none") {
            _2f.width(_2d.width);
        }
        if (_2d.height != "none") {
            _2f.height(_2d.height);
        }
        _2f.attr("autocomplete", "off");
        $(this).append(_2f);
        return (_2f);
    }}, textarea: {element: function (_30, _31) {
        var _32 = $("<textarea />");
        if (_30.rows) {
            _32.attr("rows", _30.rows);
        } else {
            if (_30.height != "none") {
                _32.height(_30.height);
            }
        }
        if (_30.cols) {
            _32.attr("cols", _30.cols);
        } else {
            if (_30.width != "none") {
                _32.width(_30.width);
            }
        }
        $(this).append(_32);
        return (_32);
    }}, select: {element: function (_33, _34) {
        var _35 = $("<select />");
        $(this).append(_35);
        return (_35);
    }, content: function (_36, _37, _38) {
        if (String == _36.constructor) {
            eval("var json = " + _36);
        } else {
            var _39 = _36;
        }
        for (var key in _39) {
            if (!_39.hasOwnProperty(key)) {
                continue;
            }
            if ("selected" == key) {
                continue;
            }
            var _3a = $("<option />").val(key).append(_39[key]);
            $("select", this).append(_3a);
        }
        $("select", this).children().each(function () {
            if ($(this).val() == _39["selected"] || $(this).text() == $.trim(_38.revert)) {
                $(this).attr("selected", "selected");
            }
        });
    }}}, addInputType: function (_3b, _3c) {
        $.editable.types[_3b] = _3c;
    }};
    $.fn.editable.defaults = {name: "value", id: "id", type: "text", width: "auto", height: "auto", event: "click.editable", onblur: "cancel", saveVal: false, loadtype: "GET", loadtext: "Loading...", placeholder: "Click to edit", loaddata: {}, submitdata: {}, ajaxoptions: {}};
})(jQuery);

