const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../auth");

module.exports = server => {
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        //Hash password
        user.password = hash;
        //Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  //auth User

  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await auth.authenticate(email, password);

      next();
    } catch (err) {
      //User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
