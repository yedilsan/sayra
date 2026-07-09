/*
  Warnings:

  - You are about to drop the column `userId` on the `ExerciseSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PronunciationSession` table. All the data in the column will be lost.
  - Added the required column `childId` to the `ExerciseSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childId` to the `PronunciationSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExerciseSession" DROP CONSTRAINT "ExerciseSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "PronunciationSession" DROP CONSTRAINT "PronunciationSession_userId_fkey";

-- AlterTable
ALTER TABLE "ExerciseSession" DROP COLUMN "userId",
ADD COLUMN     "childId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PronunciationSession" DROP COLUMN "userId",
ADD COLUMN     "childId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSession" ADD CONSTRAINT "ExerciseSession_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronunciationSession" ADD CONSTRAINT "PronunciationSession_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
