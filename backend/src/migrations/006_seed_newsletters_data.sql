INSERT INTO newsletters (title, content, status, sent_date, created_at, updated_at)
VALUES
-- 1
('My first newsletter',
'<!doctype html><html><head><meta charset="utf-8"><title>Test Newsletter</title></head><body style="font-family: Arial, sans-serif; background:#f6f7fb; padding:20px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;"><tr><td style="background:#2563eb; color:#ffffff; padding:16px; text-align:center; font-size:20px; font-weight:bold;">M3TechOps Newsletter</td></tr><tr><td style="padding:20px; font-size:16px; color:#333333;"><p>Hello subscriber,</p><p>This is a <strong>test newsletter</strong>. If you are reading this, the email delivery works 🎉</p><p>Stay tuned for more updates from our team.</p></td></tr><tr><td style="padding:20px; text-align:center;"><a href="https://m3techops.com" style="background:#2563eb; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:4px; font-size:16px;">Visit Our Website</a></td></tr><tr><td style="padding:16px; font-size:12px; color:#888888; text-align:center;">© 2025 M3TechOps. All rights reserved.<br>You received this email as part of a test.</td></tr></table></body></html>',
'Draft', NULL, NOW(), NOW());

-- 2
-- ('Weekly Tech Digest - Issue #1',
-- '<html><body><h2>Welcome to Issue #1</h2><p>We are excited to share the latest updates in tech with you.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '20 days', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),

-- -- 3
-- ('Security Tips for 2025',
-- '<html><body><h2>Stay Secure</h2><p>Here are 5 tips to improve your cybersecurity.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '18 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),

-- -- 4
-- ('Cancelled Campaign: Summer Offers',
-- '<html><body><h2>Summer Offers</h2><p>This campaign was canceled before launch.</p></body></html>',
-- 'Canceled', NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),

-- -- 5
-- ('Weekly Tech Digest - Issue #2',
-- '<html><body><h2>Issue #2</h2><p>Latest AI research updates.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '14 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),

-- -- 6
-- ('Product Launch: M3 Cloud',
-- '<html><body><h2>Introducing M3 Cloud</h2><p>Our new cloud hosting solution is live.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '12 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days'),

-- -- 7
-- ('Survey Invitation',
-- '<html><body><h2>We Value Your Feedback</h2><p>Take our short survey and help us improve.</p></body></html>',
-- 'Draft', NULL, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),

-- -- 8
-- ('Weekly Tech Digest - Issue #3',
-- '<html><body><h2>Issue #3</h2><p>Highlights on machine learning trends.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '10 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),

-- -- 9
-- ('Maintenance Notice',
-- '<html><body><h2>Scheduled Downtime</h2><p>Our servers will undergo maintenance this weekend.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

-- -- 10
-- ('Cancelled: Partnership Announcement',
-- '<html><body><h2>Partnership Announcement</h2><p>This campaign was canceled due to internal changes.</p></body></html>',
-- 'Canceled', NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- -- 11
-- ('Weekly Tech Digest - Issue #4',
-- '<html><body><h2>Issue #4</h2><p>Blockchain developments to watch.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),

-- -- 12
-- ('Exclusive Offer for Subscribers',
-- '<html><body><h2>Exclusive Offer</h2><p>Get 20% off on all premium services this week only!</p></body></html>',
-- 'Draft', NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

-- -- 13
-- ('Weekly Tech Digest - Issue #5',
-- '<html><body><h2>Issue #5</h2><p>Latest DevOps practices for 2025.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),

-- -- 14
-- ('Cancelled: Webinar Invite',
-- '<html><body><h2>Upcoming Webinar</h2><p>This campaign was canceled before publishing.</p></body></html>',
-- 'Canceled', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- -- 15
-- ('Weekly Tech Digest - Issue #6',
-- '<html><body><h2>Issue #6</h2><p>Cloud-native applications are trending!</p></body></html>',
-- 'Sent', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),

-- -- 16
-- ('Yearly Roundup 2025',
-- '<html><body><h2>2025 Roundup</h2><p>Here are the biggest highlights of the year so far.</p></body></html>',
-- 'Draft', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- -- 17
-- ('Weekly Tech Digest - Issue #7',
-- '<html><body><h2>Issue #7</h2><p>AI-powered automation explained.</p></body></html>',
-- 'Sent', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

-- -- 18
-- ('New Blog: Remote Work Best Practices',
-- '<html><body><h2>Remote Work</h2><p>Tips to stay productive while working remotely.</p></body></html>',
-- 'Draft', NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- -- 19
-- ('Upcoming Event: TechOps 2025',
-- '<html><body><h2>TechOps 2025</h2><p>Join us for our annual tech event.</p></body></html>',
-- 'Draft', NULL, NOW(), NOW()),

-- -- 20
-- ('Weekly Tech Digest - Issue #8',
-- '<html><body><h2>Issue #8</h2><p>Quantum computing breakthroughs in 2025.</p></body></html>',
-- 'Sent', NOW(), NOW() - INTERVAL '1 day', NOW());
