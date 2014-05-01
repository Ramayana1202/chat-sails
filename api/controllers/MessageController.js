module.exports = {
	'index'	:function(req,res,next){
		return res.view({'title':'App chat viet'});
		var room = req.param('room');
		
	},
	'get':function(req,res,next){
		var room = req.param('room');
		sails.sockets.broadcast('4', 'hello', 'hello');
		var roomNames = JSON.stringify(sails.sockets.rooms());
		res.json({
			message: 'A list of all the rooms: '+roomNames
		});
	},
	'set_private': function(req,res,next){
		var roomName = req.session.User.id;
		sails.sockets.join(req.socket, roomName);
		res.json({
			message: 'Subscribed to a fun room called '+roomName+'!'
		});

		Message.find({'toUser':req.session.User.id, 'isview': false}).done(function(err,message){
			for (var i in message){
				sails.sockets.broadcast(req.session.User.id, 'private_chat', message[i]);
				Message.update({'toUser':req.session.User.id, 'isview': false}, {'isview': true}).done(function(err,m){
					if(err){return next(err)}
				})
			}

		});

	},
	'send_message': function(req,res,next){
		var toUser = req.param('toUser');
		var fromUser = req.session.User.id;
		var message = req.param('message');
		var jsonMessage = {
			'toUser': toUser,
			'fromUser': fromUser,
			'message': message
		};
		sails.sockets.broadcast(toUser, 'private_chat', jsonMessage);
		User.findOne({'id':jsonMessage.toUser}).done(function(err,user){
			if (user.online){
				jsonMessage.isview = true;
			}else{jsonMessage.isview=false;}
			Message.create(jsonMessage).done(function(err,user){
				if(err){next(err)}
			});
			
		});
		var roomNames = JSON.stringify(sails.sockets.rooms());
		
		return res.json({
			message: 'A list of all the rooms: '+roomNames
		});		
	},
	'upload_file': function(req,res,next){
	},
	'send_typing':function(req,res,next){
		var jsonTyping = {
			'toUser': req.param('toUser'),
			'fromUser': req.session.User.id
		};
		sails.sockets.broadcast(req.param('toUser'), 'private_typing', jsonTyping);
	},
	upload: function(req, res) {

		if (req.files && req.files.image.name) {
			fs.readFile(req.files.image.path, function(err, data) {
				var filename = uuid.v4() + '.' + req.files.image.name.split('.').reverse()[0];	
				fs.mkdirs(sails.config.anhnt.uploadPath, function(err) {
					if (err) return res.json({
						error: err
					});
						var filePath = sails.config.anhnt.uploadPath + '/' + filename;
						fs.writeFile(filePath, data, function(err) {
							if (err) return res.json({
								error: err
							});
								return res.json({
									image: '/posts/' + filename
								});
							});
					});
			});
		}else{console.log('Hello')}

	}
};
