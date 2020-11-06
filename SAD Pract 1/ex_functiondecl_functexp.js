// naming a function expression allows to locate errors more easily, and 
// to understand what is the purpose of the function
var foo = function bar() {
	var foo = "baz";

	function baz(foo) {
		foo = bar;    // ref to the function, allows recursion
		foo;
	}
	baz();
};

foo();
bar();