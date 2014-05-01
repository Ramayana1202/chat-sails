module.exports = {
	attributes: {
		'email':{
			type:'email',
			required: true,
			unique: true
		},
		'encryptedPassword':{
			type: 'string'
		},
		'online':{
			type:'boolean',
			defaultsTo: false
		},
 		toJSON: function(){
 			var obj = this.toObject();
 			delete obj.password;
 			delete obj.confirmation;
 			delete obj.encryptedPassword;
 			delete obj._csrf;
 			return obj;
 		}		
	},
	 	beforeCreate: function (values, next) {
	 		if (!values.password || values.password != values.confirmation){
	 			return next({err: ["password != confirmation"]});
	 		}
	 		var md5 = require('MD5');
	 		encryptedPassword = md5(values.password);
	 		values.encryptedPassword = encryptedPassword;
	 		next();
	 		
	 	}
};