var foo = "goo";

(function (bar) {
		var foo = bar;
		console.log(foo);

}) (foo); // we make a function expression not a function declaration

console.log(foo);  // "foo"