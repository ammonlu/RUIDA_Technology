var animationUtil={
	getAnimEndEventName:function() {
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
	startMainAnimation:function(){
		
		var shadedone = false;
		//main S型遮罩动画
		$(".shadecommon").animationTrigger(function($this) {
			if(!shadedone){
				shadedone = true;
				$(".shadecommon").each(function() {
					$(this).css('width', '32.5vw');
				});
			}
		},true);
		
		//*******************************
		//3横线 动画**********************
		$(".laddershaped").animationTrigger(function($this) {
			$this.css('opacity', '1');
		},true);
		$(".ladder1").animationTrigger(function($this) {
			$this.css('width', '9.5vw');
		},true);
		$(".ladder2").animationTrigger(function($this) {
			$this.css('width', '8.5vw');
		},true);
		$(".ladder3").animationTrigger(function($this) {
			$this.css('width', '7.5vw');
		},true);
		//***********************************
		
		//*********main 文字动画****************
		$(".titlemoveL").animationTrigger(function($this) {
			$this.css('margin-left', '0vw');
		},true);
		$(".textContentMoveL").animationTrigger(function($this) {
			$this.css('margin-left', '0vw');
		},true);
		$(".textModuleMoveR").animationTrigger(function($this) {
			$this.css('margin-right', '1vw');
		},true);
		$(".textModuleMoveL").animationTrigger(function($this) {
			$this.css('margin-left', '1vw');
		},true);
		//*************************************
		
		$(".imgmoveL").animationTrigger(function($this) {
			
			$this.css('padding-right', '0vw');
		},true);
		$(".imgmoveR").animationTrigger(function($this) {
			$this.css('padding-left', '0vw');
		},true);
	},
	_startHideAnimation:function($div, animEndEventName, anClass){
		$div.addClass(anClass).on(animEndEventName, function(){
			$div.off(animEndEventName);
		});
	},
	_startShowAnimation:function($div, animEndEventName, anClass){
		$div.addClass(anClass).on(animEndEventName, function(){
			$div.off(animEndEventName);
			$div.removeClass(anClass);
		});
	},
	startSubHideAnimation:function($section){
		var moveToRight = 'pt-page-moveToRight';
		var moveToLeft = 'pt-page-moveToLeft';
		var animEndEventName = animationUtil.getAnimEndEventName();
		animationUtil._startHideAnimation($section.find('.type-bar').first(),animEndEventName, moveToLeft);
		animationUtil._startHideAnimation($section.find('.instructionTitle').first(),animEndEventName, moveToRight);
		animationUtil._startHideAnimation($section.find('.instruction').first(),animEndEventName, moveToRight);
		animationUtil._startHideAnimation($section.find('.instruction-imgDiv').first(),animEndEventName, moveToLeft);
		animationUtil._startHideAnimation($section.find('.dataSubjectdiv').first(),animEndEventName, moveToRight);
		animationUtil._startHideAnimation($section.find('.dataDetailDiv').first(),animEndEventName, moveToLeft);
	}, 
	showSubPageAnimation:function($section){
		var moveFromRight = 'pt-page-moveFromRight';
		var moveFromLeft = 'pt-page-moveFromLeft';
		var animEndEventName = animationUtil.getAnimEndEventName();
		animationUtil._startShowAnimation($section.find('.type-bar').first(),animEndEventName, moveFromLeft);
		animationUtil._startShowAnimation($section.find('.instructionTitle').first(),animEndEventName, moveFromRight);
		animationUtil._startShowAnimation($section.find('.instruction').first(),animEndEventName, moveFromRight);
		animationUtil._startShowAnimation($section.find('.instruction-imgDiv').first(),animEndEventName, moveFromLeft);
		animationUtil._startShowAnimation($section.find('.dataSubjectdiv').first(),animEndEventName, moveFromRight);
		animationUtil._startShowAnimation($section.find('.dataDetailDiv').first(),animEndEventName, moveFromLeft);
	}
};
 