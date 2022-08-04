const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ShopDetails'
    },
    category : {
        type : String,
        require : true
    },
    parentCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
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

module.exports = mongoose.model('Category', categoriesSchema, 'Category')