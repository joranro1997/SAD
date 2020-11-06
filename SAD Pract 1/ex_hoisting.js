var a=b();
var c=d;
a;
c;

function b(){
	return c;
}

var d = function(){ // is not a function declaration, is a function expression
	return b();
}

