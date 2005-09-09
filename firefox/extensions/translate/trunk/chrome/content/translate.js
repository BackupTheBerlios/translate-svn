String.prototype.trim = function() 
{
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}

// Contructor to set up some variables and preferences
function PGTranslate() // lets initialise some of the variables that we are going to use
{
	this.PGTRANSLATE_QUICKTRANSLATIONSITE = "http://translate.google.com/translate_c?u=";
	this.PGTRANSLATE_TRANSLATIONSITE = "http://babelfish.altavista.com/babelfish/trurl_pagecontent?";
	this.PGTRANSLATE_SELECTIONSITE = "http://babelfish.altavista.com/babelfish/tr?"
	this.PGTRANSLATE_FIRSTARG = "url";
	this.PGTRANSLATE_SELECTFIRSTARG = "urltext";
	this.PGTRANSLATE_SECONDARG = "lp";
	this.PGTRANSLATE_EQUALS = "=";
	this.PGTRANSLATE_AMP = "&";
	
	this.request = null;
	
	this.translateBundle;  //holds variable found in translate.properties
	this.PGTranslate_prefs = new PGTranslate_prefs();		
	this.myListener =           //listens for page refreshs, if the page refreshed is an image then translate is disabled
	{
		onStateChange:function(aProgress,aRequest,aFlag,aStatus)
		{
			//gPGTranslate.detectLang(aFlag);	
		},
		onLocationChange:function(aProgress,aRequest,aLocation)
		{
			gPGTranslate.enableTranslate(aLocation.asciiSpec);
		},
		onProgressChange:function(a,b,c,d,e,f){},
		onStatusChange:function(a,b,c,d)
		{
			
			
		},
		onSecurityChange:function(a,b,c){},
		onLinkIconAvailable:function(a){}
	}
	
	
		
	this.initPref(this.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED , "bool", true);
    this.initPref(this.PGTranslate_prefs.PREF_TOOLMENU_ENABLED , "bool", true);
    this.initPref(this.PGTranslate_prefs.PREF_STATUSBAR_ENABLED , "bool", true);
    this.initPref(this.PGTranslate_prefs.PREF_LANGUAGE , "int", 0);
    this.initPref(this.PGTranslate_prefs.PREF_ORIGIN_LANGUAGE , "int", 0);
}
   
// Code written by Doron R.
//
// Method to initalise preferences                  
PGTranslate.prototype.initPref = function (aPrefName, aPrefType, aDefaultValue)
{
  switch (aPrefType) 
  {
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

//  Sets up listeners (progress and context menu)
//  Gets string bundle
//  Initalises the menus

PGTranslate.prototype.onTextSelected = function(e)
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.getSelection();
	var selectedText = selection.toString() ;
	dump("onTextSelected: " + e.target.nodeType + "\n");
	if(selectedText.length != null || selectedText.length > 0 )
	{
		//fill status bar
		var languagePair = PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)]
													[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_ORIGIN_LANGUAGE)] + 
													"_" + 
							PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)]
													[0];
													
		// fill the statusbar with the translated word									
		gPGTranslate.fillStatusbar(selectedText.split(" ")[0], languagePair);  //I'm spliting the selected text because the statusbar is 
	}																	// only design to translate one word, not multiple words			
	
}


PGTranslate.prototype.onLoad = function()
{
	const NOTIFY_ALL =  Components.interfaces.nsIWebProgress.NOTIFY_ALL;
	window.getBrowser().addProgressListener(gPGTranslate.myListener , NOTIFY_ALL);
	
	//var file = Components.classes["@mozilla.org/content/dom-selection;1"].createInstance(Components.interfaces.nsISelectionPrivate);
	//file.addSelectionListener(gPGTranslate.mySelectionListener);
	
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",gPGTranslate.onTranslatePopup,false);
	
	// get the variables stored in translate.properties
	gPGTranslate.translateBundle = document.getElementById("bundle-translate");
	if (! gPGTranslate.translateBundle)
	{
		alert("no bundle");  // alert if tranlate.properties is invalid
	}
	gPGTranslate.initMenus();
}

// This method is excuted after each page refresh
// Checks to see if the document ins't html, if so, diasbales the translate button
PGTranslate.prototype.enableTranslate  = function (aUri)
{
	if(aUri != null)
	{
		var ext = aUri.toLowerCase();
		ext = ext.split(".");	
		var toolbarItem = document.getElementById("translate-pg");
		var toolbarMenu = document.getElementById("translate-pg-menu");
		var disableItem ;
	
		if( ext == null)
		{
			disableItem = false;
		}
		else if ( ext[ext.length-1] == "gif" || ext[ext.length-1] == "png" || ext[ext.length-1] == "jpg")
		{
			disableItem = true;
		}
		else
		{
			disableItem = false;
		}
		
		if(toolbarItem != null)
			toolbarItem.disabled = disableItem;
		
		if(toolbarMenu != null)
			toolbarMenu.disabled = disableItem;	
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


PGTranslate.prototype.setupStatusbar = function()
{
	if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_STATUSBAR_ENABLED))
	{
		document.getElementById("translate-pg-statusbar").setAttribute("style","visibility: visible")
	}else
	{
		document.getElementById("translate-pg-statusbar").setAttribute("style","visibility: collapse")
	}	
}


