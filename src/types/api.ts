export interface User {
  id: string;
  created_at: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'worker' | 'client';
  skills?: string[];
  hourly_rate?: number;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role: 'worker' | 'client';
  skills?: string[];
  hourly_rate?: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  budget: number;
  userId: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
