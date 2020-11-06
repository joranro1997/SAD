var foo = (function(){

		var o = { bar: "bar"};

		return {
				bar:function (){
					console.log(o.bar); // closure in a module (classic module pattern)
				}
		};

}) ();


foo.bar();