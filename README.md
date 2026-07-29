# Academic Performance API

Node.js + Express + Sequelize solution for the "Database Version Control and
Querying with Sequelize" exercises, plus the Part 11 report API.

**Database: PostgreSQL** (via `pg`). This project deliberately does **not**
use SQLite — Exercise 3's hint calls for `Op.iLike`, which Sequelize only
implements for Postgres, so Postgres was the natural choice. Swap `dialect`
in `config/database.js` to `"mysql"` if you'd rather use MySQL, but then
replace `Op.iLike` with `Op.like` in `services/exercises.js` (MySQL string
comparisons are case-insensitive by default).

## Schema

| Table | Fields |
|---|---|
| `majors` | id, name |
| `courses` | id, name, credit, isActive, majorId → majors |
| `students` | id, firstName, lastName, email |
| `scores` | id, studentId → students, courseId → courses, score, academicYear |

Relationship path: `Student → Score → Course → Major`.

## Setup

```bash
npm install
cp .env.example .env        # fill in your Postgres credentials
createdb academic_db        # or create it in psql/pgAdmin
npm run seed                # syncs tables + inserts sample data
npm start                   # starts the API on http://localhost:3000
```

## Exercise endpoints (1–5)

| Exercise | Endpoint |
|---|---|
| 1. High-performing students | `GET /api/reports/high-performers` |
| 2. Multiple score conditions | `GET /api/reports/scores-between` |
| 3. Search by name + score | `GET /api/reports/scores?keyword=dara&minScore=70` |
| 4. Full academic report | `GET /api/reports/full-academic-report` |
| 5. Average score per student | `GET /api/reports/average-scores` |

Equivalent raw SQL for exercises 1–5 (and a bonus pass-rate query) lives in
`sql/exercises.sql`. Table DDL is in `sql/schema.sql`.

## Part 11: Academic Performance API endpoints

| Endpoint | Description |
|---|---|
| `GET /api/reports/student-performance` | Every student's average score + courses taken |
| `GET /api/reports/course-performance` | Every course's average score + enrollment count |
| `GET /api/reports/major-performance` | Average score per major, across all its courses |
| `GET /api/reports/top-students?limit=5` | Highest-average students, best first |
| `GET /api/reports/at-risk-students?threshold=60` | Students averaging below the threshold |
| `GET /api/reports/pass-rate?passingScore=60` | Overall % of scores meeting/exceeding the passing score |

## Project layout

```
academic-api/
├── app.js
├── config/database.js       # Sequelize + Postgres connection
├── models/                  # Major, Course, Student, Score + associations
├── seeders/seed.js          # sample data covering every exercise condition
├── services/exercises.js    # Exercises 1-5 as Sequelize queries
├── controllers/
│   ├── exerciseController.js
│   └── reportController.js  # Part 11 endpoints
├── routes/reportRoutes.js
└── sql/
    ├── schema.sql           # DDL (PostgreSQL)
    └── exercises.sql        # raw SQL for exercises 1-5 (PostgreSQL)
```

## Sample data notes

The seed data is deliberately built to exercise edge cases:
- One score is in `2024-2025` (wrong year) to verify Exercise 1's year filter.
- One score belongs to an inactive course to verify Exercise 1's active-course filter.
- Two students share the first name "Dara" to verify Exercise 3's keyword search.
- One student has a low average to populate `at-risk-students`.
