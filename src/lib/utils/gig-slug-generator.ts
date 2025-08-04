import prisma from '@/lib/prisma';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(baseTitle: string): Promise<string> {
  const baseSlug = slugify(baseTitle);

  const existingSlugs = await prisma.gig.findMany({
    where: {
      slug: {
        startsWith: baseSlug
      }
    },
    select: { slug: true }
  });

  const slugSet = new Set(existingSlugs.map((gig) => gig.slug.toLowerCase()));

  if (!slugSet.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let uniqueSlug = `${baseSlug}-${suffix}`;

  while (slugSet.has(uniqueSlug)) {
    suffix++;
    uniqueSlug = `${baseSlug}-${suffix}`;
  }

  return uniqueSlug;
}
