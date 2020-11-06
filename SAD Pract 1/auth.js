
exports.createSalt = function (depth, callback) {
// do salting here
	if (err) {
		return callback(err);
	};
	callback();
};
 
exports.createHash = function (password, salt, callback) {
// hashify
	if (err) {
		return callback(err);
	}
	callback();
};
