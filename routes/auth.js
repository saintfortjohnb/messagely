const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 */

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const isValidUser = await User.authenticate(username, password);

    if (isValidUser) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    } else {
      throw new Error("Invalid username/password");
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const user = await User.register({
      username,
      password,
      first_name,
      last_name,
      phone,
    });

    await User.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
