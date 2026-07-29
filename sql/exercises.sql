-- ============================================================
-- Exercise 1: High-performing students in a specific year
-- - academic year 2025-2026, score >= 85, active courses only
-- ============================================================
SELECT
    s.id            AS student_id,
    s."firstName" || ' ' || s."lastName" AS full_name,
    c.name          AS course,
    sc.score,
    sc."academicYear" AS academic_year
FROM scores sc
JOIN students s ON s.id = sc."studentId"
JOIN courses c  ON c.id = sc."courseId"
WHERE sc."academicYear" = '2025-2026'
  AND sc.score >= 85
  AND c."isActive" = true;

-- ============================================================
-- Exercise 2: Multiple score conditions
-- score BETWEEN 60 AND 90, academic_year = '2025-2026'
-- ============================================================
SELECT *
FROM scores
WHERE score BETWEEN 60 AND 90
  AND "academicYear" = '2025-2026';

-- ============================================================
-- Exercise 3: Search students by name and score
-- GET /api/reports/scores?keyword=dara&minScore=70
-- Search firstname, lastname (case-insensitive), minimum score
-- ============================================================
SELECT
    s.id  AS student_id,
    s."firstName" || ' ' || s."lastName" AS full_name,
    c.name AS course,
    sc.score
FROM scores sc
JOIN students s ON s.id = sc."studentId"
JOIN courses c  ON c.id = sc."courseId"
WHERE (s."firstName" ILIKE '%dara%' OR s."lastName" ILIKE '%dara%')
  AND sc.score >= 70;

-- ============================================================
-- Exercise 4: Full academic report
-- Student -> Score -> Course -> Major
-- ============================================================
SELECT
    s."firstName" || ' ' || s."lastName" AS student,
    sc.score,
    sc."academicYear" AS academic_year,
    c.name   AS course,
    c.credit,
    m.name   AS major
FROM scores sc
JOIN students s ON s.id = sc."studentId"
JOIN courses c  ON c.id = sc."courseId"
JOIN majors m   ON m.id = c."majorId";

-- ============================================================
-- Exercise 5: Average score for each student
-- Returns student_id, full_name, average_score
-- ============================================================
SELECT
    s.id AS student_id,
    s."firstName" || ' ' || s."lastName" AS full_name,
    ROUND(AVG(sc.score)::numeric, 2) AS average_score
FROM scores sc
JOIN students s ON s.id = sc."studentId"
GROUP BY s.id, s."firstName", s."lastName";

-- ============================================================
-- Part 11 bonus: pass-rate as a single raw SQL query
-- ============================================================
SELECT
    COUNT(*) FILTER (WHERE score >= 60)::float / COUNT(*) * 100 AS pass_rate_percent
FROM scores;
