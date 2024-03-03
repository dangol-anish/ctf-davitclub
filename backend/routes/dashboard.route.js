const express = require("express");
const router = express.Router();
const {
  sendQuestion,
  checkAnswer,
} = require("../controllers/dashboard.controller.js");

router.get("/", sendQuestion);
router.post("/", checkAnswer);
module.exports = router;
