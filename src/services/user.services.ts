import { PRIVATE_API_ROUTES } from '@/constants/app-routes';
import apiService from './api';
import { ApiResponse } from '@/types/shared/api-response';
import {
  AboutUserPayload,
  UpdateEducationPayload,
  UserProfile,
  UpdateUserTagsPayload
} from '@/types/shared/user';

export const userService = {
  async updateAboutDetails(body: AboutUserPayload) {
    const response = await apiService.patch<ApiResponse<UserProfile>>(
      PRIVATE_API_ROUTES.USER_ABOUT_UPDATE_API,
      body,
      { withAuth: true }
    );

    return response.data;
  },
  async updateUserTags(body: UpdateUserTagsPayload) {
    const response = await apiService.patch<ApiResponse<UserProfile>>(
      PRIVATE_API_ROUTES.USER_TAGS_UPDATE_API,
      body,
      { withAuth: true }
    );
    return response.data;
  },
  async updateUserEducationHistory(body: UpdateEducationPayload) {
    const response = await apiService.patch<ApiResponse<UserProfile>>(
      PRIVATE_API_ROUTES.USER_EDUCATION_UPDATE_API,
      body,
      { withAuth: true }
    );
    return response.data;
  },
  async updateUserProfilePicture(body: FormData) {
    const response = await apiService.post<
      ApiResponse<{ id: string; profile_url: string }>
    >(PRIVATE_API_ROUTES.USER_PROFILE_PICTURE_UPDATE_API, body, {
      withAuth: true
    });
    return response.data;
  },
  async updateUserBannerPicture(body: FormData) {
    const response = await apiService.post<ApiResponse<UserProfile>>(
      PRIVATE_API_ROUTES.USER_BANNER_IMAGE_UPDATE_API,
      body,
      {
        withAuth: true
      }
    );
    return response.data;
  }
};
