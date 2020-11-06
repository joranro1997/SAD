var foo = (function(){

		var publicAPI = {
			bar : function(){
				publicAPI.baz();
			},
			baz: function(){
				console.log("baz");
			}
		}
		return publicAPI;
}) ();


foo.bar();