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
    .test('is-valid-price', 'Must be a number greater than 0', function (val) {
      const { subscriptionType } = this.parent;
      const num = Number(val);
      if (isNaN(num)) return false;
      if (num === 0 && subscriptionType !== 'free') return false;
      return num > 0 || (subscriptionType === 'free' && num === 0);
    }),
  maxGigs: Yup.mixed()
    .required('Max gigs is required')
    .test('is-valid-maxGigs', 'Must be a number >= 0 or "unlimited"', (val) => {
      if (typeof val === 'string' && val.trim().toLowerCase() === 'unlimited') return true;
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }),
  maxBids: Yup.mixed()
    .required('Max bids is required')
    .test('is-valid-maxBids', 'Must be a number >= 0 or "unlimited"', (val) => {
      if (typeof val === 'string' && val.trim().toLowerCase() === 'unlimited') return true;
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }),
  benefits: Yup.array()
    .of(Yup.string().trim().required('Each benefit must not be empty'))
    .min(1, 'Enter at least 1 benefit')
    .max(5, 'Max 5 benefits allowed')
});

export const cmsSchemas: Record<string, Yup.ObjectSchema<any>> = {
  faq: Yup.object().shape({
    title: Yup.string().required('Question is required'),
    content: Yup.string().required('Answer is required')
  }),
  step: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Description is required'),
    color: Yup.string().required('Color is required')
  }),
  contact: Yup.object().shape({
    content: Yup.string().required('Contact information is required')
  }),
  terms: Yup.object().shape({
    content: Yup.string().required('Terms & Conditions content is required')
  }),
  privacy: Yup.object().shape({
    content: Yup.string().required('Privacy Policy content is required')
  })
};
