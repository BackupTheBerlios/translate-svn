var quicktranslationSite = "http://translate.google.com/translate?u=";

var translationSite = "http://babelfish.altavista.com/babelfish/trurl_load?";
var selectionSite = "http://babelfish.altavista.com/babelfish/tr?"

var firstArg = "url";
var selectFirstArg = "urltext";
var secondArg = "lp";
var equals = "=";
var amp = "&";

// Attach translateInit to the window "load" event
window.addEventListener("load",translateInit,false);

function translateInit()
{
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);
}

function onTranslatePopup()
{
	// Get the selected text
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.__proto__.getSelection.call(focusedWindow);      
    
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
        
     item = document.getElementById("translate-context");    
        sep = document.getElementById("translateSeparator");
        
        var lang = 2;
        
               
       
        
        var menuPopupElement = document.createElement("menupopup");
    
for(var i = 1; i < languagePairs[lang].length ; i++)
    {
	
    	
    	var languagePair = languagePairs[lang][i] + "_" + languagePairs[lang][0];
    	
    	var menuItemLabel = "&translate.context.menu." + languagePair + ".label;";
    	
		var menuItemTooltiptext = "&translate." + languagePair + ".tooltip;" ;
    	
		var menuItemOncommand = "translateSelection('" + languagePair + "');";
    	
		var menuItemElement = document.createElement("menuitem");
    	
    	   	
    	
    	menuItemElement.setAttribute("label",menuItemLabel);
    	menuItemElement.setAttribute("tooltiptext",menuItemTooltiptext);
    	menuItemElement.setAttribute("oncommand",menuItemOncommand);
    	
    	
		menuPopupElement.appendChild(menuItemElement);
    	
    	
    }
        
        item.appendChild(menuPopupElement);
        
        
        
        
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
    
    

    
    document.getElementById("translateSeparator");.appendChild(menuItemElement);
   
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


