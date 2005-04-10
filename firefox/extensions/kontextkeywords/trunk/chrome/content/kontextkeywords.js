String.prototype.trim = function() 
{
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}

//var grdfService = RDF; //Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
//var gbookmarkDS = BMDS; //grdfService.GetDataSource("rdf:bookmarks");

//gkRDFCContractID  = kRDFCContractID; //"@mozilla.org/rdf/container;1";
//gkRDFCIID         = kRDFCIID ; //Components.interfaces.nsIRDFContainer;
//gRDFC             = RDFC ; //Components.classes[gkRDFCContractID].createInstance(gkRDFCIID);

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

//	 grdfService = RDF; //Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
//gbookmarkDS = BMDS; //grdfService.GetDataSource("rdf:bookmarks");
//gRDFC             = RDFC ; //Components.classes[gkRDFCContractID].createInstance(gkRDFCIID);
	var menuItems = new Array();
	var count = 0;
	
	while (aElements.hasMoreElements()) 
	{
		var currentElement = aElements.getNext();
		if (BookmarksUtils.resolveType(currentElement) != "BookmarkSeparator")
		{
			if(BookmarksUtils.resolveType(currentElement) == "Folder")
			{	
				RDFC.Init(BMDS, currentElement);
				menuItems = menuItems.concat( countElements(RDFC.GetElements(), selectedText));
				//alert("concating");		
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


//alert("loaded");
window.addEventListener("load",tempLoad,false);
window.addEventListener("close", tempClose, false);
