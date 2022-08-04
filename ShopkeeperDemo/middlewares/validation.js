const { check, validationResult } = require('express-validator')

exports.checkCustomer = [
    check('firstName').trim().not().isEmpty().withMessage('Please enter name!!!'),
    check('email').trim().isEmail().withMessage("Please enter proper emailid!!"),
]

exports.checkShopkeerper = [
    check("firstName").trim().not().isEmpty().withMessage('Please enter name!!!'),
    check('email').isEmail().withMessage("Please enter proper emailid!!"),
    check('username').trim().not().isEmpty().withMessage('Username is required!!!'),
    check('password').trim().not().isEmpty().withMessage('password is required!!!').isLength({ min: 8 }).not().withMessage("Password's length must be 8 digit!!")
]

exports.login = [
    check('uname').trim().not().isEmpty().withMessage('Username is required!!!'),
    check('password').trim().not().isEmpty().withMessage('password is required!!!')
]

exports.password = [
    check('currpassword').trim().not().isEmpty().withMessage('Current password is required!!!'),
    check('password').trim().not().isEmpty().withMessage('password is required!!!')
]

exports.forgotpassword = [
    check('code').trim().not().isEmpty().withMessage('OTP is required!!!'),
    check('password').trim().not().isEmpty().withMessage('password is required!!!')
]

exports.checkShop = [
    check('name').trim().not().isEmpty().withMessage('Please enter name!!!'),
    check('address').trim().not().isEmpty().withMessage(`Please shop's enter address!!!`),
]

// exports.checkProducts = [
//     check('name').trim().not().isEmpty().withMessage('Please enter name!!!'),
// ]

exports.valResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return res.status(422).json({ success: false, error: error })
    }
    next();
};