'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Trash, View } from 'lucide-react';

import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { cn } from '@/lib/utils';

import { useDispatch } from '@/store/store';
import { adminService } from '@/services/admin.services';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { IUser } from './page';

type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  sortable: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

const UsersListingPage = ({
  users,
  pagination,
  handlePageChange,
  handleSort,
  sortKey,
  sortOrder,
  search,
  setSearch,
}: {
  users: any[];
  pagination: any;
  handlePageChange: (page: number) => void;
  handleSort: (key: keyof IUser) => void;
  sortKey: keyof IUser | '';
  sortOrder: 'asc' | 'desc';
  search: string;
  setSearch: (value: string) => void;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleUserDetailsRedirection = (id: string) => {
    router.push(`${PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH}/${id}`);
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteOpen(false);
    const response = await dispatch(adminService.deleteAdminUsers({ id: selectedUserId }) as any);
    if (response && response.data) {
      setSelectedUserId('');
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
      sortable: true,
      render: (_value, row) => row.first_name ?? '-',
    },
    {
      key: 'last_name',
      label: 'Last Name',
      sortable: true,
      render: (_value, row) => row.last_name ?? '-',
    },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (_value, row) => (row?.role ? row.role.charAt(0).toUpperCase() + row.role.slice(1) : '-'),
    },
    {
      key: 'is_verified',
      label: 'Status',
      sortable: true,
      render: (_value, row) => (row?.is_verified ? 'Verified' : 'Non verified'),
    },
    {
      key: 'is_banned',
      label: 'Is Banned',
      sortable: true,
      render: (_value, row) => (row?.is_banned ? 'Yes' : 'No'),
    },
  ];

  const renderSortIcon = (key: keyof IUser) => {
    if (sortKey !== key) return null;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              className="h-9 w-full rounded-lg border border-[#374151] bg-[#1F2A37] pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-0 focus:ring-offset-transparent sm:w-64"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-[#374151] bg-[#111827]">
        <Table className="text-white">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={cn('font-medium text-white', column.sortable && 'cursor-pointer hover:bg-[#1F2A37]')}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((row) => (
                <TableRow key={row.id} className="border-[#374151] hover:bg-[#1F2A37]">
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.key as string}`} className="text-[#D9D9D9]">
                      {column.render ? column.render(null, row) : row[column.key] || '-'}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-gray-400 hover:bg-[#374151] hover:text-white"
                        onClick={() => handleUserDetailsRedirection(row.id)}
                      >
                        <View className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => openDeleteConfirmation(row.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-gray-400">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="border-[#374151] text-white hover:bg-[#374151] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="border-[#374151] text-white hover:bg-[#374151] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="cursor-pointer border border-[#5750F1] dark:border-white dark:text-white">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="destructive" className="cursor-pointer bg-[#5750F1] text-white" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersListingPage;
