const jwt = require('jsonwebtoken')
require('dotenv').config()

function makeToken(user) {

    return new Promise((resolve, reject) => {

        jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' }, function (err, token) {

            if (err !== null) {

                reject(err)

            } else {

                resolve(token)
            }

        });
    })
}

function verifyToken(req, res, next) {

    let auth = req.header('Authorization')

    if (auth !== undefined) {

        let [, token] = auth.split(" ")

        new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
                if (error !== null) {
                    reject(error)
                } else {
                    resolve(payload)
                }
            })
        })
        .then(payload => {
            req.email = payload.email
            next()
        })
        .catch(error => {

            res.status(403)
        })
    } else {
        res.status(403)
    }
}

module.exports.verifyToken = verifyToken
module.exports.makeToken = makeToken