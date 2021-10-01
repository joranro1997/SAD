var cartMaker = require('./CartMaker.js');

let cart = new cartMaker('cart1', ['pizza', 'beer'])

cart.addItem('melon');

cart.toString();

cart.checkItem('melon');

cart.removeItem('pizza');

cart.checkItem('melon');

cart.toString();
