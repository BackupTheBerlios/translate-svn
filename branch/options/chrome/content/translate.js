var quicktranslationSite = "http://translate.google.com/translate?u=";

var translationSite = "http://babelfish.altavista.com/babelfish/trurl_load?";
var selectionSite = "http://babelfish.altavista.com/babelfish/tr?"

var firstArg = "url";
var selectFirstArg = "urltext";
var secondArg = "lp";
var equals = "=";
var amp = "&";
var glocale ;

var languagePairs = new Array();
languagePairs[0] = new Array("en","fr", "de", "es", "it","nl", "pt", "el", "ko","ja", "zh", "zt", "ru");
languagePairs[1] = new Array("fr","en", "de", "es", "it","pt", "nl", "el");
languagePairs[2] =  new Array("de","en", "fr");
languagePairs[3] =  new Array("es","en", "fr");
languagePairs[4] =  new Array("it","en", "fr");
languagePairs[5] =  new Array("el","en", "fr");
languagePairs[6] =  new Array("ko","en");
languagePairs[7] =  new Array("ja","en");
languagePairs[8] =  new Array("zh","en");
languagePairs[9] =  new Array("zt","en");
languagePairs[10] =  new Array("nl","en", "fr");
languagePairs[11] =  new Array("ru","en");
languagePairs[12] =  new Array("pt","en", "fr");
 
 
var gTranslateBundle;



// Attach translateInit to the window "load" event
window.addEventListener("load",translateInit,false);

function translateInit()
{
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);
	gTranslateBundle = document.getElementById("bundle-translate");
	
	  if (! gTranslateBundle)
  {
      alert("no bundle");
  }
   
  
   
  readPrefs();
  initContextMenu();
  initToolbarMenu();
   
   
}


function readPrefs()
{
	
}


function initToolbarMenu()
{
	 glocale = 2;
   var item = document.getElementById("translate-pg");  
   var menuPopupElement = document.createElement("menupopup");
  
	 for(var i = 1; i < languagePairs[glocale].length ; i++)
   {
	
    	var languagePair = languagePairs[glocale][i] + "_" + languagePairs[glocale][0];
    	var menuItemLabel = gTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      var menuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
    	var menuItemOncommand = "translateFrom('" + languagePair + "');";
   		var menuItemElement = document.createElement("menuitem");
    	
    	   	
    	
    	menuItemElement.setAttribute("label",menuItemLabel);
    	menuItemElement.setAttribute("tooltiptext",menuItemTooltiptext);
    	menuItemElement.setAttribute("oncommand",menuItemOncommand);
    	 	
			menuPopupElement.appendChild(menuItemElement);
    	
    }
        
    item.appendChild(menuPopupElement);
	
	
}

function initContextMenu()
{
   glocale = 2;
   var item = document.getElementById("translate-context");  
   var menuPopupElement = document.createElement("menupopup");
  
	 for(var i = 1; i < languagePairs[glocale].length ; i++)
   {
	
    	var languagePair = languagePairs[glocale][i] + "_" + languagePairs[glocale][0];
    	var menuItemLabel = gTranslateBundle.getString("context.menu." + languagePair + ".label");
      var menuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
    	var menuItemOncommand = "translateSelection('" + languagePair + "');";
   		var menuItemElement = document.createElement("menuitem");
    	
    	   	
    	
    	menuItemElement.setAttribute("label",menuItemLabel);
    	menuItemElement.setAttribute("tooltiptext",menuItemTooltiptext);
    	menuItemElement.setAttribute("oncommand",menuItemOncommand);
    	 	
			menuPopupElement.appendChild(menuItemElement);
    	
    }
        
    item.appendChild(menuPopupElement);
        
}

function onTranslatePopup()
{
	// Get the selected text
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.__proto__.getSelection.call(focusedWindow);      
   // alert("work");
    // if the selected text is blank then don't display the context menu, otherwise, display the first 14 characters + ...
    if (selection!="")
    {
    	var selectedText = selection.toString()
        if (selectedText.length > 15)
        {
            selectedText = selectedText.substr(0,15) + "...";
            //selectedText = "true" + selectedText;
        }
        var menuText;
        var item;
        var sep;
       // alert("work");
     		item = document.getElementById("translate-context");    
        sep = document.getElementById("translateSeparator");
        
        
         
       
   
        sep.hidden = false;
        item.hidden = false;
                
        menuText = "Translate " + "\"" + selectedText + "\"";
        item.setAttribute("label", menuText);
        
        
        
        
        
    }
    else
    {
        item = document.getElementById("translate-context");
        sep = document.getElementById("translateSeparator");
        
        sep.hidden = true;
        item.hidden = true;
    }
    
    

    
   
}



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
	//window.content.document.location.href= selectionSite + secondArg + equals + lang + amp + selectFirstArg + equals + searchStr.toString();
	
}


