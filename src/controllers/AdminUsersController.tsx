import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deleteUser(id: string) {
  const bigint_id = BigInt(id);

  const updated = await prisma.user.update({
    where: { id: bigint_id },
    data: {
      is_deleted: true,
      updated_at: new Date(),
    },
  });

  return updated;
}

export async function getUserDetails(id: string) {
  const bigint_id = BigInt(id);

  const user_details = await prisma.user.findFirst({
    where: { id: bigint_id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      is_banned: true,
      is_verified: true,
      sign_up_type: true,
      created_at: true,
      subscriptions: true,
    },
  });

  if (!user_details) {
    throw new Error(`User not found.`);
  }

  const { id: userId, ...rest } = user_details;

  return {
    id: userId.toString(),
    ...rest,
  };
}
