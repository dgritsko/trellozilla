var initMain = function(container) {
   container.validateKey = function() {
      var key = $('#txtKey').val();
    
      var match = key.match(/([a-z0-9]{32})/);
         if (match) {
             $('#keyValid').html('OK');
			    container.data.key = match[1];
         } else { 
            $('#keyValid').html('Not Valid');
			   container.data.key = undefined;
         }  
   }

   container.validateToken = function() {
      var key = $('#txtToken').val();
	  
      var match = key.match(/([a-z0-9]{64})/);
         if (match) {
             $('#tokenValid').html('OK');
			 container.data.token = match[1];
         } else { 
            $('#tokenValid').html('Not Valid');
			container.data.token = undefined;
         }  
   }
   
   container.validateBoardId = function() {
      var key = $('#txtBoardId').val();
	  
      var matches = [
	     key.match(/\/([a-z0-9]{24})$/),
		 key.match(/\/b\/([\w]+)(\/[\w-]+)?$/),
	  ];
	  
	  for (var i = 0, len = matches.length; i < len; i++) {
	     var match = matches[i];
	  
         if (match) {
             $('#boardIdValid').html('OK');
			 container.data.boardId = match[1];
			 container.updateBoardName();
			 container.getBoardLists();
			 break;
         } else { 
            $('#boardIdValid').html('Not Valid');
			container.data.boardId = undefined;
         }  
	  }
   }
   
   container.navigateTo = function(panelIndex) {
      switch (panelIndex) 
	  {
	     case 0: // Developer Key
               $('[id^=panel]').hide();
               $('[id^=panel]:eq(' + panelIndex + ')').show();
		    break;
         case 1: // Security Token
		    if (container.data.key) {
			   var tokenUrl = 'https://trello.com/1/connect?key=' + container.data.key + '&name=TrelloBugzillaBookmarklet&response_type=token&scope=read,write';
			   $('#securityTokenLink').attr('href', tokenUrl);
			
               $('[id^=panel]').hide();
               $('[id^=panel]:eq(' + panelIndex + ')').show();
			}
		    break;
		 case 2: 
		    if (container.data.token) {
               $('[id^=panel]').hide();
               $('[id^=panel]:eq(' + panelIndex + ')').show();
			}
		 case 3:
		    if (container.data.boardId && container.data.boardName) {
               $('[id^=panel]').hide();
               $('[id^=panel]:eq(' + panelIndex + ')').show();
			}
		 case 4:
		    if (container.data.listId) {
			   container.generateBookmarklet();
			
               $('[id^=panel]').hide();
               $('[id^=panel]:eq(' + panelIndex + ')').show();
			}
         default: 
            break;
	  }   
   }
   
   var init = function() {
      $('[id^=panel]').hide();
	  $('[id^=panel]:eq(0)').show();
   }
   init();
}