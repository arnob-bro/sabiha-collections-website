class SchedulerController {
    constructor(schedulerService) {
        this.schedulerService = schedulerService;

        // Bind methods
        this.getMySchedule = this.getMySchedule.bind(this);
        this.createSchedule = this.createSchedule.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
        this.getCommonSlots = this.getCommonSlots.bind(this);
        this.getEmployeeSchedules = this.getEmployeeSchedules.bind(this);
    }

    // Get schedule for logged-in employee
    async getMySchedule(req, res) {
        try {
            const employeeId = req.user.employee_id || req.user.user_id;
            console.log('Fetching schedule for employee:', employeeId);
            const schedules = await this.schedulerService.getEmployeeSchedules([employeeId]);
            res.json({ success: true, data: schedules });
        } catch (error) {
            console.error('Error in getMySchedule:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Create new schedule slot for logged-in employee
    async createSchedule(req, res) {
        try {
            const employeeId = req.user.employee_id || req.user.user_id;
            const { start_time, end_time, title, description } = req.body;

            console.log('Create schedule request:', { employeeId, start_time, end_time });

            // Validate required fields
            if (!start_time || !end_time) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Start time and end time are required" 
                });
            }

            // Validate and parse dates
            const startDate = new Date(start_time);
            const endDate = new Date(end_time);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS" 
                });
            }

            // Validate time range
            if (startDate >= endDate) {
                return res.status(400).json({ 
                    success: false, 
                    error: "End time must be after start time" 
                });
            }

            const schedule = await this.schedulerService.createSchedule({
                employee_id: employeeId,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                title,
                description
            });

            res.status(201).json({ success: true, data: schedule });
        } catch (error) {
            console.error('Create schedule error:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Update schedule slot
    async updateSchedule(req, res) {
        try {
            const employeeId = req.user.employee_id || req.user.user_id;
            const { id } = req.params;
            const { start_time, end_time, title, description } = req.body;

            if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
                return res.status(400).json({ 
                    success: false, 
                    error: "End time must be after start time" 
                });
            }

            const schedule = await this.schedulerService.updateSchedule(id, employeeId, {
                start_time,
                end_time,
                title,
                description
            });

            res.json({ success: true, data: schedule });
        } catch (error) {
            if (error.message === 'Schedule not found' || error.message === 'Unauthorized') {
                return res.status(404).json({ success: false, error: error.message });
            }
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Delete schedule slot
    async deleteSchedule(req, res) {
        try {
            const employeeId = req.user.employee_id || req.user.user_id;
            const { id } = req.params;

            await this.schedulerService.deleteSchedule(id, employeeId);
            res.json({ success: true, message: "Schedule deleted successfully" });
        } catch (error) {
            if (error.message === 'Schedule not found' || error.message === 'Unauthorized') {
                return res.status(404).json({ success: false, error: error.message });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get common available slots
    async getCommonSlots(req, res) {
        try {
            const { employee_ids, date_range } = req.body;
            
            if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Employee IDs array is required" 
                });
            }

            const commonSlots = await this.schedulerService.findCommonSlots(employee_ids, date_range);
            res.json({ success: true, data: commonSlots });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get schedules for multiple employees
    async getEmployeeSchedules(req, res) {
        try {
            const { employee_ids, start_date, end_date } = req.query;
            
            let employeeIdsArray = [];
            if (employee_ids) {
                employeeIdsArray = Array.isArray(employee_ids) ? employee_ids : [employee_ids];
            }

            console.log('Fetching employee schedules:', {
                employeeIds: employeeIdsArray,
                start_date,
                end_date
            });

            const schedules = await this.schedulerService.getSchedulesByEmployees(
                employeeIdsArray, 
                start_date, 
                end_date
            );
            
            res.json({ success: true, data: schedules });
        } catch (error) {
            console.error('Error in getEmployeeSchedules:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = SchedulerController;