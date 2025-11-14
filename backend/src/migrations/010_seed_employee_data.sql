-- INSERT INTO employees (
--     employee_id, first_name, last_name, phone, position, hire_date,
--     address, city, country, status, avatar, emergency_contact, role_id
-- ) VALUES
-- ('EMP001', 'John', 'Doe', '+1-555-1234', 'Senior Developer', '2022-03-15',
--  '123 Main St', 'San Francisco', 'USA', 'active', 'https://randomuser.me/api/portraits/men/32.jpg',
--  '{"name":"Jane Doe","relationship":"Spouse","phone":"+1-555-9876"}', 1),

-- ('EMP002', 'Sarah', 'Johnson', '+1-555-2345', 'Product Manager', '2021-08-22',
--  '456 Oak Ave', 'New York', 'USA', 'active', 'https://randomuser.me/api/portraits/women/44.jpg',
--  '{"name":"Mike Johnson","relationship":"Spouse","phone":"+1-555-8765"}', 1),

-- ('EMP003', 'Michael', 'Chen', '+1-555-3456', 'UX Designer', '2023-01-10',
--  '789 Pine Rd', 'Austin', 'USA', 'active', 'https://randomuser.me/api/portraits/men/75.jpg',
--  '{"name":"Lisa Chen","relationship":"Spouse","phone":"+1-555-7654"}', 1),

-- ('EMP004', 'Emma', 'Williams', '+1-555-4567', 'HR Specialist', '2020-11-05',
--  '321 Elm St', 'Chicago', 'USA', 'active', 'https://randomuser.me/api/portraits/women/22.jpg',
--  '{"name":"David Williams","relationship":"Spouse","phone":"+1-555-6543"}', 1),

-- ('EMP005', 'David', 'Kim', '+1-555-5678', 'DevOps Engineer', '2022-06-30',
--  '654 Maple Dr', 'Seattle', 'USA', 'on_leave', 'https://randomuser.me/api/portraits/men/45.jpg',
--  '{"name":"Sophia Kim","relationship":"Spouse","phone":"+1-555-5432"}', 1),

-- ('EMP006', 'Olivia', 'Brown', '+1-555-6789', 'Marketing Specialist', '2021-05-12',
--  '987 Cedar St', 'Boston', 'USA', 'active', 'https://randomuser.me/api/portraits/women/55.jpg',
--  '{"name":"Mark Brown","relationship":"Spouse","phone":"+1-555-4321"}', 1),

-- ('EMP007', 'James', 'Davis', '+1-555-7890', 'Sales Executive', '2020-09-18',
--  '654 Spruce Ave', 'Denver', 'USA', 'probation', 'https://randomuser.me/api/portraits/men/12.jpg',
--  '{"name":"Laura Davis","relationship":"Spouse","phone":"+1-555-3210"}', 1),

-- ('EMP008', 'Sophia', 'Martinez', '+1-555-8901', 'Financial Analyst', '2022-02-25',
--  '321 Birch Rd', 'Miami', 'USA', 'active', 'https://randomuser.me/api/portraits/women/33.jpg',
--  '{"name":"Carlos Martinez","relationship":"Spouse","phone":"+1-555-2109"}', 1),

-- ('EMP009', 'William', 'Lee', '+1-555-9012', 'QA Engineer', '2023-03-20',
--  '147 Aspen Ln', 'San Diego', 'USA', 'active', 'https://randomuser.me/api/portraits/men/65.jpg',
--  '{"name":"Anna Lee","relationship":"Spouse","phone":"+1-555-1098"}', 1),

-- ('EMP010', 'Isabella', 'Taylor', '+1-555-0123', 'Graphic Designer', '2021-12-01',
--  '258 Willow St', 'Portland', 'USA', 'terminated', 'https://randomuser.me/api/portraits/women/44.jpg',
--  '{"name":"Henry Taylor","relationship":"Spouse","phone":"+1-555-0987"}', 1),

-- ('EMP011', 'Alexander', 'Wilson', '+1-555-2346', 'Backend Developer', '2020-07-14',
--  '369 Redwood Dr', 'Austin', 'USA', 'active', 'https://randomuser.me/api/portraits/men/77.jpg',
--  '{"name":"Grace Wilson","relationship":"Spouse","phone":"+1-555-0876"}', 1),

-- ('EMP012', 'Mia', 'Anderson', '+1-555-3457', 'HR Manager', '2019-11-30',
--  '741 Cypress Ave', 'Chicago', 'USA', 'on_leave', 'https://randomuser.me/api/portraits/women/66.jpg',
--  '{"name":"Liam Anderson","relationship":"Spouse","phone":"+1-555-0765"}', 1);


