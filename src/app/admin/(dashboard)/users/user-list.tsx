'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Plus, Search, Trash, View } from 'lucide-react';

import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { cn } from '@/lib/utils';

import { useDispatch } from '@/store/store';
import { adminService } from '@/services/admin.services';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { IUser } from './page';

const userSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    )
    .required('Required'),
  role: Yup.string().oneOf(['user', 'provider'], 'Invalid role').required('Required'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'user',
};

type FormValues = typeof initialValues;

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
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

  const handleCreateUser = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    try {
      const response = await dispatch(adminService.createAdminUsers({ body: values }) as any);
      if (response && response.data) {
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
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
          <div className="flex items-center space-x-3">
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
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-9 bg-[#4F46E5] text-white hover:bg-[#4338CA] focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 focus:ring-offset-[#111827]"
            >
              <Plus className="h-4 w-4" />
              Create User
            </Button>
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} modal>
        <DialogContent className="overflow-auto border-[#374151] bg-[#1F2937] text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-white">Create New User</DialogTitle>
          </DialogHeader>
          <Formik initialValues={initialValues} validationSchema={userSchema} onSubmit={handleCreateUser}>
            {({ errors, touched, isSubmitting, setFieldValue, values, handleSubmit, getFieldProps }) => {
              return (
                <Form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        {...getFieldProps('firstName')}
                        className={`m-0 border-[#4B5563] bg-[#374151] text-white focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                          errors.firstName && touched.firstName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.firstName && touched.firstName && <div className="text-sm text-red-500">{errors.firstName}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        {...getFieldProps('lastName')}
                        className={`m-0 border-[#4B5563] bg-[#374151] text-white focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                          errors.lastName && touched.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.lastName && touched.lastName && <div className="text-sm text-red-500">{errors.lastName}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        {...getFieldProps('email')}
                        className={`m-0 border-[#4B5563] bg-[#374151] text-white focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                          errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.email && touched.email && <div className="text-sm text-red-500">{errors.email}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        {...getFieldProps('password')}
                        className={`m-0 border-[#4B5563] bg-[#374151] text-white focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                          errors.password && touched.password ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.password && touched.password && <div className="text-sm text-red-500">{errors.password}</div>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">
                      Role
                    </Label>
                    <Select value={values.role} onValueChange={(value) => setFieldValue('role', value)}>
                      <SelectTrigger className="w-full border-slate-700/50 bg-[#374151] text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-foreground border-slate-700/50 text-white hover:text-white">
                        <SelectItem value="user" className="hover:bg-slate-700/50">
                          User
                        </SelectItem>
                        <SelectItem value="provider" className="hover:bg-slate-700/50">
                          Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && touched.role && <div className="text-sm text-red-500">{errors.role}</div>}
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#4F46E5] text-white hover:bg-[#4338CA] focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create User'}
                    </Button>
                  </DialogFooter>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersListingPage;
