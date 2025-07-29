import * as yup from 'yup';

export const signupSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required')
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

export const roleChangeSchema = yup.object({
  userId: yup.string().required('User ID is required.'),
  profile_view: yup.string().oneOf(['user', 'provider'], 'Profile must be either "user" or "provider".').required('Role is required.')
});

export const rateGigSchema = yup.object({
  user_id: yup.string().required('User ID is required.'),
  gig_id: yup.string().required('Gig ID is required.'),
  provider_id: yup.string().required('Provider ID is required.'),
  rating: yup.number().min(1, 'Rating must be at least 1.').max(5, 'Rating cannot be more than 5.').required('Rating is required.'),
  rating_feedback: yup.string().max(500).optional()
});
