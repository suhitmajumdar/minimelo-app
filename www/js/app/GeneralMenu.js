//////////////// GENERAL MENU ///// Thomas
/*var generalMenuButton = $('#general-menu-button')
var generalMenu = $('#general-menu');
var generalMenuOverlay = $('#general-menu-overlay')*/
//Ouvrir le general menu
function openGeneralMenu(){
    $('#general-menu').addClass('active');
    $('#general-menu-overlay').addClass('active');
}
function openGeneralMenuHelp(){
    if($('#general-menu').hasClass('helpActive')){
        $('#general-menu').removeClass('helpActive');
    }
    else{
        $('#general-menu').addClass('helpActive');
    }
}
function closeGeneralMenu(){
    $('#general-menu').removeClass('helpActive').removeClass('active');
    $('#general-menu-overlay').removeClass('active');
    $('.sub-menu').removeClass('active');
}


//SAVE SUB MENU
    function getSaveName(){
        alert('penser à aller chercher le nom de la sauvegarde')
        return "saveName";
    }
    function load_saveMenu(){
        var name = getSaveName();
        $('#save-menu-input').val( name );
    }
    function isAvailableSaveName(name){
        alert("Penser à vérivier si un nom est déjà pris dans les sauvegardes")
        return true;
    }
    function checkSaveName(name){
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
    function saveComposition(){
        var name = $('#save-menu-input').val();
        if(checkSaveName(name)){
            alert("penser à sauvegarder la composition...")
        }
    }
//END SAVE SUB MENU
//EXPORT SUB MENU
    function getExportName(){
        alert('Penser à aller chercher si il y a un export name')
        var name = "";
        if(name==""){
            name=getSaveName();
        }
        return name;
    }
    function load_exportMenu(){
        name = getExportName()
        $('#export-menu-input').val(name)
    }
    function exportComposition(){
        var name = $('#export-menu-input').val();
        if(name!=null && name!=""){
            alert("penser à exporter la composition...")
        }
        else{
            alert("Donnez un nom à votre musique")
        }
    }

//END EXPORT SUB MENU
//LOAD SUB MENU
    var selectedSaveToLoad = null;
    function getSavedCompositionList(){
        alert("penser à aller chercher la liste des compositions");
        return ["saveA","saveB","savEnger"];
    }
    function load_loadMenu(){
        var fileList = getSavedCompositionList();
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
                selectedSaveToLoad = null;
            }
            else{
                $('.load-menu-save').removeClass('active');
                $(this).addClass('active');
                $('#load-menu-validate').addClass('active');
                selectedSaveToLoad = $(this).text();
            }
        });
    }
    function loadSave(name){
        if(selectedSaveToLoad!=null){
            alert("Penser à charger une sauvegarde")
        }
    }
//END LOAD SUB MENU
//NEW SUB MENU
    function newComposition(){
        alert('Penser à vider la timeline ET effacer les noms de save et d\'export')
        //On vide la timeline
        //On efface les noms de sauvegarde et d'exportation
    }
//END NEW SUB MENU
//MICRO SUB MENU
    function launchRecordView(){
        alert('Penser à aller sur la vue de record')
    }
//END MICRO SUB MENU
//MANAGE SUB MENU
    function launchSoundManagementView(){
        alert('Penser à aller sur la vue de management de records')
    }
//END MANAGE SUB MENU



function loadSubMenu(name){
    switch(name){
        case 'save-menu':
            load_saveMenu();
            break;
        case 'export-menu':
            load_exportMenu();
            break;
        case 'load-menu':
            load_loadMenu();
            break;
        case 'new-menu':
            break;
        case 'micro-menu':
            break;
        case 'manage-menu':
            break;
    }
}
//Ouvrir un sub-menu
function openSubMenu(menuName){
    $('.sub-menu').removeClass('active');
    $('#'+menuName).addClass('active');
    //Charger le sub-menu
    loadSubMenu( menuName )
}

//////////////// END GENERAL MENU ///// Thomas