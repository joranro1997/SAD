var bar = "bar";

function foo(str) {
	eval(str);
	console.log(bar);
}

foo("var bar = 42;");