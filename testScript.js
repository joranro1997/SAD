//The exported module is imported into the test script.
var cartMaker = require('./CartMaker.js');
//We create an instance of the class from the exported module.
let cart = new cartMaker('cart1', ['pizza', 'beer'])
//We call different functions from the newly created instance of the exported class.
cart.addItem('melon');

cart.toString();

cart.checkItem('melon');

cart.removeItem('pizza');

cart.checkItem('melon');

cart.toString();
