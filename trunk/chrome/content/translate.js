const quicktranslationSite = "http://translate.google.com/translate_c?u=;
const translationSite = "http://babelfish.altavista.com/babelfish/trurl_load?";
const selectionSite = "http://babelfish.altavista.com/babelfish/tr?"
const firstArg = "url";
const selectFirstArg = "urltext";
const secondArg = "lp";
const equals = "=";
const amp = "&";

var glocale;  // language variable (0 = English)
var gTranslateBundle;  //holds variable found in translate.properties

// Attach translateInit to the window "load" event
window.addEventListener("load",translateInit,false);
window.addEventListener("close", translateBrowserClose, false);
//document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);
//document.getElementById("nav-bar").addEventListener("dragdrop", checkJustDraged, false);

function quickTranslate()
{
	if(glocale == 0)
	{
		quick_translate();
	}
	else
	{
		translateFrom("en_" + glanguagePairs[glocale][0]);
	}
}

function translateBrowserClose()  	//Write preferences on browser shutdown
{
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	preferencesService.setIntPref("translate.userlanguage", glocale);
}

function setLang(languageTo)  //function is executed from the options menu, sets language and intialises the menus
{
	glocale = languageTo;
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


   	for(var i = 1; i < glanguagePairs[glocale].length ; i++)
	{

		languagePair = glanguagePairs[glocale][i] + "_" + glanguagePairs[glocale][0];
		//add menuitems to the toolbutton menu
		toolbarMenuItemLabel = gTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      	toolbarMenuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
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
	gTranslateBundle = document.getElementById("bundle-translate");
	if (! gTranslateBundle)
	{
		alert("no bundle");  // alert if tranlate.properties is invalid
	}

	// read the preferences file and set the language if their is one
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	if(preferencesService.prefHasUserValue("translate.userlanguage"))
	{
  		glocale = preferencesService.getIntPref("translate.userlanguage");
	}
	else
	{
		glocale = 0 ;
	}

	initOptionsMenu();
	initMenus();
}

function initOptionsMenu()  //read through the array found in languagePairs and add available languages to the options menu
{
	var menuPopup = document.getElementById("langSelect");
	var menuItem ;

	for(var i = 0;i < glanguagePairs.length ; i++)
	{
	  menuItem = document.createElement("menuitem");
	  menuItem.setAttribute("label",glanguageUnicode[i]);
	  menuItem.setAttribute("name","languageSet");
	  menuItem.setAttribute("tooltiptext", gTranslateBundle.getString("tool.menu."+glanguagePairs[i][0]+".tooltip"));
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




   for(var i = 1; i < glanguagePairs[glocale].length ; i++)
   {
		languagePair = glanguagePairs[glocale][i] + "_" + glanguagePairs[glocale][0];

    	//add menuitems to the  context menu
    	contextMenuItemLabel = gTranslateBundle.getString("context.menu." + languagePair + ".label");
   		contextMenuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
    	contextMenuItemOncommand = "translateSelection('" + languagePair + "');";

   		contextMenuItemElement = document.createElement("menuitem");
    	contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
    	contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
    	contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);

		contextMenuPopupElement.appendChild(contextMenuItemElement);

		//add menuitems to the toolbutton menu
		toolMenuItemLabel = gTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      	toolMenuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
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
    		langSelected.childNodes[glocale].setAttribute("checked","true");
  	}



	//set toolbar button class, which inturns sets the icon
  	toolbarItem.setAttribute("class","translate-tool-" + glanguagePairs[glocale][0]);



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

        menuText = "Translate " + "\"" + selectedText + "\"";
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
	window.content.document.location.href = quicktranslationSite + window.content.document.location.href;
}

function translateFrom(lang)
{
	window.content.document.location.href= translationSite + secondArg + equals + lang + amp + firstArg + equals + window.content.document.location.href;
}

function translateSelection(lang)
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var searchStr = focusedWindow.__proto__.getSelection.call(focusedWindow);
	getBrowser().addTab(selectionSite + secondArg + equals + lang + amp + selectFirstArg + equals + encodeURIComponent(searchStr.toString()));
}


