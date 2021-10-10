module.exports = class StockDb {
    mgdb = require('mongodb');

    constructor(url) {
        this.mongoclient = this.mgdb.MongoClient;
        this.url = url;
    }

    interactWithDb(func) {
        this.mongoclient.connect(this.url).then((client) => {
            const db = client.db("shop");

            db.listCollections().toArray().then((docs) => {
                if(!docs.map(doc => doc.name).includes('products')) {
                    db.createCollection('products').then(() => {
                        console.log("Collection created!");
                    }).catch((err) => {
                        console.log(err);
                    });

                    db.members.createIndex( { "cod": 1 }, { unique: true } )
                }
            }).catch((err) => {
                console.log(err);
            });

            func(db,client);
            
        }).catch((err) => {
            throw err;
        });
    }

    insertGoods(db, client) {
        var collection = db.collection('products');
        let query = { _id: 1 };
        collection.findOne(query).then((res) => {
            if(res == null) {
                collection.insertMany([
                    {_id: 1, cod : 1,desc:'palos',stock:0}, {_id: 2, cod : 2,desc:'hierros',stock:10}, {_id: 3,cod : 3,desc:'muelles',stock:5}
                ]);
            }
            client.close();
        });
    }

    checkGoods(good, db, client) {
        var collection = db.collection('products');
        let query = { desc: good };
        collection.findOne(query).then((result) => {
            if(result.stock) {
                console.log({product: good, success: "Exists"});
            } else {
                console.log({product: good, error: "Not in stock"});
            }
            client.close();
        }).catch((err) => {
            throw err;
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