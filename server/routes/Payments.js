const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment } = require("../controllers/payments");
const { auth, isStudent } = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);

router.post("/verifyPayment", auth, isStudent, verifyPayment);

module.exports = router;
