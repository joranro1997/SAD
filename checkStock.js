var StockDb = require('./manipulateStock.js');

let stockDb = new StockDb('mongodb://localhost:27017/shop');

stockDb.addItems();
stockDb.isInStock('palos');
stockDb.isInStock('hierros');
stockDb.isInStock('muelles');