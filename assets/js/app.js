
socket = io.connect();

typeof console !== 'undefined' &&
console.log('Connecting Socket.io to Sails.js...');

socket.on('connect', function socketConnected() {
	$('#disconnect').hide();
	$('#main').show();
    socket.get('/user/me', function(data) {
      window.me = data;
    });  
	socket.get('/user',updateUserList);
	socket.get('/message/set_private');
	socket.on('private_typing', function get_typing_me(data){
  if($('.typing_'+data.fromUser).length ==0    ){
      $('#content'+data.fromUser+' .maincontent').append('<div class="typing_'+data.fromUser+'">Typing.....</div>');
      setTimeout(function(){
        $('.typing_'+data.fromUser).remove();
      },3000);}
  })
  socket.on('private_chat', function get_message_me(data){
    socket.get('/user/?id='+data.fromUser, function(user){
      addFrame(data.fromUser, user.email);  
      $('#content'+data.fromUser+' div').append(user.email+':'+data.message+'</br>');
      $('#content'+data.fromUser+' div').animate({ scrollTop: $('#content'+data.fromUser+' div')[0].scrollHeight}, 1000);      
      $('.typing_'+data.fromUser).remove();
    })
		
	})
	socket.on('user', function(message){
      console.log(message);
      switch (message.verb) {

        // Handle user creation
        case 'created':
          addUser(message.data);
          break;

        // Handle a user changing their name
        case 'updated':

          // Get the user's old name by finding the <option> in the list with their ID
          // and getting its text.
          var oldName = $('#user-'+message.id).text();

          // Update the name in the user select list
          $('#user-'+message.id).text(message.data.name);

          // If we have a private convo with them, update the name there and post a status message in the chat.
          if ($('#private-username-'+message.id).length) {
            $('#private-username-'+message.id).html(message.data.name);
            postStatusMessage('private-messages-'+message.id,oldName+' has changed their name to '+message.data.name);
          }

          break;
        
        // Handle user destruction
        case 'destroyed':
          removeUser(message.id);
          break;
      	case 'login':
      		updateOnline(message.id);
      		break;
        // Handle private messages.  Only sockets subscribed to the "message" context of a
        // User instance will get this message--see the onConnect logic in config/sockets.js
        // to see where a new user gets subscribed to their own "message" context
        case 'messaged':
          receivePrivateMessage(message.data);
          break;

        default:
          break;
      }

	})
});
