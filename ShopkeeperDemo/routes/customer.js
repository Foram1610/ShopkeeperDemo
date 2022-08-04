const express = require('express')
const router = express.Router()
const customer = require('../controllers/customer.controller')
const {  valResult,checkCustomer } = require('../middlewares/validation')
const authMiddleware = require('../middlewares/auth')

router.post('/addcustomer',authMiddleware,checkCustomer,valResult,customer.addCustomer)
router.put('/updatecustomer/:_id',authMiddleware,customer.updateCustomer)
router.get('/display',authMiddleware,customer.displayCustomer)
router.get('/alertmail',authMiddleware,customer.sendAlertMail)
router.get('/deactive/:_id',authMiddleware,customer.activeDeactiveCustomer)
router.get('/addressWiseSuggestion',authMiddleware,customer.suggetion)
router.post('/deleteCustomer/:_id',authMiddleware,customer.deleteCustomer) 
router.get('/getDetails',authMiddleware,customer.getDetails)
router.post('/in',customer.insertData)

// router.get('/creditCustomer',authMiddleware,customer.creditCustomerList)
// router.post('/display1',authMiddleware,customer.displayCustomer1)
// router.get('/displayActivecustomer',authMiddleware,customer.displayActiveCustomer)
// router.get('/serachcustomer',authMiddleware,customer.searchCustomer)

module.exports = router 