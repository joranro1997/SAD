const express = require('express');
const service = express();
const Cart = require('../models/cart');
const axios = require('axios');
var backendPort
const backendService = () => axios.get(`http://localhost:3000/find/backend/1.0.0`).then(res => {backendPort = res.data.port});

backendService();

const interval = setInterval(backendService, 20000);

var products = [];
var availableProducts;

module.exports = (config) => {
  const log = config.log();
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get('/cart', async function (req, res, next) {
    await axios.get("http://localhost:"+ backendPort + "/goods").then(res => {availableProducts = res.data;});
    var cart = new Cart(products);
    response = [{"Items in the cart:": products}, {"Items available in the shop:": availableProducts}];
    res.json(response);
  });

  service.get('/', function (req, res, next) {
    res.redirect('/cart');
  });
  
  service.get('/add/:id/:cod/:desc/:stock', async function(req, res, next) {
    await axios.get("http://localhost:"+ backendPort + "/goods").then(res => {availableProducts = res.data;});
  
    const { id, cod, desc, stock } = req.params;
    var cart = new Cart(products);
    if(availableProducts.length > 0){
      for(let i = 0; i < availableProducts.length; i++){
        if(availableProducts[i]._id == id){
          if(products.length > 0){
            for(let j = 0; j < products.length; j++){
              if(availableProducts[i]._id == products[j]._id){
                if((parseInt(products[j].stock) + parseInt(stock)) <= parseInt(availableProducts[i].stock)){
                  cart.add(id, cod, desc, stock);
                  products = cart.getItems();
                  return res.redirect('/cart');
                }else{return res.status(404).json({ result: 'Not that many of that item in stock' });}
              }
            }
          }else{
            if(stock <= availableProducts[i].stock){
              cart.add(id, cod, desc, stock);
              products = cart.getItems();
              return res.redirect('/cart');
            }
          }
        }
      } return res.status(404).json({ result: 'Item not available in store' });
    } return res.status(404).json({ result: 'Store is empty' });
  });
  
  service.get('/remove/:_id', function(req, res, next) {
    var productId = req.params._id;
    var cart = new Cart(products);
  
    cart.remove(productId);
    products = cart.getItems();
    res.redirect('/cart');
  });

  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });

  return service;
};
