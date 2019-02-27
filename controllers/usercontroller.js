let router = require('express').Router();
let User = require('../db').import('../models/user')
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
let validateSession = require('../middleware/validate-session')

router.post('/signup', (req, res) => {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userEmail: req.body.userEmail,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: 60 * 60* 24
            })
            res.json({
                user: user,
                message: 'user created',
                sessionToken: token,
                isAdmin: user.isAdmin,
                id: user.id
            })
        },
        createError = err => res.send(500, err.message)
    )
})

router.post('/signin', (req, res) => {
    User.findOne({ where: {userEmail: req.body.userEmail}})
    .then(
        user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, (err, matches) => {
                    if(matches) {
                        let token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24 
                        })
                        res.json({
                            user: user,
                            message: 'Successfully authenticated',
                            sessionToken: token,
                            isAdmin: user.isAdmin,
                            id: user.id
                        })
                    } else {
                        res.status(502).send({error: 'bad gateway'})
                    }
                })
            } else {
                res.status(502).send({error: 'failed to authenticate'})
            }
        },
        err => res.status(501).send({error: 'failed to process'})
    )
})

router.get('/', validateSession, (req, res) => {
    User.findAll()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({error: err})) 
})

router.put('/update/:id', (req, res) => {
    if (!req.errors) {
        User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userEmail: req.body.userEmail,
            password: bcrypt.hashSync(req.body.password, 10)
        }, {where: {id: req.params.id}})
            .then(user => res.status(200).json(user))
            .catch(err => res.json(req.errors))
    } else {
        res.status(500).json(req.errors)
    }
})

router.delete('/delete/:id', validateSession, (req, res) => {
    User.destroy({ where: {id: req.params.id}})
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({error: err}))
})

module.exports = router











// firstName: {
//     type: DataTypes.STRING,
//     allowNull: false
// },
// lastName: {
//     type: DataTypes.STRING,
//     allowNull: false
// },
// userEmail: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
// },
// password: {
//     type: DataTypes.STRING,
//     allowNull: false
// }