function alert(x) { // Needed in Node.js in order
    console.log(x); // to print messages to stdout.
}
var global = 'this is global';
function scopeFunction() {
    alsoGlobal = 'This is also global!';
    var notGlobal = 'This is private to scopeFunction!';
    function subFunction() {
        alert(notGlobal); 
        stillGlobal = 'No var keyword so this is global!';
        var isPrivate = 'This is private to subFunction!';
    }
    alert(stillGlobal); 
    subFunction();  
    alert(stillGlobal); 
    alert(isPrivate); 
    alert(global);  
}
alert(global);      
alert(alsoGlobal);  

scopeFunction();
alert(alsoGlobal);  
alert(notGlobal);   
