const CartItem = require('../models/cartItem');
const Cart = require('../models/cart');
const express = require('express');
const router = express.Router();

//add new cart
router.post('/', async (req,res) => {
    let i = 1;
    const cartItemsIds = Promise.all(
        req.body.cartItems.map(async (cartItem) => {
            console.log('inside' + i);
            i++;
            let newCartItem = new CartItem({
                item: cartItem.item,
                quantity: cartItem.quantity
            })
            newCartItem = await newCartItem.save();
            
            return newCartItem._id;
    }));
    

    const cartItemsIdsResolved = await cartItemsIds;
    console.log('cartItemsIds' + cartItemsIdsResolved);


    let x = 1
    const totalPrices = await Promise.all(
        cartItemsIdsResolved.map(async (cartItemId) => {
            console.log('inside ID' + x);
            x++;
            const cartItem = await CartItem.findById(cartItemId).populate('item','price');
            console.log('cartItem' + cartItem);
            const totalPrice = cartItem.item.price * cartItem.quantity;
            return totalPrice;
        }));

    const totalPrice = totalPrices.reduce((a,b)=>a+b, 0);
    console.log('totalPrice' + totalPrice);

    let cart = new Cart({
        cartItems:cartItemsIdsResolved,
        user:req.body.user,
        totalPrice:totalPrice
    })

    cart = await cart.save();

    if(!cart){
        return res.status(400).send('Cart cannot be created');
    }
    res.send(cart);
});

//get all cart
router.get('/', async (req,res) => {
    // const cartList = await Cart.find().populate('user').populate('cartItems');

    const cartList = await Cart.find().populate('user');
    if(!cartList){
        return res.status(400).send("NO carts available");
    }
    res.send(cartList);

});

//get by id
router.get('/:id', async (req,res) => {

    const cart = await Cart.findById(req.params.id)
    .populate({path:'cartItems' , populate: {path:'item',populate:'category'}});
    if(!cart){
        return res.status(400).send("Cannot display cart");
    }
    res.send(cart);

})

module.exports = router;