/**
 * Migration Script: Create Member OWNER entries for club owners
 *
 * This script finds all clubs that have an owner but no corresponding
 * Member OWNER entry, and creates the missing Member records.
 *
 * Usage:
 *   npx tsx scripts/migrate-owners-to-members.ts
 */

import { PrismaClient, ClubRole } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration: Create Member OWNER for club owners...\n');

  try {
    // Find all clubs
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    });

    console.log(`Found ${clubs.length} clubs\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const club of clubs) {
      // Check if owner already has a Member entry as OWNER
      const existingMember = await prisma.member.findFirst({
        where: {
          userId: club.ownerId,
          clubId: club.id,
          role: ClubRole.OWNER,
        },
      });

      if (existingMember) {
        console.log(
          `✓ Club "${club.name}" (${club.id}) - Owner already has Member OWNER (skipped)`,
        );
        skippedCount++;
        continue;
      }

      // Create Member OWNER for the owner
      await prisma.member.create({
        data: {
          id: randomUUID(),
          userId: club.ownerId,
          clubId: club.id,
          role: ClubRole.OWNER,
          joinedAt: new Date(),
          leftAt: null,
          invitedBy: null,
        },
      });

      console.log(
        `✓ Club "${club.name}" (${club.id}) - Created Member OWNER for owner`,
      );
      migratedCount++;
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Total clubs: ${clubs.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped (already exists): ${skippedCount}`);
    console.log('\n✓ Migration completed successfully');
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
