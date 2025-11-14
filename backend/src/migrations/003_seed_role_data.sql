-- Insert Roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('manager'),
  ('editor'),
  ('support'),
  ('basic');

-- Insert Permissions
INSERT INTO permissions (code, description) VALUES
('VIEW_DASHBOARD', 'Access to view the admin dashboard'),
('MANAGE_SERVICES', 'Create, edit, delete services'),
('MANAGE_PORTFOLIO', 'Create, edit, delete portfolio items'),
('MANAGE_BLOG', 'Create, edit, delete blog posts'),
('GENERATE_PAYSLIP', 'Generate pay slips for employees'),
('MANAGE_PAYSLIP', 'Manage generated pay slips'),
('MANAGE_MESSAGES', 'View and respond to contact messages'),
('MANAGE_SCHEDULER', 'Access and manage scheduler'),
('MANAGE_EMPLOYEES', 'Create, edit, delete employee records'),
('MANAGE_NEWSLETTER', 'Manage newsletter subscriptions and send emails'),
('MANAGE_TESTIMONIALS', 'Manage testimonials and testimonial initialization'),
('MANAGE_PRIVACY_POLICY', 'Edit the privacy policy page'),
('MANAGE_COOKIES_POLICY', 'Edit the cookies policy page'),
('MANAGE_TERMS_POLICY', 'Edit the terms of service page'),
('ALL', 'Admin has all the access');

-- Assign Role ↔ Permissions
-- 1. Admin gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- 2. Manager: dashboard, services, portfolio, blog, messages, scheduler
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE code IN (
  'VIEW_DASHBOARD',
  'MANAGE_SERVICES',
  'MANAGE_PORTFOLIO',
  'MANAGE_BLOG',
  'MANAGE_MESSAGES',
  'MANAGE_SCHEDULER'
);

-- 3. Editor: can manage portfolio and blog
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions WHERE code IN (
  'MANAGE_PORTFOLIO',
  'MANAGE_BLOG'
);

-- 4. Support: can manage messages, scheduler, newsletter
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 4, id FROM permissions WHERE code IN (
  'MANAGE_MESSAGES',
  'MANAGE_SCHEDULER',
  'MANAGE_NEWSLETTER'
);

-- 5. Basic employee: only view dashboard
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 5, id FROM permissions WHERE code IN (
  'VIEW_DASHBOARD'
);