PGTranslate.prototype.initMenus = function()  //initialises the context menu and the toolbar menu
{
	
	
	gPGTranslate.setupStatusbar();
	
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
    	if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED))
    	{ 
	    	contextMenuItemLabel = gPGTranslate.translateBundle.getString("context.menu." + languagePair + ".label");
	   		contextMenuItemTooltiptext = 	gPGTranslate.translateBundle.getString(languagePair + ".tooltip");
	    	contextMenuItemOncommand = "gPGTranslate.translateSelection('" + languagePair + "');";
			
	   		contextMenuItemElement = document.createElement("menuitem");
	    	contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
	    	contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
	    	contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);
	    	contextMenuItemElement.setAttribute("id",languagePair);

	    	//contextMenuItemID = "translate-context-" + languagePair;
			//contextMenuItemElement.setAttribute("id",contextMenuItemID);
			//contextMenuItemElement.setAttribute("onmouseover","gPGTranslate.contextOnMouseOver('"+ contextMenuItemID + "', '" + languagePair + "')");

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
    		if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED))
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
  			if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED))
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
  	if(toolbarItem != null)
  		toolbarItem.setAttribute("class","translate-tool-" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0] + " toolbarbutton-1");
	
	var statusBarImage = document.getElementById("translate-pg-image");
	statusBarImage.setAttribute("class","translate-status-" + PGTRANSLATE_LANGUAGEPAIRS[gPGTranslate.PGTranslate_prefs.getIntPref(gPGTranslate.PGTranslate_prefs.PREF_LANGUAGE)][0]) ;
}



PGTranslate.prototype.load_xml = function(aURL,aSelectedText) 
{
	//dump(aURL + "\n");
	document.getElementById("translate-pg-progressbar").setAttribute("style","visibility:visible;width:"+ aSelectedText.length + "em;");
	document.getElementById("translate-pg-status").setAttribute("style","visibility:collapse;");
	gPGTranslate.request = new XMLHttpRequest();
	gPGTranslate.request.onreadystatechange = gPGTranslate.process_request;
	gPGTranslate.request.open("GET", aURL, true);
	gPGTranslate.request.send(null);	
}

PGTranslate.prototype.process_request = function ()
{
	switch (gPGTranslate.request.readyState){
   case 0 :
      document.getElementById("translate-pg-progressbar").setAttribute("value","5%");
      break;
   case 1 :
      document.getElementById("translate-pg-progressbar").setAttribute("value","25%");
      break;
   case 2 :
      document.getElementById("translate-pg-progressbar").setAttribute("value","50%");
      break;
   case 3 :
      document.getElementById("translate-pg-progressbar").setAttribute("value","75%");
      break;
   case 4 :
   		var responseTextMatch = gPGTranslate.request.responseText.match(/\<td bgcolor\=white class\=s\>\<div style\=padding\:10px\;\>([^\<]*)\<\/div\>\<\/td\>/)
      	if (gPGTranslate.request.status == 200 && responseTextMatch) 
		{
			{
				dump(responseTextMatch[1] + "\n");
				document.getElementById("translate-pg-status").setAttribute("style","padding: 0 0 0 "+ responseTextMatch[1].length + 1 +" em;");
				document.getElementById("translate-pg-status").setAttribute("value",responseTextMatch[1]);			
			}     		
		} 
		else
		{
			document.getElementById("translate-pg-status").setAttribute("style","padding: 0 0 0 15em;");
			document.getElementById("translate-pg-status").setAttribute("value","Translation Failed.");
		}
		document.getElementById("translate-pg-progressbar").setAttribute("value","100%");
		document.getElementById("translate-pg-progressbar").setAttribute("style","visibility:collapse;");
		document.getElementById("translate-pg-status").setAttribute("style","visibility:visible;");
      break;
   
}



}



PGTranslate.prototype.fillStatusbar = function (aSelectedText, aLanguage)
{
	var aURL = gPGTranslate.PGTRANSLATE_SELECTIONSITE + gPGTranslate.PGTRANSLATE_SECONDARG + gPGTranslate.PGTRANSLATE_EQUALS + aLanguage + gPGTranslate.PGTRANSLATE_AMP + gPGTranslate.PGTRANSLATE_SELECTFIRSTARG + gPGTranslate.PGTRANSLATE_EQUALS + encodeURIComponent(aSelectedText);
	gPGTranslate.load_xml(aURL,aSelectedText);
}




