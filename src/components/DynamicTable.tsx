'use client';
import { ArrowDown, ArrowUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/lib/toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/Pagination';
import { ColumnConfig, SortOrder } from '@/types/table_types';

interface DynamicTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T | '';
  sortOrder?: SortOrder;
  actions?: (row: T) => React.ReactNode;
  totalPages: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
}

export function DynamicTable<T extends { id: number | string }>({
  data,
  columns,
  onSort,
  sortKey,
  sortOrder,
  actions,
  totalPages,
  handlePageChange,
  currentPage
}: DynamicTableProps<T>) {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const getArrow = (key: keyof T) =>
    sortKey === key ? (
      sortOrder === 'asc' ? (
        <ArrowUp size={18} strokeWidth={1} />
      ) : (
        <ArrowDown size={18} strokeWidth={1} />
      )
    ) : null;

  const getVisiblePages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handleCopyToClipboard = async (text: string, id: string | number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Coupon code copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy coupon code');
    }
  };

  const renderCell = (col: ColumnConfig<T>, value: T[keyof T], row: T, index: number) => {
    if (col.key === 'coupon_code' || col.key === 'code') {
      return (
        <div
          className="hover:text-primary flex cursor-pointer items-center gap-2"
          onClick={() => handleCopyToClipboard(String(value), row.id)}
        >
          <span>{String(value)}</span>
          {copiedId === row.id ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </div>
      );
    }
    return col.render ? col.render(value, row, index) : String(value);
  };

  if (data === undefined) {
    console.warn('Data is undefined in DynamicTable component');
  } else {
    console.log('Table data:', data);
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800">
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={col.sortable ? 'cursor-pointer' : ''}
                onClick={() => col.sortable && onSort?.(col.key)}
                textAlign={col.textAlign}
              >
                {col.label} {col.sortable && getArrow(col.key)}
              </TableHead>
            ))}
            {actions && <TableHead textAlign="right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="!hover:bg-transparent">
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-30 py-6 text-center text-sm text-gray-500"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell className="whitespace-nowrap" key={String(col.key)}>
                    {renderCell(col, row[col.key], row, index)}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {data.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              />
            </PaginationItem>

            {getVisiblePages().map((page, index) =>
              page === '...' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
