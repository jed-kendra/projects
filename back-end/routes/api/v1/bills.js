const express = require('express');
const router = express.Router();
const db = require('../../../db/dbmongoosebill')

//API - GET all bills 
router.get('/', function (req, res, next) {
    let readObj = {
        billsCollection: req.app.locals.billsCollection
    }
    db.readAll(readObj)
        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.json(500)
        })
});

//Get bills by ID
router.get('/:id', function (req, res, next) {

    let readObj = {
        id: req.params.id,
        billsCollection: req.app.locals.billsCollection
    }
    db.readOne(readObj)
        .then(response => {
            console.log(response.fullName())
            res.json(response)
        })
        .catch(error => {
            res.status(500)
        })
});


//Create bill
router.post('/', function (req, res, next) {

    let createObj = {
        doc: req.body,
        billsCollection: req.app.locals.billsCollection
    }
    db.create(createObj)
        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            
        })
})

//API - DELETE - delete a bill
router.delete('/:id', function (req, res, next) {
    let deleteObj = {
        id: req.params.id,
        billsCollection: req.app.locals.billsCollection
    }
    db.del(deleteObj)
        .then(response => {
            if (response.deletedCount == 1) {
                res.json({})
            }
            throw new Error("Not Deleted")
        })
        .catch(error => {
            res.status(500)
        })
});

//API - PUT bill
router.put('/:id', function (req, res, next) {
    let putObj = {
        id: req.params.id,
        doc: req.body,
        billsCollection: req.app.locals.billsCollection
    }
    db.readOne(putObj)
        .then(response => {
            if (response == null) {
                //add if not found
                db.create(putObj)
                    .then(response => {
                        res.json(response.ops[0])
                    })
            } else {
                //update if found
                db.replace(putObj)
                    .then(response => {
                        res.json(response)
                    })
            }
        })
        .catch(error => {
            res.status(500)
        })
});

//API - PATCH - update a bill
router.patch('/:id', async function (req, res, next) {
    console.log("this is patch")
    let patchObj = {
        id: req.params.id,
        doc: req.body,
        billsCollection: req.app.locals.billsCollection
    }
    try {
        //check to see if we have an object with this id
        let response = await db.readOne(patchObj)

        if (response == null) {

            //add if not found
            throw new Error("Not Found")

        } else {
            //update the one we found
            await db.update(patchObj)
            //respond with the result from the db
            res.json(await db.readOne(patchObj))
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

module.exports = router;