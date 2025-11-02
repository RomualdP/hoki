-- Migration: Rename COACH to OWNER and ASSISTANT_COACH to COACH
-- This migration updates existing data to use the new enum values
-- Note: Enum values were added in the previous migration

-- Step 2: Update existing Member records
-- COACH -> OWNER
UPDATE "members" 
SET role = 'OWNER'::"ClubRole" 
WHERE role = 'COACH'::"ClubRole";

-- ASSISTANT_COACH -> COACH
UPDATE "members" 
SET role = 'COACH'::"ClubRole" 
WHERE role = 'ASSISTANT_COACH'::"ClubRole";

-- Step 3: Update existing User records
-- COACH -> OWNER
UPDATE "users" 
SET "clubRole" = 'OWNER'::"ClubRole" 
WHERE "clubRole" = 'COACH'::"ClubRole";

-- ASSISTANT_COACH -> COACH
UPDATE "users" 
SET "clubRole" = 'COACH'::"ClubRole" 
WHERE "clubRole" = 'ASSISTANT_COACH'::"ClubRole";

-- Step 4: Update existing Invitation records
-- ASSISTANT_COACH -> COACH
UPDATE "invitations" 
SET type = 'COACH'::"InvitationType" 
WHERE type = 'ASSISTANT_COACH'::"InvitationType";

-- Step 5: Remove old enum values (PostgreSQL doesn't support removing enum values directly)
-- We'll keep the old values for backward compatibility but they won't be used
-- The Prisma schema will only define the new values
