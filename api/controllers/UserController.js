module.exports = {
	'new':function(req,res){
		res.view({'title':'Register'});
	},
	'create':function(req,res,next){
		var userObj = {
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};
		console.log(userObj);
		User.create(userObj, function(err, user){
			if(err){

				return next(err);
			}

			return res.send('Reg ok roi nhe');
		});
	},
	'me': function(req,res,next){
		if(req.session.User){
			User.findOne({'id': req.session.User.id}, function(err,user){
				if(err){return res.json(err)}
					return res.json(user);
			})
		}else{
			res.send('You please login!!')
		}
	}
	
};
