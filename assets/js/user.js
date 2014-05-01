function updateUserList(users) {
	users.forEach(function(user) {
    if (user.id == me.id) {return false;}else
    {addUser(user);}
});
}
function addUser(user){
	$('.list-online').append('<a href=# class="list-group-item ss_u_'+user.id+'" onclick="addFrame('+"'"+user.id+"'"+', '+"'"+user.email+"'"+')">'+user.email+'</a>');

	if(user.online){
		$('.ss_u_'+user.id).css('background-color', 'red');
	}
}
function removeUser(user){
	$('.ss_u_'+user).css('background-color', 'white');
}
function updateOnline(user){
	$('.ss_u_'+user).css('background-color', 'red');	
}
function addFrame(userid, email){
	if($('#frame'+userid).length == 0){
		$('.tabs').append('<li id="frame'+userid+'"><a href="#" onclick="removeActive('+"'"+userid+"'"+')">'+email+'</a></li>');
		$('.panes').append('<div class="Contentchat well" id="content'+userid+'"><input type="textbox" class="form-control" placeholder="Enter text" onkeypress="handleEnter(this, event, '+"'"+userid+"'"+')" /><div class="maincontent" <div style="width: 500px; overflow: auto; height: 450px;"></div></div>');
		
		$("ul.tabs").tabs("div.panes > div");
	}
} 

function handleEnter(inField, e, userid) {
	var charCode;
//Get key code (support for all browsers)
if(e && e.which){
	charCode = e.which;
}else if(window.event){
	e = window.event;
	charCode = e.keyCode;
}

	socket.get('/message/send_typing?toUser='+userid );

if(charCode == 13) {
	$('#content'+userid+' .maincontent').append('You:'+inField.value+'</br>');
	
      $('#content'+userid+' div').animate({ scrollTop: $('#content'+userid+' div')[0].scrollHeight}, 1000);      
	$.ajax({
		url: '/message/send_message',
		type: 'GET',
		data:{'message': inField.value,
		'toUser':userid},
		success: function(){
			$('#content'+userid+' input').val('');
		}
	});	
}
}
function removeActive(userid){
	$('.tabs li').removeClass("active");
	$('#frame'+userid).addClass('active');
}