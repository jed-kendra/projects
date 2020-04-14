const mongoose = require('mongoose');
const { usersModel: Users, usersSchema } = require('../models/usersModel')
require('dotenv').config()
function connect(objConnect) {

    const uri = `mongodb+srv://jedkendra:${process.env.DB_PASSWORD}@cluster0-hbkq5.mongodb.net/test?retryWrites=true&w=majority`;

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Project"
    });
}
//end of connect function

// Close connection
function close() {
    mongoose.connection.close()
}

//POST create user
function create(objCreate) {

    let serial = {}
    //use the schema as a template to check for properties in document to write
    //if the document has a matching property copy it to new object
    //write the new object
    for (let key in usersSchema) {
        if (objCreate.doc.hasOwnProperty(key)) {
            serial[key] = objCreate.doc[key]
        }
    }
    return Users.create(serial)
}

// Get all
function readAll(objRead) {

    return Users.find().exec()
}

//FindOne
function findOne(objFind) {

    return Users.findOne(objFind.query).exec()
}


// Get id
function readOne(objRead) {

    return Users.findById(objRead.id).exec()
}

//Put
function replace(objReplace) {

    let serial = {}
    for (let key in usersSchema) {

        if (objReplace.doc.hasOwnProperty(key)) {
            serial[key] = objReplace.doc[key]
        }
    }
    return Users.replaceOne({ _id: objReplace.id }, serial).exec()
}

//Patch
function update(objUpdate) {
    let serial = {}
    for (let key in usersSchema) {
        if (objUpdate.doc.hasOwnProperty(key)) {
            serial[key] = objUpdate.doc[key]
        }
    }
    console.log(serial)
    return Users.updateOne({ _id: objUpdate.id }, serial).exec()
}

//Delete
// can't use delete as function name because it is a js key word
function del(objDelete) {
    return Users.deleteOne({ _id: objDelete.id }).exec()
}

module.exports.connect = connect
module.exports.close = close
module.exports.create = create
module.exports.findOne = findOne
module.exports.readAll = readAll
module.exports.readOne = readOne
module.exports.replace = replace
module.exports.update = update
module.exports.del = del
