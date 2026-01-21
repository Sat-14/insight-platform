# AMEP MongoDB Schema Documentation

This document describes the MongoDB collections and their schemas for the AMEP platform.

## Collections Overview

AMEP uses 21 MongoDB collections organized by business requirements (BR1-BR9).

---

## Core User Collections

### users
Primary authentication and user management.

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  username: String (unique, indexed),
  password_hash: String,
  role: String, // enum: ['student', 'teacher', 'admin']
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
- `email: 1` (unique)
- `username: 1` (unique)
- `role: 1`

---

### students
Student profile information.

```javascript
{
  _id: String, // Same as user_id for easy lookup
  user_id: ObjectId (ref: users._id, unique),
  first_name: String,
  last_name: String,
  grade_level: Number, // 1-12
  section: String, // Class section identifier
  enrollment_date: Date,
  learning_style: String, // Optional personalization
  preferred_difficulty: Number, // 0.0 to 1.0 (BR2)
  created_at: Date
}
```

**Indexes:**
- `user_id: 1` (unique)
- `grade_level: 1`
- `section: 1`

---

### teachers
Teacher profile information.

```javascript
{
  _id: String, // Same as user_id
  user_id: ObjectId (ref: users._id, unique),
  first_name: String,
  last_name: String,
  subject_area: String,
  department: String,
  years_experience: Number,
  created_at: Date
}
```

**Indexes:**
- `user_id: 1` (unique)
- `subject_area: 1`

---

## Curriculum & Content Collections (BR1, BR2)

### concepts
Learning concepts that students master.

```javascript
{
  _id: ObjectId,
  concept_name: String,
  description: String,
  subject_area: String,
  difficulty_level: Number, // 0.0 to 1.0
  weight: Number, // Importance factor (default: 1.0)
  prerequisites: [ObjectId], // Array of concept IDs
  correlation_weights: Object, // { concept_id: weight } for DKVMN (BR3)
  created_at: Date
}
```

**Indexes:**
- `concept_name: 1`
- `subject_area: 1`
- `difficulty_level: 1`

---

### content_items
Practice questions, videos, readings, exercises.

```javascript
{
  _id: ObjectId,
  concept_id: ObjectId (ref: concepts._id),
  item_type: String, // enum: ['question', 'video', 'reading', 'exercise']
  title: String,
  content: String, // Question text, video URL, etc.
  difficulty: Number, // 0.0 to 1.0
  estimated_time: Number, // Minutes
  scaffolding_available: Boolean,
  created_by: ObjectId (ref: teachers._id),
  created_at: Date
}
```

**Indexes:**
- `concept_id: 1`
- `difficulty: 1`
- `item_type: 1`

---

## Knowledge Tracing Collections (BR1, BR2, BR3)

### student_concept_mastery
Core mastery tracking with hybrid model components.

```javascript
{
  _id: String, // Format: "{student_id}_{concept_id}" for uniqueness
  student_id: ObjectId (ref: students._id),
  concept_id: ObjectId (ref: concepts._id),
  mastery_score: Number, // 0.00 to 100.00 (BR1: continuous scoring)
  bkt_component: Number, // Bayesian Knowledge Tracing contribution
  dkt_component: Number, // Deep Knowledge Tracing contribution
  dkvmn_component: Number, // DKVMN contribution
  confidence: Number, // 0.0 to 1.0
  learning_velocity: Number, // Rate of improvement
  last_assessed: Date,
  times_assessed: Number,
  updated_at: Date
}
```

**Indexes:**
- `student_id: 1, concept_id: 1` (compound, unique)
- `mastery_score: 1`
- `last_assessed: -1`

---

### student_responses
Individual student responses to practice items.

```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: students._id),
  item_id: ObjectId (ref: content_items._id),
  concept_id: ObjectId (ref: concepts._id),
  is_correct: Boolean,
  response_time: Number, // Seconds
  hints_used: Number, // For disengagement detection (BR4)
  attempts: Number, // For disengagement detection (BR4)
  response_text: String, // Optional for open-ended
  session_id: ObjectId, // Links to practice session
  submitted_at: Date
}
```

**Indexes:**
- `student_id: 1`
- `concept_id: 1`
- `submitted_at: -1`
- `session_id: 1`

---

## Engagement Tracking Collections (BR4, BR6)

### engagement_sessions
Student engagement analysis results.

```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: students._id),
  session_type: String, // enum: ['live_class', 'practice', 'project_work', 'assessment']
  start_time: Date,
  end_time: Date,
  duration_minutes: Number,
  engagement_score: Number, // 0.00 to 100.00 (BR4)
  engagement_level: String, // enum: ['ENGAGED', 'PASSIVE', 'MONITOR', 'AT_RISK', 'CRITICAL']
  implicit_component: Number, // Contribution from implicit signals
  explicit_component: Number, // Contribution from explicit signals
  behaviors_detected: Array, // List of disengagement behaviors found
  recommendations: Array, // Actionable recommendations for teacher
  analyzed_at: Date
}
```

