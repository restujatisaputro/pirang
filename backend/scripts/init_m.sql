-- Migration: change schedules.lecturerId -> schedules.lecturerIds (JSON/TEXT)
-- Run once.

-- 1) Add lecturerIds column (use JSON if your MySQL supports it; otherwise TEXT)
ALTER TABLE schedules
  ADD COLUMN lecturerIds JSON NULL AFTER courseId;

-- If your MySQL does NOT support JSON type, use this instead:
-- ALTER TABLE schedules ADD COLUMN lecturerIds TEXT NULL AFTER courseId;

-- 2) Backfill lecturerIds from existing lecturerId
UPDATE schedules
SET lecturerIds = JSON_ARRAY(lecturerId)
WHERE lecturerId IS NOT NULL AND (lecturerIds IS NULL OR JSON_LENGTH(lecturerIds) = 0);

-- 3) (Optional) Keep lecturerId for backward compatibility, or drop it after frontend is updated.
-- ALTER TABLE schedules DROP COLUMN lecturerId;
