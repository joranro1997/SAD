var foo;

try {
	foo.length;

} catch (err) {
	console.log(err); // TypeError
}

console.log(err); // err is not visible outside catch block