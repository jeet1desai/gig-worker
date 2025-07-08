'use server';

import { getUserDetails } from '@/controllers/AdminUsersController';

export async function getUserDetailsAction(id: string) {
  try {
    const result = await getUserDetails(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching user:', error);

    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
