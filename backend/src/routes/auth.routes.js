const router = require("express").Router();
const { login } = require("../controllers/auth.controller");

router.post("/auth/login", login);

module.exports = router;
