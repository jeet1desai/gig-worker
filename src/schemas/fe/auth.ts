import { SUBSCRIPTION_PLAN_TYPES } from '@/constants';
import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
});

export const signupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions').required()
});

export const subscriptionsPlanValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  description: Yup.string().trim().required('Description is required'),
  subscriptionType: Yup.string().oneOf(SUBSCRIPTION_PLAN_TYPES, 'Invalid subscription type').required('Subscription type is required'),
  price: Yup.mixed()
    .required('Price is required')
    .test('is-valid-price', 'Must be a number >= 0', (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }),
  maxGigs: Yup.mixed()
    .required('Max gigs is required')
    .test('is-valid-maxGigs', 'Must be 0, positive number, or "unlimited"', (val) => {
      const value = typeof val === 'string' ? val.toLowerCase().trim() : '';
      return value === 'unlimited' || (!isNaN(Number(value)) && Number(value) >= 0);
    }),
  maxBids: Yup.mixed()
    .required('Max bids is required')
    .test('is-valid-maxBids', 'Must be 0, positive number, or "unlimited"', (val) => {
      const value = typeof val === 'string' ? val.toLowerCase().trim() : '';
      return value === 'unlimited' || (!isNaN(Number(value)) && Number(value) >= 0);
    }),
  benefits: Yup.array()
    .of(Yup.string().trim().required('Each benefit must not be empty'))
    .min(1, 'Enter at least 1 benefit')
    .max(5, 'Max 5 benefits allowed')
});
