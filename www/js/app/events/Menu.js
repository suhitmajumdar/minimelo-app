define(function( require ) {

	var CollectionEvents = require('events/CollectionEvents');

	function Menu( uiHandler ) {
		this.selectedSaveToLoad = null;
		this.ui = uiHandler;

		var self = this;

		$('#general-menu-button')       .click( self.openGeneralMenu );
		$('#general-menu-help')         .click( self.openGeneralMenuHelp );

		$('#general-menu-overlay').click(function(){
			if(!$("#traitement-popup").hasClass("active"))
				self.closeGeneralMenu();
		});

		$('#save-menu-validate')        .click( self.saveComposition )
		$('#export-menu-validate')      .click( self.exportComposition );
		$('#load-menu-validate')        .click( self.loadSaveMenu );
		$('#new-menu-validate')         .click( function(){ self.newComposition() });
		$('#micro-menu-validate')       .click( self.launchRecordView );
		$('#manage-menu-validate')      .click( self.launchSoundManagementView );
		$('#general-menu .sub-menu-btn').click( function () { self.openSubMenu($(this).attr('menu')) });
		$("#success-export-validate").click(self.closeGeneralMenu);
	}

	Menu.prototype.openGeneralMenu = function(){
		$('#general-menu').addClass('active');
		$('#general-menu-overlay').addClass('active');
	}

	Menu.prototype.openGeneralMenuHelp = function(){
		if($('#general-menu').hasClass('helpActive')){
			$('#general-menu').removeClass('helpActive');
		}
		else{
			$('#general-menu').addClass('helpActive');
		}
	}

	Menu.prototype.closeGeneralMenu = function(){
		$('#general-menu').removeClass('helpActive').removeClass('active');
		$('#general-menu-overlay').removeClass('active');
		$('.sub-menu').removeClass('active');
	}

	Menu.prototype.getSaveName = function(){
		alert('penser à aller chercher le nom de la sauvegarde')
		return "saveName";
	}

	Menu.prototype.loadSaveMenu = function(){
		var name = this.getSaveName();
		$('#save-menu-input').val( name );
	}

	Menu.prototype.isAvailableSaveName = function(name){
		alert("Penser à vérivier si un nom est déjà pris dans les sauvegardes")
		return true;
	}

	Menu.prototype.checkSaveName = function(name){
		if(name == null || name ==""){
			alert("Donnez un nom à votre sauvegarde");
		}else{
			if(isAvailableSaveName(name) == false){
				alert("ce nom est déjà pris");
			}
			else{
				return true;
			}
		}
		return false;
	}

	Menu.prototype.saveComposition = function(){
		var name = $('#save-menu-input').val();
		if(this.checkSaveName(name)){
			alert("penser à sauvegarder la composition...")
		}
	}

	Menu.prototype.getExportName = function(){
		alert('Penser à aller chercher si il y a un export name')
		var name = "";
		if(name == ""){
			name = this.getSaveName();
		}
		return name;
	}

	Menu.prototype.loadExportMenufunction = function(){
		name = this.getExportName()
		$('#export-menu-input').val(name)
	}

	Menu.prototype.exportComposition = function (){
		var name = $('#export-menu-input').val();
		if(name!=null && name!=""){
			$("#traitement-popup").addClass("active");
			$("#export-menu").removeClass("active");
			var Export = require('app/Export');
			var exportTimeline = new Export();
            exportTimeline.exportMp3(name+".mp3");
		}
		else{
			alert("Donnez un nom à votre musique")
		}
	}

	Menu.prototype.getSavedCompositionList = function (){
		alert("penser à aller chercher la liste des compositions");
		return ["saveA","saveB","savEnger"];
	}

	Menu.prototype.loadLoadMenu = function (){
		var fileList = this.getSavedCompositionList();
		var domList = $('#load-menu-list');
		domList.empty();
		for(var i=0; i<fileList.length; i++){
			var s = $('<li class="load-menu-save">'+fileList[i]+'</li>');
			s.appendTo(domList);
		}
		$('.load-menu-save').click(function(){
			if( $(this).hasClass('active') ){
				$('.load-menu-save').removeClass('active');
				$('#load-menu-validate').removeClass('active');
				this.selectedSaveToLoad = null;
			}
			else{
				$('.load-menu-save').removeClass('active');
				$(this).addClass('active');
				$('#load-menu-validate').addClass('active');
				this.selectedSaveToLoad = $(this).text();
			}
		});
	}

	Menu.prototype.loadstart = function (name){
		if(this.selectedSaveToLoad!=null){
			alert("Penser à charger une sauvegarde")
		}
	}

	Menu.prototype.newComposition = function (){
		//On vide la timeline
		$(".track").empty();
		$("#export-menu-input").val("");
		this.closeGeneralMenu();

		//On efface les noms de sauvegarde et d'exportation
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
		$('#'+menuName).addClass('active');
		this.loadSubMenu( menuName );
	}

	Menu.prototype.displayCollectionManager = function () {
		this.ui.initCollectionManager();
		new CollectionEvents();
	}

	Menu.prototype.loadSubMenu = function (name){
		switch(name){
			case 'save-menu':
				this.loadSaveMenu();
				break;
			case 'export-menu':
				this.loadExportMenu();
				break;
			case 'load-menu':
				this.loadLoadMenu();
				break;
			case 'new-menu':
				break;
			case 'micro-menu':
            	this.launchRecordView();
				break;
			case 'manage-menu':
				this.displayCollectionManager();
				break;
		}
	}

	return Menu;

})