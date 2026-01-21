// MongoDB Initialization Script for AMEP
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('amep_db');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'username', 'password_hash', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email'
        },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 100
        },
        password_hash: {
          bsonType: 'string'
        },
        role: {
          enum: ['student', 'teacher', 'admin']
        }
      }
    }
  }
});

db.createCollection('concepts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['concept_name', 'subject_area', 'difficulty_level'],
      properties: {
        concept_name: {
          bsonType: 'string'
        },
        difficulty_level: {
          bsonType: 'double',
          minimum: 0.0,
          maximum: 1.0
        }
      }
    }
  }
});

db.createCollection('student_concept_mastery', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['student_id', 'concept_id', 'mastery_score'],
      properties: {
        mastery_score: {
          bsonType: 'double',
          minimum: 0.0,
          maximum: 100.0,
          description: 'Mastery score must be between 0 and 100'
        }
      }
    }
  }
});

db.createCollection('soft_skill_assessments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['team_id', 'assessed_student_id', 'assessment_type'],
      properties: {
        td_communication: {
          bsonType: 'double',
          minimum: 1.0,
          maximum: 5.0
        },
        overall_td_score: {
          bsonType: 'double',
          minimum: 1.0,
          maximum: 5.0
        }
      }
    }
  }
});

print('✓ AMEP collections created with validation rules');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.students.createIndex({ user_id: 1 }, { unique: true });
db.students.createIndex({ section: 1 });

db.teachers.createIndex({ user_id: 1 }, { unique: true });

db.concepts.createIndex({ concept_name: 1 });
db.concepts.createIndex({ subject_area: 1 });

db.student_concept_mastery.createIndex({ student_id: 1, concept_id: 1 }, { unique: true });
db.student_concept_mastery.createIndex({ mastery_score: 1 });

db.live_polls.createIndex({ is_active: 1 });
db.live_polls.createIndex({ created_at: -1 });

db.poll_responses.createIndex({ poll_id: 1, student_id: 1 }, { unique: true });

db.projects.createIndex({ teacher_id: 1 });
db.teams.createIndex({ project_id: 1 });

db.soft_skill_assessments.createIndex({ team_id: 1 });
db.soft_skill_assessments.createIndex({ assessed_student_id: 1 });

db.curriculum_templates.createIndex({ subject_area: 1 });
db.curriculum_templates.createIndex({ grade_level: 1 });
db.curriculum_templates.createIndex({ title: 'text', description: 'text' });

print('✓ All indexes created successfully');
