const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },
    quantity:{
        type: Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required:true
    }
})

CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
