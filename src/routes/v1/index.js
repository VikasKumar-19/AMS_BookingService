const { BookingController } = require("../../controllers");

const router = require("express").Router();

router.post("/bookings", BookingController.create)

module.exports = router;
