// import required modules, bcrypt for encryption, passport for auth
const express = require('express');
const router = express.Router();
const joi = require('joi');

// import in user model
let Item = require('../models/item');

// Define user schemas - could later use joigoose, but just use joi and mongoose seperately for now
const itemSchema = joi.object().keys({
    username: joi.string().required(),
    desiredPrice: joi.number().required(),
    itemName: joi.string().required(),
    currency: joi.string().required()
});

// POST request for user registration
router.post('/addItem', (req, res) => {

    // validate request
    let validated = joi.validate(req.body, itemSchema);
    if (validated.error != null) {
        throw new Error(validated.error.message);
    }
    let body = validated.value;

    //create new item object
    let newItem = new Item({
        userID: body.username,
        desiredPrice: body.desiredPrice,
        currency: body.currency,
        lowestPrice: 1000000000,
        url: 'Currently unavailable',
        itemName: body.itemName
    });

    let query = {itemName:body.itemName};
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
            res.send('\n Item already exists! \n');
        }
    });
});
  
module.exports = router;