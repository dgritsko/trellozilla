javascript:(function(){

var key = "' + container.data.key + '";
var token = "' + container.data.token + '";
var listId = "' + container.data.listId + '";
var boardId = "' + container.data.boardId + '";

var cardsUrl = "https://api.trello.com/1/lists/" + listId + "/cards?key=" + key + "&token=" + token + "&callback=cardCreatedCallback";
var postUrl = "https://api.trello.com/1/cards/?key=" + key + "&token=" + token;

function getBugUrl() {
   return window.location.href.trim();
}

function getBugName() {
   try {
   var nameElement = window.document.getElementById("subtitle");
   var content = nameElement.innerText || nameElement.textContent;
   return content.trim();
   } catch (e) { return ""; }
}

function postToUrl(path, params) {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", path);
    form.setAttribute("target", "results_frame");

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    var iframe = document.getElementById("results_frame");
    if (iframe) {
       alert("Trello card already created");
    } else {
       var iframe = document.createElement("iframe");
       iframe.id = "results_frame";
       iframe.name = "results_frame";
       iframe.style.display = "none";
       window.document.body.appendChild(form);
       window.document.body.appendChild(iframe);
       form.submit();

       var script = document.createElement("script");
       script.src = cardsUrl;
       document.getElementsByTagName("head")[0].appendChild(script);
    }
}

window.cardCreatedCallback = function(data) {
   var card = undefined;
   for (var i = 0; i < data.length; i++) {
      if (!card && data[i].desc === bugDesc) {
         card = data[i];
      }
   }

   var disp = document.createElement("div");
   window.closeTrelloOverlay = function() { document.body.removeChild(disp); };
   disp.innerHTML="<a href=\\\"" + card.url + "\\\" target=\\\"_blank\\\">Trello card created!</a><br /><a href=\\\"#\\\" onclick=\\\"window.closeTrelloOverlay()\\\">Close</a>";
   disp.setAttribute("style", "position:absolute;left:80px;top:20px;background:#FFFFFF;height:35px;width:200px;border: 1px solid black;border-radius:10px;padding:10px;");
   window.document.body.appendChild(disp);
   
   if (document.querySelectorAll) {
      var logoutLinks = document.querySelectorAll("a[href=\\\"index.cgi?logout=1\\\"]");
      if (logoutLinks && logoutLinks.length > 0 && confirm("Add Trello card URL to this Bugzilla entry?")) {
         document.querySelectorAll("#bug_file_loc")[0].value = card.url;
         var submitButton = document.querySelectorAll("#commit")[0];
         
         if ("click" in submitButton) {
            submitButton.click();
         } else if ("dispatchEvent" in submitButton) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window,
               0, 0, 0, 0, 0, false, false, false, false, 0, null);
            submitButton.dispatchEvent(evt);
         }
      } else {
         alert("Not logged in, unable to save URL of Trello card");
      }      
   } else {
      alert("Unable to save URL of Trello card");
   }  
};

var bugName = getBugName();
var bugDesc = getBugUrl();

if (bugName && bugDesc) {
   var items = { name : bugName, desc : bugDesc, idList : listId };
   postToUrl(postUrl, items);
} else { alert("Error creating Trello card!"); }

})()