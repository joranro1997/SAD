
function b(){
	return c;
}

var a;
var c;
var d;

a=b();
c=d();
a;
c;

d = function(){
	return b();
}

