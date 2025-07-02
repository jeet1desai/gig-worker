'use client';
import { useCallback, useEffect, useState } from 'react';
import { DynamicTable } from '@/components/DynamicTable';
import { DEFAULT_PAGINATION } from '@/constants';
import { IUser } from '@/types/table_types';
import { FETCH_ALL_USERS_ENDPOINT } from '@/lib/config/endpoints/users';
import { toast } from 'react-toastify';
import apiService from '@/services/api';
import { Edit, Trash } from 'lucide-react';
import CommonDialog from '@/components/dialog';
import Loader from '@/components/Loader';
import { deleteUserAction } from '@/actions/AdminUserActions';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE } from '@/constants/app-routes';

type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  sortable: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

const UsersListingPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<any[]>([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortKey, setSortKey] = useState<keyof IUser | ''>('created_at');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserDetailsRedirection = (id: string) => {
    router.push(`${PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH}/${id}`);
  };

  const handleSort = (key: keyof IUser) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteOpen(true);
  };

  const getAllUsers = useCallback(
    async (sortKey = '', sortOrder = '') => {
      setIsLoading(true);
      const { page, pageSize } = pagination;
      try {
        const response: any = await apiService.get(
          `${FETCH_ALL_USERS_ENDPOINT}?page=${page}&pageSize=${pageSize}&sortBy=${sortKey}&order=${sortOrder}`,
          { withAuth: true },
        );
        if (response.data && response.status === 200) {
          const { items, meta } = response.data;
          setUser(items);
          setPagination(meta);
        }
      } catch (error: any) {
        if (!error?.response?.data?.success) {
          toast.error(error.response?.data?.message);
          return;
        }
        toast.error('Something went wrong, please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.pageSize],
  );

  useEffect(() => {
    getAllUsers(sortKey, sortOrder);
  }, [getAllUsers, sortKey, sortOrder]);

  const handleDeleteConfirm = async () => {
    const response = await deleteUserAction(selectedUserId);

    if (response.success) {
      toast.success('User deleted successfully');
      setSelectedUserId('');
      await getAllUsers();
    } else {
      toast.error(response.error);
    }
  };

  const columns: ColumnConfig<IUser>[] = [
    {
      key: 'id',
      label: 'Id',
      sortable: true,
      render: (_value, row) => row.id ?? '-',
    },
    {
      key: 'first_name',
      label: 'First Name',
      sortable: false,
      render: (_value, row) => row.first_name ?? '-',
    },
    {
      key: 'last_name',
      label: 'Last Name',
      sortable: false,
      render: (_value, row) => row.last_name ?? '-',
    },
    { key: 'email', label: 'Email', sortable: false },
    {
      key: 'role',
      label: 'Role',
      sortable: false,
      render: (_value, row) =>
        row?.role ? row.role.charAt(0).toUpperCase() + row.role.slice(1) : '-',
    },
    {
      key: 'is_verified',
      label: 'Verification Status',
      sortable: false,
      render: (_value, row) => (row?.is_verified ? 'Verified' : 'Non verified'),
    },
    {
      key: 'is_banned',
      label: 'Banned Status',
      sortable: false,
      render: (_value, row) => (row?.is_banned ? 'Banned' : 'Not Banned'),
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-1">
        <h2 className="text-dark text-[26px] leading-[30px] font-bold text-white">
          Users
        </h2>
      </div>
      <div className="space-y-10">
        <DynamicTable
          data={user}
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          handlePageChange={handlePageChange}
          columns={columns}
          actions={(row) => (
            <div className="flex items-center justify-end gap-x-3">
              <button
                className="cursor-pointer hover:text-[#5750F1]"
                onClick={() => handleUserDetailsRedirection(row.id)}
              >
                <Edit size={'20'} />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => openDeleteConfirmation(row.id)}
              >
                <Trash size={'20'} color="red" />
              </button>
            </div>
          )}
        />
      </div>
      <CommonDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="User"
        description="Are you sure you want to delete user?"
      />
    </>
  );
};

export default UsersListingPage;
