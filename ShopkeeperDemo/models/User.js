const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const usersSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require : [true,"Firstname is required!!"]
    },
    lastName : {
        type : String,
        require : [true,"Lastname is required!!"]
    },
    email : {
        type : String,
        unique: true,
    },
    mobileNo : {
        type : String,
        require : [true,"Mobile number is required!!"]
    },
    username : {
        type : String,
        require : [true,"username is required!!"],
        unique: true
    },
    password : {
        type : String,
        validate(value){
            if(value === undefined){
                throw new Error("Passsword is required!!")
            }
        } 
        // require : [true,"Passsword is required!!"]
    },
    avatar : String,
    resetPasswordToken : String,
    expireToken : Date,
    wrongAttempt : 
    {
        type : Number,
        default : 0
    },
    userRole : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserRole',
        require : [true,"User role is required!!"]
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
})

usersSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});

module.exports = mongoose.model('Users', usersSchema,'Users')