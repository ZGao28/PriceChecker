// import required modules, bcrypt for encryption, passport for auth
const express = require('express');
const router = express.Router();
const joi = require('joi');

// import in item model
let Item = require('../models/item');

// Define item schemas - could later use joigoose, but just use joi and mongoose seperately for now
const itemSchema = joi.object().keys({
    desiredPrice: joi.number().required(),
    itemName: joi.string().required(),
    currency: joi.string().required()
});

const deleteItemSchema = joi.object().keys({
    itemName: joi.string().required(),
});

// POST request for creating item
router.post('/addItem', (req, res) => {

    // validate request
    let validated = joi.validate(req.body, itemSchema);
    if (validated.error != null) {
        throw new Error(validated.error.message);
    }
    let body = validated.value;

    // check if user is authenticated
    
    if (!req.isAuthenticated()){
        return res.redirect('/users/login');
    }
    

    //create new item object
    let newItem = new Item({
        // replace the itemID with more effective hash!
        itemID: `user-${req.user.username}-item-${body.itemName}`,
        userID: req.user.username,
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
            newItem.save();
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

    // check if user is authenticated
    if (!req.isAuthenticated()){
        return res.redirect('/users/login');
    }

    // create query using itemID made by username and itemname (need to replace with proper hash)
    // with req.user.username only people who are logged in can change their own items list
    let body = validated.value;
    let query = {itemID: `user-${req.user.username}-item-${body.itemName}`};

    // delete item from database
    Item.deleteOne(query, (err, res) => {
        if(err) throw new Error(err);
    });
    
    res.redirect('/');

});

// GET request for addItem form 
router.get('/addItem', (req, res) => {
    res.render('addItem');
});

// GET request for special ALEXA! - some sort of auth later on would be nice
router.get('/alexa', (req, res) => {
    // have to manually give id
    let query = {userID: 'daniel'}
    Item.find(query, (err, items) => {
        if(err) throw new Error(err);
        res.send(JSON.stringify(items));
    });
});



module.exports = router;