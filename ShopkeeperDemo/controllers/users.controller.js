const UsersModel = require('../models/User')
const transport = require('../utils/sendmail')

exports.updateUser = async (req, res) => {
    const { firstName, lastName, email, mobileNo, username, } = req.body
    const user = await UsersModel.findByIdAndUpdate(req.logInid, {
            username: username,
            firstName: firstName,
            email: email,
            lastName: lastName,
            mobileNo: mobileNo,
    })
    if (user) {
        return res.status(200).json({ message: 'Data updated!!!' })
    }
    else {
        return res.status(400).json({ message: 'Data not updated!!!' })
    }
}

exports.updateUserAvatar = async (req, res) => {
    const image = await UsersModel.findByIdAndUpdate(req.logInid, {
        $set: {
            avatar: req.file.filename
        }
    })
    if (image) {
        return res.status(200).json({ message: 'Image updated!!!' })
    }
    else {
        return res.status(400).json({ message: 'Image not updated!!!' })
    }
}

exports.displayProfile = async (req, res) => {
    const userData = await UsersModel.findOne({ _id: req.logInid }).select('-_id -password -wrongAttempt -__v -createdAt -updatedAt').populate('userRole', 'role -_id')
    if (userData) {
        return res.status(200).json({ data : userData })
    }
    else {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

exports.sendVerificationMail = async (req, res) => {
    const mail = await UsersModel.findOne({ _id: req.logInid }).select('email -_id')
    const status = transport.sendMail({
        to: mail.email,
        from: 'fparmar986@gmail.com',
        subject: 'Verification of EmailID!!',
        html: `<h1>Verify Your EmailID!!</h1><br />
            <p>This email is just send for verify your EmailID</p><br /><br />`
    })
    if (status) {
        return res.status(200).json({ message: 'Email send to your Emailid!!!' })
    }
    else {
        return res.status(400).json({ message: 'Something went wrong!!!' })
    }
}

