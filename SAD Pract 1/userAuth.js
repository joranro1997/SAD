var db = require('./db.js');
 
app.on('/createUser', function(req, res) {
	var user = req.username,
	pwd = req.password,
	email = req.email;
 
	db.lookup('user', {username: user }, function(err, data) {
		if (err) {
			return;
		}
		// Didn't find a user by that name
	
		if (data.userid === null) {
   			createSalt(10, function(err, salt) {
				if (err) {
				return;
				}
				createHash(pwd, salt, function(err, hash) {
					db.create('user', {username: user, password: pwd, email: email }, function(err, user) {
						if (err) {
							return;
						} else {
							user.isauthenticated = true;
							app.users.push[user];
							res.send(user);
						}
					});
				});
 
			});
		}
	});
 
});

function createSalt(depth, callback) {
// do salting here
	if (err) {
		return callback(err);
	};
	callback();
};
 
function createHash(password, salt, callback) {
// hashify
	if (err) {
		return callback(err);
	}
	callback();
};

