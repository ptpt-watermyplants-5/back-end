const User = require('../user/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../auth/secrets');

module.exports = {
    validRequest,
    validUsername,
    restricted,
    verifyUser,
    updatePasswordHash,
};

function validRequest(req, res, next) {
    const { username, password } = req.body;
    const valid = Boolean(username, password);

    if (valid) {
        next();
    }else {
        next({status: 422, message: 'username and password required.'});
    };
};

async function validUsername(req, res, next) {
    const { username } = req.body;
    const valid = await User.findBy(username);
  
    if (valid) {
      next({ status: 422, message: 'username taken' });
    }else {
      next();
    }
  };

  function restricted(req, res, next) {
    const token = req.headers.authorization;

    if(!token) {
      return next({ status: 401, message: 'requires authorization'})
    }

    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return next({ status: 401, message: 'authorization is invalid' })
      }

      req.decodedToken = decodedToken;
      next();
    });
  };

  function updatePasswordHash(req, res, next) {
    const usrObj = req.body;

    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(usrObj.password, rounds);

    usrObj.password = hash;
    req.body = usrObj;
    next();
  };

  async function verifyUser(req, res, next) {
    const { username } = req.decodedToken;
    const { id } = req.params;
    const verifiedUser = await User.findById(id);

    if (Boolean(verifiedUser) === false) {
      return next({ status: 404, message: `not found user id ${id}`})
    }else if (username !== verifiedUser.username) {
      return next({ status: 401, message: 'invalid authorization' })
    }
    next();
  };
