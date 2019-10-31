var i18nUtil = (function() {
	//cookie name
	var _language = 'i18n_language';

	/**
	 * @param {Object} lan
	 * @param {Object} $dashboard
	 */
	function _changeLanguage(lan, $dashboard) {
		_changeLanguageLink(lan);
		_changeFont(lan, $dashboard);
		//_changePosition(lan);

		if(lan == 'zh') {
			_changeLanguageZh($dashboard);
		} else if(lan == 'ru') {
			_changeLanguageRU($dashboard);
		} else {
			_changeLanguageEn($dashboard);
		}
	}
	//i18n.properties function
	function _changeLanguageEn($dashboard) {
		$.i18n.properties({
			name: 'language', //属性文件名     命名格式： 文件名_国家代号.properties             
			path: 'i18n/', //注意这里路径是你属性文件的所在文件夹          
			mode: 'map',
			language: 'en', //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
			callback: function() {
				if($dashboard != undefined && $dashboard != null) {
					$dashboard.find("[data-locale]").each(function() {
						//						console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				} else {
					$("[data-locale]").each(function() {
						//						console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				}
			}
		});
	}

	function _changeLanguageZh($dashboard) {
		$.i18n.properties({
			name: 'language', //属性文件名     命名格式： 文件名_国家代号.properties             
			path: 'i18n/', //注意这里路径是你属性文件的所在文件夹          
			mode: 'map',
			language: 'zh', //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
			callback: function() {
				if($dashboard != undefined && $dashboard != null) {
					$dashboard.find("[data-locale]").each(function() {
						//console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				} else {
					$("[data-locale]").each(function() {
						//console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				}
			}
		});
	}

	function _changeLanguageRU($dashboard) {
		$.i18n.properties({
			name: 'language', //属性文件名     命名格式： 文件名_国家代号.properties             
			path: 'i18n/', //注意这里路径是你属性文件的所在文件夹          
			mode: 'map',
			language: 'ru', //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
			callback: function() {
				if($dashboard != undefined && $dashboard != null) {
					$dashboard.find("[data-locale]").each(function() {
						//console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				} else {
					$("[data-locale]").each(function() {
						//console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				}
			}
		});
	}

	//cookie option
	function _getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	function _setCookie(name, value) {
		var strsec = 24 * 60 * 60 * 1000;
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec * 1);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	function _changeLanguageLink(lan) {
		var lanDiv = $('#languagelink');
		var current = lanDiv.children().first();
		var cur_lan = current.data('lan');
		if(cur_lan != lan) {
			var cur_local = current.data('locale');

			lanDiv.children().each(function() {
				var data_lan = $(this).data('lan');

				if(data_lan == lan) {
					var style1 = $(this).attr('style');
					//					console.log('style: ' + style1);

					var data_local = $(this).data('locale');

					$(this).data('lan', cur_lan);
					$(this).data('locale', cur_local);
					$(this).attr('style', current.attr('style'));

					current.data('lan', lan);
					current.data('locale', data_local);
					current.attr('style', style1);

					return false;
				}
			});
		}
	}
	var fonts = ['font-nav-',
		'font-industry-',
		'font-industrydes-',
		'font-mian-module-',
		'font-mainT-',
		'font-main-description-',
		'font-submodule-',
		'font-sub-nav-',
		'font-sub-type-',
		'font-sub-typedes-'
	];

	function _changeFont(lan, $dashboard) {
		if($dashboard != undefined && $dashboard != null) {
			for(var i in fonts) {
				var f = fonts[i];
				$dashboard.find("[class*='" + f + "']").each(function() {
					//console.log($(this).text());
					//console.log($(this).attr('class'));

					$(this).removeFontClass().addClass(f + lan);

					//console.log($(this).attr('class'));
				});
			}
		} else {
			for(var i in fonts) {
				var f = fonts[i];
				$("[class*='" + f + "']").each(function() {
//					console.log($(this).text());
//					console.log($(this).attr('class'));

					$(this).removeFontClass().addClass(f + lan);

					//console.log($(this).attr('class'));
				});
			}
		}

	}

	function _changePosition(lan) {
		var obliqueline = $('#obliqueline-box1');
		if(obliqueline != undefined && obliqueline != null) {
			if(lan == 'ru') {
				obliqueline.css('margin-top', '38vw');
			} else {
				obliqueline.css('margin-top', '25vw');
			}
		}
	}
	return {
		initializeI18N: function($dashboard) {
			var lan = _getCookie(_language);
			_changeLanguage(lan, $dashboard);
		},
		changeLanguage: function(lan) {
			if(lan == undefined) {
				var _lan = _getCookie(_language);
				if(_lan == 'en') {
					_setCookie(_language, 'zh');
					_changeLanguage('zh');
				} else {
					_setCookie(_language, 'en');
					_changeLanguage('en');
				}
			} else {
				_setCookie(_language, lan);
				_changeLanguage(lan);
			}
		},
	};
})();
var animationUtil = (function() {
	function _startHideAnimation($div, animEndEventName, anClass) {
		$div.addClass(anClass).on(animEndEventName, function() {
			$div.off(animEndEventName);
		});
	}

	function _startShowAnimation($div, animEndEventName, anClass) {
		$div.addClass(anClass).on(animEndEventName, function() {
			$div.off(animEndEventName);
			$div.removeClass(anClass);
		});
	}
	return {
		getAnimEndEventName: function() {
			var animEndEventNames = {
				'WebkitAnimation': 'webkitAnimationEnd',
				'OAnimation': 'oAnimationEnd',
				'msAnimation': 'MSAnimationEnd',
				'animation': 'animationend'
			};
			// animation end event name
			var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
			return animEndEventName;
		},
		startMainAnimation: function() {

			var shadedone = false;
			//main S型遮罩动画
			$(".shadecommon").animationTrigger(function($this) {
				if(!shadedone) {
					shadedone = true;
					$(".shadecommon").each(function() {
						$(this).css('width', '32.5vw');
					});
				}
			}, true);

			//*******************************
			//3横线 动画**********************
			$(".laddershaped").animationTrigger(function($this) {
				$this.css('opacity', '1');
			}, true);
			$(".ladder1").animationTrigger(function($this) {
				$this.css('width', '9.5vw');
			}, true);
			$(".ladder2").animationTrigger(function($this) {
				$this.css('width', '8.5vw');
			}, true);
			$(".ladder3").animationTrigger(function($this) {
				$this.css('width', '7.5vw');
			}, true);
			//***********************************

			//*********main 文字动画****************
			$(".titlemoveL").animationTrigger(function($this) {
				$this.css('margin-left', '0vw');
			}, true);
			$(".textContentMoveL").animationTrigger(function($this) {
				$this.css('margin-left', '0vw');
			}, true);
			$(".textModuleMoveR").animationTrigger(function($this) {
				$this.css('margin-right', '1vw');
			}, true);
			$(".textModuleMoveL").animationTrigger(function($this) {
				$this.css('margin-left', '1vw');
			}, true);
			//*************************************

			$(".imgmoveL").animationTrigger(function($this) {

				$this.css('padding-right', '0vw');
			}, true);
			$(".imgmoveR").animationTrigger(function($this) {
				$this.css('padding-left', '0vw');
			}, true);
		},

		startSubHideAnimation: function($section) {
			var moveToRight = 'pt-page-moveToRight';
			var moveToLeft = 'pt-page-moveToLeft';
			var animEndEventName = animationUtil.getAnimEndEventName();
			_startHideAnimation($section.find('.type-bar').first(), animEndEventName, moveToLeft);
			_startHideAnimation($section.find('.instructionTitle').first(), animEndEventName, moveToRight);
			_startHideAnimation($section.find('.instruction').first(), animEndEventName, moveToRight);
			_startHideAnimation($section.find('.instruction-imgDiv').first(), animEndEventName, moveToLeft);
			_startHideAnimation($section.find('.dataSubjectdiv').first(), animEndEventName, moveToRight);
			_startHideAnimation($section.find('.dataDetailDiv').first(), animEndEventName, moveToLeft);
		},
		showSubPageAnimation: function($section) {
			var moveFromRight = 'pt-page-moveFromRight';
			var moveFromLeft = 'pt-page-moveFromLeft';
			var animEndEventName = animationUtil.getAnimEndEventName();
			_startShowAnimation($section.find('.type-bar').first(), animEndEventName, moveFromLeft);
			_startShowAnimation($section.find('.instructionTitle').first(), animEndEventName, moveFromRight);
			_startShowAnimation($section.find('.instruction').first(), animEndEventName, moveFromRight);
			_startShowAnimation($section.find('.instruction-imgDiv').first(), animEndEventName, moveFromLeft);
			_startShowAnimation($section.find('.dataSubjectdiv').first(), animEndEventName, moveFromRight);
			_startShowAnimation($section.find('.dataDetailDiv').first(), animEndEventName, moveFromLeft);
		}
	};
})();