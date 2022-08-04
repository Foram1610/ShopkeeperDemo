const express = require('express')
const router = express.Router()
const transaction = require('../controllers/transaction.controller')
const authMiddleware = require('../middlewares/auth')

router.post('/trsnsaction',authMiddleware,transaction.makeTransaction)
router.get('/credit',authMiddleware,transaction.mailCreditAmount)
router.get('/profitloss',authMiddleware,transaction.profitLossOfShop)
router.post('/transationlist',authMiddleware,transaction.customerWiseTransationlist)
router.put('/updaetTransaction/:_id',authMiddleware,transaction.updateTransaction)

module.exports = router