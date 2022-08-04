const express = require('express')
const router = express.Router()
const { checkShop ,valResult,} = require('../middlewares/validation')
const authMiddleware = require('../middlewares/auth')
const logoMiddleware = require('../middlewares/logo')
const shop = require('../controllers/shop.controller')

router.post('/addshop',authMiddleware,logoMiddleware,checkShop,valResult,shop.addShop)
router.put('/updateshop/:_id',authMiddleware,shop.updateShopDetails)
router.put('/updatelogo/:_id',authMiddleware,logoMiddleware,shop.updateShopLogo)
router.get('/displayshop',authMiddleware,shop.displayUsersShop)
router.get('/deactiveshop/:_id',authMiddleware,shop.activeDeactiveShops)
router.post('/deleteShop/:_id',authMiddleware,shop.deleteShops)
// router.get('/searchshop',authMiddleware,shop.searchUsersShop)

module.exports = router