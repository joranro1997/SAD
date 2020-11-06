var foo = "bar";

function bar() {
	var foo = "baz";
	console.log(foo);

	function baz(foo) {
		foo = "bam";
		console.log(foo);
		bam = "yay";
	}
	baz();
}
bar();
console.log(foo);
console.log(bam);
