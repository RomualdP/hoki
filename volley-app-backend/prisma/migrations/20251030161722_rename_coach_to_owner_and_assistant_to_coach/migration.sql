-- Migration: Add new enum values for ClubRole and InvitationType
-- This migration only adds the new enum values
-- The updates of existing data will be done in the next migration

-- Add enum values if they don't exist (using DO block to check first)
DO $$ 
BEGIN
    -- Check if OWNER exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'ClubRole' AND e.enumlabel = 'OWNER') THEN
        ALTER TYPE "ClubRole" ADD VALUE 'OWNER';
    END IF;
    
    -- Check if COACH exists (as new value), if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'ClubRole' AND e.enumlabel = 'COACH') THEN
        ALTER TYPE "ClubRole" ADD VALUE 'COACH';
    END IF;
    
    -- Check if COACH exists in InvitationType
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'InvitationType' AND e.enumlabel = 'COACH') THEN
        ALTER TYPE "InvitationType" ADD VALUE 'COACH';
    END IF;
END $$;
