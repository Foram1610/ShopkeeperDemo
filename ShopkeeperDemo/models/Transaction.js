const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate')


const transactionSchema = new mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Customer',
        require : [true,"Customer is required!!"]
    },
    date : {
        type : Date,
        require : [true,"Date is required!!"]
    },
    type : {
        type : String,
        require : [true,"Please select type of transaction!!"],
        enum : ['credit','debit','return']
    },
    subtotal : Number,
    totalQuantity : Number,
    totalTax : Number,
    discount : Number,
    total : Number,
},
{
    timestamps : true
})
transactionSchema.plugin(mongoosePagination);

module.exports = mongoose.model('Transactions', transactionSchema, 'Transactions')