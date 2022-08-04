const ShopModel = require('../models/Shopdetails')

exports.addShop = async (req, res) => {
    const { name, address, city, state, country } = req.body
    let logo
    try {
        if (req.file === undefined) {
            logo = 'deflogo.png'
        }
        else {
            logo = req.file.filename
        }
        const shop = new ShopModel({
            user: req.logInid,
            name, address, city, state, country,
            logo: logo
        })

        await shop.save()
        return res.status(200).json({ message: 'Data inserted!!!' })
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.updateShopDetails = async (req, res) => {
    const { name, address, city, state, country } = req.body
    try {
        const shopDeatils = await ShopModel.findOneAndUpdate({ $and: [{ _id: req.params._id }, { user: req.logInid }, { isDeleted: false }] }, {
            name: name,
            address: address,
            city: city,
            state: state,
            country: country,
        })
        if (shopDeatils) {
            return res.status(200).json({ message: 'Data updated!!!' })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Data not updated!!!' })
    }
}

exports.updateShopLogo = async (req, res) => {
    try {
        const shopLogo = await ShopModel.findByIdAndUpdate(req.params._id, { logo: req.file.filename })
        if (shopLogo) {
            return res.status(200).json({ message: 'Logo updated!!!' })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Logo not updated!!!' })
    }
}

// exports.displayUsersShop = async (req, res) => {
//     try {
//         const shopDetails = await ShopModel.find({ $and: [{ user: req.logInid }, { isDeleted: false }] }).select('-createdAt -updatedAt -__v')
//         if (shopDetails) {
//             return res.status(200).json({ data: shopDetails })
//         }

//     } catch (error) {
//         return res.status(400).json({ message: 'Something went wrong!!!' })
//     }
// }

exports.displayUsersShop = async (req, res) => {

    let filter = {}
    let sorting = {}
    try {
        if (req.body.filters.isActive) {
            filter.isActive = req.body.filters.isActive
        }
        if (req.body.filters.city) {
            filter.city = req.body.filters.city
        }
        if (req.body.filters.state) {
            filter.state = req.body.filters.state
        }
        if (req.body.filters.country) {
            filter.country = req.body.filters.country
        }

        if (req.body.search) {
            const keyword = req.body.search ? {
                $or: [
                    { name: { $regex: req.params.search, $options: 'i' } },
                    { address: { $regex: req.params.search, $options: 'i' } }
                ]
            } : {};
            filter = keyword
        }

        if (req.body.sortBy.name) {
            sorting = { 'name': req.body.sortBy.name }
        }
        if (req.body.sortBy.isActive) {
            sorting = { 'isActive': req.body.sortBy.isActive }
        }
        if (req.body.sortBy.city) {
            sorting = { 'city': req.body.sortBy.city }
        }
        if (req.body.sortBy.state) {
            sorting = { 'state': req.body.sortBy.state }
        }
        if (req.body.sortBy.country) {
            sorting = { 'country': req.body.sortBy.country }
        }
        const len = await ShopModel.find(filter)
            .where('user').equals(req.logInid)
            .where('isDeleted').equals(false)
            .sort(sorting)

        let totalData = len.length
        let page = (req.body.pageNo) ? parseInt(req.body.pageNo) : 1
        let limit = (req.body.perPage) ? parseInt(req.body.perPage) : 10
        let skip = (page - 1) * limit

        // let endIndex = page * limit
        // if (endIndex < totalData) {
        //     filter.next = {
        //         page: page + 1,
        //         limit: limit
        //     }
        // }

        // if (skip > 0) {
        //     filter.previous = {
        //         page: page - 1,
        //         limit: limit
        //     }
        // }

        const ans = await ShopModel.find(filter)
            .where('user').equals(req.logInid)
            .where('isDeleted').equals(false)
            .populate('user', 'firstName -_id')
            .select('-__v -updatedAt')
            .sort(sorting)
            .limit(limit).skip(skip)
            .exec()

        if (ans) {
            return res.status(200).json({ data: ans, TotalData: totalData })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.searchUsersShop = async (req, res) => {
    const keyword = req.params.search ? {
        $or: [
            { name: { $regex: req.params.search, $options: 'i' } },
            { address: { $regex: req.params.search, $options: 'i' } }
        ]
    } : {};
    const searchResult = await ShopModel.find(keyword)
        .find({ $and: [{ user: req.logInid }, { isDeleted: false }] })
        .select('-createdAt -updatedAt -__v');
    if (searchResult) {
        return res.status(200).json({ data: searchResult })
    }
    else {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.activeDeactiveShops = async (req, res) => {
    try {
        const shopData = await ShopModel.findOne({ $and: [{ _id: req.params._id }, { isDeleted: false }, { user: req.logInid }] })
        let activeStatus
        if (shopData.isActive === true) {
            activeStatus = false
        } else {
            activeStatus = true
        }
        await ShopModel.findOneAndUpdate({ _id: req.params._id }, { isActive: activeStatus })
        return res.status(200).json({ message: "Shop's status changed!!" })
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong!!" })
    }
}

exports.deleteShops = async (req, res) => {
    try {
        const shopData = await ShopModel.findOne({ $and: [{ shop: req.params._id }, { user: req.logInid }] })
        if (shopData.isDeleted === false) {
            await ShopModel.findOneAndUpdate({ _id: req.params._id }, {
                isActive: false,
                isDeleted: true
            })
            return res.status(200).json({ message: "Shop deleted!!" })
        }
    } catch (error) {
        return res.status(400).json({ message: "Can not activate shop now!!!!" })
    }
}