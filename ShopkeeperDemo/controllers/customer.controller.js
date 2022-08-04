const CustomerModel = require('../models/Customer')
const ShopModel = require('../models/Shopdetails')
const TransactionModel = require('../models/Transaction')
const transport = require('../utils/sendmail')
const CountryModel = require('../models/Country')
const CityModel = require('../models/City')
const StateModel = require('../models/State')

exports.addCustomer = async (req, res) => {
    // TODO: Error handling
    const { shop, firstName, lastName, dob, email, mobileNo, gender, address, city, state, country } = req.body
    const shopid = await ShopModel.findOne({ $and: [{ _id: shop }, { user: req.logInid }] })
    try {
        if (shopid) {
            const customer = new CustomerModel({
                shop, firstName, lastName, dob, email, mobileNo, gender, balance: 0, address, city, state, country,
                addedBy: req.logInid,
            })
            const customerDetails = await customer.save()
            if (customerDetails) {
                return res.status(200).json({ message: 'Customer Inserted!!' })
            }
            else {
                return res.status(400).json({ message: 'Customer Not Inserted!!' })
            }
        }
    } catch (error) {
        return res.status(404).json({ message: 'Something went wrong!!!' })
    }
}

exports.updateCustomer = async (req, res) => {
    const { shop, firstName, lastName, dob, email, mobileNo, gender, address, city, country, state } = req.body
    const shopid = await ShopModel.findOne({ $and: [{ _id: shop }, { user: req.logInid }, { isDeleted: false }] })
    try {
        if (shopid) {
            const customer = await CustomerModel.findByIdAndUpdate(req.params._id, {
                $set: {
                    shop: shop,
                    firstName: firstName,
                    lastName: lastName,
                    dob: dob,
                    email: email,
                    mobileNo: mobileNo,
                    gender: gender,
                    address: address,
                    city: city,
                    country: country,
                    state: state
                }
            })
            if (customer) {
                return res.status(200).json({ message: 'Customer details updated!!' })
            }
            else {
                return res.status(400).json({ message: 'Customer details not updated!!' })
            }
        }
    } catch (error) {
        return res.status(401).json({ message: 'Something went wrong!!!' })
    }
}

// exports.displayCustomer = async (req, res) => {
//     const data = await CustomerModel.find({ $and: [{ addedBy: req.logInid }, { isDeleted: false }] }).populate('shop', 'name').populate('addedBy', 'firstName -_id').select('-__v -updatedAt -createdAt')
//     const e = data.length

//     if (data) {
//         return res.status(200).json({ data: data })
//     }
//     else {
//         return res.status(400).json({ message: 'Something went wrong!!!' })
//     }
// }

exports.insertData = async (req, res) => {
    const { name, cityCode, stateID, countryID } = req.body
    const data = new CityModel({
        name, cityCode, stateID, countryID
    })
    const d = await data.save()
    res.send('d ==> ', d)
}

exports.getDetails = async (req, res) => {
    const city = await CityModel.find({}).select('name -_id')
    const country = await CountryModel.find({}).select('name -_id')
    const state = await StateModel.find({}).select('name -_id')
    const shops = await ShopModel.find({ $and: [{ user: req.logInid }, { isDeleted: false }] }).select('name _id')
    res.json({ city: city, state: state, country: country, shops: shops });
}


