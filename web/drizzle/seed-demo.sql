-- Demo Users
INSERT OR IGNORE INTO users (id, email) VALUES
  ('demo-freelancer-1', 'tanvir@demo.com'),
  ('demo-freelancer-2', 'fatima@demo.com'),
  ('demo-freelancer-3', 'rafiq@demo.com'),
  ('demo-freelancer-4', 'nadia@demo.com'),
  ('demo-freelancer-5', 'kamal@demo.com'),
  ('demo-freelancer-6', 'sabrina@demo.com'),
  ('demo-employer-1', 'hr@techventure.com');

-- Demo Freelancers
INSERT OR IGNORE INTO profiles (id, full_name, role, title, bio, skills, hourly_rate, onboarding_complete) VALUES 
  ('demo-freelancer-1', 'Tanvir Rahman', 'freelancer', 'Senior Full-Stack Developer', 'Expert React & Node.js developer with 5+ years of experience building scalable web applications.', '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Next.js"]', 35, 1),
  ('demo-freelancer-2', 'Fatima Akter', 'freelancer', 'UI/UX Designer', 'Creative designer specializing in mobile apps and web interfaces. Figma expert.', '["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"]', 30, 1),
  ('demo-freelancer-3', 'Rafiq Hossain', 'freelancer', 'Digital Marketing Specialist', 'Growth marketer with expertise in SEO, Google Ads, and social media marketing.', '["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics"]', 25, 1),
  ('demo-freelancer-4', 'Nadia Islam', 'freelancer', 'Mobile App Developer', 'Flutter and React Native developer building cross-platform mobile apps.', '["Flutter", "React Native", "Dart", "Firebase", "iOS", "Android"]', 40, 1),
  ('demo-freelancer-5', 'Kamal Ahmed', 'freelancer', 'WordPress Developer', 'WordPress expert with 100+ websites delivered.', '["WordPress", "WooCommerce", "PHP", "JavaScript", "CSS"]', 20, 1),
  ('demo-freelancer-6', 'Sabrina Khan', 'freelancer', 'Content Writer', 'Professional content writer and copywriter.', '["Content Writing", "Copywriting", "SEO Writing", "Blog Posts"]', 15, 1);

-- Demo Employer
INSERT OR IGNORE INTO profiles (id, full_name, role, company_name, title, bio, onboarding_complete) VALUES 
  ('demo-employer-1', 'TechVenture BD', 'employer', 'TechVenture Bangladesh', 'HR Manager', 'Leading tech company in Dhaka.', 1);

-- Demo Jobs
INSERT OR IGNORE INTO jobs (id, employer_id, title, description, category, budget_mode, budget_min, budget_max, skills, experience_level, status) VALUES 
  ('demo-job-1', 'demo-employer-1', 'React.js Developer for E-commerce Platform', 'We are looking for an experienced React.js developer to help build our new e-commerce platform.', 'Development & IT', 'hourly', 30, 50, '["React", "Redux", "JavaScript", "REST API"]', 'intermediate', 'open'),
  ('demo-job-2', 'demo-employer-1', 'Mobile App UI/UX Design', 'Need a talented UI/UX designer to design our fintech mobile application.', 'Design & Creative', 'fixed', 50000, 80000, '["Figma", "Mobile Design", "User Research"]', 'expert', 'open'),
  ('demo-job-3', 'demo-employer-1', 'SEO & Content Marketing Manager', 'Looking for a digital marketing expert to improve our online presence.', 'Marketing & Growth', 'hourly', 20, 35, '["SEO", "Content Marketing", "Google Ads"]', 'intermediate', 'open'),
  ('demo-job-4', 'demo-employer-1', 'Flutter Developer for Healthcare App', 'Seeking a Flutter developer to build a telemedicine app.', 'Development & IT', 'fixed', 100000, 150000, '["Flutter", "Dart", "Firebase"]', 'expert', 'open'),
  ('demo-job-5', 'demo-employer-1', 'WordPress Website Redesign', 'We need to redesign our company website.', 'Development & IT', 'fixed', 30000, 50000, '["WordPress", "PHP", "CSS"]', 'entry', 'open');
