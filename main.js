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
	var outClass, inClass;
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

				if(subpageutil != undefined) {
					subpageutil.clearTimer();
				}
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
		setRandomAnimation();

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

						console.log('1');

						endCurrPage = true;

						if(endNextPage) {
							onEndAnimation(newSection, $nextPage, nextHeight);
						} else {
							$nextPage.prev('.cd-section').remove();
						}
					});

					$nextPage.removeClass('hidden').addClass(inClass).on(animEndEventName, function() {
						$nextPage.off(animEndEventName);
						endNextPage = true;

						//console.log('2');

						if(!endCurrPage) {
							$nextPage.prev('.cd-section').remove();
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

		resetLoadingBar();
		resetMainContentSize(newHeight);

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

	var animationArrayList = [32, 44, 46, 62, 63, 67];

	function setRandomAnimation() {
		var animation = 2; //animationArrayList[Math.round(Math.random() * (animationArrayList.length - 1))];
		//	    var animation = Math.floor(Math.random() * 67) + 1;
		//	    console.log('animation no. '+animation);

		switch(animation) {

			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 3:
				outClass = 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 4:
				outClass = 'pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 5:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 6:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 7:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 8:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 9:
				outClass = 'pt-page-moveToLeftFade';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 10:
				outClass = 'pt-page-moveToRightFade';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 11:
				outClass = 'pt-page-moveToTopFade';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 12:
				outClass = 'pt-page-moveToBottomFade';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 13:
				outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
				inClass = 'pt-page-moveFromRight';
				break;
			case 14:
				outClass = 'pt-page-moveToRightEasing pt-page-ontop';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 15:
				outClass = 'pt-page-moveToTopEasing pt-page-ontop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 16:
				outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
				inClass = 'pt-page-moveFromTop';
				break;
			case 17:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 18:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 19:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 20:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 21:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-scaleUpDown pt-page-delay300';
				break;
			case 22:
				outClass = 'pt-page-scaleDownUp';
				inClass = 'pt-page-scaleUp pt-page-delay300';
				break;
			case 23:
				outClass = 'pt-page-moveToLeft pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 24:
				outClass = 'pt-page-moveToRight pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 25:
				outClass = 'pt-page-moveToTop pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 26:
				outClass = 'pt-page-moveToBottom pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 27:
				outClass = 'pt-page-scaleDownCenter';
				inClass = 'pt-page-scaleUpCenter pt-page-delay400';
				break;
			case 28:
				outClass = 'pt-page-rotateRightSideFirst';
				inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
				break;
			case 29:
				outClass = 'pt-page-rotateLeftSideFirst';
				inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
				break;
			case 30:
				outClass = 'pt-page-rotateTopSideFirst';
				inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
				break;
			case 31:
				outClass = 'pt-page-rotateBottomSideFirst';
				inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
				break;
			case 32:
				outClass = 'pt-page-flipOutRight';
				inClass = 'pt-page-flipInLeft pt-page-delay500';
				break;
			case 33:
				outClass = 'pt-page-flipOutLeft';
				inClass = 'pt-page-flipInRight pt-page-delay500';
				break;
			case 34:
				outClass = 'pt-page-flipOutTop';
				inClass = 'pt-page-flipInBottom pt-page-delay500';
				break;
			case 35:
				outClass = 'pt-page-flipOutBottom';
				inClass = 'pt-page-flipInTop pt-page-delay500';
				break;
			case 36:
				outClass = 'pt-page-rotateFall pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 37:
				outClass = 'pt-page-rotateOutNewspaper';
				inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
				break;
			case 38:
				outClass = 'pt-page-rotatePushLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 39:
				outClass = 'pt-page-rotatePushRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 40:
				outClass = 'pt-page-rotatePushTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 41:
				outClass = 'pt-page-rotatePushBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 42:
				outClass = 'pt-page-rotatePushLeft';
				inClass = 'pt-page-rotatePullRight pt-page-delay180';
				break;
			case 43:
				outClass = 'pt-page-rotatePushRight';
				inClass = 'pt-page-rotatePullLeft pt-page-delay180';
				break;
			case 44:
				outClass = 'pt-page-rotatePushTop';
				inClass = 'pt-page-rotatePullBottom pt-page-delay180';
				break;
			case 45:
				outClass = 'pt-page-rotatePushBottom';
				inClass = 'pt-page-rotatePullTop pt-page-delay180';
				break;
			case 46:
				outClass = 'pt-page-rotateFoldLeft';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 47:
				outClass = 'pt-page-rotateFoldRight';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 48:
				outClass = 'pt-page-rotateFoldTop';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 49:
				outClass = 'pt-page-rotateFoldBottom';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 50:
				outClass = 'pt-page-moveToRightFade';
				inClass = 'pt-page-rotateUnfoldLeft';
				break;
			case 51:
				outClass = 'pt-page-moveToLeftFade';
				inClass = 'pt-page-rotateUnfoldRight';
				break;
			case 52:
				outClass = 'pt-page-moveToBottomFade';
				inClass = 'pt-page-rotateUnfoldTop';
				break;
			case 53:
				outClass = 'pt-page-moveToTopFade';
				inClass = 'pt-page-rotateUnfoldBottom';
				break;
			case 54:
				outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomLeftIn';
				break;
			case 55:
				outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomRightIn';
				break;
			case 56:
				outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomTopIn';
				break;
			case 57:
				outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomBottomIn';
				break;
			case 58:
				outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeLeftIn';
				break;
			case 59:
				outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeRightIn';
				break;
			case 60:
				outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeTopIn';
				break;
			case 61:
				outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeBottomIn';
				break;
			case 62:
				outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselLeftIn';
				break;
			case 63:
				outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselRightIn';
				break;
			case 64:
				outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselTopIn';
				break;
			case 65:
				outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselBottomIn';
				break;
			case 66:
				outClass = 'pt-page-rotateSidesOut';
				inClass = 'pt-page-rotateSidesIn pt-page-delay200';
				break;
			case 67:
				outClass = 'pt-page-rotateSlideOut';
				inClass = 'pt-page-rotateSlideIn';
				break;

		}
	}
})