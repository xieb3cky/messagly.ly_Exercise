
const router = new express.Router();
const ExpressError = require("../expressError");

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const User = require("../models/user");



/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        let users = await User.all();
        return res.json({ "users": users });
    }
    catch (err) {
        return next(err);
    }
});


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        let username = req.params.username;
        let user = await User.get(req.params.username);
        return res.json({ "user": user });
    }
    catch (err) {
        return next(err);
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
    try {
        let username = req.params.username;
        let messages = await User.messageTo(username);
        return res.json({ "messages": messages });
    }
    catch (err) {
        return next(err);
    }
});



/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async function (req, res, next) {
    try {
        let username = req.params.username;
        let messages = await User.messageFrom(username);
        return res.json({ "messages": messages });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;