/**
 * Removes duplicate Child rows (same parent + same name + same age), keeping the oldest
 * of each group. Duplicates were possible before the Add Child screen guarded against
 * repeat submissions.
 *
 * Dry run (default) — prints what it would delete, changes nothing:
 *   node scripts/dedupe-children.js --email you@example.com
 *
 * Actually delete:
 *   node scripts/dedupe-children.js --email you@example.com --apply
 *
 * Deleting a Child cascades to its ExerciseSession / PronunciationSession rows, so this
 * refuses to touch any duplicate that has sessions unless you pass --force.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : process.argv[i + 1];
}

const email = arg('--email');
const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');

async function main() {
  if (!email) {
    console.error('Usage: node scripts/dedupe-children.js --email <email> [--apply] [--force]');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      children: {
        select: {
          id: true,
          name: true,
          age: true,
          createdAt: true,
          _count: { select: { exerciseSessions: true, pronunciationSessions: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  const groups = new Map();
  for (const child of user.children) {
    const key = `${child.name.trim().toLowerCase()}|${child.age}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(child);
  }

  const doomed = [];
  const skipped = [];

  for (const [key, list] of groups) {
    // list is oldest-first, so index 0 is the keeper.
    for (const child of list.slice(1)) {
      const sessions = child._count.exerciseSessions + child._count.pronunciationSessions;
      if (sessions > 0 && !force) {
        skipped.push({ ...child, key, sessions });
      } else {
        doomed.push({ ...child, key, sessions });
      }
    }
  }

  console.log(`${user.email}: ${user.children.length} children, ${groups.size} unique name+age`);
  console.log(`${doomed.length} duplicate(s) to delete, ${skipped.length} skipped (have sessions)\n`);

  for (const child of doomed) {
    console.log(`  ${apply ? 'DELETING' : 'would delete'}  ${child.id}  "${child.name}" age ${child.age}`);
  }
  for (const child of skipped) {
    console.log(`  SKIP (has ${child.sessions} session(s), pass --force)  ${child.id}  "${child.name}"`);
  }

  if (!apply) {
    console.log('\nDry run — nothing changed. Re-run with --apply to delete.');
    return;
  }

  if (doomed.length > 0) {
    const result = await prisma.child.deleteMany({ where: { id: { in: doomed.map((c) => c.id) } } });
    console.log(`\nDeleted ${result.count} duplicate child record(s).`);
  } else {
    console.log('\nNothing to delete.');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
