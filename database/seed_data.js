// MongoDB Seed Data for AMEP Development
// Run with: mongosh < seed_data.js

db = db.getSiblingDB('amep_db');

// Clean existing data (only in development!)
print('Cleaning existing data...');
db.users.deleteMany({});
db.students.deleteMany({});
db.teachers.deleteMany({});
db.concepts.deleteMany({});
db.content_items.deleteMany({});
db.curriculum_templates.deleteMany({});

// ============================================================================
// USERS & PROFILES
// ============================================================================

print('Seeding users...');

// Create demo teacher
const teacherId = ObjectId();
db.users.insertOne({
  _id: teacherId,
  email: 'teacher@amep.edu',
  username: 'demo_teacher',
  password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lGOvGbQqBaP6', // password: demo123
  role: 'teacher',
  created_at: new Date()
});

db.teachers.insertOne({
  _id: teacherId.str,
  user_id: teacherId,
  first_name: 'Jane',
  last_name: 'Smith',
  subject_area: 'Mathematics',
  department: 'STEM',
  years_experience: 8,
  created_at: new Date()
});

// Create demo students
const studentIds = [];
const studentNames = [
  { first: 'Alice', last: 'Johnson' },
  { first: 'Bob', last: 'Williams' },
  { first: 'Carol', last: 'Davis' },
  { first: 'David', last: 'Lee' },
  { first: 'Emma', last: 'Martinez' }
];

studentNames.forEach((name, idx) => {
  const userId = ObjectId();
  studentIds.push(userId);

  db.users.insertOne({
    _id: userId,
    email: `student${idx + 1}@amep.edu`,
    username: `student_${name.first.toLowerCase()}`,
    password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lGOvGbQqBaP6', // password: demo123
    role: 'student',
    created_at: new Date()
  });

  db.students.insertOne({
    _id: userId.str,
    user_id: userId,
    first_name: name.first,
    last_name: name.last,
    grade_level: 8,
    section: 'Section-A',
    enrollment_date: new Date('2024-09-01'),
    learning_style: 'visual',
    preferred_difficulty: 0.5,
    created_at: new Date()
  });
});

print(`✓ Created ${studentNames.length} demo students and 1 teacher`);

// ============================================================================
// CONCEPTS & CONTENT
// ============================================================================

print('Seeding concepts...');

const concepts = [
  {
    _id: 'concept_algebra_001',
    concept_name: 'Linear Equations',
    description: 'Solving equations of the form ax + b = c',
    subject_area: 'Algebra',
    difficulty_level: 0.4,
    weight: 1.0,
    prerequisites: [],
    created_at: new Date()
  },
  {
    _id: 'concept_algebra_002',
    concept_name: 'Quadratic Equations',
    description: 'Solving equations of the form ax² + bx + c = 0',
    subject_area: 'Algebra',
    difficulty_level: 0.7,
    weight: 1.5,
    prerequisites: ['concept_algebra_001'],
    created_at: new Date()
  },
  {
    _id: 'concept_geometry_001',
    concept_name: 'Pythagorean Theorem',
    description: 'a² + b² = c² for right triangles',
    subject_area: 'Geometry',
    difficulty_level: 0.5,
    weight: 1.2,
    prerequisites: [],
    created_at: new Date()
  },
  {
    _id: 'concept_statistics_001',
    concept_name: 'Mean, Median, Mode',
    description: 'Measures of central tendency',
    subject_area: 'Statistics',
    difficulty_level: 0.3,
    weight: 1.0,
    prerequisites: [],
    created_at: new Date()
  }
];

db.concepts.insertMany(concepts);
print(`✓ Created ${concepts.length} concepts`);

// Create sample content items
const contentItems = [
  {
    _id: ObjectId(),
    concept_id: 'concept_algebra_001',
    item_type: 'question',
    title: 'Solve for x',
    content: 'Solve: 2x + 5 = 13',
    difficulty: 0.4,
    estimated_time: 3,
    scaffolding_available: true,
    created_by: teacherId,
    created_at: new Date()
  },
  {
    _id: ObjectId(),
    concept_id: 'concept_algebra_001',
    item_type: 'question',
    title: 'Word Problem',
    content: 'Sarah has twice as many apples as oranges. If she has 18 pieces of fruit, how many apples does she have?',
    difficulty: 0.6,
    estimated_time: 5,
    scaffolding_available: true,
    created_by: teacherId,
    created_at: new Date()
  }
];

db.content_items.insertMany(contentItems);
print(`✓ Created ${contentItems.length} content items`);

// ============================================================================
// SAMPLE MASTERY DATA
// ============================================================================

print('Seeding mastery data...');

studentIds.forEach((studentId, idx) => {
  concepts.forEach((concept) => {
    // Simulate different mastery levels
    const baseScore = 30 + (idx * 12) + Math.random() * 30;

    db.student_concept_mastery.insertOne({
      _id: `${studentId.str}_${concept._id}`,
      student_id: studentId,
      concept_id: concept._id,
      mastery_score: Math.min(100, baseScore),
      bkt_component: Math.min(100, baseScore + 5),
      dkt_component: Math.min(100, baseScore - 3),
      dkvmn_component: Math.min(100, baseScore + 2),
      confidence: 0.75 + Math.random() * 0.2,
      learning_velocity: -5 + Math.random() * 15,
      last_assessed: new Date(),
      times_assessed: Math.floor(3 + Math.random() * 10),
      updated_at: new Date()
    });
  });
});

print(`✓ Created mastery records for ${studentIds.length} students`);

