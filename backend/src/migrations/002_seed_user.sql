INSERT INTO users (user_id, email, password_hash, role, first_name, last_name, phone)
VALUES
-- Admin
('11111111-1111-1111-1111-111111111111', 'admin@example.com',
 crypt('123456', gen_salt('bf')), 'admin', 'System', 'Admin', '01700000000'),


-- Customers
('33333333-3333-3333-3333-333333333333', 'customer1@example.com',
 crypt('123456', gen_salt('bf')), 'customer', 'Alice', 'Rahman', '01900000001'),

('44444444-4444-4444-4444-444444444444', 'customer2@example.com',
 crypt('123456', gen_salt('bf')), 'customer', 'Bob', 'Khan', '01900000002'),

('55555555-5555-5555-5555-555555555555', 'customer3@example.com',
 crypt('123456', gen_salt('bf')), 'customer', 'Charlie', 'Hossain', '01900000003');



INSERT INTO user_addresses 
(user_address_id, phone, address_line_1, address_line_2, city, country, postal_code, is_default, user_id)
VALUES
-- Admin Address
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '01700000000', 'Head Office Road', 'Building 1', 'Dhaka', 'Bangladesh', '1205', TRUE,
 '11111111-1111-1111-1111-111111111111'),


-- Customer 1 Address
('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '01900000001', 'Lake Road', 'Apt 12A', 'Gulshan', 'Bangladesh', '1212', TRUE,
 '33333333-3333-3333-3333-333333333333'),

-- Customer 2 Address
('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '01900000002', 'Banani Block C', 'Flat 5B', 'Dhaka', 'Bangladesh', '1213', TRUE,
 '44444444-4444-4444-4444-444444444444'),

-- Customer 3 Address
('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '01900000003', 'Mirpur Road', 'House 22', 'Mirpur', 'Bangladesh', '1216', TRUE,
 '55555555-5555-5555-5555-555555555555');
