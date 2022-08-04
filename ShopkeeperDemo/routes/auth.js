const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth.controller')
const { checkShopkeerper, login, valResult, password, forgotpassword } = require('../middlewares/validation')
const imageMiddleware = require('../middlewares/image')
const authMiddleware = require('../middlewares/auth')

// router.post('/', auth.insertRole)
// router.post('/registration', imageMiddleware, auth.registration)
// router.post('/login', auth.login)
// router.get('/me', authMiddleware, auth.me)
// router.get('/allusers', auth.listOfUsers)
// router.post('/forgotLink', auth.forgotPassLink)
// router.post('/forgotpassword', auth.forgotPassword)
// router.post('/resetpassword', authMiddleware, auth.resetPassword)



router.post('/', auth.insertRole)
router.post('/registration', imageMiddleware, checkShopkeerper, valResult, auth.registration)
router.post('/login', login, valResult, auth.login)
router.get('/me', authMiddleware, auth.me)
router.get('/allusers', auth.listOfUsers)
router.post('/forgotLink', auth.forgotPassLink)
router.post('/forgotpassword', forgotpassword,valResult,auth.forgotPassword)
router.post('/resetpassword', authMiddleware, password,valResult,auth.resetPassword)
// router.post('/login1', login, valResult, auth.login1)

module.exports = router;

