import { FormInstance } from 'antd';
import { toast } from 'react-toastify';
import { loginSchema } from '@/schemas/auth';
import { setStorage } from '@/lib/local-storage';
import { ADMIN_AUTH_TOKEN_KEY, ADMIN_PROFILE_KEY, AUTH_TOKEN_KEY } from '@/constants/local-storage-keys';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { getSession, signIn } from 'next-auth/react';

type LoginValues = { email: string; password: string };

export async function handleAdminLogin(
  values: LoginValues,
  form: FormInstance,
  router: ReturnType<typeof import('next/navigation').useRouter>,
  setError: (msg: string | null) => void,
) {
  try {
    setError(null);

    await loginSchema.validate(values, { abortEarly: false });

    const response = await signIn('admin-credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      setError(response.error);
      toast.error(response.error);
    }

    if (response?.ok && response?.status === 200) {
      form.resetFields();
      toast.success('Login successful!');

      const session = await getSession();

      if (session) {
        setStorage(AUTH_TOKEN_KEY, session.accessToken);
        setStorage(ADMIN_AUTH_TOKEN_KEY, session.accessToken);
        setStorage(ADMIN_PROFILE_KEY, session.user);

        router.push(PRIVATE_ROUTE.ADMIN_DASHBOARD_PATH);
      }
    }
  } catch (err: any) {
    if (err.name === 'ValidationError' && err.inner) {
      const formErrors = err.inner.reduce((acc: any, curr: any) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      form.setFields(
        Object.entries(formErrors).map(([name, message]) => ({
          name,
          errors: [message as string],
        })),
      );
    } else {
      const errorMessage = err?.response?.data?.message || err?.message || 'Something went wrong.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }
}
