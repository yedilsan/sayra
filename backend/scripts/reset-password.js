/**
 * Resets a user's password directly in the database — for local development only.
 * There is no forgot-password flow in the API, so this is the escape hatch when a dev
 * or test account's password is lost.
 *
 *   node scripts/reset-password.js --email you@example.com --password newpassword123
 *
 * Uses the same argon2id hashing as AuthService, so the new password works with
 * POST /auth/login unchanged. Also clears the stored refresh-token hash, which
 * invalidates any existing session for that user.
 */
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : process.argv[i + 1];
}

const email = arg('--email');
const password = arg('--password');

// Mirrors @MinLength(8) on RegisterDto.password.
const MIN_LENGTH = 8;

async function main() {
  if (!email || !password) {
    console.error('Usage: node scripts/reset-password.js --email <email> --password <newPassword>');
    process.exit(1);
  }
  if (password.length < MIN_LENGTH) {
    console.error(`Password must be at least ${MIN_LENGTH} characters (matches the API's rule).`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  await prisma.user.update({
    where: { id: user.id },
    // Dropping the refresh hash logs out any device still holding a session.
    data: { passwordHash, refreshTokenHash: null },
  });

  console.log(`Password reset for ${user.email}. Existing sessions were invalidated.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