**Indexes:**
- `student_id: 1`
- `analyzed_at: -1`

---

### engagement_logs
Detailed event tracking for implicit signals.

```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: students._id),
  session_id: ObjectId (ref: engagement_sessions._id),
  event_type: String, // enum: ['login', 'page_view', 'interaction', 'resource_access', 'quiz_attempt', 'poll_response']
  event_data: Object, // Flexible data storage
  timestamp: Date
}
```

**Indexes:**
- `student_id: 1`
- `timestamp: -1`

---

### live_polls
Anonymous polling for 100% participation (BR4).

```javascript
{
  _id: ObjectId,
  teacher_id: ObjectId (ref: teachers._id),
  class_id: String, // Section identifier
  question: String,
  poll_type: String, // enum: ['multiple_choice', 'understanding', 'fact_based']
  options: [String], // Array of answer options
  correct_answer: String, // Optional for fact-based
  created_at: Date,
  closed_at: Date,
  is_active: Boolean
}
```

**Indexes:**
- `teacher_id: 1`
- `is_active: 1`
- `created_at: -1`

---

### poll_responses
Student responses to live polls (anonymous aggregation).

```javascript
{
  _id: ObjectId,
  poll_id: ObjectId (ref: live_polls._id),
  student_id: ObjectId (ref: students._id), // For tracking but not shown to teacher
  selected_option: String,
  is_correct: Boolean, // If poll has correct answer
  response_time: Number, // Seconds
  submitted_at: Date
}
```

**Indexes:**
- `poll_id: 1, student_id: 1` (compound, unique - one response per poll)

---

### disengagement_alerts
Alerts for at-risk students (BR4, BR6).

```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: students._id),
  alert_type: String, // enum: ['quick_guess', 'bottom_out_hint', 'many_attempts', 'low_login_frequency', 'declining_performance']
  severity: String, // enum: ['MONITOR', 'AT_RISK', 'CRITICAL']
  engagement_score: Number,
  engagement_level: String,
  behaviors: Array, // Detected behaviors
  recommendations: Array,
  detected_at: Date,
  acknowledged: Boolean, // Has teacher seen this?
  resolved_at: Date
}
```

**Indexes:**
- `student_id: 1, acknowledged: 1`
- `detected_at: -1`

---

## Project-Based Learning Collections (BR5, BR9)

### projects
PBL project definitions.

```javascript
{
  _id: ObjectId,
  teacher_id: ObjectId (ref: teachers._id),
  title: String,
  description: String,
  curriculum_alignment: ObjectId, // Optional reference to standards
  start_date: Date,
  end_date: Date,
  current_stage: String, // enum: ['questioning', 'define', 'research', 'create', 'present']
  created_at: Date
}
```

**Indexes:**
- `teacher_id: 1`
- `start_date: -1`

---

### teams
Project teams.

```javascript
{
  _id: ObjectId,
  project_id: ObjectId (ref: projects._id),
  team_name: String,
  created_at: Date
}
```

**Indexes:**
- `project_id: 1`

---

### team_memberships
Student-team associations with roles.

```javascript
{
  _id: ObjectId,
  team_id: ObjectId (ref: teams._id),
  student_id: ObjectId (ref: students._id),
  role: String, // e.g., 'leader', 'researcher', 'designer'
  joined_at: Date
}
```

**Indexes:**
- `team_id: 1, student_id: 1` (compound, unique)
- `student_id: 1`

---

### soft_skill_assessments
4-dimensional team effectiveness model (BR5).

```javascript
{
  _id: ObjectId,
  team_id: ObjectId (ref: teams._id),
  assessed_student_id: ObjectId (ref: students._id),
  assessor_student_id: ObjectId (ref: students._id), // Peer review
  assessment_type: String, // enum: ['peer_review', 'self_assessment', 'teacher_assessment']

  // Team Dynamics (TD) - Likert 1.0 to 5.0
  td_communication: Number,
  td_mutual_support: Number,
  td_trust: Number,
  td_active_listening: Number,
  overall_td_score: Number, // Computed average

  // Team Structure (TS)
  ts_clear_roles: Number,
  ts_task_scheduling: Number,
  ts_decision_making: Number,
  ts_conflict_resolution: Number,
  overall_ts_score: Number,

  // Team Motivation (TM)
  tm_clear_purpose: Number,
  tm_smart_goals: Number,
  tm_passion: Number,
  tm_synergy: Number,
  overall_tm_score: Number,

  // Team Excellence (TE)
  te_growth_mindset: Number,
  te_quality_work: Number,
  te_self_monitoring: Number,
  te_reflective_practice: Number,
  overall_te_score: Number,

  comments: String,
  assessed_at: Date
}
```

**Indexes:**
- `team_id: 1`
- `assessed_student_id: 1`
- `assessed_at: -1`

---

### project_milestones
Project timeline tracking (BR9).

