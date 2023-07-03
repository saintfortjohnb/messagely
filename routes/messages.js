const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id, body, sent_at, read_at, from_user: {username, first_name, last_name, phone}, to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in user is either the sender or the recipient of the message.
 *
 **/
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.get(id);
    const { from_user, to_user } = message;

    if (
      from_user.username !== req.user.username &&
      to_user.username !== req.user.username
    ) {
      throw new Error("Unauthorized access to message details");
    }

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    const message = await Message.create({ from_username, to_username, body });
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that only the intended recipient can mark the message as read.
 *
 **/
router.post("/:id/read", ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.markRead(id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
