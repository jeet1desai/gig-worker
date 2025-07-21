import apiService from './api';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { CMSModuleResponse, ContentItem, WorkingStepDirectionType } from '@/types/fe';

export const contentFEService = {
  getContentByType: async (type: string) => {
    try {
      const response = await apiService.get<CMSModuleResponse>(`${PUBLIC_API_ROUTES.CMS_TYPE_API}/${type}`, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  },
  createContent: async (data: Omit<ContentItem, 'id'>) => {
    try {
      const response = await apiService.post<CMSModuleResponse>(`${PUBLIC_API_ROUTES.CMS_PARENT_API}`, data, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        return response.data.message;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  },
  updateContent: async (id: string, data: Partial<ContentItem>) => {
    try {
      const response = await apiService.patch<CMSModuleResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${id}`, data, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        return response.data.message;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  },
  reorderContent: async ({ id, direction }: { id: string; direction: WorkingStepDirectionType }) => {
    try {
      const response = await apiService.patch<CMSModuleResponse>(
        `${PUBLIC_API_ROUTES.CMS_PARENT_API}`,
        { id, direction },
        {
          withAuth: true
        }
      );
      if (response.data.data && response.data.message) {
        return response.data.message;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  },
  deleteContent: async (id: string) => {
    try {
      const response = await apiService.delete<CMSModuleResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${id}`, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        return response.data.message;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
};