```javascript
{
  _id: ObjectId,
  project_id: ObjectId (ref: projects._id),
  team_id: ObjectId (ref: teams._id),
  title: String,
  description: String,
  due_date: Date,
  status: String, // enum: ['pending', 'in_progress', 'completed', 'overdue']
  completed_at: Date
}
```

**Indexes:**
- `project_id: 1`
- `team_id: 1`
- `due_date: 1`

---

### project_artifacts
File submissions with version control (BR9).

```javascript
{
  _id: ObjectId,
  team_id: ObjectId (ref: teams._id),
  project_id: ObjectId (ref: projects._id),
  artifact_type: String, // enum: ['document', 'presentation', 'code', 'video', 'other']
  file_name: String,
  file_url: String, // S3/Cloud storage URL
  file_size: Number, // Bytes
  version: Number, // Auto-increment for version control
  uploaded_by: ObjectId (ref: students._id),
  uploaded_at: Date
}
```

**Indexes:**
- `team_id: 1`
- `project_id: 1`
- `uploaded_at: -1`

---

## Teacher Productivity Collections (BR7, BR8)

### curriculum_templates
Template library for workload reduction (BR7).

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject_area: String,
  grade_level: Number,
  template_type: String, // enum: ['lesson_plan', 'project_brief', 'assessment', 'rubric']
  content: Object, // Structured template content
  learning_objectives: [String],
  estimated_duration: Number, // Minutes
  soft_skills_targeted: [String], // e.g., ['collaboration', 'communication']
  created_by: ObjectId (ref: teachers._id),
  collaborators: [ObjectId], // Teachers who contributed
  is_public: Boolean,
  times_used: Number,
  avg_rating: Number,
  created_at: Date
}
```

**Indexes:**
- `subject_area: 1, grade_level: 1` (compound)
- `is_public: 1`
- `times_used: -1`
- Text index on `title` and `description` for search

---

### institutional_metrics
Unified reporting dashboard data (BR8).

```javascript
{
  _id: ObjectId,
  metric_date: Date,

  // BR8: Three core metrics
  mastery_rate: Number, // Average class mastery (0-100)
  teacher_adoption_rate: Number, // Platform usage (0-100)
  admin_confidence_score: Number, // Data completeness (0-100)

  // Supporting metrics
  total_students: Number,
  active_students: Number,
  total_teachers: Number,
  active_teachers: Number,
  total_concepts_taught: Number,
  avg_engagement_score: Number,

  // BR7: Workload metrics
  avg_planning_time_minutes: Number,
  data_entry_events: Number,

  calculated_at: Date
}
```

**Indexes:**
- `metric_date: -1`

---

### teacher_interventions
Intervention tracking for BR6.

```javascript
{
  _id: ObjectId,
  teacher_id: ObjectId (ref: teachers._id),
  concept_id: ObjectId (ref: concepts._id),
  intervention_type: String, // enum: ['re_explanation', 'additional_practice', 'one_on_one', 'group_activity', 'scaffolding']
  target_students: [ObjectId], // Array of student IDs
  description: String,
  mastery_before: Number, // Average before intervention
  mastery_after: Number, // Average after intervention
  improvement: Number, // Calculated difference
  performed_at: Date,
  measured_at: Date // When post-intervention measurement occurred
}
```

**Indexes:**
- `teacher_id: 1`
- `performed_at: -1`

---

## Data Validation Rules

All collections enforce the following validation rules at the application level:

### Number Ranges
- **Mastery scores:** 0.00 - 100.00
- **Difficulty levels:** 0.0 - 1.0
- **Likert scales:** 1.0 - 5.0
- **Confidence scores:** 0.0 - 1.0

### Enumerations
Strictly enforced via Pydantic schemas in `backend/models/schemas.py`

### Required Fields
- All documents have `_id` (auto-generated if not provided)
- All user-created content has `created_at` timestamp
- All mutable data has `updated_at` timestamp (via middleware)

---

## Migration from PostgreSQL

This schema mirrors the original PostgreSQL design but optimized for MongoDB:

### Key Differences:
1. **No foreign key constraints** - Enforced at application level
2. **Embedded documents** - Some related data embedded instead of separate tables
3. **Arrays instead of junction tables** - e.g., `prerequisites` in concepts
4. **Flexible schemas** - `event_data` and `content` fields use Objects for flexibility
5. **Computed fields stored** - e.g., `overall_td_score` calculated and stored
6. **Text search indexes** - Native MongoDB text search instead of PostgreSQL FTS

### Advantages:
- **Horizontal scalability** - Easy sharding by student_id or class_id
- **Flexible schema evolution** - Add fields without migrations
- **JSON-native** - Direct mapping to/from API responses
- **Performance** - Indexed queries return results fast
- **Developer experience** - Python dicts map naturally to MongoDB documents

---

## References

- **Business Requirements:** See README.md for BR1-BR9 mapping
- **API Schemas:** `backend/models/schemas.py` (Pydantic validation)
- **Database Connection:** `backend/models/database.py`
- **Research Papers:** See README.md for academic citations
