var PGTranslate_prefs;
function pg_prefs_load()
{
	PGTranslate_prefs = new PGTranslate_prefs();
	initListBox();
	var defaultLanguage = PGTranslate_prefs.getIntPref(PGTranslate_prefs.PREF_LANGUAGE);
	document.getElementById("translate.prefs.language.selection").selectedIndex = defaultLanguage;
	document.getElementById("translate.prefs.contextMenu").checked = PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED);     
	document.getElementById("translate.prefs.displayTools").checked = PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_TOOLMENU_ENABLED);
	document.getElementById("translate.prefs.statusbar").checked = PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_STATUSBAR_ENABLED);
	initOriginBox(defaultLanguage);
	document.getElementById("translate.prefs.language.origin.selection").selectedIndex = PGTranslate_prefs.getIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE);
}

function resetOriginLang(aLanguage)
{
	listbox = document.getElementById("translate.prefs.language.origin.selection");
	PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE,0);
 	listbox.selectedIndex = 0;

 	listbox.removeChild(listbox.firstChild);    	 		
	initOriginBox(aLanguage);
}

function initOriginBox(aLanguage)
{
	listbox = document.getElementById("translate.prefs.language.origin.selection");
	var menupopup = document.createElement("menupopup");
	var listitem ;
		
	menupopup.appendChild(listitem);
	for(var i = 1 ; i < PGTRANSLATE_LANGUAGEPAIRS[aLanguage].length ; i++)
	{	
		listitem = document.createElement("menuitem");
		listitem.setAttribute("label",PGTRANSLATE_LANGUAGEPAIRS[aLanguage][i].toUpperCase());
		listitem.setAttribute("value",i);
		
		menupopup.appendChild(listitem);
	}
	listbox.appendChild(menupopup);
}

function initListBox()
{
	var listbox = document.getElementById("translate.prefs.language.selection");
	var menupopup = listbox.firstChild;
	var listitem ;
	for(var i = 0;i < PGTRANSLATE_LANGUAGEPAIRS.length ; i++)
	{	
		listitem = document.createElement("menuitem");
		listitem.setAttribute("label",PGTRANSLATE_LANGUAGEUNICODE[i]);
		listitem.setAttribute("value",i);
		//listitem.setAttribute("oncommand","resetOriginLang(i)");
		menupopup.appendChild(listitem);
	}
	listbox.appendChild(menupopup);
}

function pg_prefs_accept()
{
	PGTranslate_prefs.setBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED, document.getElementById("translate.prefs.contextMenu").checked)
	PGTranslate_prefs.setBoolPref(PGTranslate_prefs.PREF_TOOLMENU_ENABLED, document.getElementById("translate.prefs.displayTools").checked);
	PGTranslate_prefs.setBoolPref(PGTranslate_prefs.PREF_STATUSBAR_ENABLED, document.getElementById("translate.prefs.statusbar").checked);
	PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_LANGUAGE, document.getElementById("translate.prefs.language.selection").selectedIndex);
	
	if(document.getElementById("translate.prefs.language.origin.selection").selectedIndex != -1)
	{
		PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE, document.getElementById("translate.prefs.language.origin.selection").selectedIndex);
	}else
	{
		PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE, 0);
	}
	if(window.opener.opener)
	{
		window.opener.opener.gPGTranslate.initMenus();
	}else
	{
		window.opener.gPGTranslate.initMenus();
	}

}
