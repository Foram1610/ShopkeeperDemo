const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/User')
const UserRoleModel = require('../models/Userrole')
const transport = require('../utils/sendmail')

exports.insertRole = (req, res) => {
    const { role } = req.body
    // TODO: 
    UserRoleModel.findOne({ role }, async (err, role1) => {
        if (role1) {
            return res.status(409).json({ message: 'This user role is already exits!!' })
        }
        else {
            const userrole = new UserRoleModel({ role })
            const userrole1 = await userrole.save()
            if (userrole1) {
                return res.status(200).json({ message: 'Data inserted!!' })
            }
            else {
                return res.status(400).json({ data: err })
            }
        }
    })

}

exports.registration = (req, res) => {
    const { firstName, lastName, email, mobileNo, username, password, userRole } = req.body;
    let avatar;
    if (req.file === undefined) {
        avatar = 'def.png'
    } else {
        avatar = req.file.filename;
    }

    UsersModel.findOne({ email: email }, async (err, user) => {
        try {
            if (!user) {
                const user = new UsersModel({
                    firstName, lastName, email, mobileNo, username, password, userRole, avatar: avatar
                })
                const user1 = await user.save()
                if (user1) {
                    return res.status(200).json({ message: `User's Data inserted!!` })
                }
                else {
                    return res.status(400).json({ data: err })
                }
            }
            else {
                return res.status(409).json({ message: 'User already exits!!' });
            }
        } catch (error) {
            throw error
        }
    })

}

exports.login = async (req, res) => {
    const { uname, password } = req.body
    if (uname === "") {
        return res.status(409).json({ message: "Please enter username or emailID or mobileNo. to login!!!" })
    }
    else {
        try {
            let filter = {
                $or: [
                    { username: uname },
                    { email: uname },
                    { mobileNo: uname }
                ]
            }
            // TODO: improve login code : DONE

            let data = await UsersModel.findOne(filter)
            if (!data) {
                return res.status(409).json({ message: 'User does not exits!!' });
            }
            else {
                const isMatch = await bcrypt.compare(password, data.password)
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid password!!' });
                }
                else {
                    const token = jwt.sign({
                        username: data.username,
                        _id: data._id.toString()
                    }, process.env.SECRET_KEY, { expiresIn: '10h' });
                    return res.status(200).json({ message: 'Login successfully!!', token: token })
                }
            }
        } catch (error) {
            throw error
        }
    }
}

// exports.login1 = async (req, res) => {
//     const { uname, password } = req.body
//     const userNo = (uname.length < 10) ? "1234567890" : uname
//     const userID = (uname == /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && uname
//     console.log("Email ==>", userID);
//     console.log("Uname ==> ", uname);
//     if (!uname) {
//         return res.status(409).json({ message: "Please enter username or emailID or mobileNo. to login!!!" })
//     }
//     else {
//         await UsersModel.findOne(
//             {
//                 $and:
//                     [
//                     { 'mobileNo': userNo },
//                     {
//                         $or: [
//                             { 'email': uname },
//                             { 'username': uname }
//                         ]
//                     }]
//             }, async (err, user) => {
//                 try {
//                     console.log("Uname ==> ", uname);
//                     console.log("Username ==> ", user.username);
//                     if (!user) {
//                         return res.status(409).json({ message: 'User does not exits!!' });
//                     }
//                     else {
//                         const isMatch = await bcrypt.compare(password, user.password)
//                         if (!isMatch) {
//                             return res.status(401).json({ message: 'Invalid password!!' });
//                         }
//                         else {
//                             const token = jwt.sign({
//                                 username: user.username,
//                                 _id: user._id.toString()
//                             }, process.env.SECRET_KEY, { expiresIn: '10h' });
//                             return res.status(200).json({ message: 'Login successfully!!', token: token })
//                             console.log("Hello!! ==> ", token);
//                         }
//                     }
//                 } catch (error) {
//                     let errors = getErrors(error);
//                     //Send Errors to browser
//                     console.log(errors);
//                     throw return res.status(400).json({ data: errors });
//                 }
//             })
//     }
// }

