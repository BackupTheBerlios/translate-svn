const PGTRANSLATE_QUICKTRANSLATIONSITE = "http://translate.google.com/translate_c?u=";
const PGTRANSLATE_TRANSLATIONSITE = "http://babelfish.altavista.com/babelfish/trurl_pagecontent?";
const PGTRANSLATE_SELECTIONSITE = "http://babelfish.altavista.com/babelfish/tr?"
const PGTRANSLATE_FIRSTARG = "url";
const PGTRANSLATE_SELECTFIRSTARG = "urltext";
const PGTRANSLATE_SECONDARG = "lp";
const PGTRANSLATE_EQUALS = "=";
const PGTRANSLATE_AMP = "&";


String.prototype.trim = function() {

 // skip leading and trailing whitespace
 // and return everything in between
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}
	
function PGTranslate() // lets initialise some of the variables that we are going to use
{
	/*
	this.pref_theLanguage;
	this.pref_displayContextMenu ;
	this.pref_displayToolMenu ;
	*/
	this.translateBundle;  //holds variable found in translate.properties
	
	this.PGTranslate_prefs = new PGTranslate_prefs();
	
	
	this.myListener =           //listens for page refreshs, if the page refreshed is an image then translate is disabled
	{
		onStateChange:function(aProgress,aRequest,aFlag,aStatus){},
		onLocationChange:function(aProgress,aRequest,aLocation)
		{
			gPGTranslate.enableTranslate(aLocation.asciiSpec);
		},
		onProgressChange:function(a,b,c,d,e,f){},
		onStatusChange:function(a,b,c,d){},
		onSecurityChange:function(a,b,c){},
		onLinkIconAvailable:function(a){}
	}
	
	this.initPref(this.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED , "bool", true);
    this.initPref(this.PGTranslate_prefs.PREF_TOOLMENU_ENABLED , "bool", true);
    this.initPref(this.PGTranslate_prefs.PREF_LANGUAGE , "int", 0);
}
                  


PGTranslate.prototype.initPref = function (aPrefName, aPrefType, aDefaultValue){

  switch (aPrefType) {
    case "bool" :
      var prefExists = this.PGTranslate_prefs.getBoolPref(aPrefName);
      if (prefExists == null)
        this.PGTranslate_prefs.setBoolPref(aPrefName, aDefaultValue);
      break;

    case "int" :
      var prefExists = this.PGTranslate_prefs.getIntPref(aPrefName);
      if (prefExists == null)
        this.PGTranslate_prefs.setIntPref(aPrefName, aDefaultValue);
      break;

    case "char" :
      var prefExists = this.PGTranslate_prefs.getCharPref(aPrefName);
      if (prefExists == null)
        this.PGTranslate_prefs.setCharPref(aPrefName, aDefaultValue);
      break;
  }
}

  	detectLang();


PGTranslate.prototype.onLoad = function()
{
	PREFERENCESSERVICE = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	const NOTIFY_LOCATION =  Components.interfaces.nsIWebProgress.NOTIFY_LOCATION;
	
	
		//	this.PGTranslate_prefs.getBoolPref(this.PGTranslate_prefs.PREF_TOOLMENU_ENABLED);
	//alert(this.PGTranslate_prefs.getBoolPref(this.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED));
	//alert(this.PGTranslate_prefs.getBoolPref(this.PGTranslate_prefs.PREF_TOOLMENU_ENABLED));
	//alert(gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE));
	
	window.getBrowser().addProgressListener(gPGTranslate.myListener , NOTIFY_LOCATION);
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",gPGTranslate.onTranslatePopup,false);
	// get the variables strong in translate.properties
	gPGTranslate.translateBundle = document.getElementById("bundle-translate");
	if (! gPGTranslate.translateBundle)
	{
		alert("no bundle");  // alert if tranlate.properties is invalid
	}

	// read the preferences file and set the language if their is one
	/*
	if(PREFERENCESSERVICE.prefHasUserValue("translate.userlanguage"))
	{
  		gPGTranslate.setTheLanguage(PREFERENCESSERVICE.getIntPref("translate.userlanguage"));
	}
	else
	{
		gPGTranslate.setTheLanguage(0) ;
	}
	if(PREFERENCESSERVICE.prefHasUserValue("translate.displayContextMenu"))
	{
  		PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED) = PREFERENCESSERVICE.getBoolPref("translate.displayContextMenu");
	}
	else
	{
		PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED) = true;
	}
	if(PREFERENCESSERVICE.prefHasUserValue("translate.displayToolMenu"))
	{
  		gPGTranslate.pref_displayToolMenu = PREFERENCESSERVICE.getBoolPref("translate.displayToolMenu");
	}
	else
	{
		gPGTranslate.pref_displayToolMenu = true;
	}
	
	*/
	gPGTranslate.initMenus();
}

