(function($) {
	"use strict";
	//callback($this)
	$.fn.animationTrigger = function(callback, onlyOnce) {

		return this.each(function() {

			// Store the object
			var $this = $(this);
			var trigger = function() {
				//console.log('test startAnimation: '+ $this.data('index'));
				if(onlyOnce) {
					var done = $this.data('isdone');
					if(done != 'true') {
						$this.data('isdone', 'true');

						callback($this);
					}
				} else {
					callback($this);
				}

			};
			// Perform counts when the element gets into view
			$this.waypoint(trigger, {
				offset: '100%',
				triggerOnce: true
			});
		});
	};

})(jQuery);