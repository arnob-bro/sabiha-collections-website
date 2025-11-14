INSERT INTO services (title, short_desc, key_benefits, our_process, technologies, active, icon)
VALUES
(
  'Web Development',
  'Custom websites built with modern technologies for performance and scalability.',
  '["Responsive design","SEO-friendly","Secure and scalable","User-focused UI/UX"]'::jsonb,
  '["Requirement analysis","UI/UX design","Frontend & backend development","Testing & deployment"]'::jsonb,
  '["React", "Nodejs", "Nextjs", "PostgreSQL", "TailwindCSS"]'::jsonb,
  true,
  'FaGlobe'
),
(
  'Mobile App Development',
  'iOS and Android applications tailored for your business needs.',
  '["Cross-platform solutions","High performance","Scalable architecture","Engaging user experience"]'::jsonb,
  '["Requirement gathering","UI design","App development","Testing & publishing"]'::jsonb,
  '["Flutter", "React Native", "Swift", "Kotlin", "Firebase"]'::jsonb,
  true,
  'FaMobileAlt'
),
(
  'Cloud Solutions',
  'Reliable cloud infrastructure setup and migration for businesses.',
  '["High availability","Cost-effective","Scalable resources","Secure environment"]'::jsonb,
  '["Assess business needs","Plan cloud migration","Implement infrastructure","Ongoing support"]'::jsonb,
  '["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]'::jsonb,
  true,
  'FaCloud'
),
(
  'UI/UX Design',
  'Creative and user-friendly designs that enhance user engagement.',
  '["Intuitive interfaces","User research-based","Improved usability","Better conversions"]'::jsonb,
  '["Research & analysis","Wireframing","Prototyping","Final design delivery"]'::jsonb,
  '["Figma", "Adobe XD", "Sketch", "InVision"]'::jsonb,
  true,
  'FaPaintBrush'
),
(
  'E-commerce Solutions',
  'Custom online stores with secure payment gateways and user-friendly experience.',
  '["Boosts online sales","Secure transactions","Mobile-friendly","Scalable"]'::jsonb,
  '["Plan store structure","Integrate payment system","Develop & customize features","Launch & support"]'::jsonb,
  '["Shopify", "WooCommerce", "Magento", "Stripe", "PayPal"]'::jsonb,
  true,
  'FaShoppingCart'
),
(
  'Software Testing & QA',
  'Ensure quality and performance with manual and automated testing services.',
  '["Bug-free products","Improved reliability","Faster releases","Enhanced user trust"]'::jsonb,
  '["Plan test cases","Conduct manual/automated tests","Bug fixing","Final QA approval"]'::jsonb,
  '["Selenium", "Jest", "Cypress", "Postman", "JUnit"]'::jsonb,
  true,
  'FaCheckCircle'
),
(
  'DevOps & Automation',
  'CI/CD pipelines and automation solutions to improve efficiency.',
  '["Faster deployments","Reduced downtime","Better collaboration","Improved scalability"]'::jsonb,
  '["Analyze workflows","Setup CI/CD pipelines","Automate deployments","Monitor & optimize"]'::jsonb,
  '["Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Terraform"]'::jsonb,
  true,
  'FaServer'
),
(
  'AI & Machine Learning',
  'Smart AI-driven solutions for automation, insights, and predictions.',
  '["Data-driven insights","Improved efficiency","Predictive analytics","Custom AI models"]'::jsonb,
  '["Collect data","Build ML models","Train & validate","Deploy AI solutions"]'::jsonb,
  '["Python", "TensorFlow", "PyTorch", "scikit-learn", "Pandas"]'::jsonb,
  true,
  'FaBrain'
),
(
  'Custom Software',
  'Tailored software solutions designed for your specific business needs.',
  '["Machine Learning", "Process Automation", "Data Analysis"]'::jsonb,
  '["Bespoke Development", "Process Automation", "System Integration"]'::jsonb,
  '["C#", "Java", "Spring Boot", "Node.js", "PostgreSQL"]'::jsonb,
  true,
  'FaLaptopCode'
);
