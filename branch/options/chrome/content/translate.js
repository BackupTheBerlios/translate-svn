const quicktranslationSite = "http://translate.google.com/translate?u=";

const translationSite = "http://babelfish.altavista.com/babelfish/trurl_load?";
const selectionSite = "http://babelfish.altavista.com/babelfish/tr?"

const firstArg = "url";
const selectFirstArg = "urltext";
const secondArg = "lp";
const equals = "=";
const amp = "&";

var glocale =2 ;


 
 
var gTranslateBundle;



// Attach translateInit to the window "load" event
window.addEventListener("load",translateInit,false);


function setLang(languageTo)
{
	
	glocale = languageTo;
	initMenus();
}




function translateInit()
{
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",onTranslatePopup,false);
	gTranslateBundle = document.getElementById("bundle-translate");
	
	  if (! gTranslateBundle)
  {
      alert("no bundle");
  }
  
  
  initOptionsMenu();
     	
  initMenus();
   
}

function initOptionsMenu()
{
	var menuPopup = document.getElementById("langSelect");
	var menuItem ;
	
	for(var i = 0;i < glanguagePairs.length ; i++)
	{
	  menuItem = document.createElement("menuitem");
	  menuItem.setAttribute("label",glanguagePairs[i][0]);
	  menuItem.setAttribute("name","languageSet");
	  menuItem.setAttribute("oncommand","setLang("+ i +")");
	  menuItem.setAttribute("type","radio");
	  
	  menuPopup.appendChild(menuItem);              
                    
  }
}


function readPrefs()
{
}

function initToolbarMenu()
{
}

function initMenus()
{
   var languagePair;
   
   var contextItem = document.getElementById("translate-context");
   
   var contextMenuPopupElement = document.createElement("menupopup");
   
   var contextMenuItemLabel;
   var contextMenuItemTooltiptext;
   var contextMenuItemOncommand;
   
   var contextMenuItemElement;
   
   var toolbarItem = document.getElementById("translate-pg");
   var toolbarMenuPopupElement = document.createElement("menupopup");  
   var toolbarMenuItemLabel;
   var toolbarMenuItemTooltiptext;
   var toolbarMenuItemOncommand ;
   var toolbarMenuItemElement;

   var toolMenu = document.getElementById("translate-tool-menu");
   var toolMenuSeperator = document.getElementById("translate-options-separator");
   
	 for(var i = 1; i < glanguagePairs[glocale].length ; i++)
   {
	
    	languagePair = glanguagePairs[glocale][i] + "_" + glanguagePairs[glocale][0];
    	    	
    	//setup up context menu
    	contextMenuItemLabel = gTranslateBundle.getString("context.menu." + languagePair + ".label");
      
      
      contextMenuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
    	contextMenuItemOncommand = "translateSelection('" + languagePair + "');";
   		
   		contextMenuItemElement = document.createElement("menuitem");    	
    	contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
    	contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
    	contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);
			
			contextMenuPopupElement.appendChild(contextMenuItemElement);
			
			//setup toolbutton menu
			toolbarMenuItemLabel = gTranslateBundle.getString("toolbar.menu." + languagePair + ".label");
      toolbarMenuItemTooltiptext = 	gTranslateBundle.getString(languagePair + ".tooltip");
    	toolbarMenuItemOncommand = "translateFrom('" + languagePair + "');";
   		
   		toolbarMenuItemElement = document.createElement("menuitem");   	
    	toolbarMenuItemElement.setAttribute("label",toolbarMenuItemLabel);
    	toolbarMenuItemElement.setAttribute("tooltiptext",toolbarMenuItemTooltiptext);
    	toolbarMenuItemElement.setAttribute("oncommand",toolbarMenuItemOncommand);    	 	
			
			toolbarMenuPopupElement.appendChild(toolbarMenuItemElement);
			
    	
    }
        
        
    //set toolbar icon    
    toolbarItem.setAttribute("class","translate-tool-" + glanguagePairs[glocale][0]); 
    
    //
    toolbarItem.setAttribute("oncommand","if (event.target==this)   translateFrom('en_" + glanguagePairs[glocale][0] + "');");
    
    
    
    
    
    
    
    // add menus  

    if(contextItem.hasChildNodes())  //if Firefox has already started, then replace existing childnodes, otherwise append them
    { 
    		contextItem.replaceChild(contextMenuPopupElement,contextItem.firstChild);
    		toolbarItem.replaceChild(toolbarMenuPopupElement,toolbarItem.firstChild);
    		
    		var toolChildren = toolMenu.childNodes;
    		 	
    	 	for (var i in toolChildren)
    	 	{
    	 		//alert(toolChildren[i].nodeName);
    	 		if(toolChildren[i].nodeName == "menuitem")
    	 		{
    	 		//	alert("removing");
    	 			toolMenu.removeChild(toolChildren[i]);
    	 		}
    	 		//alert(i);	
    	 	}
    	 	
    	 	
    		var cloneMenu = toolbarMenuPopupElement.cloneNode(true);  // use a clone because insertBefore moves elements and does NOT copy
    		var nodeLength = cloneMenu.childNodes.length;
    		for( var i = 0 ; i < nodeLength  ;i++)
    		{
    			//alert(cloneMenu.childNodes.length);
    			toolMenu.insertBefore(cloneMenu.childNodes[0],toolMenuSeperator);
    		}
    		
    	
    		
    }
    else
  	{
  			// adds both context menu and toolbar menu   
  		  	contextItem.appendChild(contextMenuPopupElement);
    		toolbarItem.appendChild(toolbarMenuPopupElement); 
    		
    		
    		// creates list of translation languages in the tool menu	
    		
    		
    		var cloneMenu = toolbarMenuPopupElement.cloneNode(true);  // use a clone because insertBefore moves elements and does NOT copy
    		var nodeLength = cloneMenu.childNodes.length;
    		
    		for( var i = 0 ; i < nodeLength  ;i++)
    		{
    			//alert(cloneMenu.childNodes.length);
    			toolMenu.insertBefore(cloneMenu.childNodes[0],toolMenuSeperator);
    			
    		}
            var langSelected = document.getElementById("langSelect");
    		langSelected.childNodes[glocale].setAttribute("checked","true");
   			//alert(langSelected.childNodes[glocale].getAttribute("checked"));
    		
  	}
  	
  	
  	
  	
  	
  	
  	   
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


