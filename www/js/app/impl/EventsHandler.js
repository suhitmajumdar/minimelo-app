define(function( require ) {


	function EventsHandler(){
	}

	EventsHandler.prototype.active = function(selector){

		selector.click(function(){
			$(selector).filter(".active").removeClass('active');
			$(this).addClass("active");
		})
	}

	return EventsHandler;

});