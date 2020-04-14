const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const billsSchema = new Schema({
    biller: {
        type: String
    }, 
    name: {
        type: String
    },
    typeofBill: {
        type: String
    },
    dueDate: {
        type: String
    },
    amount: {
        type: String
    },
    nextDue: {
        type: String
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    title: {
        type: String
    },


});


billsSchema.methods.fullName = function () {
    return `Name ${this.name}`
}

module.exports.billsModel = mongoose.model('Bills', billsSchema, 'bills')
module.exports.billsSchema = billsSchema.obj