PGTranslate.prototype.enableTranslate  = function (aUri)









{
	
	var ext = aUri.toLowerCase();
	ext = ext.split(".");
	//alert(ext);
	
	var toolbarItem = document.getElementById("translate-pg");
	var toolbarMenu = document.getElementById("translate-pg-menu");

	if( ext == null)
	{
		toolbarItem.disabled = false;
		toolbarMenu.disabled = false;
		//alert("null: " + toolbarMenu.disabled);
	}
	else if ( ext[ext.length-1] == "gif" || ext[ext.length-1] == "png" || ext[ext.length-1] == "jpg")
	{
		toolbarItem.disabled = true;
		toolbarMenu.disabled = true;
		//toolbarMenu.allowevents = false;
		//alert("dis: " + toolbarMenu.disabled);
	}
	else
	{
		toolbarItem.disabled = false;
		toolbarMenu.disabled = false;
		//alert("else: " + toolbarMenu.disabled);
	}
}


PGTranslate.prototype.quickTranslate = function ()
{
	if(gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE) == 0)
	{
		gPGTranslate.quick_translate();
	}
	else
	{
		gPGTranslate.translateFrom("en_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0]);
	}
}



PGTranslate.prototype.savePrefs = function ()
{ /*
	preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	preferencesService.setIntPref("translate.userlanguage", this.PGTranslate_prefs.getIntPref(this.PGTranslate_prefs.PREF_LANGUAGE));
	preferencesService.setBoolPref("translate.displayContextMenu", gPGTranslate.pref_displayContextMenu);
	preferencesService.setBoolPref("translate.displayToolMenu", gPGTranslate.pref_displayToolMenu);
	*/
}


PGTranslate.prototype.fillToolbutton = function ()
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


   	for(var i = 1; i < PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)].length ; i++)
	{
		languagePair = PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][i] + "_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0];
		//add menuitems to the toolbutton menu
		toolbarMenuItemLabel = gPGTranslate.translateBundle.getString("toolbar.menu." + languagePair + ".label");
      	toolbarMenuItemTooltiptext = 	gPGTranslate.translateBundle.getString(languagePair + ".tooltip");
    	toolbarMenuItemOncommand = "gPGTranslate.translateFrom('" + languagePair + "');";

   		toolbarMenuItemElement = document.createElement("menuitem");
    	toolbarMenuItemElement.setAttribute("label",toolbarMenuItemLabel);
    	toolbarMenuItemElement.setAttribute("tooltiptext",toolbarMenuItemTooltiptext);
    	toolbarMenuItemElement.setAttribute("oncommand",toolbarMenuItemOncommand);

		toolbarMenuPopupElement.appendChild(toolbarMenuItemElement);
    }
}


PGTranslate.prototype.openPrefs = function()  
{
	window.openDialog("chrome://translate/content/translate-preferences.xul", "_blank", "chrome,resizable=no,dependent=yes");
}

