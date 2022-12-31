const router = require("express").Router();
const v1ApiRoutes = require("./v1");

router.use("/v1", v1ApiRoutes);

module.exports = router;
