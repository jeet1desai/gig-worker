'use client';

import { useCallback, useState } from 'react';
import { Form, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { loginSchema } from '../../../schemas/auth';
import { useRouter } from 'next/navigation';
import { Images } from '@/lib/images';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

const { Title } = Typography;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await loginSchema.validate(values, { abortEarly: false });

      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error === 'Email not verified') {
        setError('Your email is not verified. Please verify your account.');
      } else if (!result?.ok) {
        setError('Invalid email or password.');
      } else {
        router.push(PRIVATE_ROUTE.DASHBOARD);
      }
    } catch (err: any) {
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
        setError('Something went wrong');
      }
    }
  };

  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: PRIVATE_ROUTE.DASHBOARD });
  }, []);

  return (
    <>
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
            onClick={() => router.push(PUBLIC_ROUTE.FORGOT_PASSWORD)}
            className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#FFF2E3] underline"
          >
            Forgot password ?
          </button>
        </div>
        <Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            className="font-large mt-5 border-none bg-[#635d57] text-[#FFF2E3] shadow-none"
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-6 mb-3 text-center text-sm text-[#FFF2E3]">or sign in using</div>
      <div className="mb-4 flex justify-center">
        <Image
          src={Images.googleIcon}
          alt="Google Icon"
          width={36}
          height={36}
          className="cursor-pointer"
          onClick={handleGoogleLogin}
        />
      </div>
      <div className="text-center text-sm text-[#FFF2E3]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => router.push(PUBLIC_ROUTE.SIGNUP)}
          className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#FFF2E3] underline"
        >
          Sign up
        </button>
      </div>
    </>
  );
}
