'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe, FileText, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE, PUBLIC_API_ROUTES } from '@/constants/app-routes';
import apiService from '@/services/api';
import { CMSPage, CMSPageResponse } from '@/types/fe';
import { PageType } from '@prisma/client';
import { DEFAULT_PAGINATION, pageTypes } from '@/constants';
import { useDebouncedEffect } from '@/hooks/use-debounce';
import Loader from '@/components/Loader';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';

export default function PageManager() {
  const router = useRouter();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [search, setSearch] = useState<string>('');
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletePageId, setDeletePageId] = useState<string>('');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  useDebouncedEffect(
    () => {
      getAllPagesList();
    },
    500,
    [pagination.page, search]
  );

  const getAllPagesList = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<CMSPageResponse>(
        `${PUBLIC_API_ROUTES.CMS_PARENT_API}?page=${pagination.page}&pageSize=${pagination.pageSize}&search=${search}`,
        {
          withAuth: true
        }
      );
      if (response.data.items && response.data.meta) {
        setPages(response.data.items);
        setPagination(response.data.meta);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to create page';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCMSPage = async () => {
    setLoading(true);
    try {
      const response = await apiService.delete<CMSPageResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${deletePageId}`, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        setDeletePageId('');
        toast.success(response.data.message);
        getAllPagesList();
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to create page';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (page_data: CMSPage) => {
    setLoading(true);
    try {
      const data = {
        ...page_data,
        isPublished: !page_data.isPublished
      };
      const response = await apiService.patch<CMSPageResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${page_data.id}`, data, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        toast.success(response.data.message);
        getAllPagesList();
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to create page';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page_number: number) => {
    setPagination({ ...pagination, page: page_number });
  };

  const addPageNavigation = () => {
    router.push(PRIVATE_ROUTE.ADMIN_ADD_CMS_PAGES_PATH);
  };

  const handleEdit = (page_id: string) => {
    router.push(`${PRIVATE_ROUTE.ADMIN_EDIT_CMS_PAGES_PATH}/${page_id}`);
  };

  const handleDelete = (id: string) => {
    setIsDeleteOpen(true);
    setDeletePageId(id);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handlePageChange(1);
  };

  return (
    <div className="min-h-screen">
      <Loader isLoading={loading} />
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">CMS Pages</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search pages..."
                  className="h-9 w-full rounded-lg border border-[#374151] bg-[#1F2A37] pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-0 focus:ring-offset-transparent sm:w-64"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                />
              </div>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                onClick={addPageNavigation}
              >
                <Plus className="h-4 w-4" />
                Add New Page
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-[#374151] bg-[#111827]">
            <Table className="text-white">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium text-white">Title</TableHead>
                  <TableHead className="font-medium text-white">Type</TableHead>
                  <TableHead className="font-medium text-white">Slug</TableHead>
                  <TableHead className="font-medium text-white">Status</TableHead>
                  <TableHead className="text-right font-medium text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length > 0 ? (
                  pages.map((page) => {
                    const PageIcon = pageTypes[page.type as PageType].icon;
                    return (
                      <TableRow key={page.id} className="border-[#374151] hover:bg-[#1F2A37]">
                        <TableCell className="font-medium text-[#D9D9D9]">
                          <div className="flex items-center gap-2">
                            <div className={`rounded p-1 ${pageTypes[page.type as PageType].color} text-white`}>
                              <PageIcon className="h-3 w-3" />
                            </div>
                            {page.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{pageTypes[page.type as PageType].label}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-[#D9D9D9]">/{page.slug}</TableCell>
                        <TableCell>
                          <button onClick={() => handleUpdateStatus(page)} className="flex items-center gap-1">
                            {page.isPublished ? (
                              <>
                                <Eye className="h-4 w-4 text-green-500" />
                                <Badge className="bg-green-500/10 text-green-500">Published</Badge>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-gray-500" />
                                <Badge variant="outline" className="text-white">
                                  Draft
                                </Badge>
                              </>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-start gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-gray-400 hover:bg-[#374151] hover:text-white"
                              onClick={() => handleEdit(page.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDelete(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                      No pages found.
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
                className="border-[#374151] bg-[#374151] text-white hover:bg-[#374151] hover:text-white"
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
                className="border-[#374151] bg-[#374151] text-white hover:bg-[#374151] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          isLoading={loading}
          onOpenChange={setIsDeleteOpen}
          onConfirm={deleteCMSPage}
          title={`Delete Page`}
          description={`Are you sure you want to delete this page? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
