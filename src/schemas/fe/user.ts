import * as yup from 'yup';

export const aboutUpdateSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters')
});
