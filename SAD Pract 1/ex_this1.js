function foo() {
	console.log(this.bar);
}

var bar = "bar1";
var o2 = { bar: "bar2",foo:foo};
var o3 = { bar: "bar3",foo:foo};

foo();  // undefined in strict mode, bar1 in non strict mode
o2.foo();
o3.foo();