INSERT INTO employees (
    employee_id, first_name, last_name, email, phone, position, role_id, hire_date,
    address, city, country, status, avatar, emergency_contact
) VALUES
('E-003', 'Abdul Mohaimen Khan', 'Arnob', 'arnob@m3techops.com', '01533580353', 'Project Manager', 1, '2025-07-01',
 'Binimoy Kunja, East Rampura', 'Dhaka', 'Bangladesh', 'active', 'https://randomuser.me/api/portraits/men/32.jpg',
 '{"name":"Mazeda Haque","relationship":"Mother","phone":"01911627388"}');

-- ('EMP002', 'Sarah', 'Johnson', 'sarah.johnson@example.com', '+15552345678', 'Product Manager', 1, '2021-08-22',
--  '456 Oak Ave', 'New York', 'USA', 'active', 'https://randomuser.me/api/portraits/women/44.jpg',
--  '{"name":"Mike Johnson","relationship":"Spouse","phone":"+15558765432"}'),

-- ('EMP003', 'Michael', 'Chen', 'michael.chen@example.com', '+15553456789', 'UX Designer', 1, '2023-01-10',
--  '789 Pine Rd', 'Austin', 'USA', 'active', 'https://randomuser.me/api/portraits/men/75.jpg',
--  '{"name":"Lisa Chen","relationship":"Spouse","phone":"+15557654321"}'),

-- ('EMP004', 'Emma', 'Williams', 'emma.williams@example.com', '+15554567890', 'HR Specialist', 1, '2020-11-05',
--  '321 Elm St', 'Chicago', 'USA', 'active', 'https://randomuser.me/api/portraits/women/22.jpg',
--  '{"name":"David Williams","relationship":"Spouse","phone":"+15556543210"}'),

-- ('EMP005', 'David', 'Kim', 'david.kim@example.com', '+15555678901', 'DevOps Engineer', 1, '2022-06-30',
--  '654 Maple Dr', 'Seattle', 'USA', 'active', 'https://randomuser.me/api/portraits/men/45.jpg',
--  '{"name":"Sophia Kim","relationship":"Spouse","phone":"+15555432109"}'),

-- ('EMP006', 'Olivia', 'Brown', 'olivia.brown@example.com', '+15556789012', 'Marketing Specialist', 1, '2021-05-12',
--  '987 Cedar St', 'Boston', 'USA', 'active', 'https://randomuser.me/api/portraits/women/55.jpg',
--  '{"name":"Mark Brown","relationship":"Spouse","phone":"+15554321098"}'),

-- ('EMP007', 'James', 'Davis', 'james.davis@example.com', '+15557890123', 'Sales Executive', 1, '2020-09-18',
--  '654 Spruce Ave', 'Denver', 'USA', 'active', 'https://randomuser.me/api/portraits/men/12.jpg',
--  '{"name":"Laura Davis","relationship":"Spouse","phone":"+15553210987"}'),

-- ('EMP008', 'Sophia', 'Martinez', 'sophia.martinez@example.com', '+15558901234', 'Financial Analyst', 1, '2022-02-25',
--  '321 Birch Rd', 'Miami', 'USA', 'active', 'https://randomuser.me/api/portraits/women/33.jpg',
--  '{"name":"Carlos Martinez","relationship":"Spouse","phone":"+15552109876"}'),

-- ('EMP009', 'William', 'Lee', 'william.lee@example.com', '+15559012345', 'QA Engineer', 1, '2023-03-20',
--  '147 Aspen Ln', 'San Diego', 'USA', 'active', 'https://randomuser.me/api/portraits/men/65.jpg',
--  '{"name":"Anna Lee","relationship":"Spouse","phone":"+15551098765"}'),

-- ('EMP010', 'Isabella', 'Taylor', 'isabella.taylor@example.com', '+15550123456', 'Graphic Designer', 1, '2021-12-01',
--  '258 Willow St', 'Portland', 'USA', 'active', 'https://randomuser.me/api/portraits/women/44.jpg',
--  '{"name":"Henry Taylor","relationship":"Spouse","phone":"+15550987654"}'),

-- ('EMP011', 'Alexander', 'Wilson', 'alexander.wilson@example.com', '+15552345679', 'Backend Developer', 1, '2020-07-14',
--  '369 Redwood Dr', 'Austin', 'USA', 'active', 'https://randomuser.me/api/portraits/men/77.jpg',
--  '{"name":"Grace Wilson","relationship":"Spouse","phone":"+15550876543"}'),

-- ('EMP012', 'Mia', 'Anderson', 'mia.anderson@example.com', '+15553456780', 'HR Manager', 1, '2019-11-30',
--  '741 Cypress Ave', 'Chicago', 'USA', 'on_leave', 'https://randomuser.me/api/portraits/women/66.jpg',
--  '{"name":"Liam Anderson","relationship":"Spouse","phone":"+15550765432"}');
