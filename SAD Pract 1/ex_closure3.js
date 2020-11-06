function foo() {
	var bar = "bar";

	setTimeout(function(){
		console.log(bar);
	},1000);
}


foo();