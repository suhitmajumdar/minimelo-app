define( function (require) {

	var ResourcesHandler = require('app/ResourcesHandler');

	function CollectionEvents() {
		this.dragAndDrop();
		this.sortCollection();
	}

	CollectionEvents.prototype.sortCollection = function () {
		var sorted_type = null;
		$('#sorting_colors .pool').click(function () {
			if( sorted_type == this.getAttribute('type') ) {
				$('#sorted_sounds .button').show();
			} else {
				sorted_type = this.getAttribute('type');
				$('#sorted_sounds .button').show();
				$('#sorted_sounds .button[type!=' + sorted_type + ']').hide();
			}

		});
	}

	CollectionEvents.prototype.dragAndDrop = function () {

		$('#manage-menu .button').each(function() {
			var defaultLocation = $(this).parent();

			this.ontouchstart = function(event) {
				$(this).addClass('inDrag');
				$('#manage-menu > div').append($(this));
				this.style.left = this.getBoundingClientRect().left;	
				this.style.top = this.getBoundingClientRect().top;	

			}
			
			this.ontouchend = function(event) {

				var type = isOverType(this);

				if( type != null) {
					// todo :change the location of the file
					var newType = type.getAttribute('type');
					var song = ResourcesHandler.getSong($(this).attr("data-song-id"));

					song.type = newType;

					$(this).attr('type', newType);
					$(this).appendTo(sorted_sounds);

				} else {
					$(this).appendTo(defaultLocation);
				}

				$(this).removeClass('inDrag');		
				this.style.top = "";
				this.style.left = "";	

			}

			this.ontouchmove = function(event) {

				var rectTimeline = document.querySelectorAll( "#manage-menu > div")[0].getBoundingClientRect();

				this.style.top = (event.touches[0].clientY - rectTimeline.top) + "px";
				this.style.left = (event.touches[0].clientX - rectTimeline.left + timeline.scrollLeft) + "px";

			}

		});
	}

	function isOverType( div ) {
		var divRect        = div.getBoundingClientRect();
		var centerYDiv     = divRect.top + divRect.height/2;
		var centerXDiv     = divRect.left + divRect.width/2;
		
		var types = sorting_colors.children;

		for (var i = types.length - 1; i >= 0; i--) {
			var typeRect = types[i].getBoundingClientRect();

			if( centerYDiv >= typeRect.top && centerYDiv <= typeRect.bottom && centerXDiv >= typeRect.left && centerXDiv <= typeRect.right ){
				return types[i];
			}
		}

		return null;
	}

	return CollectionEvents;

});