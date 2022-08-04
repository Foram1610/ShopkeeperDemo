const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate')

const customerSchema = new mongoose.Schema({
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ShopDetails',
        require : [true,"Shop is required!!"]
    },
    firstName : {
        type : String,
        require : [true,"Firstname is required!!"]
    },
    lastName : {
        type : String,
        require : [true,"Lastname is required!!"]
    },
    dob : Date,
    email : {
        type : String,
        unique: true,
    },
    mobileNo : {
        type : String,
        require : [true,"Mobile number is required!!"]
    },
    gender : {
        type : String,
        require : [true,"Gender is required!!"]
    },
    balance : {
        type : Number,
        require : true
    },
    address : String,
    city : {
        type : String,
        require : [true,"City is required!!"]
    },
    state :{
        type : String,
        require : [true,"State is required!!"]
    },
    country : {
        type : String,
        require : [true,"Country is required!!"]
    },
    addedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require : [true,"Please enter the username, who added this customer!!"]
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
customerSchema.plugin(mongoosePagination);
module.exports = mongoose.model('Customer', customerSchema, 'Customer')