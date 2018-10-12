// import required modules, bcrypt for encryption, passport for auth
const express = require('express');
const router = express.Router();
const joi = require('joi');

// import in item model
let Item = require('../models/item');

// Define item schemas - could later use joigoose, but just use joi and mongoose seperately for now
const itemSchema = joi.object().keys({
    username: joi.string().required(),
    desiredPrice: joi.number().required(),
    itemName: joi.string().required(),
    currency: joi.string().required()
});

const deleteItemSchema = joi.object().keys({
    itemName: joi.string().required(),
    username: joi.string().required()
});

// POST request for creating item
router.post('/addItem', (req, res) => {

    // validate request
    let validated = joi.validate(req.body, itemSchema);
    if (validated.error != null) {
        throw new Error(validated.error.message);
    }
    let body = validated.value;

    //create new item object
    let newItem = new Item({
        // replace the itemID with more effective hash! 
        itemID: `user-${body.username}-item-${body.itemName}`,
        userID: body.username,
        desiredPrice: body.desiredPrice,
        currency: body.currency,
        lowestPrice: 1000000000,
        url: 'Currently unavailable',
        itemName: body.itemName
    });

    let query = {itemID:newItem.itemID};
    Item.findOne(query, (err, item) => {
        //make sure there is no error and item with specified item name does not already exist
        if (!item) {
            newItem.save((err) => {
                if(err){
                    console.log(err);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.send('\n You already have that item already on your list! \n');
        }
    });

    res.redirect('/');
});


// POST request for deleting item
router.post('/deleteItem', (req, res) => {
    // validate request
    let validated = joi.validate(req.body, deleteItemSchema);
    if (validated.error != null) {
        throw new Error(validated.error.message);
    }

    // create query using itemID made by username and itemname (need to replace with proper hash)
    let body = validated.value;
    let query = {itemID: `user-${body.username}-item-${body.itemName}`};

    // delete item from database
    Item.deleteOne(query, (err, res) => {
        if(err) throw new Error(err);
    });
    
    res.redirect('/');

});
  
module.exports = router;