PGTranslate.prototype.onTranslatePopup = function ()
{
	// Get the selected text
 	var item = document.getElementById("translate-context");
    var sep = document.getElementById("translateSeparator");

	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.getSelection();
	var selectedText = selection.toString() ;
	
	
	if(gPGTranslate.PGTranslate_prefs.getBoolPref(gPGTranslate.PGTranslate_prefs.PREF_CONTEXTMENU_ENABLED) && selection!="")
	{
	    // if the selected text is blank then don't display the context menu, otherwise, display the first 14 characters + ...
    	//text selected so display the context menu
    	selectedText = selectedText.trim();
        if (selectedText.length > 15)  // crop selected text if necessary
        {
            selectedText = selectedText.substr(0,15) + "...";
        }
        var menuText;


        sep.hidden = false;  //display separator
        item.hidden = false; //display menu
		
		if(gPGTranslate.translateBundle.getString("context.menu.prefix.position") == "0")
		{
        	menuText = gPGTranslate.translateBundle.getString("context.menu.prefix") + " " + "\"" + selectedText + "\"";
        }
    	else
    	{
 
        	menuText = "\"" + selectedText + "\"" + " " +  gPGTranslate.translateBundle.getString("context.menu.prefix") ;
    	}       
        item.setAttribute("label", menuText);
	}
	else
	{
	    	//no text selected so hide the context menu	       	
	        sep.hidden = true;
	        item.hidden = true;
	}
	
	
	//  add tooltips
	//var contextItem = document.getElementById("translate-context");
	//var contextMenuPopupElement = contextItem.firstChild.childNodes;
	//dump(contextMenuPopupElement.length);
	//for(var i = 0 ; i < contextMenuPopupElement.length ; i++ )
//	{
		//dump(contextMenuPopupElement[i].getAttribute("id"));
		
	//	gPGTranslate.contextOnMouseOver(contextMenuPopupElement[i],contextMenuPopupElement[i].getAttribute("id"),selectedText);
	
	//}
}
PGTranslate.prototype.copyToClip = function(e)
{
	if(e.button == 0)
	{
		var translatedText = document.getElementById("translate-pg-status").getAttribute("value");
		dump("Copying to clipboard: " + translatedText + " mouse: "+ e.button + "\n");
		if (translatedText) 
		{
		try 
		{
			const clipURI = "@mozilla.org/widget/clipboardhelper;1";
			const clipI = Components.interfaces.nsIClipboardHelper;
			var clipboard = Components.classes[clipURI].getService(clipI);
			clipboard.copyString(translatedText);
		} catch (ex) 
		{
			// Unable to copy anything, die quietly
		}
		}	
	}
}

PGTranslate.prototype.quick_translate = function()
{
	window.content.document.location.href = gPGTranslate.PGTRANSLATE_QUICKTRANSLATIONSITE + encodeURIComponent(window.content.document.location.href);
}

PGTranslate.prototype.translateFrom = function(aLanguage)
{
	window.content.document.location.href = gPGTranslate.PGTRANSLATE_TRANSLATIONSITE + gPGTranslate.PGTRANSLATE_SECONDARG + gPGTranslate.PGTRANSLATE_EQUALS + aLanguage + gPGTranslate.PGTRANSLATE_AMP + gPGTranslate.PGTRANSLATE_FIRSTARG + gPGTranslate.PGTRANSLATE_EQUALS + encodeURIComponent(window.content.document.location.href);
}

PGTranslate.prototype.translateSelection = function(aLanguage)
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var searchStr = focusedWindow.getSelection();
	getBrowser().addTab(gPGTranslate.PGTRANSLATE_SELECTIONSITE + gPGTranslate.PGTRANSLATE_SECONDARG + gPGTranslate.PGTRANSLATE_EQUALS + aLanguage + gPGTranslate.PGTRANSLATE_AMP + gPGTranslate.PGTRANSLATE_SELECTFIRSTARG + gPGTranslate.PGTRANSLATE_EQUALS + encodeURIComponent(searchStr.toString()));
}
PGTranslate.prototype.onClose = function()
{
	window.getBrowser().removeProgressListener(this.myListener);
	//window.getBrowser().removeSelectionListener(this.mySelectionListener);
	document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing",gPGTranslate.onTranslatePopup,false);
	gPGTranslate = null;
}


//  Need to make sure only browser
//  windows have gPGTranslate attached.
if(window.location == "chrome://browser/content/browser.xul")
{
	var gPGTranslate = new PGTranslate(); 
	window.addEventListener("load",gPGTranslate.onLoad,false);
	window.addEventListener("close", gPGTranslate.onClose, false);
	
	document.ondblclick = gPGTranslate.onTextSelected;
	//window.addEventListener("onmouseup", gPGTranslate.onTextSelected, false);	
}