'use client';

import { useCallback, useState } from 'react';
import { Form, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { loginSchema } from '../../../schemas/auth';
import { Images } from '@/lib/images';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { LOGIN_MESSAGES } from '@/constants';

const { Title } = Typography;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await loginSchema.validate(values, { abortEarly: false });
      setLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error === 'Email not verified') {
        setError(LOGIN_MESSAGES.emailNotVerified);
        toast.error(LOGIN_MESSAGES.emailNotVerified);
        setLoading(false);
      } else if (!result?.ok) {
        setError(LOGIN_MESSAGES.invalidCredentials);
        toast.error(LOGIN_MESSAGES.invalidCredentials);
        setLoading(false);
      } else {
        setLoading(false);
        router.replace(PRIVATE_ROUTE.DASHBOARD);
        router.refresh();
      }
    } catch (err: any) {
      setLoading(false);
      if (err.name === 'ValidationError') {
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
        setError(LOGIN_MESSAGES.genericError);
      }
    }
  };

  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: PRIVATE_ROUTE.DASHBOARD });
  }, []);

  return (
    <>
      <Loader isLoading={loading} />
      <Title level={3} className="mb-6 text-center !text-2xl">
        <span className="text-[#FFF2E3]">Welcome back</span>
      </Title>
      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        className="w-full"
        initialValues={{ email: '', password: '' }}
        requiredMark={false}
        onFieldsChange={() => {
          if (error) setError('');
        }}
      >
        <TextField
          name="email"
          label="Email"
          required
          type="text"
          placeholder="Enter your email"
          icon={<MailOutlined className="text-[#FFF2E3]" />}
          className="border border-[#444] bg-transparent text-white placeholder-white"
          labelClassName="text-[#FFF2E3]"
        />

        <TextField
          label="Password"
          name="password"
          required
          type="password"
          className="border border-[#444] bg-transparent text-white placeholder-white"
          placeholder="Enter your password"
          icon={<LockOutlined className="text-[#FFF2E3]" />}
          labelClassName="text-[#FFF2E3]"
        />
        <div className="mt-2 flex w-full justify-end">
          <button
            type="button"
            onClick={() => pageRedirection(PUBLIC_ROUTE.FORGOT_PASSWORD_PAGE_PATH)}
            className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#FFF2E3] underline"
          >
            Forgot password ?
          </button>
        </div>
        <Form.Item>
          <div className="mt-5 w-full rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button type="submit" className="h-full w-full cursor-pointer rounded-lg px-5 py-2 font-bold text-[#383937]">
              Sign in
            </button>
          </div>
        </Form.Item>
      </Form>
      <div className="mt-6 mb-3 text-center text-sm text-[#FFF2E3]">or sign in using</div>
      <div className="mb-4 flex justify-center">
        <Image src={Images.googleIcon} alt="Google Icon" width={36} height={36} className="cursor-pointer" onClick={handleGoogleLogin} />
      </div>
      <div className="text-center text-sm text-[#FFF2E3]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)}
          className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#FFF2E3] underline"
        >
          Sign up
        </button>
      </div>
    </>
  );
}
