const User = require('../user/user-model');

module.exports = {
    validRequest,
    validUsername,
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
      next({ status: 422, message: "username taken" });
    }else {
      next();
    }
  };
