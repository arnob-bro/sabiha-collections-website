const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createAuthRouter(authController) {
  const router = express.Router();

  router.post("/create-user", authController.createUser);
  router.post("/login", authController.login);
  router.post("/logout", authController.logout);
  router.post("/refresh", authController.refresh);
  router.get("/profile", verifyAccessToken, authController.getProfile);

  // New route
  router.post("/change-password/:new_pass_token", authController.changePassword);
  router.get("/change-password/:new_pass_token", authController.verifyNewPassToken);

  return router;
}

module.exports = createAuthRouter;
