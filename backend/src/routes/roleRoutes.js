const express = require("express");

function createRoleRouter(roleController) {
  const router = express.Router();

  router.post("/create-role", roleController.createRole);
  router.get("/", roleController.getAllRoles);
  router.get("/with-permission", roleController.getAllRolesWithPermissions);
  router.get("/permissions", roleController.getAllPermissions);
  router.put("/:id", roleController.updateRole);


  return router;
}

module.exports = createRoleRouter;
