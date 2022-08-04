const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    name : String,
    cityCode : String,
    stateID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State', 
    },
    countryID : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    }
})

module.exports = mongoose.model('City', citySchema, 'City')