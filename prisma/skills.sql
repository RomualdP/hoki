-- Clear existing skills
DELETE FROM skills;

-- Insert the 4 mock skills from frontend
INSERT INTO skills (id, name, description, category, "isActive", "createdAt", "updatedAt") VALUES
('skill1', 'Smash', 'Attaque puissante au filet', 'ATTACK'::"SkillCategory", true, NOW(), NOW()),
('skill2', 'Service flottant', 'Service technique sans rotation', 'SERVING'::"SkillCategory", true, NOW(), NOW()),
('skill3', 'Reception', 'Reception de service', 'RECEPTION'::"SkillCategory", true, NOW(), NOW()),
('skill4', 'Contre simple', 'Blocage a une main', 'BLOCKING'::"SkillCategory", true, NOW(), NOW());

-- Show inserted skills
SELECT * FROM skills;
