export interface SignupPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface UserRolePayload {
  userId: string;
  role: 'admin' | 'user' | 'provider';
}

export interface rateGigPayload {
  gig_id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  rating_feedback?: string;
}