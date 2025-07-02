import { FormInstance } from 'antd';
import { toast } from 'react-toastify';
import { forgotPasswordSchema } from '@/schemas/auth';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { APPLICATION_JSON, CONTENT_TYPE, POST } from '@/constants';

type ForgotPasswordValues = { email: string };

export async function handleForgotPassword(
  values: ForgotPasswordValues,
  form: FormInstance,
  setError: (msg: string | null) => void,
) {
  try {
    setError(null);

    await forgotPasswordSchema.validate(values, { abortEarly: false });

    const response = await fetch(PUBLIC_API_ROUTES.FORGOT_PASSWORD_API, {
      method: POST,
      headers: { [CONTENT_TYPE]: APPLICATION_JSON },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      const apiErrorMessage =
        data?.error?.message || data?.message || 'Failed to send reset email.';

      if (data?.error?.fieldErrors) {
        const fieldErrors = Object.entries(data.error.fieldErrors).map(
          ([name, message]) => ({
            name,
            errors: [message as string],
          }),
        );
        form.setFields(fieldErrors);
      }

      setError(apiErrorMessage);
      toast.error(apiErrorMessage);
    } else {
      toast.success(data?.message || 'Check your email for reset instructions.');
      form.resetFields();
    }
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const fieldErrors = err.inner.map((e: any) => ({
        name: e.path,
        errors: [e.message],
      }));
      form.setFields(fieldErrors);
    } else {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Something went wrong.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }
}
