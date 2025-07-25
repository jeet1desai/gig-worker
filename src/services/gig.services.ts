import { setGigs, setLoading, clearGigs, setOwnGigs } from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';

import apiService from './api';

import { toast } from '@/lib/toast';

export const gigService = {
  createGig({ body }: { body: FormData }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.post(`/gigs`, body, {
          withAuth: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 201 && response.data) {
          toast.success('Gig created successfully');
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getGigs({
    page,
    limit,
    search,
    deliveryTime,
    tiers,
    minPrice,
    maxPrice,
    rating,
    reviews
  }: {
    deliveryTime?: string;
    page: number;
    limit?: number;
    search?: string;
    tiers?: string[];
    minPrice?: string;
    maxPrice?: string;
    rating?: number;
    reviews?: string;
  }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));

        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (search) params.append('search', search);
        if (limit) params.append('limit', limit.toString());
        if (minPrice !== undefined && minPrice !== '') params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined && maxPrice !== '') params.append('maxPrice', maxPrice.toString());
        if (deliveryTime !== undefined) params.append('deliveryTime', deliveryTime.toString());
        if (tiers?.length) tiers.forEach((tier) => params.append('tiers', tier));
        if (rating !== undefined && rating !== 0) params.append('rating', rating.toString());
        if (reviews !== undefined && reviews !== '') params.append('reviews', reviews.toString());

        const response: any = await apiService.get(`/gigs?${params.toString()}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          dispatch(setGigs({ gigs: response.data.data.gigs, pagination: response.data.data.pagination }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  clearGigs() {
    return async (dispatch: AppDispatch) => {
      dispatch(clearGigs());
    };
  },

  getGigById(id: string) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/gigs/${id}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message || 'Failed to fetch gig details');
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getPublicGigDetailById(id: string) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/public/gigs/${id}`, {
          withAuth: false
        });
        if (response.status === 200 && response.data) {
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message || 'Failed to fetch gig details');
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getOwnersGig({
    page,
    search,
    limit,
    tiers,
    minPrice,
    maxPrice,
    rating,
    reviews
  }: {
    page: number;
    search?: string;
    limit?: number;
    tiers?: string[];
    minPrice?: string;
    maxPrice?: string;
    rating?: number;
    reviews?: string;
  }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (search) params.append('search', search);
        if (limit) params.append('limit', limit.toString());
        if (minPrice !== undefined && minPrice !== '') params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined && maxPrice !== '') params.append('maxPrice', maxPrice.toString());
        if (tiers?.length) tiers.forEach((tier) => params.append('tiers', tier));
        if (rating !== undefined && rating !== 0) params.append('rating', rating.toString());
        if (reviews !== undefined && reviews !== '') params.append('reviews', reviews.toString());

        console.log(params.toString());

        const response: any = await apiService.get(`/gigs/me?${params.toString()}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          dispatch(setOwnGigs({ gigs: response.data.data.gigs, pagination: response.data.data.pagination }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  }
};
