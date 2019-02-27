let router = require('express').Router();
let List = require('../db').import('../models/watchList')
let validateSession = require('../middleware/validate-session');

router.post('/new', validateSession, (req, res) => {
    List.create({
        movieImage: req.body.movieImage,
        isWatched: false,
        owner: req.user.id
    }).then(
        createSucces = (data) => {
            res.json({
                movieImage: data,
                message: 'Story Submitted'
            })
        },
        createError = err => res.send(500, err.message)
    )
})

router.get('/', (req, res) => {
    List.findAll()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({error: err}))
})

router.get('/getmine', validateSession, function (req, res) {
    List.findAll({
        where: {owner: req.user.id}
    })
    .then(
        function findAllSuccess(data) {
            res.json(data);
        },
        function findAllError(err) {
            res.send(500, err.message);
        }
    );
});

router.delete('/delete/:id', validateSession, function(req, res) {
    List.destroy({
        where: {id: req.params.id}
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({error: err}))
})

router.put('/update/:id', validateSession, (req, res) => {
    List.update({
        movieImage: req.body.movieImage,
        isWatched: req.body.isWatched,
        owner: req.user.id
    }, {where: {id: req.params.id}})
    .then(setting => res.status(200).json(setting))
    .catch(setting => res.json(req.errors))
})

module.exports = router




















