jQuery(document).ready(function($) {

	//导航自动悬浮
	var headerHeight = $('#headerdiv').height();
	$(window).scroll(function() {
		var scroH = $(window).scrollTop();
		if(scroH > 0 && scroH >= headerHeight) {
			$('#navdiv').addClass('navigationFixed');
			$('#navdiv').removeClass('navigation');

		} else {
			$('#navdiv').addClass('navigation');
			$('#navdiv').removeClass('navigationFixed');
		}
	});

	var loadingBar = $('#loadingBar');
	var newWidthValue = 1;
	var widthMax = 100;

	var firstLoad = false;
	var isAnimating = false;
	var outClass = 'pt-page-moveToRight';
	var inClass = 'pt-page-moveFromLeft';
	var endCurrPage = false,
		endNextPage = false;

	var dashboard = $('.navigation'),
		mainContent = $('.content-main');
	
	var animEndEventNames = {
		'WebkitAnimation': 'webkitAnimationEnd',
		'OAnimation': 'oAnimationEnd',
		'msAnimation': 'MSAnimationEnd',
		'animation': 'animationend'
	};
	// animation end event name
	var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

	//  console.log('animEndEventName:'+animEndEventName)
	var support = Modernizr.cssanimations;

	dashboard.on('click', 'a', function(event) {
		event.preventDefault();
		var target = $(this);
		//detect which section user has chosen
		sectionTarget = target.data('menu');

		if(sectionTarget != 'language') {

			$('title').text('RUIDA TECHNOLOGY ' + sectionTarget.toUpperCase());
			if(!isAnimating) {
				
				subpageutil.clearTimer();
				sliderUtil.clearTimer();

				//if user has selected a section different from the one alredy visible - load the new content
				triggerAnimation(sectionTarget, true);
			} else {
				//				console.log('is animating');
			}
		} else if(!isAnimating) {
			var lan = target.data('lan');
			i18nUtil.changeLanguage(lan);
		}
	});
	//语言导航
	$('.link-list').hover(function() {
		$(this).children('.navigation-link2').each(function() {
			$(this).css('display', 'block');
		});
	}, function() {
		$(this).children('.navigation-link2').each(function() {
			$(this).css('display', 'none');
		});
	});

	function triggerAnimation(newSection, bool) {
		isAnimating = true;
		newSection = (newSection == '') ? 'index' : newSection;

		initializeLoadingBar();

		loadNewContent(newSection, bool);
	}

	function loadNewContent(newSection, bool) {

		loadingBarAnimation();

		var sectionHeight = mainContent.data('height');

		var $currPage = mainContent.children().first();

		var $nextPage = $('<div class="cd-section ' + newSection + ' overflow-hidden hidden" ></div>').appendTo(mainContent);
		setTimeout(function() {

			$nextPage.load(newSection + '.html .cd-section > *', function(event) {

				loadingBar.velocity('stop').velocity({
					width: widthMax + 'vw',
				}, 400, function() {
					i18nUtil.initializeI18N($nextPage);
					var nextHeight = $nextPage.children('div:first-child').data('height');
					mainContent.data('height', nextHeight);

					resetMainContentSize(nextHeight);
					$currPage.addClass(outClass).on(animEndEventName, function() {
						$currPage.off(animEndEventName);

						if(newSection == 'index') {
							sliderUtil.init($nextPage);
						}
						console.log('1');

						endCurrPage = true;

						if(endNextPage) {
							onEndAnimation(newSection, $nextPage, nextHeight);
						} else {
							//$nextPage.prev('.cd-section').remove();
						}
					});

					$nextPage.removeClass('hidden').addClass(inClass).on(animEndEventName, function() {
						$nextPage.off(animEndEventName);
						endNextPage = true;

						//console.log('2');

						if(!endCurrPage) {
							//$nextPage.prev('.cd-section').remove();
						}

						onEndAnimation(newSection, $nextPage, nextHeight);
					});

					if(!support) {
						onEndAnimation(newSection, $nextPage, nextHeight);
					}
				});

				var url = newSection + '.html';
				if(url != window.location && bool) {
					window.history.pushState({
						path: url
					}, '', url);
				}
			});

		}, 10);
	}

	function onEndAnimation(newSectionName, $inpage, newHeight) {
		isAnimating = false;
		endCurrPage = false;
		endNextPage = false;
		console.log('onEndAnimation...');
		
        $inpage.prev('.cd-section').remove();

        $inpage.removeClass(inClass);
        
		resetLoadingBar();
		resetMainContentSize(newHeight);

		window.scrollTo(0, 0);

		if(newSectionName == 'index') {
			$('.counter').countUp();
			startShadeAnimation();
		} else {
			if(subpageutil != undefined) {
				subpageutil.initialize();
			}
		}
	}

	function resetMainContentSize(newHeight) {
		if(newHeight == '358vw') {
			mainContent.removeClass('height112');
			mainContent.addClass('height358');

		} else {
			mainContent.removeClass('height358');
			mainContent.addClass('height112');
		}
	}

	function initializeLoadingBar() {
		newWidthValue = 1;
		loadingBar.css({
			width: '1vw'
		}).removeClass('hidden');
	}

	function loadingBarAnimation() {
		if(newWidthValue + 5 < widthMax / 2) {
			newWidthValue = newWidthValue + 1;
		} else if(newWidthValue + 0.2 < widthMax) {
			newWidthValue = newWidthValue + 0.2;
		}

		loadingBar.velocity({
			width: newWidthValue + 'vw'
		}, 100, loadingBarAnimation);
	}
	//触发main shade 动画
	function startShadeAnimation() {
		animationUtil.startMainAnimation();
	}

	function resetLoadingBar() {
		loadingBar.addClass('hidden');
	}
});

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

				animationUtil.startSubHideAnimation($currSection);

				setTimeout(function() {
					$nextSection.removeClass('hidden');

					animationUtil.showSubPageAnimation($nextSection);

					$nextSection.prev('.sub-section').remove();

					_onEndAnimation($currSection, $nextSection);

				}, 800);

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

