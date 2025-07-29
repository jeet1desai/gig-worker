import {
  setGigs,
  setLoading,
  clearGigs,
  setOwnGigs,
  removeGig,
  setBids,
  updateBid
} from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';

import apiService from './api';
import { ApiResponse } from '@/types/shared/api-response';
import { toast } from '@/lib/toast';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';

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
        if (minPrice !== undefined && minPrice !== '')
          params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined && maxPrice !== '')
          params.append('maxPrice', maxPrice.toString());
        if (deliveryTime !== undefined)
          params.append('deliveryTime', deliveryTime.toString());
        if (tiers?.length) params.append('tiers', tiers.join(','));
        if (rating !== undefined && rating !== 0)
          params.append('rating', rating.toString());
        if (reviews !== undefined && reviews !== '')
          params.append('reviews', reviews.toString());

        const response: any = await apiService.get(
          `/gigs?${params.toString()}`,
          {
            withAuth: true
          }
        );
        if (response.status === 200 && response.data) {
          dispatch(
            setGigs({
              gigs: response.data.data.gigs,
              pagination: response.data.data.pagination
            })
          );
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
        toast.error(
          error.response?.data?.error?.message || 'Failed to fetch gig details'
        );
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
        toast.error(
          error.response?.data?.error?.message || 'Failed to fetch gig details'
        );
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
        if (minPrice !== undefined && minPrice !== '')
          params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined && maxPrice !== '')
          params.append('maxPrice', maxPrice.toString());
        if (tiers?.length) params.append('tiers', tiers.join(','));
        if (rating !== undefined && rating !== 0)
          params.append('rating', rating.toString());
        if (reviews !== undefined && reviews !== '')
          params.append('reviews', reviews.toString());

        const response: any = await apiService.get(
          `/gigs/me?${params.toString()}`,
          {
            withAuth: true
          }
        );
        if (response.status === 200 && response.data) {
          dispatch(
            setOwnGigs({
              gigs: response.data.data.gigs,
              pagination: response.data.data.pagination
            })
          );
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  deleteGig(id: string) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.delete(`/gigs/${id}`, {
          withAuth: true
        });
        if (response && response.status === 200) {
          toast.success('Gig deleted successfully');
          dispatch(removeGig({ id: id }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.error?.message || 'Failed to delete gig'
        );
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  createBid(gigId: string, body: { proposal: string; bidPrice: number }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response = await apiService.post(`/gigs/bids/${gigId}`, body, {
          withAuth: true
        });
        if (response && response.status === 201) {
          toast.success('Bid placed successfully!');
          return response.data;
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.error?.message || 'Failed to place bid'
        );
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  updateBidStatus(bidId: string, body: { status: string }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response = await apiService.patch(`/gigs/bids/${bidId}`, body, {
          withAuth: true
        });
        if (response && response.status === 200) {
          toast.success('Bid status updated successfully!');
          dispatch(updateBid({ id: bidId, status: body.status }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.error?.message || 'Failed to update bid status'
        );
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getBidsByGigId(gigId: string, page: number, limit: number) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(
          `/gigs/bids/${gigId}?page=${page}&limit=${limit}`,
          { withAuth: true }
        );
        if (response && response.status === 200) {
          dispatch(
            setBids({
              bids: response.data.data.items,
              pagination: response.data.data.pagination
            })
          );
          return response.data;
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.error?.message || 'Failed to fetch bids'
        );
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getUserGigsByiId: async (userId: string, page: number) => {
    const response = await apiService.get<ApiResponse<any>>(
      `${PUBLIC_API_ROUTES.GIGS_BY_USER_ID_API}/${userId}?page=${page}&limit=4`,
      {
        withAuth: false
      }
    );
    return response.data;
  }
};
