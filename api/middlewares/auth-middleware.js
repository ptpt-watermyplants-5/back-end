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

    if (!username || !password) {
      next({status: 422, message: 'username and password required.'});
    }else {
      next();
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

  async function updatePasswordHash(req, res, next) {
    const { id } = req.params;
    const usrObj = req.body;

    const user =  await User.findById(id);
    const usernameIsValid =  await User.findBy(usrObj.username);

    if (!usrObj.username && !usrObj.password ) {
      return next({ status: 422, message: "username and password required" })
    }else if (!usrObj.password) {
      return next({ status: 422, message: "password required" })
    }else if (!usrObj.username) {
      return next({ status: 422, message: "username required" })
    }

    if (usernameIsValid && user.user_id !== usernameIsValid.user_id) {
      return next({ status: 422, message: "username taken" });
    }


    if (id == 1) {
      usrObj.password = '1234';
      usrObj.password2 = '1234';
      usrObj.username = 'jAppleseed';
    }

    if(req.body.password2.length > 0) {
      if (bcrypt.compareSync(usrObj.password, user.password)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcrypt.hashSync(usrObj.password2, rounds);
    
        usrObj.password2 = hash;

        req.body = {
          username: usrObj.username,
          password: usrObj.password2,
          phone_number: usrObj.phone_number,
        };
        next();
      }else {
        return next({ status: 401, message: 'password does not match existing' })
      }
    }else {
      if (bcrypt.compareSync(usrObj.password, user.password)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcrypt.hashSync(usrObj.password, rounds);
  
      usrObj.password = hash;
      req.body = {
        username: usrObj.username,
        password: usrObj.password,
        phone_number: usrObj.phone_number,
      };
      next();
      }else {
        return next({ status: 401, message: 'password does not match existing' })
      }
    }
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
