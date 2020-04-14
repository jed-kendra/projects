const express = require('express');
const router = express.Router();
const db = require('../../../db/dbmongoose')
const bcrypt = require('bcrypt')
const { makeToken, verifyToken } = require('../../../bin/jwt')
const passport = require('passport')

//API - GET all users listing
router.get('/', function (req, res, next) {
    let readObj = {
        usersCollection: req.app.locals.usersCollection
    }

    db.readAll(readObj)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.json(500)
        })
});

//Get a user by ID
router.get('/:id', function (req, res, next) {

    let readObj = {
        id: req.params.id,
        usersCollection: req.app.locals.usersCollection
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

//Login
router.post('/login', function (req, res, next) {

    db.findOne({ query: { email: req.body.email } })
        .then((user) => {

            bcrypt.compare(req.body.password, user.passwordHash)
                .then(match => {

                    if (match) {

                        makeToken(user)
                            .then(token => {

                                res.json({ token })
                            })

                    } else {
                        throw new Error("Bad Login")
                    }
                })
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

//GET/auth/google
// Use passport.authenticate()      


router.get('/auth/googlelogin',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)


//GET /auth/google/callback
router.get('/auth/googlecallback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {

        makeToken({ email: req.user.emails[0].value }) //google returns an array of emails, get the first one
            .then(token => {
                res.redirect(`http://localhost:3000?token=${token}`);
            })
            .catch(error => {
                console.log(error)
                res.status(500)
            })

    })

//Post - verify token        
router.post('/auth/verifytoken', verifyToken, function (req, res, next) {
    console.log("verifyToken")
    db.findOne({ query: { email: req.email } })
        .then((user) => {

            makeToken(user)
                .then(token => {

                    res.json({ token })
                })
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

//Create (signup)
router.post('/signup', async function (req, res, next) {

    let newUser = { ...req.body }
    delete newUser.password
    let passwordHash = await bcrypt.hash(req.body.password, 13)

    newUser.passwordHash = passwordHash

    console.log({ newUser })

    let createObj = {
        doc: newUser,
        usersCollection: req.app.locals.usersCollection
    }
    db.create(createObj)
        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(error => {
            res.status(500)
        })
})



//API - DELETE - delete a user
router.delete('/:id', verifyToken, function (req, res, next) {
    let deleteObj = {
        id: req.params.id,
        usersCollection: req.app.locals.usersCollection
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

//API - PUT
router.put('/:id', function (req, res, next) {
    let putObj = {
        id: req.params.id,
        doc: req.body,
        usersCollection: req.app.locals.userssCollection
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

//API - PATCH - update a user
router.patch('/:id', async function (req, res, next) {
    console.log("this is patch")
    let patchObj = {
        id: req.params.id,
        doc: req.body,
        usersCollection: req.app.locals.usersCollection
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
