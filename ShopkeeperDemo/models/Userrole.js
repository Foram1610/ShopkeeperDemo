const mongoose = require('mongoose')

const userroleSchema = new mongoose.Schema({
    role : {
        type : String,
        enum : {
            values : ['shopkeeper','admin','super admin'],
            message : "Selected role is not valid!!"
        },
        require : [true,"Role is required!!"],
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('UserRole', userroleSchema, 'UserRole')