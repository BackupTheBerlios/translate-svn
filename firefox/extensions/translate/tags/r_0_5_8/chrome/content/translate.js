const PGTRANSLATE_QUICKTRANSLATIONSITE = "http://translate.google.com/translate_c?u=";
const PGTRANSLATE_TRANSLATIONSITE = "http://babelfish.altavista.com/babelfish/trurl_pagecontent?";
const PGTRANSLATE_SELECTIONSITE = "http://babelfish.altavista.com/babelfish/tr?"
const PGTRANSLATE_FIRSTARG = "url";
const PGTRANSLATE_SELECTFIRSTARG = "urltext";
const PGTRANSLATE_SECONDARG = "lp";
const PGTRANSLATE_EQUALS = "=";
const PGTRANSLATE_AMP = "&";

var gPGTranslateLocale;  // language variable (0 = English)
var gPGTranslateBundle;  //holds variable found in translate.properties

// Attach translateInit to the window "load" event
window.addEventListener("load",translateInit,false);
window.addEventListener("close", translateBrowserClose, false);
//document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);
//document.getElementById("nav-bar").addEventListener("dragdrop", checkJustDraged, false);
//document.getElementById("urlbar").addEventListener("change", checkCurrentPage, false);







function quickTranslate()
{
	if(gPGTranslateLocale == 0)
	{
		quick_translate();
	}
	else
	{
		translateFrom("en_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][0]);
	}
}

function translateBrowserClose()  	//Write preferences on browser shutdown
{
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	preferencesService.setIntPref("translate.userlanguage", gPGTranslateLocale);
}

function setLang(languageTo)  //function is executed from the options menu, sets language and intialises the menus
{
	gPGTranslateLocale = languageTo;
	initMenus();
}


function fillToolbutton()
{
	var languagePair;
	var toolbarItem = document.getElementById("translate-pg");

  	var toolbarMenuPopupElement = document.getElementById("translate-toolbutton-menupopup");
	var toolbarMenuItemLabel;
	var toolbarMenuItemTooltiptext;
   	var toolbarMenuItemOncommand ;
   	var toolbarMenuItemElement;

   	while( toolbarMenuPopupElement.hasChildNodes())
   	{
		toolbarMenuPopupElement.removeChild(toolbarMenuPopupElement.firstChild);
	}


   	for(var i = 1; i < PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale].length ; i++)
	{

		languagePair = PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][i] + "_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][0];
		//add menuitems to the toolbutton menu
		toolbarMenuItemLabel = gPGTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      	toolbarMenuItemTooltiptext = 	gPGTranslateBundle.getString(languagePair + ".tooltip");
    	toolbarMenuItemOncommand = "translateFrom('" + languagePair + "');";

   		toolbarMenuItemElement = document.createElement("menuitem");
    	toolbarMenuItemElement.setAttribute("label",toolbarMenuItemLabel);
    	toolbarMenuItemElement.setAttribute("tooltiptext",toolbarMenuItemTooltiptext);
    	toolbarMenuItemElement.setAttribute("oncommand",toolbarMenuItemOncommand);

		toolbarMenuPopupElement.appendChild(toolbarMenuItemElement);
    }
}

function translateInit()  // load prefs, initalise options menu and fill other menus
{

	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);

	// get the variables strong in translate.properties
	gPGTranslateBundle = document.getElementById("bundle-translate");
	if (! gPGTranslateBundle)
	{
		alert("no bundle");  // alert if tranlate.properties is invalid
	}

	// read the preferences file and set the language if their is one
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	if(preferencesService.prefHasUserValue("translate.userlanguage"))
	{
  		gPGTranslateLocale = preferencesService.getIntPref("translate.userlanguage");
	}
	else
	{
		gPGTranslateLocale = 0 ;
	}

	initOptionsMenu();
	initMenus();
}

function initOptionsMenu()  //read through the array found in languagePairs and add available languages to the options menu
{
	var menuPopup = document.getElementById("langSelect");
	var menuItem ;

	for(var i = 0;i < PGTRANSLATE_LANGUAGEPAIRS.length ; i++)
	{
	  menuItem = document.createElement("menuitem");
	  menuItem.setAttribute("label",PGTRANSLATE_LANGUAGEUNICODE[i]);
	  menuItem.setAttribute("name","languageSet");
	  menuItem.setAttribute("tooltiptext", gPGTranslateBundle.getString("tool.menu."+PGTRANSLATE_LANGUAGEPAIRS[i][0]+".tooltip"));
	  menuItem.setAttribute("oncommand","setLang("+ i +")");
	  menuItem.setAttribute("type","radio");

  menuPopup.appendChild(menuItem);
	}
}

