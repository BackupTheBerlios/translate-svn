String.prototype.trim = function() 
{
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}

function PgKontextKeywords()
{
	// not much to initialise here
}

PgKontextKeywords.prototype.onLoad = function()
{
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",gPgKontextKeywords.kontextPopup,false);
}	

PgKontextKeywords.prototype.onClose = function()
{
	document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing",gPgKontextKeywords.kontextPopup,false);
}

/*
This function recursively goes through the user's bookmarks, looking for ones that
have a shortcutURL (or keyword) also containing the text "%s".  Results are
added to an array of menuItems for adding later to the context menu.
*/
PgKontextKeywords.prototype.createMenuItems = function(aElements, aSelectedText)  //returns an array of menuItems
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
				menuItems = menuItems.concat( gPgKontextKeywords.createMenuItems(RDFC.GetElements(), aSelectedText));
			}
			else  //it's a bookmark
			{
				var keyword = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#ShortcutURL");
				var keywordURL = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#URL");
				var postData = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#PostData");
				
				//dump(postData + "\n");
				if(keyword != "" && (keywordURL.indexOf("%s") > 0 || postData != ""))
				{
					var contextMenuItemLabel;
					var contextMenuItemTooltiptext;
					var contextMenuItemOncommand;
					var contextMenuItemImage;
					var contextMenuItemElement;
					
					contextMenuItemLabel = BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#Name");
					contextMenuItemTooltiptext = 	BookmarksUtils.getProperty(currentElement, "http://home.netscape.com/NC-rdf#Description");
					if(contextMenuItemTooltiptext.trim() == "")			
						contextMenuItemTooltiptext = contextMenuItemLabel;
					
					contextMenuItemOncommand = "gPgKontextKeywords.addKontextCommand('"+keywordURL+"','"+ escape(aSelectedText) +"','" + postData +"');";
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

PgKontextKeywords.prototype.addKontextCommand = function(aKeywordURL, aSelectedText, aPostData)
{
	
	if(aPostData)
	{
		aPostData = unescape(aPostData);
        aPostDataRef = getPostDataStream(aPostData, aSelectedText, "application/x-www-form-urlencoded");
		dump(aKeywordURL + "\n");
		//re=/%25s/;
		//postData = aPostData.replace(re, aSelectedText);
		//dump(postData + "\n");
		gBrowser.addTab(aKeywordURL, null, null, aPostDataRef)

	} else
	{
		re = /%s/;	
		uri = aKeywordURL.replace(re, aSelectedText);
		getBrowser().addTab(uri);
		
	}
}

PgKontextKeywords.prototype.kontextPopup = function()
{
	initServices();
  	initBMService();
	var item = document.getElementById("kontextKeywordsMenu");
	var sep = document.getElementById("kontextKeywordsSeparator");
	
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var selection = focusedWindow.getSelection();
	var selectedText = selection.toString();
	
	if(selectedText != "")
	{
		
		gPgKontextKeywords.initmenu(selectedText);		
		selectedText = selectedText.trim();
		if (selectedText.length > 15)  // crop selected text if necessary
		{
		    selectedText = selectedText.substr(0,15) + "...";
		}
		var menuText;	
		
		sep.hidden = false;  //display separator
		item.hidden = false; //display menu
		
		menuText = "Kontext Keyword " + "\"" + selectedText + "\""; 
		item.setAttribute("label", menuText);
	}
	else
	{
	    	//no text selected so hide the context menu	       	
	        sep.hidden = true;
	        item.hidden = true;
	}
}

PgKontextKeywords.prototype.initmenu = function(aSelectedText)
{
	grTarget = RDF.GetResource("NC:BookmarksRoot");
	RDFC.Init(BMDS, grTarget);	
   var contextItem = document.getElementById("kontextKeywordsMenu");
   var contextMenuPopupElement = document.createElement("menupopup");
   var itemArray = gPgKontextKeywords.createMenuItems(RDFC.GetElements() , aSelectedText);
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

if(window.location == "chrome://browser/content/browser.xul")
{
	var gPgKontextKeywords = new PgKontextKeywords();
	window.addEventListener("load",gPgKontextKeywords.onLoad,false);
	window.addEventListener("close", gPgKontextKeywords.onClose, false);
}
