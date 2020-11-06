function foo() {
	console.log(bar);
}

function baz(){
	var bar = "bar";
	foo();
}
baz();