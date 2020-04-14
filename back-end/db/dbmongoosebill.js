const mongoose = require('mongoose');
const { billsModel: Bills, billsSchema } = require('../models/billsModel')
require('dotenv').config()


//POST create user
function create(objCreate) {

    let serial = {}
    //use the schema as a template to check for properties in document to write
    //if the document has a matching property copy it to new object
    //write the new object
    for (let key in billsSchema) {
        if (objCreate.doc.hasOwnProperty(key)) {
            serial[key] = objCreate.doc[key]
        }
    }
    return Bills.create(serial)
}

// Get all
function readAll(objRead) {

    return Bills.find().exec()
}

//FindOne
function findOne(objFind) {

    return Bills.findOne(objFind.query).exec()
}


// Get id
function readOne(objRead) {

    return Bills.findById(objRead.id).exec()
}

//Put
function replace(objReplace) {

    let serial = {}
    for (let key in billsSchema) {

        if (objReplace.doc.hasOwnProperty(key)) {
            serial[key] = objReplace.doc[key]
        }
    }
    return Bills.replaceOne({ _id: objReplace.id }, serial).exec()
}

//Patch
function update(objUpdate) {
    let serial = {}
    for (let key in billsSchema) {
        if (objUpdate.doc.hasOwnProperty(key)) {
            serial[key] = objUpdate.doc[key]
        }
    }
    console.log(serial)
    return Bills.updateOne({ _id: objUpdate.id }, serial).exec()
}

//Delete
// can't use delete as function name because it is a js key word
function del(objDelete) {
    return Bills.deleteOne({ _id: objDelete.id }).exec()
}

module.exports.create = create
module.exports.findOne = findOne
module.exports.readAll = readAll
module.exports.readOne = readOne
module.exports.replace = replace
module.exports.update = update
module.exports.del = del
