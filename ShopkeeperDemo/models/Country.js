const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    name : String,
    isoCode : String
})

module.exports = mongoose.model('Country', countrySchema, 'Country')