const express = require("express");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

function createDatabaseRouter(databaseController) {
  const router = express.Router();

  // router.get("/snapshot", verifyAccessToken, databaseController.getSnapshot);
  router.get("/snapshot", databaseController.getSnapshot);

  return router;
}

module.exports = createDatabaseRouter;

