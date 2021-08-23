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

    if (!usrObj.username || !usrObj.password ) {
      return next({ status: 422, message: "username and password required" })
    }

    if (req.params.id == 1) {
      usrObj.password = '1234';
      usrObj.username = 'jAppleseed';
    }

    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(usrObj.password, rounds);

    usrObj.password = hash;
    req.body = usrObj;
    next();
  };

  async function verifyUser(req, res, next) {
    const { sub } = req.decodedToken;
    const id = req.path[1];
    const verifiedUser = await User.findById(id);

    if (Boolean(verifiedUser) === false) {
      return next({ status: 404, message: 'invalid'})
    }else if (sub !== verifiedUser.user_id) {
      return next({ status: 401, message: 'invalid authorization' })
    }
    next();
  };
