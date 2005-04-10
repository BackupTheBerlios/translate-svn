String.prototype.trim = function() 
{
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}

function tempLoad()
{
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",tempPopup,false);
}	

function tempClose()
{
	document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing",tempPopup,false);
}

function countElements(aElements, selectedText)  //returns an array of menuItems
{
	var menuItems = new Array();
	
	while (aElements.hasMoreElements()) 
	{
		var currentElement = aElements.getNext();
		if (BookmarksUtils.resolveType(currentElement) != "BookmarkSeparator")
		{
			if(BookmarksUtils.resolveType(currentElement) == "Folder")
			{	
				RDFC.Init(BMDS, currentElement);
				menuItems = menuItems.concat( countElements(RDFC.GetElements(), selectedText));
			}
			else  //it's a bookmark
			{
				var keyword = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#ShortcutURL");
				var keywordURL = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#URL");

				if(keyword != "" && keywordURL.indexOf("%s") > 0)
				{
					var contextMenuItemLabel;
					var contextMenuItemTooltiptext;
					var contextMenuItemOncommand;
					var contextMenuItemImage;
					var contextMenuItemElement;
					
					contextMenuItemLabel = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#Name");
					contextMenuItemTooltiptext = 	BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#Description");
					if(contextMenuItemTooltiptext = "")			
						contextMenuItemTooltiptext = contextMenuItemLabel;
					
					contextMenuItemOncommand = "gotoSearch('"+keywordURL+"','"+selectedText+"');";
					contextMenuItemImage = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#Icon");
										
					contextMenuItemElement = document.createElement("menuitem");
					contextMenuItemElement.setAttribute("label",contextMenuItemLabel);
					contextMenuItemElement.setAttribute("tooltiptext",contextMenuItemTooltiptext);
					contextMenuItemElement.setAttribute("oncommand",contextMenuItemOncommand);
					contextMenuItemElement.setAttribute("image",contextMenuItemImage);
					contextMenuItemElement.setAttribute("class","menuitem-iconic");
					menuItems.push(contextMenuItemElement);	
				}
			}	
		}
	}
	return  menuItems;
}

function gotoSearch(keywordURL, selectedText)
{
	re = /%s/;	
	uri = keywordURL.replace(re, selectedText);
	getBrowser().addTab(uri);
}

function tempPopup()
{
	initServices();
  	initBMService();
	var item = document.getElementById("temp-context");
	var sep = document.getElementById("tempSeparator");
	
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.__proto__.getSelection.call(focusedWindow);
	
	if(selection != "")
	{
		var selectedText = selection.toString() ;
		initmenu(selectedText);		
		selectedText = selectedText.trim();
		if (selectedText.length > 15)  // crop selected text if necessary
		{
		    selectedText = selectedText.substr(0,15) + "...";
		}
		var menuText;	
		
		sep.hidden = false;  //display separator
		item.hidden = false; //display menu
		
		menuText = "Keyword Query " + "\"" + selectedText + "\""; 
		item.setAttribute("label", menuText);
	}
	else
	{
	    	//no text selected so hide the context menu	       	
	        sep.hidden = true;
	        item.hidden = true;
	}
}


function initmenu(selectedText)
{
	grTarget = RDF.GetResource("NC:BookmarksRoot");
	RDFC.Init(BMDS, grTarget);	
   var contextItem = document.getElementById("temp-context");
   var contextMenuPopupElement = document.createElement("menupopup");
   var itemArray = countElements(RDFC.GetElements() , selectedText);
   for(var i = 0 ; i < itemArray.length ; i++)
   { 
		contextMenuPopupElement.appendChild(itemArray[i]);
	}
	
 if(contextItem.hasChildNodes())  //if Firefox has already started, then replace existing childnodes, otherwise append them
    {
    			contextItem.replaceChild(contextMenuPopupElement,contextItem.firstChild);
    }
    else
  	{
  		  		contextItem.appendChild(contextMenuPopupElement);
  	}  	
}

window.addEventListener("load",tempLoad,false);
window.addEventListener("close", tempClose, false);
