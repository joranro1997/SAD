
function b(){
	return c;
}

var a;
var c;
var d;

d = function(){
	return b();
}

a=b();
c=d();
a;
c;


