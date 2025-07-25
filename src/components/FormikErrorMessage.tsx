import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';

interface FormikErrorMessageProps<T> {
  name: keyof T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
}

const FormikErrorMessage = <T,>({
  name,
  errors,
  touched
}: FormikErrorMessageProps<T>) => {
  const hasError = touched[name] && errors[name];

  if (!hasError || typeof errors[name] !== 'string') return null;

  return <p className="text-sm text-red-500">{errors[name]}</p>;
};

export default FormikErrorMessage;
