/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
 var path = require('path');
 var sys = require('sys');
 var exec = require('child_process').exec;
 module.exports.bootstrap = function (cb) {
 	User.update({}, {'online':false}).exec(cb);
 /*	var postsSource = path.join(process.cwd(), 'attachments/posts')
 	, postsDest = path.join(process.cwd(), '.tmp/public/images/posts');
 	exec('ln -s '+postsDest+' '+postsSource , function(err, stdout, stderr){
 	//console.log(postsSource);
 	//console.log(postsDest);
 	cb(err);
 });*/

 };

