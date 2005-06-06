String.prototype.trim = function() 
{
  var x=this;
  x=x.replace(/^\s*(.*)/, "$1");
  x=x.replace(/(.*?)\s*$/, "$1");
  return x;
}

function PgLeftSelect()
{
	// not much to initialise here
}

PgLeftSelect.prototype.onLoad = function()
{
	alert('Left Click Load');
}	

PgLeftSelect.prototype.onClose = function()
{
}

PgLeftSelect.prototype.createMenuItems = function(aElements, aSelectedText)  //returns an array of menuItems
{

}

PgLeftSelect.prototype.addKontextCommand = function(aKeywordURL, aSelectedText, aPostData)
{
	

}

PgLeftSelect.prototype.kontextPopup = function()
{

}

PgLeftSelect.prototype.initmenu = function(aSelectedText)
{

}

if(window.location == "chrome://browser/content/browser.xul")
{
	var gPgLeftSelect = new PgLeftSelect();
	window.addEventListener("load",gPgLeftSelect.onLoad,false);
	window.addEventListener("close", gPgLeftSelect.onClose, false);
}
