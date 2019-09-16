var subpageutil = (function() {
	var timer = null;
	var isAnimation = false;
	var isPausing = false;
	var imgCount = 0;
	var animEndEventName = _getAnimEndEventName();
	var mainContent;
	var outClass = 'pt-page-moveToRight';
	var inclass = 'pt-page-moveFromLeft';
	var endCurrPage = false;
	var endNextPage = false;
	var support = Modernizr.cssanimations;
	var loadingBar = $('#loadingBar');
	var isAnimating = false;
	var widthMax = 100;

	function _initImgEvent() {
		$(".item-img-box").hover(function() {
			isPausing = true;
		}, function() {
			isPausing = false;
		});

		$(".item-img-box").click(function() {
			if(!isAnimation) {
				isAnimation = true;
				_showImg($(this));
			}
		});
	};

	function _initSubNavationEvent() {
		var submenu = $('.submenu');

		submenu.on('click', 'li', function(event) {
			event.preventDefault();
			var target = $(this);
			var sectionTarget = target.data('menu');
			if(!isAnimating && sectionTarget != undefined) {
				isAnimating = true;

				subpageutil.clearTimer();

				_loadNewContent(sectionTarget);
			}
		});
	};

	function _loadNewContent(newSection) {
		mainContent = $('.sub-main');
		var $currSection = mainContent.children().first();
		var $nextSection = $('<div class="sub-section  overflow-hidden hidden" ></div>').appendTo(mainContent);
		initializeLoadingBar();
		loadingBarAnimation();

		$nextSection.load(newSection + '.html .sub-section > *', function(event) {

			loadingBar.velocity('stop').velocity({
				width: widthMax + 'vw',
			}, 400, function() {

				i18nUtil.initializeI18N($nextSection.children().first());

//				$currSection.addClass(outClass).on(animEndEventName, function() {
//					$currSection.off(animEndEventName);
//
//					console.log('1');
//
//					endCurrPage = true;
//
//					if(endNextPage) {
//						_onEndAnimation($currSection, $nextSection);
//					} else {
//						$nextSection.prev('.sub-section').remove();
//					}
//				});

				animationUtil.startSubHideAnimation($currSection);

				setTimeout(function(){
					$nextSection.removeClass('hidden');
					
					animationUtil.showSubPageAnimation($nextSection);
					
					$nextSection.prev('.sub-section').remove();
					
					_onEndAnimation($currSection, $nextSection);
					
				}, 800);
//				$nextSection.removeClass('hidden').addClass(inclass).on(animEndEventName, function() {
//					$nextSection.off(animEndEventName);
//					endNextPage = true;
//
//					console.log('2');
//
//					$nextSection.prev('.sub-section').remove();
//
//					_onEndAnimation($currSection, $nextSection);
//				});

				if(!support) {
					$nextSection.prev('.sub-section').remove();
					_onEndAnimation($currSection, $nextSection);
				}

			});
		});
	};

	function _onEndAnimation($currentSection, $nextSection) {
		isAnimating = false;

		subpageutil.initializeImgEvent();

		resetLoadingBar();
	};

	function initializeLoadingBar() {
		newWidthValue = 1;
		loadingBar.css({
			width: '1vw'
		}).removeClass('hidden');
	};

	function loadingBarAnimation() {
		if(newWidthValue + 5 < widthMax / 2) {
			newWidthValue = newWidthValue + 1;
		} else if(newWidthValue + 0.2 < widthMax) {
			newWidthValue = newWidthValue + 0.2;
		}

		loadingBar.velocity({
			width: newWidthValue + 'vw'
		}, 100, loadingBarAnimation);
	};

	function resetLoadingBar() {
		loadingBar.addClass('hidden');
	};

	function _slidImage() {
		if(!isAnimation) {
			isAnimation = true;
			var $list = $('.item-img-list');
			var selectedIndex = $list.children().index($('.item-img-selected'));
			if(imgCount > 3) {
				$list.children('.item-img-selected').each(function() {
					$(this).removeClass('item-img-selected');
				});
				var $first = $list.children().first();

				$first.addClass('item-img-moveToLeft').on(animEndEventName, function() {
					$first.off(animEndEventName);

					$first.detach().removeClass('item-img-moveToLeft').appendTo($list);

					_showImg($list.children().eq(selectedIndex == -1 ? 0 : selectedIndex));
				});
			} else {
				selectedIndex = (selectedIndex + 1) % imgCount;
				_showImg($list.children().eq(selectedIndex == -1 ? 0 : selectedIndex));
			}
		}
	};

	function _showImg($this) {

		var imgPath = $this.find('.img-item img').attr('src')
		$('.item-img-list').children('.item-img-selected').each(function() {
			$(this).removeClass('item-img-selected');
		});
		$this.addClass('item-img-selected');

		var nextStage = $('.img-stage-l').children(':not(.img-stage-selected)');
		var currentStage = $('.img-stage-l').children('.img-stage-selected');

		nextStage.empty();
		nextStage.append('<img src=' + imgPath + ' />');
		nextStage.addClass('img-stage-selected');
		currentStage.removeClass('img-stage-selected');

		isAnimation = false;
	};

	function _getAnimEndEventName() {
		var animEndEventNames = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		};
		// animation end event name
		var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
		return animEndEventName;
	};

	function _startTimer() {
		if(!isPausing) {
			_slidImage();
		}
	};

	return {
		getAnimEndEventName: function() {
			return _getAnimEndEventName();
		},

		clearTimer: function() {
			if(timer != undefined) {
				isAnimating = true;
				clearInterval(timer);
			}
		},
		initializeImgEvent: function() {
			imgCount = $('.item-img-list').children().length;
			isAnimation = false;
			isPausing = false;
			_initImgEvent();
			isAnimating = false;
			mainContent = $('.sub-main');
			timer = setInterval(_startTimer, 7 * 1000)
		},
		initialize: function() {
			isAnimating = false;
			
			subpageutil.initializeImgEvent($('.sub-section'));

			_initSubNavationEvent();
		},
	};
})();