const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createPayslipRouter(payslipController) {
  const router = express.Router();

  router.post('/', payslipController.createPayslip);
  router.get('/', payslipController.getPayslips);
  router.get('/:payslip_id', payslipController.getPayslipById);
  router.put('/:payslip_id', payslipController.updatePayslipStatus);
  return router;
}

module.exports = createPayslipRouter;
