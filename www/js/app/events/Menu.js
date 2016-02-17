define(function( require ) {

	var CollectionEvents = require('events/CollectionEvents');
	var ResourcesHandler = require('app/ResourcesHandler');


	var ui = null
	var events = null
	var modifiedCollection = false;
	function Menu( eventsHandler ) {

		this.selectedSaveToLoad = null;
		events = eventsHandler;
		ui = eventsHandler.uiHandler;

		var self = this;
		$('#general-menu-button')       .click( self.openGeneralMenu );
		$('#general-menu-help')         .click( self.openGeneralMenuHelp );

		$('#general-menu-overlay').click(function(){
			if(!$("#overlay-traitement").hasClass("active"))
				self.closeGeneralMenu();
		});

		$('#export-menu-validate')      .click( self.exportComposition );
		$('#new-menu-validate')         .click(function(){ self.newComposition() });
		$('#general-menu .sub-menu-btn').click( function () { self.openSubMenu($(this).attr('menu')) });
		$("#success-export-validate").click(self.closeGeneralMenu);
	}

	Menu.prototype.openGeneralMenu = function(){
		$('#general-menu').addClass('active');
		$('#general-menu-overlay').addClass('active');
	}

	Menu.prototype.openGeneralMenuHelp = function(){
		$('#general-menu').toggleClass('helpActive');
	}

	Menu.prototype.closeGeneralMenu = function() {
		$('#general-menu').removeClass('helpActive').removeClass('active');
		$('#general-menu-overlay').removeClass('active');
		$('.sub-menu').removeClass('active');

		if ( modifiedCollection == true ) {
			reloadSoundElements();
			modifiedCollection = false;
		}
	}
	Menu.prototype.exportComposition = function (){
		var name = $('#export-menu-input').val();
		if(name!=null && name!=""){
			$("#overlay-traitement").addClass("active");
			$("#export-menu").removeClass("active");
			var Export = require('app/Export');
			var exportTimeline = new Export();
            exportTimeline.exportMp3(name+".mp3");
		}
		else{
			alert("Donnez un nom à votre musique")
		}
	}

	Menu.prototype.newComposition = function (){
		//On vide la timeline
		$(".track").empty();
		$("#export-menu-input").val("");
		this.closeGeneralMenu();

	}

	Menu.prototype.launchRecordView = function (){
		//alert('Penser à aller sur la vue de record')
        $('.panel').removeClass('active');
        $('#panel-record').addClass('active');
        this.closeGeneralMenu();
	}

	Menu.prototype.launchSoundManagementView = function (){
		alert('Penser à aller sur la vue de management de records')
	}

	Menu.prototype.openSubMenu = function (menuName){
		$('.sub-menu').removeClass('active');
		$('#general-menu *[menu]').addClass('active');
		$('#general-menu *[menu=' + menuName + ']').addClass('active');
		$('#'+menuName).addClass('active');
		this.loadSubMenu( menuName );
	}

	Menu.prototype.displayCollectionManager = function () {
		ui.initCollectionManager();
		new CollectionEvents();
	}

	Menu.prototype.loadSubMenu = function (name){
		switch(name){
			case 'new-menu':
				break;
			case 'micro-menu':
            	this.launchRecordView();
				break;
			case 'manage-menu':
				this.displayCollectionManager();
				modifiedCollection = true;
				break;
		}
	}

	function reloadSoundElements () {
		ResourcesHandler.postProcessing();
		ui.reloadSoundElements();
		events.initSoundEvents();

	}

	return Menu;

})