// ============================================================================
// CURRICULUM TEMPLATES (BR7)
// ============================================================================

print('Seeding curriculum templates...');

const templates = [
  {
    _id: ObjectId(),
    title: 'Ecosystem Investigation Project',
    description: 'Students investigate local ecosystems and present findings on biodiversity',
    subject_area: 'Science',
    grade_level: 7,
    template_type: 'project_brief',
    content: {
      objectives: ['Understand ecosystem dynamics', 'Develop scientific observation skills'],
      activities: ['Field trip planning', 'Data collection', 'Analysis', 'Presentation'],
      assessment_criteria: ['Research quality', 'Data accuracy', 'Presentation clarity']
    },
    learning_objectives: [
      'Understand ecosystem dynamics and interdependence',
      'Develop scientific observation and data collection skills',
      'Analyze environmental impact factors'
    ],
    estimated_duration: 180,
    soft_skills_targeted: ['Collaboration', 'Research', 'Critical Thinking'],
    created_by: teacherId,
    is_public: true,
    times_used: 45,
    avg_rating: 4.6,
    created_at: new Date()
  },
  {
    _id: ObjectId(),
    title: 'Statistics in Sports Analysis',
    description: 'Use statistical methods to analyze sports performance data',
    subject_area: 'Math',
    grade_level: 8,
    template_type: 'project_brief',
    content: {
      objectives: ['Apply statistics to real data', 'Create visualizations'],
      activities: ['Data collection', 'Statistical analysis', 'Graph creation'],
      assessment_criteria: ['Accuracy of calculations', 'Quality of visualizations']
    },
    learning_objectives: [
      'Apply statistical concepts to real-world data',
      'Calculate mean, median, mode, and standard deviation',
      'Create data visualizations and interpret trends'
    ],
    estimated_duration: 150,
    soft_skills_targeted: ['Problem Solving', 'Presentation', 'Data Literacy'],
    created_by: teacherId,
    is_public: true,
    times_used: 38,
    avg_rating: 4.4,
    created_at: new Date()
  }
];

db.curriculum_templates.insertMany(templates);
print(`✓ Created ${templates.length} curriculum templates`);

// ============================================================================
// SAMPLE PROJECT
// ============================================================================

print('Seeding sample project...');

const projectId = ObjectId();
db.projects.insertOne({
  _id: projectId,
  teacher_id: teacherId,
  title: 'Sustainable Energy Solutions for Local Community',
  description: 'Design and propose renewable energy solutions for our school district',
  start_date: new Date('2025-01-06'),
  end_date: new Date('2025-02-14'),
  current_stage: 'research',
  created_at: new Date()
});

// Create team
const teamId = ObjectId();
db.teams.insertOne({
  _id: teamId,
  project_id: projectId,
  team_name: 'Team Alpha',
  created_at: new Date()
});

// Add students to team
studentIds.slice(0, 4).forEach((studentId, idx) => {
  const roles = ['Team Leader', 'Researcher', 'Designer', 'Technical Lead'];

  db.team_memberships.insertOne({
    _id: ObjectId(),
    team_id: teamId,
    student_id: studentId,
    role: roles[idx],
    joined_at: new Date()
  });
});

// Add milestones
db.project_milestones.insertMany([
  {
    _id: ObjectId(),
    project_id: projectId,
    team_id: teamId,
    title: 'Problem Statement',
    description: 'Define the energy challenge',
    due_date: new Date('2025-01-10'),
    status: 'completed',
    completed_at: new Date('2025-01-09')
  },
  {
    _id: ObjectId(),
    project_id: projectId,
    team_id: teamId,
    title: 'Research Report',
    description: 'Complete research on renewable energy options',
    due_date: new Date('2025-01-20'),
    status: 'in_progress'
  }
]);

print('✓ Created sample project with team and milestones');

// ============================================================================
// INSTITUTIONAL METRICS (BR8)
// ============================================================================

print('Seeding institutional metrics...');

db.institutional_metrics.insertOne({
  _id: ObjectId(),
  metric_date: new Date(),
  mastery_rate: 78.5,
  teacher_adoption_rate: 92.0,
  admin_confidence_score: 94.0,
  total_students: studentIds.length,
  active_students: studentIds.length,
  total_teachers: 1,
  active_teachers: 1,
  total_concepts_taught: concepts.length,
  avg_engagement_score: 85.3,
  avg_planning_time_minutes: 45,
  data_entry_events: 3,
  calculated_at: new Date()
});

print('✓ Created institutional metrics');

// ============================================================================
// SUMMARY
// ============================================================================

print('\n' + '='.repeat(60));
print('AMEP Seed Data Summary:');
print('='.repeat(60));
print(`Users: ${db.users.countDocuments()}`);
print(`Students: ${db.students.countDocuments()}`);
print(`Teachers: ${db.teachers.countDocuments()}`);
print(`Concepts: ${db.concepts.countDocuments()}`);
print(`Content Items: ${db.content_items.countDocuments()}`);
print(`Mastery Records: ${db.student_concept_mastery.countDocuments()}`);
print(`Curriculum Templates: ${db.curriculum_templates.countDocuments()}`);
print(`Projects: ${db.projects.countDocuments()}`);
print(`Teams: ${db.teams.countDocuments()}`);
print('='.repeat(60));
print('✓ Seed data created successfully!');
print('='.repeat(60));

print('\nDemo Login Credentials:');
print('Teacher: teacher@amep.edu / demo123');
print('Student: student1@amep.edu / demo123');
print('='.repeat(60));