PGTranslate.prototype.initMenus = function()  //initialises the context menu and the toolbar menu
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
	
	var tool = document.getElementById("translate-pg-menu");
	
	if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED))
	{
		tool.hidden = !gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED);
		
	}
	else
	{
		
		tool.hidden = !gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED);	
	}
	
	
	var toolMenuPopupElement = document.createElement("menupopup");
	var toolMenuItemLabel;
	var toolMenuItemTooltiptext;
   	var toolMenuItemOncommand ;
   	var toolMenuItemElement;

   for(var i = 1; i < PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)].length ; i++)
   {
		languagePair = PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][i] + "_" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0];

    	//add menuitems to the  context menu
    	if(gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE))
    	{ 
	    	contextMenuItemLabel = gPGTranslate.translateBundle.getString("context.menu." + languagePair + ".label");
	   		contextMenuItemTooltiptext = 	gPGTranslate.translateBundle.getString(languagePair + ".tooltip");
	    	contextMenuItemOncommand = "gPGTranslate.translateSelection('" + languagePair + "');";
	
	   		contextMenuItemElement = document.createElement("menuitem");
	    	contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
	    	contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
	    	contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);
	
			contextMenuPopupElement.appendChild(contextMenuItemElement);
		}
		if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED))
		{
			//add menuitems to the toolbutton menu
			toolMenuItemLabel = gPGTranslate.translateBundle.getString("toolbar.menu." + languagePair + ".label");
		  	toolMenuItemTooltiptext = 	gPGTranslate.translateBundle.getString(languagePair + ".tooltip");
			toolMenuItemOncommand = "gPGTranslate.translateFrom('" + languagePair + "');";
		
			toolMenuItemElement = document.createElement("menuitem");
			toolMenuItemElement.setAttribute("label",toolMenuItemLabel);
			toolMenuItemElement.setAttribute("tooltiptext",toolMenuItemTooltiptext);
			toolMenuItemElement.setAttribute("oncommand",toolMenuItemOncommand);
		
			toolMenuPopupElement.appendChild(toolMenuItemElement);
		}

    }
    // here's where we add menus if they aren't already there, if they are, then we remove them then add the new ones
    if(contextItem.hasChildNodes())  //if Firefox has already started, then replace existing childnodes, otherwise append them
    {
    		if(gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE))
    			contextItem.replaceChild(contextMenuPopupElement,contextItem.firstChild);


    		// deals with adding languages to the tool menu, basically we add a clone of the toolbar menu.
    		// Tricky part is to remove existing menuitems
    		
    		
    		
    		
    		if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED))
			{
    		
	    		var toolChildren = toolMenu.childNodes;
	
	    	 	for (var i in toolChildren)
	    	 	{
	    	 		if(toolChildren[i].nodeName == "menuitem" && toolChildren[i].id != "translate-options")
	    	 			toolMenu.removeChild(toolChildren[i]);    	 		
	    	 	}
	
	    	 	var nodeLength = toolMenuPopupElement.childNodes.length;
	    		for( var i = 0 ; i < nodeLength  ;i++)
	    		{
	    			toolMenu.insertBefore(toolMenuPopupElement.childNodes[0],toolMenuSeperator);
	    		}
    		}
 
    		
    		
    }
    else
  	{
  			// adds both context menu and toolbar menu
  			if(gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE))
  		  		contextItem.appendChild(contextMenuPopupElement);

    			
    		if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_TOOLMENU_ENABLED))  // creates list of translation languages in the tool menu  	
			{
	    		var nodeLength = toolMenuPopupElement.childNodes.length;
	    		for( var i = 0 ; i < nodeLength  ;i++)
	    		{
	    			toolMenu.insertBefore(toolMenuPopupElement.childNodes[0],toolMenuSeperator);
	    		}
  			}
  	}
	//set toolbar button class, which inturns sets the icon
  	toolbarItem.setAttribute("class","translate-tool-" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0] + " toolbarbutton-1");
}

PGTranslate.prototype.onTranslatePopup = function ()
{
	// Get the selected text
 	var item = document.getElementById("translate-context");
    var sep = document.getElementById("translateSeparator");
	/*
	item.hidden = !PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED);
	sep.hidden = !PGTranslate_prefs.getBoolPref(PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED);
	*/
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.__proto__.getSelection.call(focusedWindow);
	
	if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED) && selection!="")
	{
		
		
	    // if the selected text is blank then don't display the context menu, otherwise, display the first 14 characters + ...
   
    	//text selected so display the context menu
    	var selectedText = selection.toString() ;
    	selectedText = selectedText.trim();
        if (selectedText.length > 15)  // crop selected text if necessary
        {
            selectedText = selectedText.substr(0,15) + "...";
        }
        var menuText;


        sep.hidden = false;  //display separator
        item.hidden = false; //display menu

        menuText = gPGTranslate.translateBundle.getString("context.menu.prefix") + " " + "\"" + selectedText + "\"";
        item.setAttribute("label", menuText);
	}
	else
	{
	    	//no text selected so hide the context menu
	       	
	        sep.hidden = true;
	        item.hidden = true;
	}
	
}


PGTranslate.prototype.quick_translate = function()
{
	window.content.document.location.href = PGTRANSLATE_QUICKTRANSLATIONSITE + window.content.document.location.href;
}

PGTranslate.prototype.translateFrom = function(aLanguage)
{
	window.content.document.location.href = PGTRANSLATE_TRANSLATIONSITE + PGTRANSLATE_SECONDARG + PGTRANSLATE_EQUALS + aLanguage + PGTRANSLATE_AMP + PGTRANSLATE_FIRSTARG + PGTRANSLATE_EQUALS + window.content.document.location.href;
}

PGTranslate.prototype.translateSelection = function(aLanguage)
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var searchStr = focusedWindow.__proto__.getSelection.call(focusedWindow);
	getBrowser().addTab(PGTRANSLATE_SELECTIONSITE + PGTRANSLATE_SECONDARG + PGTRANSLATE_EQUALS + aLanguage + PGTRANSLATE_AMP + PGTRANSLATE_SELECTFIRSTARG + PGTRANSLATE_EQUALS + encodeURIComponent(searchStr.toString()));
}
PGTranslate.prototype.onClose = function()
{
	window.getBrowser().removeProgressListener(this.myListener);
	gPGTranslate.savePrefs();
}


//  Need to make sure only browser
//  windows have gPGTranslate attached.
if(window.location == "chrome://browser/content/browser.xul")
{
	var gPGTranslate = new PGTranslate(); 
	window.addEventListener("load",gPGTranslate.onLoad,false);
	window.addEventListener("close", gPGTranslate.onClose, false);
}
