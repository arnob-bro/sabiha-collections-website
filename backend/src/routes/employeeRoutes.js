const express = require("express");
const multer = require("multer");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createEmployeeRouter(employeeController) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.get('/', employeeController.getEmployees);
  router.get('/:employee_id', employeeController.getEmployeeById);
  router.post('/', upload.single("avatar"), employeeController.createEmployee);
  router.put('/:employee_id', upload.single("avatar"), employeeController.updateEmployee);

  return router;
}

module.exports = createEmployeeRouter;
