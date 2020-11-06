var fs = require('fs');

function getFiles(dir, files_) {
	files_ = files_ || [];
	var files = fs.readdir(dir, function (err,data) {
			return data;
	});

	for (var i in files) {
		var name = dir + '/' + files[i];
		if (fs.stat(name).isDirectory()){
			getFiles(name,files_);

		} else {
			files_.push(name);
		}
	}
	
	return files_;
}

console.log(getFiles('..'));

