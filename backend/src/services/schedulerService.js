class SchedulerService {
    constructor(db) {
        this.db = db;
    }

    // Get all schedules for specific employees
    async getEmployeeSchedules(employeeIds) {
        try {
            if (!employeeIds || employeeIds.length === 0) {
                return [];
            }
            
            const result = await this.db.query(
                `SELECT ss.*, e.first_name, e.last_name 
                 FROM scheduler_slots ss
                 LEFT JOIN employees e ON ss.employee_id = e.employee_id
                 WHERE ss.employee_id = ANY($1) 
                 ORDER BY ss.start_time ASC`,
                [employeeIds]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get employee schedules: ${error.message}`);
        }
    }

    // Create a new schedule slot
    async createSchedule(scheduleData) {
        try {
            const { employee_id, start_time, end_time, title, description } = scheduleData;

            console.log('Creating schedule with data:', scheduleData);

            // Check for overlapping schedules
            const overlapCheck = await this.db.query(
                `SELECT id FROM scheduler_slots 
                 WHERE employee_id = $1 
                 AND (
                    (start_time < $3 AND end_time > $2)
                 )`,
                [employee_id, start_time, end_time]
            );

            if (overlapCheck.rows.length > 0) {
                throw new Error('Schedule overlaps with existing time slot');
            }

            const result = await this.db.query(
                `INSERT INTO scheduler_slots 
                 (employee_id, start_time, end_time, title, description) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [employee_id, start_time, end_time, title || null, description || null]
            );

            console.log('Schedule created successfully:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in createSchedule:', error);
            throw new Error(`Failed to create schedule: ${error.message}`);
        }
    }

    // Update a schedule slot
    async updateSchedule(scheduleId, employeeId, updateData) {
        try {
            // First verify ownership
            const ownershipCheck = await this.db.query(
                `SELECT employee_id FROM scheduler_slots WHERE id = $1`,
                [scheduleId]
            );

            if (ownershipCheck.rows.length === 0) {
                throw new Error('Schedule not found');
            }

            if (ownershipCheck.rows[0].employee_id !== employeeId) {
                throw new Error('Unauthorized');
            }

            // Build dynamic update query
            const fields = [];
            const values = [];
            let paramCount = 1;

            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined) {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(updateData[key]);
                    paramCount++;
                }
            });

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(scheduleId);
            const query = `
                UPDATE scheduler_slots 
                SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $${paramCount} 
                RETURNING *
            `;

            const result = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to update schedule: ${error.message}`);
        }
    }

    // Delete a schedule slot
    async deleteSchedule(scheduleId, employeeId) {
        try {
            // Verify ownership
            const ownershipCheck = await this.db.query(
                `SELECT employee_id FROM scheduler_slots WHERE id = $1`,
                [scheduleId]
            );

            if (ownershipCheck.rows.length === 0) {
                throw new Error('Schedule not found');
            }

            if (ownershipCheck.rows[0].employee_id !== employeeId) {
                throw new Error('Unauthorized');
            }

            await this.db.query(`DELETE FROM scheduler_slots WHERE id = $1`, [scheduleId]);
        } catch (error) {
            throw new Error(`Failed to delete schedule: ${error.message}`);
        }
    }

    // Find common available slots
    async findCommonSlots(employeeIds, dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let dateCondition = '';
            const params = [employeeIds];

            if (start_date && end_date) {
                dateCondition = `AND start_time >= $2 AND end_time <= $3`;
                params.push(start_date, end_date);
            }

            const query = `
                WITH employee_schedules AS (
                    SELECT employee_id, start_time, end_time
                    FROM scheduler_slots
                    WHERE employee_id = ANY($1) ${dateCondition}
                )
                SELECT 
                    time_slot as start_time,
                    time_slot + INTERVAL '1 hour' as end_time,
                    COUNT(DISTINCT employee_id) as available_count
                FROM (
                    SELECT 
                        generate_series(
                            date_trunc('day', COALESCE(MIN(start_time), NOW())),
                            date_trunc('day', COALESCE(MAX(end_time), NOW() + INTERVAL '7 days')),
                            '1 hour'::interval
                        ) as time_slot,
                        employee_id
                    FROM employee_schedules
                ) slots
                WHERE NOT EXISTS (
                    SELECT 1 FROM employee_schedules es
                    WHERE es.employee_id = slots.employee_id
                    AND slots.time_slot >= es.start_time 
                    AND slots.time_slot < es.end_time
                )
                GROUP BY time_slot
                HAVING COUNT(DISTINCT employee_id) = $2
                ORDER BY time_slot
            `;

            params.push(employeeIds.length);
            const result = await this.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to find common slots: ${error.message}`);
        }
    }

    // Get schedules for multiple employees within date range
    async getSchedulesByEmployees(employeeIds, startDate, endDate) {
        try {
            console.log('getSchedulesByEmployees called with:', {
                employeeIds,
                startDate,
                endDate
            });

            let query = `
                SELECT ss.*, e.first_name, e.last_name, e.email
                FROM scheduler_slots ss
                LEFT JOIN employees e ON ss.employee_id = e.employee_id
            `;
            
            const params = [];
            let whereConditions = [];
            let paramCount = 1;

            // Add employee filter if provided
            if (employeeIds && employeeIds.length > 0) {
                whereConditions.push(`ss.employee_id = ANY($${paramCount})`);
                params.push(employeeIds);
                paramCount++;
            }

            // Add date range filters
            if (startDate) {
                whereConditions.push(`ss.end_time >= $${paramCount}`);
                params.push(startDate);
                paramCount++;
            }

            if (endDate) {
                whereConditions.push(`ss.start_time <= $${paramCount}`);
                params.push(endDate);
            }

            // Combine WHERE conditions
            if (whereConditions.length > 0) {
                query += ` WHERE ` + whereConditions.join(' AND ');
            }

            query += ` ORDER BY ss.start_time ASC`;

            console.log('Executing query:', query);
            console.log('With parameters:', params);

            const result = await this.db.query(query, params);
            console.log(`Found ${result.rows.length} schedules`);
            
            return result.rows;
        } catch (error) {
            console.error('Error in getSchedulesByEmployees:', error);
            throw new Error(`Failed to get employee schedules: ${error.message}`);
        }
    }
}

module.exports = SchedulerService;