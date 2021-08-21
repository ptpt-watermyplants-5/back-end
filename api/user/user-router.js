const router = require('express').Router();
const User = require('./user-model');
const { verifyUser, updatePasswordHash } = require('../middlewares/auth-middleware');

router.get('/:id', verifyUser, (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
    .then(user => {
        if (user) {
            res.json(user);
        }else {
            res.status(404).json({ message: `there is no user with id ${id}` })
        }
    })
    .catch(err => next(err))
});

router.put('/:id', verifyUser, updatePasswordHash, (req, res, next) => {
    const { id } = req.params;
    const changes = req.body;

    User.updateUser(id, changes)
    .then(user => {
        res.json(user)
    })
    .catch(err => next(err))


});

router.get('/:id/plants', verifyUser, (req, res, next) => {
    const { id } = req.params;
console.log(id)
    User.getUserPlants(id)
    .then(user => {
        res.json(user)
    })
    .catch(err => next(err))
});

router.post('/:id/plants', verifyUser, (req, res, next) => {
    const { id } = req.params;
    const plant = req.body;

    User.addPlant(id, plant)
    .then(newPlant => {
        res.status(201).json(newPlant)
    })
    .catch(err => next(err));
});

router.delete('/:id/plants/:id', (req, res, next) => {
    const { id } = req.params;

    User.removePlant(id)
    .then(resp => {
        if (resp === 1) {
            res.json({ message: 'removed successfuly' })
        }else {
            res.status(404).json({ message: 'entity does not exist'})
        }
    })
.catch(err => next(err))
});


module.exports = router;
