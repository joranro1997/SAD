module.exports = class StockDb {
    mgdb = require('mongodb');

    constructor(url) {
        this.mongoclient = this.mgdb.MongoClient;
        this.url = url;
    }

    interactWithDb(func) {
        this.mongoclient.connect(this.url,function (err,client) {
            if (err) throw err;

            const db = client.db("shop");

            db.listCollections().toArray().then((docs) => {
                if(!docs.map(doc => doc.name).includes('products')) {
                    db.createCollection('products', function(err, res) {
                        if (err) throw err;
                        console.log("Collection created!");
                    });
                    db.members.createIndex( { "cod": 1 }, { unique: true } )
                }
            }).catch((err) => {
                console.log(err);
            });

            func(db,function() {
                if (err) throw err;
                client.close();
            });
        });
    }

    insertGoods(db, callback) {
        var collection = db.collection('products');
        collection.insertMany([
            {_id: 1, cod : 1,desc:'palos',stock:0}, {_id: 2, cod : 2,desc:'hierros',stock:10}, {_id: 3,cod : 3,desc:'muelles',stock:5}
        ], function(err, result) {
            callback(result);
        });
    }

    checkGoods(good, db, callback) {
        var collection = db.collection('products');
        let query = { desc: good };
        collection.findOne(query, function(err, result) {
            if (err) throw err;
            if(result.stock) {
                console.log({product: good, success: "Exists"});
            } else {
                console.log({product: good, error: "Not in stock"});
            }
            callback(result);
        });
    }

    addItems() {
        this.interactWithDb(this.insertGoods);
    }

    isInStock(good) {
        var func = (db, callback) => this.checkGoods(good, db, callback);
        this.interactWithDb(func);
    }
}