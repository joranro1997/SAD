const express = require('express');
const mgdb = require('mongodb');
const service = express();
const mongoclient = mgdb.MongoClient;
const url = ' mongodb://localhost:27017/shop';

module.exports = (config) => {
  const log = config.log();
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get('/goods/', (req, res, next) => {
    mongoclient.connect(url).then((client) => {
      const db = client.db("shop");
      var collection = db.collection('products');
      
      collection.find({}).toArray(function(err, result) {
        if (err) return res.status(404).json({ result: 'Something went wrong' });
        client.close();
        return res.json(result);
      });
    });
  });

  service.get('/goods/:good', (req, res, next) => {
    const { good } = req.params;
    mongoclient.connect(url).then((client) => {
      const db = client.db("shop");
      var collection = db.collection('products');
      
      collection.findOne({ desc: good }).then((result) => {
        client.close();
        return res.json(result);
      }).catch((err) => {
        return res.status(404).json({ result: 'Something went wrong' });
      });
    });
  });

  service.post('/goods/:code/:good/:number', (req, res) => {
    const { code, good, number } = req.params;
    mongoclient.connect(url).then((client) => {
      const db = client.db("shop");
      var collection = db.collection('products');
      const el = {_id: code, cod : code, desc: good, stock: number};
      collection.insertMany([el]);
      return res.json(el);
    });
  });
  
  service.put('/goods/:code/:number', (req, res) => {
    const { code, number } = req.params;
    mongoclient.connect(url).then((client) => {
      const db = client.db("shop");
      var collection = db.collection('products');
      collection.updateOne( { cod: code },
        {
          $set: {
            stock: number
          }
        })
      return res.status(200).json({message: "Altered"});
    });
  });

  service.delete('/goods/:code/:number', (req, res) => {
    const { code, number } = req.params;
    mongoclient.connect(url).then((client) => {
      const db = client.db("shop");
      var collection = db.collection('products');
      
      collection.findOne({ cod: code }).then((result) => {
        var newNum;
        if(result.stock > number) {
          newNum = result.stock - number;
        } else {
          newNum = 0;
        }
        collection.updateOne( { cod: code },
          {
            $set: {
              stock: newNum
            }
          })
        return res.status(200).json({message: "Deleted"});
      }).catch((err) => {
        return res.status(404).json({ result: 'Something went wrong' });
      });
    });
  });

  // eslint-disable-next-line no-unused-vars
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
