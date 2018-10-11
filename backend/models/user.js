// require joi for schema validation
const joi = require('joi');


// create User object 

const User = module.exports = {
    

    // register user function
    registerUser: () => {

    },
    // schema for user
    schema: joi.object().keys({
        shopname: joi.string().required(),
        description: joi.string().required() 
    })
}
