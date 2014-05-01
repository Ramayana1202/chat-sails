module.exports = {
  new: function(req,res){
  	res.view({title: 'Login'});
  },
  create: function(req,res,next){
  	if (!req.param('email') || !req.param('password')){
  		var usernamePasswordRequiredError = [{
  			name: 'usernamePasswordRequired',
  			message: 'You must enter both a username and password.'
  		}]
  		req.session.flash = {
  			err: usernamePasswordRequiredError
  		}
  		res.redirect('/session/new');
  		return;
  	}
  	User.findOneByEmail  (req.param('email'), function foundUser(err, user) {
  		if (err){ next(err);}
  		if (!user){
        var noAccountError = [{
         name: 'noAccount',
         message: 'The user address ' + req.param('email') + ' not found.'
       }]
       req.session.flash = {
         err: noAccountError
       }
       res.redirect('/session/new');
       return;  			
     }
     if(require('MD5')(req.param('password')) != user.encryptedPassword){
       var usernamePasswordMismatchError = [{
        name: 'usernamePasswordMismatch',
        message: 'Invalid username and password combination.'
      }]
      req.session.flash = {
        err: usernamePasswordMismatchError
      }
      res.redirect('/session/new');
      return;
    }
    user.online = true;
    user.save(function(err, user) {
      if (err) return next(err);

    }); 
    sails.io.sockets.emit('user', {
      verb: 'login',
      id: user.id,
      action: 'login',
      status:true
    })     
    req.session.authenticated = true;
    req.session.User = user;  		
    return res.redirect('/message');
    
  });
},
destroy: function(req, res, next) {
  var socket = req.socket;
  var io = sails.io;
  User.findOne(req.session.User.id, function foundUser(err, user) {

    var userId = req.session.User.id;

    if (user) {
        // The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
        User.update(userId, {
          online: false
        }, function(err) {
          if (err) return next(err);

          User.publishDestroy(user.id, null, {previous: user});
          req.session.destroy();

          // Redirect the browser to the sign-in screen
          res.redirect('/session/new');
        });
      } else {

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        res.redirect('/session/new');
      }
    });
},
_config: {}


};
