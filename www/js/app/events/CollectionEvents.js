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
		var rectMenu = document.querySelector( "#manage-menu").getBoundingClientRect();

		$('#manage-menu .sorter .button').each(function() {
			// var cloneButton = null;
			this.ontouchstart = function(event) {

				this.cloneButton=null;

				if(!$(this).hasClass('disabled')){
					//We add a fake button at his place to show it was here
					var landMark = $(this).clone();

					$(this).addClass("cloned");

					$(landMark).addClass('inDrag');
					this.cloneButton = landMark[0];

					
					$('#manage-menu').prepend(this.cloneButton);

					var rectMenu = document.querySelector( "#manage-menu").getBoundingClientRect();

					this.cloneButton.style.top = -1000 + "px";
					this.cloneButton.style.left = -1000 + "px";
				}
			}
			
			this.ontouchend = function(event) {
				if(this.cloneButton!=null){
					
					var type = isOverType(this.cloneButton);

					if( type != null) {

						var newType = type.getAttribute('type');
						var song = ResourcesHandler.getSong($(this).attr("data-song-id"));

						song.type = newType;

						$(this).attr('type', newType);
					} 

					$(this).removeClass('cloned');
					this.cloneButton.remove();
					this.cloneButton=null;
				}
			}

			this.ontouchmove = function(event) {

				if(this.cloneButton!=null){
					
					this.cloneButton.style.top = (event.touches[0].clientY - rectMenu.top) + "px";
					this.cloneButton.style.left = (event.touches[0].clientX - rectMenu.left) + "px";
				}

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