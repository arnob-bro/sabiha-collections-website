INSERT INTO portfolio_items
(title, category, description, image, problem, solution, results, tech_stack, active)
VALUES
(
    'E-commerce Platform',
    'Web Development',
    'A high-performance online store with custom checkout flow.',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Client needed a scalable e-commerce solution to replace their outdated platform.',
    'Built a React frontend with Node.js backend, MongoDB database, and Stripe integration.',
    'Increased conversion rate by 35%, reduced page load time by 60%, and handled 2x more traffic.',
    '["React","Node.js","Express","MongoDB","Stripe API","Redux"]'::jsonb,
    true
),
(
    'Health & Fitness App',
    'Mobile Development',
    'Personalized workout and nutrition tracking application.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Fitness startup needed a cross-platform app for tracking workouts and nutrition.',
    'Developed a React Native app with Firebase backend, integrating health APIs.',
    '100,000+ downloads in first 3 months, 4.8/5 app store rating, 75% user retention.',
    '["React Native","Firebase","Google Fit API","Apple HealthKit","Redux"]'::jsonb,
    true
),
(
    'Enterprise Dashboard',
    'Cloud Solutions',
    'Real-time analytics dashboard for business intelligence.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Corporation needed a unified dashboard to visualize multiple data sources in real-time.',
    'Created cloud-based solution with AWS services, React frontend, and D3.js visualizations.',
    'Reduced decision-making time by 40%, consolidated 5 tools into one platform, saved $250k/year.',
    '["AWS Lambda","React","D3.js","Python","Amazon QuickSight","GraphQL"]'::jsonb,
    false
);


INSERT INTO portfolio_items
(title, category, description, image, problem, solution, results, tech_stack, active)
VALUES
-- 1
-- (
--     'Smart Home Automation',
--     'IoT Development',
--     'IoT platform for controlling smart devices remotely.',
--     'https://images.unsplash.com/photo-1557089708-7d5d6f3bfc4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Client needed a secure way to control smart home devices from anywhere.',
--     'Built an IoT hub with MQTT, Node.js backend, and Flutter mobile app.',
--     '10,000+ connected devices, reduced power consumption by 25%.',
--     '["Nodejs","Flutter","MQTT","AWS IoT","MongoDB"]'::jsonb,
--     true
-- ),
-- 2
(
    'AI Resume Screener',
    'AI/ML Development',
    'An AI tool that screens resumes against job descriptions.',
    'https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'HR team struggled with filtering 500+ resumes daily.',
    'Implemented NLP-based resume parser with TensorFlow and Python backend.',
    'Reduced screening time by 80%, improved hire quality score by 20%.',
    '["Python","TensorFlow","NLP","FastAPI","PostgreSQL"]'::jsonb,
    true
),
-- 3
(
    'Food Delivery App',
    'Mobile Development',
    'On-demand food ordering and delivery application.',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Restaurant chain needed mobile presence with real-time delivery tracking.',
    'Developed cross-platform React Native app with socket-based order tracking.',
    '50k+ downloads, 4.7 rating, increased online sales by 200%.',
    '["React Native","Nodejs","Express","Socketio","Firebase"]'::jsonb,
    true
),
-- 4
-- (
--     'Online Learning Platform',
--     'Web Development',
--     'A scalable e-learning platform with live classes and exams.',
--     'https://images.unsplash.com/photo-1584697964154-3c57c0e4b2d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Education startup needed to deliver video courses and assessments online.',
--     'Built platform using Next.js, Node.js, and integrated WebRTC for live classes.',
--     '100k+ active learners, 40% completion rate improvement.',
--     '["Nextjs","Nodejs","WebRTC","MongoDB","Redis"]'::jsonb,
--     true
-- ),
-- -- 5
-- (
--     'Logistics Tracking System',
--     'Cloud Solutions',
--     'GPS-based real-time logistics tracking system.',
--     'https://images.unsplash.com/photo-1556997685-309f5d716f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Logistics company needed accurate fleet tracking and route optimization.',
--     'Developed cloud-based tracking using AWS + Mapbox APIs.',
--     'Improved delivery accuracy by 35%, reduced fuel cost by 15%.',
--     '["AWS","Mapbox","Nodejs","React","PostgreSQL"]'::jsonb,
--     true
-- ),
-- 6
-- (
--     'Crypto Wallet App',
--     'Blockchain Development',
--     'Secure mobile wallet for storing and transferring cryptocurrencies.',
--     'https://images.unsplash.com/photo-1621502501051-7f6e243e9c64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Users needed a simple but secure crypto wallet for Bitcoin & Ethereum.',
--     'Developed React Native wallet app with blockchain integration.',
--     '5k+ daily active users, handled $10M+ transactions safely.',
--     '["React Native","Ethereum","Bitcoin API","Nodejs","MongoDB"]'::jsonb,
--     true
-- ),
-- 7
-- (
--     'Hospital Management System',
--     'Enterprise Software',
--     'End-to-end hospital management with scheduling and billing.',
--     'https://images.unsplash.com/photo-1580281657529-47c6a1af0b3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Hospital required centralized system for patient and staff management.',
--     'Built enterprise web app with Angular frontend and Java backend.',
--     'Reduced administrative workload by 50%, improved patient satisfaction scores.',
--     '["Angular","Java Spring Boot","MySQL","Redis","Docker"]'::jsonb,
--     true
-- ),
-- 8
(
    'Travel Booking Portal',
    'Web Development',
    'Online platform for booking flights, hotels, and packages.',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Client needed integrated system for online travel booking.',
    'Created scalable portal using React, Node.js, and third-party APIs.',
    'Processed 1M+ bookings, increased customer retention by 30%.',
    '["React","Nodejs","Express","GraphQL","PostgreSQL"]'::jsonb,
    true
);
-- 9
-- (
--     'E-Voting System',
--     'Blockchain Development',
--     'Blockchain-based secure voting platform.',
--     'https://images.unsplash.com/photo-1616353074974-77bb8d8f1db6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
--     'Organization needed transparent and tamper-proof voting mechanism.',
--     'Built blockchain-powered voting app with smart contracts.',
--     'Ensured 100% secure, immutable, and auditable elections.',
--     '["Solidity","Ethereum","React","Nodejs","IPFS"]'::jsonb,
--     true
-- );