var sliderUtil = (function() {
	var videoLoaded = false;
	var waitTimes = 0;
	var sliderTimer;
	var $pages;
	var myVideo;
	var outClass = 'pt-page-flipOutRight';
	var inClass = 'pt-page-flipInLeft pt-page-delay500';
	var animEndEventName = animationUtil.getAnimEndEventName();
	var endCurrPage = false;
	var endNextPage = false;
	var pagesCount = 2;
	var current = 0;
	var isAnimating;
	var isPausing;
	var $dashbord;

	function _init($maindashbord) {
		if($dashbord!=undefined){
			$dashbord = $maindashbord;
		}else{
			$dashbord = $('.main');
		}
		$pages = $dashbord.find('.slide-page');
		myVideo = $dashbord.find('#myVideo').get(0);
		endCurrPage = false;
		endNextPage = false;
		pagesCount = 2;
		current = 0;
		isAnimating = false;
		isPausing = false;
		waitTimes = 0;
		$dashbord.find(".main-industryvideobox").hover(function() {
			isPausing = true;
			//console.log('isPausing = true...');
		}, function() {
			isPausing = false;
			//console.log('isPausing = false...');
		});
		//				
		$pages.each(function() {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class'));
		});

		$pages.eq(0).addClass('slide-page-current');

		if(!videoLoaded) {
			myVideo.oncanplay = function() {
				
				//console.log('start timer1...');
				
				videoLoaded = true;
				//console.log('视频加载完成');
				sliderTimer = setInterval(startSlipTimer, 8 * 1000);
			};
		} else {
			//console.log('start timer2...');
			sliderTimer = setInterval(startSlipTimer, 8 * 1000);
		}

	}

	function startSlipTimer() {
		if(current == 1 && waitTimes < 2) {
			waitTimes++;
			return;
		} else {
			waitTimes = 0;
		}
		if(!isAnimating && !isPausing) {
			isAnimating = true;
            
			var $currPage = $pages.eq(current);
			if(current < pagesCount - 1) {
				++current;
			} else {
				current = 0;
			}
            //console.log('slip to..'+current);
            
			if(current == 1) {
				//					$dashbord.css('height', '56vw');
				myVideo.play();
			} else {
				//					$dashbord.css('height', '58vw');
				myVideo.pause();
			}
			var $nextPage = $pages.eq(current).addClass('slide-page-current');
			$currPage.addClass(outClass).on(animEndEventName, function() {
				$currPage.off(animEndEventName);
				endCurrPage = true;
				if(endNextPage) {
					onEndAnimation($currPage, $nextPage);
				}
			});
			$nextPage.addClass(inClass).on(animEndEventName, function() {
				$nextPage.off(animEndEventName);
				endNextPage = true;

				onEndAnimation($currPage, $nextPage);

			});
		}
	}

	function onEndAnimation($outpage, $inpage) {

		endCurrPage = false;
		endNextPage = false;
		isAnimating = false;

		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' slide-page-current');

	}
	return {
		init: function($dashbord) {
			_init($dashbord);
		},
		clearTimer: function() {
			if(sliderTimer != undefined) {
				isAnimating = true;
				clearInterval(sliderTimer);
			}
		}
	};
})();