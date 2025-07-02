'use server';

import { deleteUser, getUserDetails } from '@/controllers/AdminUsersController';

export async function deleteUserAction(id: string) {
  try {
    const result = await deleteUser(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

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
