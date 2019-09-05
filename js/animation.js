var animationUtil={
	startMainAnimation:function(){
		
		//main S型遮罩动画
		$(".shadecommon").each(function() {
			$(this).css('width', '32.5vw');
		});
		//*******************************
		//3横线 动画**********************
		$(".laddershaped").each(function() {
			$(this).css('opacity', '1');
		});
		$(".ladder1").each(function() {
			$(this).css('width', '9.5vw');
		});
		$(".ladder2").each(function() {
			$(this).css('width', '8.5vw');
		});
		$(".ladder3").each(function() {
			$(this).css('width', '7.5vw');
		});
		//***********************************
		
		//*********main 文字动画****************
		$(".titlemoveL").each(function() {
			$(this).css('margin-left', '0vw');
		});
		$(".textContentMoveL").each(function() {
			$(this).css('margin-left', '0vw');
		});
		$(".textModuleMoveR").each(function() {
			$(this).css('margin-right', '1vw');
		});
		$(".textModuleMoveL").each(function() {
			$(this).css('margin-left', '1vw');
		});
		//*************************************
		
		$(".imgmoveL").each(function() {
			
			$(this).css('padding-right', '0vw');
		});
		$(".imgmoveR").each(function() {
			$(this).css('padding-left', '0vw');
		});
	},
};
