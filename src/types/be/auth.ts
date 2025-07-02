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
