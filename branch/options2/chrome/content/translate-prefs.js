function translate_prefs_accept()
{

}

function translate_prefs_load()
{
	initListBox();

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
	  //listitem.setAttribute("name","languageSet");
	  //listitem.setAttribute("tooltiptext", gPGTranslateBundle.getString("tool.menu."+PGTRANSLATE_LANGUAGEPAIRS[i][0]+".tooltip"));
	  //listitem.setAttribute("oncommand","setLang("+ i +")");
	  listitem.setAttribute("value",i);

  	  menupopup.appendChild(listitem);
	}

	listbox.appendChild(menupopup);
	listbox.selectedIndex = 1; 
}