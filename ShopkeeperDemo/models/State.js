const mongoose = require('mongoose')

const stateSchema = new mongoose.Schema({
    name : String,
    stateCode : String,
    countryID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country', 
    }
})

module.exports = mongoose.model('State', stateSchema, 'State')
