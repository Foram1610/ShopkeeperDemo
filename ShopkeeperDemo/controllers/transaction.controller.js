const CustomerModel = require('../models/Customer')
const TransactionModel = require('../models/Transaction')
const ShopdetailsModel = require('../models/Shopdetails');
const mongoose = require('mongoose');
const transport = require('../utils/sendmail')

exports.makeTransaction = async (req, res) => {
    const { customer, date, type, subtotal, totalQuantity, totalTax, discount } = req.body
    const tot = subtotal + totalTax
    const total = tot - discount
    const transaction = new TransactionModel({
        customer, date, type, subtotal, totalQuantity, totalTax, discount, total
    })
    try {
        const customerTransaction = await CustomerModel.findOne({ _id: customer }).select('email firstName balance')
        if (type === 'credit') {
            const total1 = subtotal
            const data = new TransactionModel({
                customer, date, type, subtotal, totalQuantity, total: total1
            })
            const data1 = await data.save()
            if (data1) {
                await CustomerModel.findOneAndUpdate({ _id: customerTransaction._id }, {
                    balance: customerTransaction.balance - total
                })
                return res.status(200).json({ message: 'Transaction done!!!' })
            }
        }
        else if (type === 'debit') {
            const dataSave = await transaction.save()
            if (dataSave) {
                await CustomerModel.findOneAndUpdate({ _id: customerTransaction._id }, {
                    balance: customerTransaction.balance + total
                })
                return res.status(200).json({ message: 'Transaction done!!!' })
            }
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.mailCreditAmount = async (req, res) => {
    try {
        const sendMail = await TransactionModel.find({ type: 'credit' }).populate('customer', '-__v -createdAt -updatedAt').where({ addedBy: req.logInid })
        for (let i = 0; i < sendMail.length; i++) {
            const element = sendMail[i];
            const sendMail1 = transport.sendMail({
                from: 'fparmar986@gmail.com',
                to: element.customer.email,
                subject: 'Credit Transections Update!!',
                html: `<p>Hello ${element.customer.firstName} this is reminder email that your transection is Credit with Rs.${element.total}.</p><br />
                <p>Your current balance is ${element.customer.balance}.</p><br />
                <p>Keep shopping with us 😃 !!!</p>
                <p>Have a good day ✨ !!!</p>`
            })
            if (sendMail1) {
                return res.status(200).json({ message: 'Email send to customers!!' })
            }
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong!!' })
    }
}

// exports.customerWiseTransationlist = async (req, res) => {
//     const customerData = await CustomerModel.aggregate([
//         {
//             $lookup: {
//                 from: 'Transactions',
//                 localField: '_id',
//                 foreignField: 'customer',
//                 // pipeline: [
//                 //     {
//                 //         $match: {
//                 //             $expr: {
//                 //                 $eq : ["$type",req.body.filters.typeOf]
//                 //             }
//                 //         }
//                 //     }
//                 // ],
//                 as: 'transaction',
//             }
//         },
//         {
//             $unwind: '$transaction'
//         },
//         {
//             $project: {
//                 "firstName": "$firstName",
//                 "lastName": "$lastName",
//                 "date": "$transaction.date",
//                 "_id": "$transaction._id",
//                 "total": "$transaction.total",
//                 "type": "$transaction.type"
//             }
//         }
//     ])

//     let customers = [], empty = []
//     let dateFrom = new Date(req.body.filters.dateFrom)
//     let dateTo = new Date(req.body.filters.dateTo)
//     let typeOf = req.body.filters.typeOf

//     if (req.body.filters.dateFrom && req.body.filters.dateTo) {
//         if (req.body.filters.typeOf) {
//             for (let i = 0; i < customerData.length; i++) {
//                 const element = customerData[i];
//                 let displayCustomer = await CustomerModel.findOne({})
//                     .where('addedBy').equals(req.logInid)
//                     .where('firstName').equals(element.firstName)
//                     .where('lastName').equals(element.lastName)
//                 if (displayCustomer === null) {
//                     empty.push(element)
//                 }
//                 else {
//                     if (element.date >= dateFrom && element.date <= dateTo && element.type === typeOf) {
//                         customers.push(element)
//                     }
//                 }
//             }
//         }
//         else {
//             for (let i = 0; i < customerData.length; i++) {
//                 const element = customerData[i];
//                 let displayCustomer = await CustomerModel.findOne({})
//                     .where('addedBy').equals(req.logInid)
//                     .where('firstName').equals(element.firstName)
//                     .where('lastName').equals(element.lastName)
//                 if (displayCustomer === null) {
//                     empty.push(element)
//                 }
//                 else {
//                     if (element.date >= dateFrom && element.date <= dateTo) {
//                         customers.push(element)
//                     }
//                 }
//             }
//         }
//         const len = customers.length()
//         let totalData = len.length
//         let page = parseInt(req.body.pageNo)
//         let limit = parseInt(req.body.perPage)
//         let startIndex = (page - 1) * limit
//         let endIndex = page * limit


//         if (endIndex < totalData) {
//             filter.next = {
//                 page: page + 1,
//                 limit: limit
//             }
//         }

//         if (startIndex > 0) {
//             filter.previous = {
//                 page: page - 1,
//                 limit: limit
//             }
//         }
//         return res.status(200).json({ status: 'SUCCESS', data: customers });
//     }
//     else {
//         if (req.body.filters.typeOf) {
//             for (let i = 0; i < customerData.length; i++) {
//                 const element = customerData[i];
//                 let displayCustomer = await CustomerModel.findOne({})
//                     .where('addedBy').equals(req.logInid)
//                     .where('firstName').equals(element.firstName)
//                     .where('lastName').equals(element.lastName)
//                 if (displayCustomer === null) {
//                     empty.push(element)
//                 }
//                 else {
//                     if (element.type === typeOf) {
//                         customers.push(element)
//                     }
//                 }
//             }
//         }
//         else {
//             for (let i = 0; i < customerData.length; i++) {
//                 const element = customerData[i];
//                 let displayCustomer = await CustomerModel.findOne({})
//                     .where('addedBy').equals(req.logInid)
//                     .where('firstName').equals(element.firstName)
//                     .where('lastName').equals(element.lastName)
//                 if (displayCustomer === null) {
//                     empty.push(element)
//                 }
//                 else {
//                     customers.push(element)
//                 }
//             }
//         }
//         return res.status(200).json({ status: 'SUCCESS', data: customers });
//     }
// }

exports.customerWiseTransationlist = async (req, res) => {
    let query = [
        {
            $lookup: {
                from: 'Transactions',
                localField: '_id',
                foreignField: 'customer',
                as: 'transaction',
            }
        },
        {
            $unwind: '$transaction'
        },
        {
            $match: {
                'addedBy': mongoose.Types.ObjectId(req.logInid)
            }
        }
    ]

    if (req.body.filters.dateFrom) {
        if (req.body.filters.dateTo) {
            query.push(
                {
                    $match: {
                        $and: [
                            { 'transaction.date': { $gte: new Date(req.body.filters.dateFrom) } },
                            { 'transaction.date': { $lte: new Date(req.body.filters.dateTo) } }
                        ]
                    }
                }
            )
        }
        else {
            query.push(
                {
                    $match: { 'transaction.date': { $gte: new Date(req.body.filters.dateFrom) } }
                }
            )
        }
    }

    if (req.body.filters.type) {
        query.push(
            {
                $match: { 'transaction.type': req.body.filters.type }
            }
        )
    }
    const d = await CustomerModel.aggregate(query)
    console.log("data ==> ", d);
    let totalData = d.length
    let page = (req.body.pageNo) ? parseInt(req.body.pageNo) : 1
    let limit = (req.body.perPage) ? parseInt(req.body.perPage) : 10
    let skip = (page - 1) * limit

    query.push(
        {
            $project: {
                "firstName": "$firstName",
                "lastName": "$lastName",
                "date": "$transaction.date",
                "_id": "$transaction._id",
                "total": "$transaction.total",
                "type": "$transaction.type"
            }
        }
    )
    query.push(
        {
            $facet: {
                data: [{ $skip: skip }, { $limit: limit }]
            }
        }
    )
    const transactionData = await CustomerModel.aggregate(query)
    console.log("data1 ==> ", transactionData);
    return res.status(200).json({ data: transactionData, TotalData: totalData })

}

exports.updateTransaction = async (req, res) => {
    const { type, total } = req.body
    try {
        const updateData = await TransactionModel.findByIdAndUpdate(req.params._id,
            {
                type: type,
                total: total
            })
        const transactionData = await TransactionModel.findById(req.params._id).select('-__v').populate('customer', 'firstName balance')
        let newBalance
        if (type === 'debit') {
            newBalance = transactionData.customer.balance + total
        }
        else {
            newBalance = transactionData.customer.balance - total
        }
        const updateBalance = await CustomerModel.findByIdAndUpdate(transactionData.customer._id,
            {
                balance: newBalance
            })

        if (updateData && updateBalance) {
            return res.status(200).json({ message: 'Transaction updated successfully!!' })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Somthing went wrong!!' })
    }
}

exports.profitLossOfShop = async (req, res) => {
    // const data = await CustomerModel.aggregate([
    //     {
    //         $lookup: {
    //             from: 'ShopDetails',
    //             localField: 'shop',
    //             foreignField: '_id',
    //             as: 'shop'
    //         }
    //     },
    //     {
    //         $unwind: "$shop"
    //     },
    //     {
    //         $lookup: {
    //             from: 'Transactions',
    //             localField: '_id',
    //             foreignField: 'customer',
    //             as: 'transaction'
    //         }
    //     },
    //     {
    //         $unwind: "$transaction"
    //     },
    //     {
    //         $group: {
    //             _id:
    //             {
    //                 // shop: "$shop.name",
    //                 shop : "$shop.user",
    //                 transaction_type: "$transaction.type",
    //             },
    //             totalValue: { $sum: "$transaction.total" }
    //         }
    //     }
    // ])
    // var details = []

    var profit = 0
    var loss = 0
    try {
        const profitLossDetails = await CustomerModel.find({ addedBy: req.logInid }).select('_id')
        for (let i = 0; i < profitLossDetails.length; i++) {
            const element = profitLossDetails[i];
            let transaction = await TransactionModel.find({ customer: element._id }).select('type total')
            for (let j = 0; j < transaction.length; j++) {
                const element1 = transaction[j];
                if (element1.type == 'debit') {
                    profit = profit + parseInt(element1.total)
                }
                else if (element1.type == 'credit') {
                    loss = loss + parseInt(element1.total)
                }
            }
        }
        let details = { "Debit": profit, "Credit": loss }
        return res.status(200).json({ data: details })
    }
    catch (error) {
        return res.status(400).json({ message: "Something went wrong!!" })
    }
}