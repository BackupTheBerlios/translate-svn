var PGTranslate_prefs;
function pg_prefs_load()
{
	PGTranslate_prefs = new PGTranslate_prefs();
	initListBox();
	var defaultLanguage = PGTranslate_prefs.getIntPref(PGTranslate_prefs.PREF_LANGUAGE);
	document.getElementById("translate.prefs.language.selection").selectedIndex = defaultLanguage;
	document.getElementById("translate.prefs.contextMenu").checked = PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED);     
	document.getElementById("translate.prefs.displayTools").checked = PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_TOOLMENU_ENABLED);
	

	initOriginBox(defaultLanguage);
	document.getElementById("translate.prefs.language.origin.selection").selectedIndex = PGTranslate_prefs.getIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE);

	
}


function initOriginBox(aLanguage)
{
	listbox = document.getElementById("translate.prefs.language.origin.selection");
	var menupopup = document.createElement("menupopup");
	var listitem ;
	
	listitem = document.createElement("menuitem");
	listitem.setAttribute("label","{none}");
	listitem.setAttribute("value",0);
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
	var menupopup = document.createElement("menupopup");
	var listitem ;
	for(var i = 0;i < PGTRANSLATE_LANGUAGEPAIRS.length ; i++)
	{	
		listitem = document.createElement("menuitem");
		listitem.setAttribute("label",PGTRANSLATE_LANGUAGEUNICODE[i]);
		listitem.setAttribute("value",i);
		menupopup.appendChild(listitem);
	}
	listbox.appendChild(menupopup);
}

function pg_prefs_accept()
{
	PGTranslate_prefs.setBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED, document.getElementById("translate.prefs.contextMenu").checked)
	PGTranslate_prefs.setBoolPref(PGTranslate_prefs.PREF_TOOLMENU_ENABLED, document.getElementById("translate.prefs.displayTools").checked);
	PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_LANGUAGE, document.getElementById("translate.prefs.language.selection").selectedIndex);
	PGTranslate_prefs.setIntPref(PGTranslate_prefs.PREF_ORIGIN_LANGUAGE, document.getElementById("translate.prefs.language.origin.selection").selectedIndex);
	
	if(window.opener.opener)
	{
		window.opener.opener.gPGTranslate.initMenus();
	}else
	{
		window.opener.gPGTranslate.initMenus();
	}

}
