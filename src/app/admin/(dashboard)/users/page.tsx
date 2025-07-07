'use client';

import React, { useState } from 'react';

import UsersListingPage from './user-list';
import Loader from '@/components/Loader';

import { adminService } from '@/services/admin.services';
import { RootState, useDispatch, useSelector } from '@/store/store';

import { useDebouncedEffect } from '@/hooks/use-debounce';
import { setPage } from '@/store/slices/admin-user';

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_url: string;
  email: string;
  role: string;
  sign_up_type: string;
  is_verified: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

const UsersList = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortKey, setSortKey] = useState<keyof IUser | ''>('created_at');
  const [search, setSearch] = useState<string>('');

  const dispatch = useDispatch();
  const { users, pagination, loading } = useSelector((state: RootState) => state.adminUser);

  useDebouncedEffect(
    () => {
      dispatch(adminService.getAdminUsers({ page: pagination.page, pageSize: pagination.pageSize, sortKey, sortOrder, search }) as any);
    },
    500,
    [pagination.page, sortOrder, sortKey, search],
  );

  const handlePageChange = (page: number) => {
    dispatch(setPage({ page }));
  };

  const handleSort = (key: keyof IUser) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  return (
    <>
      <Loader isLoading={loading} />

      <UsersListingPage
        users={users}
        sortKey={sortKey}
        sortOrder={sortOrder}
        handleSort={handleSort}
        pagination={pagination}
        handlePageChange={handlePageChange}
        search={search}
        setSearch={setSearch}
      />
    </>
  );
};

export default UsersList;
