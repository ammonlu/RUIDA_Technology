var i18nUtil = (function() {
	//cookie name
	var _language = 'i18n_language';

    /**
     * @param {Object} lan
     * @param {Object} $dashboard
     */
	function _changeLanguage(lan, $dashboard) {
		if(lan == 'zh') {
			_changeLanguageZh($dashboard);
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
						console.log($(this).data("locale"));
						$(this).html($.i18n.prop($(this).data("locale")));
					});
				} else {
					$("[data-locale]").each(function() {
						console.log($(this).data("locale"));
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
	//cookie end
	return {
		initializeI18N:function($dashboard) {
			var lan = _getCookie(_language);
			_changeLanguage(lan);
		},
		changeLanguage:function(lan) {		
			if(lan==undefined){
				var _lan = _getCookie(_language);
				if(_lan =='en'){
					_setCookie(_language, 'zh');
					_changeLanguage('zh');
				}else {
					_setCookie(_language, 'en');
					_changeLanguage('en');
				}
			}else{
				_setCookie(_language, lan);			
				_changeLanguage(lan); 
			}
		}
	};
})();