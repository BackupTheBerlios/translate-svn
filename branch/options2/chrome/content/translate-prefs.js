function PGTranslate_prefs
{
	//  We need to reference the gPGTranslate object 
	//  so we therefore need to reference the window
	//  that contains gPGTranslate.
	//  The user can access the preferences from 2 places, 
	//  extensions window and the Tool Menu.
	if(window.opener.opener == null)
	{
		this.openingWindow = window.opener;  // user will have arrive here from the Tool menu
	} 
	else
	{
		this.openingWindow = window.opener.opener; // user will have arrive here from the Extensions
	}
}


/**
 * This method is run when the user clicks on OK.   
 * Updates the settngs in the gPGTranslate object.
 * Saves the settings, then re-initialises the menus.
 */
PGTranslate_prefs.prototype.accept = function()
{
	var listbox = document.getElementById("translate.prefs.language.selection");
	var displayContextCheckbox = document.getElementById("translate.prefs.contextMenu");
	var displayToolsCheckbox = document.getElementById("translate.prefs.displayTools");

	gPGTranslate_prefs.openingWindow.gPGTranslate.changeLang(listbox.selectedIndex);
	gPGTranslate_prefs.openingWindow.gPGTranslate.pref_displayContextMenu = displayContextCheckbox.checked  ;
	gPGTranslate_prefs.openingWindow.gPGTranslate.pref_displayToolMenu = displayToolsCheckbox.checked  ;
	
	gPGTranslate_prefs.openingWindow.gPGTranslate.savePrefs();
	gPGTranslate_prefs.openingWindow.gPGTranslate.initMenus();
}

PGTranslate_prefs.prototype.onload = function()
{
	gPGTranslate_prefs.initListBox();
	gPGTranslate_prefs.initValues();
}


/**
 * Initialises the listbox with   
 * all the possible languages.
 * 
 */
PGTranslate_prefs.prototype.initListBox = function()
{
	var listbox = document.getElementById("translate.prefs.language.selection");
	var menupopup = document.createElement("menupopup");
	var listitem ;

	for(var i = 0;i < PGTRANSLATE_LANGUAGEPAIRS.length ; i++)
	{
		
	  listitem = document.createElement("menuitem");
	  listitem.setAttribute("label",PGTRANSLATE_LANGUAGEUNICODE[i]);
	  //listitem.setAttribute("name","languageSet");
	  //listitem.setAttribute("tooltiptext", gPGTranslateBundle.getString("tool.menu."+PGTRANSLATE_LANGUAGEPAIRS[i][0]+".tooltip"));
	  //listitem.setAttribute("oncommand","window.opener.opener.gPGTranslate.changeLang(i);");
	  listitem.setAttribute("value",i);

  	  menupopup.appendChild(listitem);
	}

	listbox.appendChild(menupopup);
}

/**
 * Prefil the form with initial values stored
 * in the pPGTranslate object.
 * 
 */
PGTranslate_prefs.prototype.initValues = function()
{	
	var listbox = document.getElementById("translate.prefs.language.selection");
	var displayContextCheckbox = document.getElementById("translate.prefs.contextMenu");
	var displayToolsCheckbox = document.getElementById("translate.prefs.displayTools");
	
	listbox.selectedIndex = gPGTranslate_prefs.openingWindow.gPGTranslate.getTheLanguage();
	displayContextCheckbox.checked = gPGTranslate_prefs.openingWindow.gPGTranslate.pref_displayContextMenu  ;
	displayToolsCheckbox.checked = gPGTranslate_prefs.openingWindow.gPGTranslate.pref_displayToolMenu  ;
}

gPGTranslate_prefs = new PGTranslate_prefs(); 