exports.displayCustomer = async (req, res) => {

    let filter = {}
    let sorting = {}

    if (req.body.filters.city) {
        filter.city = req.body.filters.city
    }
    if (req.body.filters.state) {
        filter.state = req.body.filters.state
    }
    if (req.body.filters.country) {
        filter.country = req.body.filters.country
    }
    if (req.body.filters.shop) {
        filter.shop = req.body.filters.shop
    }
    if (req.body.filters.gender) {
        filter.gender = req.body.filters.gender
    }

    if (req.body.search) {
        const keyword = req.body.search ? {
            $or: [
                { firstName: { $regex: req.body.search, $options: 'i' } },
                { lastName: { $regex: req.body.search, $options: 'i' } },
                { mobileNo: { $regex: req.body.search, $options: 'i' } }
            ]
        } : {};
        filter = keyword
    }


    if (req.body.sortBy.firstName) {
        if (req.body.sortBy.firstName === 'asc') {
            sorting = { firstName: 1 }
        }
        else {
            sorting = { firstName: -1 }
        }
    }
    if (req.body.sortBy.shop) {
        if (req.body.sortBy.shop === 'asc') {
            sorting = { shop: 1 }
        } else {
            sorting = { shop: -1 }
        }
    }
    if (req.body.sortBy.isActive) {
        if (req.body.sortBy.isActive === 'asc') {
            sorting = { isActive: 1 }
        }
        else {
            sorting = { isActive: -1 }
        }
    }
    if (req.body.sortBy.balance) {
        if (req.body.sortBy.balance === 'asc') {
            sorting = { balance: 1 }
        }
        else {
            sorting = { balance: -1 }
        }
    }
    const len = await CustomerModel.find(filter)
        .where('addedBy').equals(req.logInid)
        .where('isDeleted').equals(false)
        .sort(sorting)

    let totalData = len.length
    let page = (req.body.pageNo) ? parseInt(req.body.pageNo) : 1
    let limit = (req.body.perPage) ? parseInt(req.body.perPage) : 10
    let startIndex = (page - 1) * limit

    const ans = await CustomerModel.find(filter)
        .where('addedBy').equals(req.logInid)
        .where('isDeleted').equals(false)
        .populate('shop', 'name')
        .populate('addedBy', 'firstName -_id')
        .select('-__v -updatedAt')
        .sort(sorting)
        .limit(limit).skip(startIndex)
        .exec()
    try {
        if (ans) {
            return res.status(200).json({ data: ans, TotalData: totalData })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

// exports.displayActiveCustomer = async (req, res) => {
//     const customerDetails = await CustomerModel.find({ $and: [{ isActive: true }, { addedBy: req.logInid }] }).populate('shop', 'name -_id').populate('addedBy', 'firstName')
//     if (customerDetails) {
//         return res.status(200).json({ data: customerDetails })
//     }
//     else {
//         return res.status(400).json({ message: 'Something went wrong!!!' })
//     }
// }

// exports.creditCustomerList = async (req, res) => {
//     const transactionStatus = await TransactionModel.find({ type: 'credit' })
//     if (transactionStatus) {

//         return res.status(200).json({ data: transactionStatus })
//     }
//     else {
//         return res.status(400).json({ message: 'Something went wrong!!!' })
//     }
// }

exports.sendAlertMail = async (req, res) => {
    const data = await CustomerModel.find({ $and: [{ addedBy: req.logInid }, { isDeleted: false }, { isActive: true }] }).select('balance email firstName')
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.balance < 1500) {
            const data1 = transport.sendMail({
                to: element.email,
                from: 'fparmar986@gmail.com',
                subject: 'Low Balance Alert!!',
                html: `<h1>Your balance is not sufficient!!</h1><br />
                <p>Hello ${element.firstName} this is alert to inform you about your balance.</p><br />
                <p>Your current balance is ${element.balance}.</p><br />
                <p>Keep shopping with us 😃 !!!</p>
                <p>Have a good day ✨ !!!</p>`
            })
            if (data1) {
                return res.status(200).json({ message: 'Email send to customers!!' })
            }
        }
        else {
            const data1 = transport.sendMail({
                to: element.email,
                from: 'fparmar986@gmail.com',
                subject: 'Balance Alert!!',
                html: `<h1>Your balance is sufficient!!</h1><br />
                <p>Hello ${element.firstName} this is alert to inform you about your balance.</p><br />
                <p>Your current balance is ${element.balance}.</p><br />
                <p>Keep shopping with us 😃 !!!</p>
                <p>Have a good day ✨ !!!</p>`
            })
            if (data1) {
                return res.status(200).json({ message: 'Email send to customers!!' })
            }
        }
    }
}

exports.searchCustomer = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { mobileNo: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    const data = await CustomerModel.find(keyword)
        .find({ $and: [{ addedBy: req.logInid }, { isDeleted: false }] })
        .select('-createdAt -updatedAt -__v');
    if (data) {
        return res.status(200).json({ data: data })
    }
    else {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.suggetion = async (req, res) => {
    const data = await CustomerModel.find({ $and: [{ addedBy: req.logInid }, { isDeleted: false }] })
        .select('name shop address city')
        .populate('shop', 'name address city -_id')
    var custArea = [], shopArea = []
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        custArea.push(element.address)
        shopArea.push(element.shop.address)
    }
    for (let i = 0; i < shopArea.length; i++) {
        const element = shopArea[i];
        const shopDetails = await ShopModel.findOne({ $and: [{ address: element }, { isDeleted: false }] }).select('-__v -_id -createdAt -updatedAt');
        const match = await CustomerModel.find({ $and: [{ address: element }, { isDeleted: false }, { addedBy: req.logInid }] }).select('-__v -_id -createdAt -updatedAt')

        for (let j = 0; j < match.length; j++) {
            const element1 = match[j];
            const data1 = transport.sendMail({
                to: element1.email,
                from: 'fparmar986@gmail.com',
                subject: 'Shop near by you!!!!',
                html: `<h1>Heyy ${element1.firstName}  ${element1.lastName} ✋!!</h1><br />
                <p>Our ${shopDetails.name} is near by your area ${shopDetails.address}.<br />Please do visit 😃 .</p><br />
                <p>Keep shopping with us 😃 !!!</p>
                <p>Have a good day ✨ !!!</p>`
            })
            if (data1) {
                return res.status(200).json({ message: 'Email send to customers!!' })
            }
        }
    }
}

exports.activeDeactiveCustomer = async (req, res) => {
    try {
        const customerData = await CustomerModel.findOne({ $and: [{ _id: req.params._id }, { addedBy: req.logInid }, { isDeleted: false }] })
        let activeStatus
        if (customerData.isActive === true) {
            activeStatus = false
        } else {
            activeStatus = true
        }
        await CustomerModel.findByIdAndUpdate(req.params._id, { isActive: activeStatus })
        return res.status(200).json({ message: "Customer's status changed!!" })
    }
    catch (error) {
        return res.status(400).json({ message: "Somthing went wrong!!" })
    }
}

exports.deleteCustomer = async (req, res) => {
    const customerData = await CustomerModel.findOne({ $and: [{ _id: req.params._id }, { addedBy: req.logInid }] })
    if (customerData.isDeleted === false) {
        await CustomerModel.findOneAndUpdate({ _id: req.params._id }, {
            isDeleted: true,
            isActive: false
        })
        return res.status(200).json({ message: "Customer deleted!!" })
    }
    else {
        return res.status(400).json({ message: "Can not activate customer now!!!!" })
    }
}


