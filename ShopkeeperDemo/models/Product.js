const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ShopDetails'
    },
    name : {
        type : String,
        require : true
    },
    description : String,
    price : Number,
    image : String,
    addedBy : Number,
    updatedBy : Number,
    isAvailable : Boolean,
    isActive : {
        type : Boolean,
        default : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
})

module.exports = mongoose.model('Products', productSchema, 'Products')