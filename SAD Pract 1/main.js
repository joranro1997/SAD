var user = require('./user.js');

app.on('/createUser', user.create(function(err,user){
	if (err) {
		return;
	}
	app.users.push[user];
}));