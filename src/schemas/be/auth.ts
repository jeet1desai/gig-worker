import * as yup from 'yup';

export const signupSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  password: yup.string().min(6).required("Password is required")
});
