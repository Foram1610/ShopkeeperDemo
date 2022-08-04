const mongoose = require('mongoose')

const transactionItemSchema = new mongoose.Schema({
    transection : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Transactions'
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Products'
    },
    qty : {
        type : Number,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
},
{
    timestamps : true
})

module.exports = mongoose.model('TransactionItem', transactionItemSchema, 'TransactionItem')