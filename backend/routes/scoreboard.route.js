const express = require("express");
const router = express.Router();

const { scoreUpdate } = require("../controllers/scoreboard.controller");

router.get("/", scoreUpdate);
// router.post("/", add);

module.exports = router;
