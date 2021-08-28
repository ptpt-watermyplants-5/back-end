const router = require('express').Router();
const User = require('./user-model');
const { updatePasswordHash, validUsername } = require('../middlewares/auth-middleware');

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
    .then(user => {
        res.json(user)
    })
    .catch(err => next(err))
});

router.put('/:id', updatePasswordHash, (req, res, next) => {
    const { id } = req.params;
    const changes = req.body;

    User.updateUser(id, changes)
    .then(user => {
        res.json(user)
    })
    .catch(err => next(err))


});

router.get('/:id/plants', (req, res, next) => {
    const { id } = req.params;

    User.getUserPlants(id)
    .then(user => {
        res.json(user)
    })
    .catch(err => next(err))
});

router.post('/:id/plants', (req, res, next) => {
    const { id } = req.params;
    const plant = req.body;

    User.addPlant(id, plant)
    .then(newPlant => {
        res.status(201).json(newPlant)
    })
    .catch(err => next(err));
});

router.put('/:id/plants/:id', (req, res, next) => {
    const { id } = req.params;
    const changes = req.body;
    const uid = req.path[1];
    User.updatePlant(id, changes, uid)
    .then(plant => {
        res.json(plant)
    })
    .catch(err => next(err))
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
   
    if (id == 1) {
        return next({ status: 401, message: "jAppleseed can not be removed" })
    }

    User.removeUser(id)
    .then(resp => {
        if (resp === 1) {
            res.json({ message: 'successfuly removed'})
        }else {
            res.status(404).json({ message: 'entity does not exist'})
        }
    })
    .catch(err => next(err))
});

router.delete('/:id/plants/:id', (req, res, next) => {
    const { id } = req.params;
    const uid = req.path[1];

    User.removePlant(id, uid)
    .then(resp => {
        if (resp === 1) {
            res.json({ message: 'successfuly removed' })
        }else {
            res.status(404).json({ message: 'entity does not exist'})
        }
    })
.catch(err => next(err))
});


module.exports = router;
