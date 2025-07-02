import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

export type SortOrder = 'asc' | 'desc';

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  textAlign?: 'left' | 'center' | 'right';
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

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
