import prisma from '@/lib/prisma';

export async function generateUniqueUsernameFromEmail(email: string): Promise<string> {
  const MAX_BASE_LENGTH = 20;
  const MAX_BATCH_SIZE = 20;

  const base = email
    .split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
    .slice(0, MAX_BASE_LENGTH);

  const candidates = Array.from({ length: MAX_BATCH_SIZE }, (_, i) => (i === 0 ? base : `${base}${i}`));

  const existingUsernames = await prisma.user.findMany({
    where: {
      username: { in: candidates }
    },
    select: { username: true }
  });

  const taken = new Set(existingUsernames.map((u) => u.username));

  for (const candidate of candidates) {
    if (!taken.has(candidate)) return candidate;
  }

  let counter = MAX_BATCH_SIZE;
  while (true) {
    const username = `${base}${counter}`;
    const exists = await prisma.user.findUnique({ where: { username } });
    if (!exists) return username;
    counter++;
  }
}
