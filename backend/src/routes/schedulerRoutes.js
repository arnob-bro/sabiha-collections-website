const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createSchedulerRouter(schedulerController) {
    const router = express.Router();

    // All routes require authentication
    router.use(verifyAccessToken);

    // My schedule routes
    router.get("/my-schedule", schedulerController.getMySchedule);
    router.post("/my-schedule", schedulerController.createSchedule);
    router.put("/my-schedule/:id", schedulerController.updateSchedule);
    router.delete("/my-schedule/:id", schedulerController.deleteSchedule);

    // Common slots and employee schedules
    router.post("/common-slots", schedulerController.getCommonSlots);
    router.get("/employee-schedules", schedulerController.getEmployeeSchedules);

    return router;
}

module.exports = createSchedulerRouter;