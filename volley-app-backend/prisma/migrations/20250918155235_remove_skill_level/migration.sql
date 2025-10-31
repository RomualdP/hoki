/*
  Warnings:

  - You are about to drop the column `level` on the `skills` table. All the data in the column will be lost.
  - The `level` column on the `user_skills` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "skills" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "user_skills" DROP COLUMN "level",
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 5;

-- DropEnum
DROP TYPE "SkillLevel";
