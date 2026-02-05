const router = require("express").Router();
const { getDatabase } = require("../controllers/database.controller");

router.get("/database", getDatabase);

module.exports = router;
