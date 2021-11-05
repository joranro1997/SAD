module.exports = function Cart(items) {
    this.items = items || {};

    this.add = function(id, cod, desc, stock) {
        var cartItem = false;
        if(this.items.length > 0){
            for(let i = 0; i < this.items.length; i++){
                console.log(this.items[i]);
                if(this.items[i]._id == id){
                    cartItem = this.items[i];
                }
            }
        }
        if (!cartItem) {
            cartItem = this.items[this.items.length] = {_id: id, cod: cod, desc: desc, stock: 0};
        }
        for(let i = 1; i <= stock; i++){
            cartItem.stock++;
        }
    };

    this.remove = function(id) {
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i]._id == id){
                delete this.items[i];
            }
        }
    };
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};