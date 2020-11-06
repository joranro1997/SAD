var db = require('./db.js');
var auth = require('./auth.js');

exports.create = function (req, res, callback) {
	var user = req.username,
	pwd = req.password,
	email = req.email;

	db.findOrCreate('user',{username: user });

 
	db.lookup('user', {username: user }, function(err, data) {
		if (err) {
			return callback(err);
		}
		// Didn't find a user by that name
	
		if (data.userid === null) {
   			auth.createSalt(10, function(err, salt) {
			if (err) {
				return callback(err);
			}
			auth.createHash(pwd, salt, function(err, hash) {
				db.create('user', {username: user, password: pwd, email: email }, function(err, user) {
					if (err) {
						return callback(err);
					} else {
						user.isauthenticated = true;
						return callback(user);
					}
					});
				});
 
			});
		}
	});
 
};