exports.me = async (req, res) => {
    const user = await UsersModel.findOne({ _id: req.logInid }).select('-password -__v -createdAt -updatedAt')
    if (!user) {
        return res.status(409).json({ message: 'User does not exits!!' });
    }
    else {
        return res.status(200).json({ data: user });
    }
}

exports.listOfUsers = async (req, res) => {
    const users = await UsersModel.find({}).populate('userRole', 'role').select('-password -__v')
    return res.status(200).json({ data: users });
}

exports.forgotPassLink = (req, res) => {
    const { email } = req.body
    UsersModel.findOne({ email: email }, async (err, user) => {
        try {
            const cnt = user.wrongAttempt;
            if (cnt < 3) {
                const token = jwt.sign({
                    username: user.username,
                    _id: user._id.toString()
                }, process.env.SECRET_KEY, { expiresIn: '5m' });
                await UsersModel.findOneAndUpdate({ email: email },
                    {
                        $set:
                        {
                            wrongAttempt: parseInt(user.wrongAttempt) + 1,
                            resetPasswordToken: token,
                            expireToken: new Date().getTime() + 300 * 1000
                        }
                    })
                transport.sendMail({
                    to: email,
                    from: 'fparmar986@gmail.com',
                    subject: 'Reset Password!!',
                    html: `<h1>Reset your password!!</h1><br />
                        <p>Please click on this link to reset your password.<br /><a href="${process.env.EMAIL}/${token}">Reset Password</a></p><br />
                        <p>This link will expire in 5 minutes...</p><br />
                        <p>Max Attempt for resend otp is 3!! This your ${cnt + 1} attempt.</p>`
                })
                if (transport) {
                    return res.status(200).json({ message: 'Mail sent to your emailid!!!' })
                }
                else {
                    return res.status(404).json({ message: 'Somthing went wrong!!Can not sent mail to your emailid!!' })
                }
            }
            else {
                return res.status(404).json({ message: 'Max attempt for resending mail is over!!' })
            }
        } catch (error) {
            return res.status(400).json({ message: 'User does not exixts!!' })
        }
    })
}

exports.forgotPassword = (req, res) => {
    const { password, resetPasswordToken } = req.body
    UsersModel.findOne({ resetPasswordToken: resetPasswordToken }, async (err, user) => {
        let curTime = new Date().getTime();
        let extime = (user.expireToken).getTime();
        let diff = extime - curTime;
        if (diff < 0) {
            return res.status(401).json({ message: 'Link exprired!!, Please send again!!' })
        }
        else {
            user.password = password;
            const updatePassword = await user.save()
            if (updatePassword) {
                try {
                    await UsersModel.findOneAndUpdate({ email: user.email },
                        {
                            wrongAttempt: 0,
                            resetPasswordToken: undefined,
                            expireToken: undefined
                        })
                    return res.status(200).json({ message: 'Password Updated!!' })
                }
                catch (error) {
                    return res.status(400).json({ message: 'Somthing went wrong!!!!' })
                }

            }
        }
    })
}

exports.resetPassword = async (req, res) => {
    const { currpassword, password } = req.body
    const check = await UsersModel.findOne({ _id: req.logInid }).populate('password')
    const isMatch = await bcrypt.compare(currpassword, check.password)
    if (!isMatch) {
        return res.status(401).json({ message: 'Current password is invalid!!' });
    }
    else {
        const hashPass = await bcrypt.hash(password, 10)
        const passswordStatus = await UsersModel.findByIdAndUpdate(req.logInid, {
            $set: { password: hashPass }
        })
        if (passswordStatus) {
            return res.status(200).json({ message: 'Password changed!!' })
        }
        else {
            return res.status(400).json({ message: 'Somthing went wrong!!' })
        }
    }
}