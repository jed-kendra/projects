const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    fName: {
        type: String
    },
    lName: {
        type: String
    },
    userName: {
        type: String
    }, 
    passwordHash: {
        type: String
    },
    email: {
        type: String
    }   
});


usersSchema.methods.fullName = function () {
    return `Name ${this.fName} ${this.lName}`
}

module.exports.usersModel = mongoose.model('Users', usersSchema, 'users')
module.exports.usersSchema = usersSchema.obj