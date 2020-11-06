
function one(cb) {
	console.log("one");
	setTimeout(cb,1000);	
}


function two(cb) {
	console.log("two");
	setTimeout(cb,1000);	
}

function three(cb) {
	console.log("three");
}

one(function() {two(three)});
