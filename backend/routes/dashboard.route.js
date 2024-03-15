const express = require("express");
const router = express.Router();
const {
  sendQuestion,
  checkAnswer,
  test,
} = require("../controllers/dashboard.controller.js");

router.get("/", sendQuestion);
router.post("/answer", checkAnswer);
router.post("/", test);
module.exports = router;