function initMenus()  //initialises the context menu and the toolbar menu
{
   var languagePair;


   // set up context menu variables
   var contextItem = document.getElementById("translate-context");

   var contextMenuPopupElement = document.createElement("menupopup");

   var contextMenuItemLabel;
   var contextMenuItemTooltiptext;
   var contextMenuItemOncommand;

   var contextMenuItemElement;

   //set up toolbar variables
	var toolbarItem = document.getElementById("translate-pg");

	//set up toolmenu variables
	var toolMenu = document.getElementById("translate-tool-menu");
	var toolMenuSeperator = document.getElementById("translate-options-separator");
	var toolMenuPopupElement = document.createElement("menupopup");
	var toolMenuItemLabel;
	var toolMenuItemTooltiptext;
   	var toolMenuItemOncommand ;
   	var toolMenuItemElement;




   for(var i = 1; i < PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale].length ; i++)
   {
		languagePair = PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][i] + "_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][0];

    	//add menuitems to the  context menu
    	contextMenuItemLabel = gPGTranslateBundle.getString("context.menu." + languagePair + ".label");
   		contextMenuItemTooltiptext = 	gPGTranslateBundle.getString(languagePair + ".tooltip");
    	contextMenuItemOncommand = "translateSelection('" + languagePair + "');";

   		contextMenuItemElement = document.createElement("menuitem");
    	contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
    	contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
    	contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);

		contextMenuPopupElement.appendChild(contextMenuItemElement);

		//add menuitems to the toolbutton menu
		toolMenuItemLabel = gPGTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      	toolMenuItemTooltiptext = 	gPGTranslateBundle.getString(languagePair + ".tooltip");
    	toolMenuItemOncommand = "translateFrom('" + languagePair + "');";

   		toolMenuItemElement = document.createElement("menuitem");
    	toolMenuItemElement.setAttribute("label",toolMenuItemLabel);
    	toolMenuItemElement.setAttribute("tooltiptext",toolMenuItemTooltiptext);
    	toolMenuItemElement.setAttribute("oncommand",toolMenuItemOncommand);

		toolMenuPopupElement.appendChild(toolMenuItemElement);

    }





    // here's where we add menus if they aren't already there, if they are, then we remove them then add the new ones
    if(contextItem.hasChildNodes())  //if Firefox has already started, then replace existing childnodes, otherwise append them
    {
    		contextItem.replaceChild(contextMenuPopupElement,contextItem.firstChild);


    		// deals with adding languages to the tool menu, basically we add a clone of the toolbar menu.
    		// Tricky part is to remove existing menuitems
    		var toolChildren = toolMenu.childNodes;

    	 	for (var i in toolChildren)
    	 	{
    	 		if(toolChildren[i].nodeName == "menuitem")
    	 		{
    	 			toolMenu.removeChild(toolChildren[i]);
    	 		}
    	 	}

    	 	var nodeLength = toolMenuPopupElement.childNodes.length;
    		for( var i = 0 ; i < nodeLength  ;i++)
    		{
    			toolMenu.insertBefore(toolMenuPopupElement.childNodes[0],toolMenuSeperator);
    		}
    }
    else
  	{
  			// adds both context menu and toolbar menu
  		  	contextItem.appendChild(contextMenuPopupElement);

    		// creates list of translation languages in the tool menu
    		var nodeLength = toolMenuPopupElement.childNodes.length;

    		for( var i = 0 ; i < nodeLength  ;i++)
    		{
    			toolMenu.insertBefore(toolMenuPopupElement.childNodes[0],toolMenuSeperator);
    		}
            var langSelected = document.getElementById("langSelect");
    		langSelected.childNodes[gPGTranslateLocale].setAttribute("checked","true");
  	}



	//set toolbar button class, which inturns sets the icon
  	toolbarItem.setAttribute("class","translate-tool-" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslateLocale][0] + " toolbarbutton-1");



}

function onTranslatePopup()
{
	// Get the selected text
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.__proto__.getSelection.call(focusedWindow);
    // if the selected text is blank then don't display the context menu, otherwise, display the first 14 characters + ...
    if (selection!="")
    {
    	//text selected so display the context menu
    	var selectedText = selection.toString()
        if (selectedText.length > 15)  // crop selected text if necessary
        {
            selectedText = selectedText.substr(0,15) + "...";
        }
        var menuText;
        var item;
        var sep;
   		item = document.getElementById("translate-context");
        sep = document.getElementById("translateSeparator");

        sep.hidden = false;  //display separator
        item.hidden = false; //display menu

        menuText = gPGTranslateBundle.getString("context.menu.prefix") + " " + "\"" + selectedText + "\"";
        item.setAttribute("label", menuText);

    }
    else
    {
    	//no text selected so hide the context menu
        item = document.getElementById("translate-context");
        sep = document.getElementById("translateSeparator");

        sep.hidden = true;
        item.hidden = true;
    }
}

// these are the functions which perform the actual translations, nothing complex here

function quick_translate()
{
	window.content.document.location.href = PGTRANSLATE_QUICKTRANSLATIONSITE + window.content.document.location.href;
}

function translateFrom(lang)
{
	window.content.document.location.href = PGTRANSLATE_TRANSLATIONSITE + PGTRANSLATE_SECONDARG + PGTRANSLATE_EQUALS + lang + PGTRANSLATE_AMP + PGTRANSLATE_FIRSTARG + PGTRANSLATE_EQUALS + window.content.document.location.href;
}

function translateSelection(lang)
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var searchStr = focusedWindow.__proto__.getSelection.call(focusedWindow);
	getBrowser().addTab(PGTRANSLATE_SELECTIONSITE + PGTRANSLATE_SECONDARG + PGTRANSLATE_EQUALS + lang + PGTRANSLATE_AMP + PGTRANSLATE_SELECTFIRSTARG + PGTRANSLATE_EQUALS + encodeURIComponent(searchStr.toString()));
}


