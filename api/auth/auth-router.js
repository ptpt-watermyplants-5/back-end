const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../user/user-model');
const {
    validRequest,
    validUsername,
} = require('../middlewares/auth-middleware');
const tokenBuilder = require('./tokenBuilder');

router.post('/register', validRequest, validUsername, (req, res, next) => {
    const user = req.body;

    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(user.password, rounds);

    user.password = hash;

    User.addUser(user)
    .then(newUser => {
        res.status(201).json(newUser)
    })
    .catch(err => next(err))
});

router.post('/login', validRequest, (req, res, next) => {
    const { username, password } = req.body;

    User.findBy(username)
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = tokenBuilder(user);
  
            res.status(200).json({
              user_id: user.user_id,
              message: `welcome, ${user.username}`,
              token: token,
            });
          }else {
            next({ status: 401, message: "invalid credentials" })
          }
    })
    .catch(err => next(err))
});

module.exports = router;
