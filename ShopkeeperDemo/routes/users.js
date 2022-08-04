const express = require('express')
const router = express.Router()
const users = require('../controllers/users.controller')
const imageMiddleware = require('../middlewares/image')
const authMiddleware = require('../middlewares/auth')

router.put('/updatedetails', authMiddleware, users.updateUser)
router.put('/updateimage',authMiddleware,imageMiddleware,users.updateUserAvatar)
router.get('/profile',authMiddleware,users.displayProfile)
router.get('/verification',authMiddleware,users.sendVerificationMail)

module.exports = router