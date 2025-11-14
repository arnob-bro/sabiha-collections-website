const express = require("express");

function createPolicyRouter(policyController) {
  const router = express.Router();

  router.get("/", policyController.getAllPolicies);
  router.get("/:type", policyController.getpolicyByType);
  router.put("/:type", policyController.updatePolicy);


  return router;
}

module.exports = createPolicyRouter;
    