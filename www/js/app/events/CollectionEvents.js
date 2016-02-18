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

		$('#manage-menu > div[id] .button').each(function() {
			var cloneButton = null;
			this.ontouchstart = function(event) {
				if(!$(this).hasClass('disabled')){
					//We add a fake button at his place to show it was here
					var landMark = $(this).clone();

					$(this).addClass("cloned");

					$(landMark).addClass('inDrag');
					if(cloneButton==null){
						$('#manage-menu').prepend(landMark);
						console.log("clonning");
						cloneButton = landMark[0];
					}
					var rectMenu = document.querySelector( "#manage-menu").getBoundingClientRect();

					cloneButton.style.top = (event.touches[0].clientY - rectMenu.top) + "px";
					cloneButton.style.left = (event.touches[0].clientX - rectMenu.left) + "px";
				}
			}
			
			this.ontouchend = function(event) {

				var type = isOverType(cloneButton);

				if( type != null) {
					// todo :change the location of the file
					var newType = type.getAttribute('type');
					var song = ResourcesHandler.getSong($(this).attr("data-song-id"));

					song.type = newType;

					$(this).attr('type', newType);
					$(this).appendTo(sorted_sounds);

				} 

				$(this).removeClass('cloned');
				$(this).removeClass('inDrag');		

				console.log("killing clone")
				cloneButton.remove();
				cloneButton=null;

			}

			this.ontouchmove = function(event) {

				var rectMenu = document.querySelector( "#manage-menu").getBoundingClientRect();

				this.cloneButton.style.top = (event.touches[0].clientY - rectMenu.top) + "px";
				this.cloneButton.style.left = (event.touches[0].clientX - rectMenu.left) + "px";

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