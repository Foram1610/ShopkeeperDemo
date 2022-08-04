const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate')

const shopdetailsSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require : [true,"User is required!!"]
    },
    name : {
        type : String,
        require : [true,"Shop's name is required!!"]
    },
    address : {
        type : String,
        require : [true,"Shop's address is required!!"]
    },
    city : {
        type : String,
        require : [true,"City is required!!"]
    },
    state : {
        type : String,
        require : [true,"State is required!!"]
    },
    country : {
        type : String,
        require : [true,"Country is required!!"]
    },
    logo : String,
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
shopdetailsSchema.plugin(mongoosePagination);
module.exports = mongoose.model('ShopDetails', shopdetailsSchema, 'ShopDetails')