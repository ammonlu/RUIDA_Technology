var animationUtil={
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
};
