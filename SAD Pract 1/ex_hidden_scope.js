var foo = "goo";

(function () {
		var foo = "goo2";
		console.log(foo);

}) (); // we make a function expression not a function declaration

console.log(foo);  // "foo"