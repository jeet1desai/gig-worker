'use client';

import { useState } from 'react';
import { Form, Button, Typography, Image } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { loginSchema } from '../../../schemas/auth';
import { useRouter } from 'next/navigation';
import { Images } from '@/lib/images';
import { FORGOT_PASSWORD_PAGE_PATH, SIGNUP_PAGE_PATH } from '@/constants/app-routes';

const { Title } = Typography;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await loginSchema.validate(values, { abortEarly: false });
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

  return (
    <>
      <Title level={3} className="text-center mb-6 !text-2xl">
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
          className="bg-transparent text-white border border-[#444] placeholder-white"
          labelClassName="text-[#FFF2E3]"
        />

        <TextField
          label="Password"
          name="password"
          required
          type="password"
          className="bg-transparent text-white border border-[#444] placeholder-white"
          placeholder="Enter your password"
          icon={<LockOutlined className="text-[#FFF2E3]" />}
          labelClassName="text-[#FFF2E3]"
        />
        <div className="flex justify-end w-full mt-2">
          <button
            type="button"
            onClick={() => router.push(FORGOT_PASSWORD_PAGE_PATH)}
            className="font-medium underline text-[#FFF2E3] bg-transparent border-none p-0 cursor-pointer"
          >
            Forgot password ?
          </button>
        </div>
        <Form.Item>
          <Button htmlType="submit" block size="large" className="mt-5 bg-[#635d57] text-[#FFF2E3] border-none shadow-none font-large">
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <div className="text-[#FFF2E3] mt-6 mb-3 text-center text-sm">or sign in using</div>
      <div className="flex justify-center mb-4">
        <Image src={Images.googleIcon} alt="Google Icon" width={36} height={36} className="cursor-pointer" />
      </div>
      <div className="text-center text-[#FFF2E3] text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => router.push(SIGNUP_PAGE_PATH)}
          className="font-medium underline text-[#FFF2E3] bg-transparent border-none p-0 cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </>
  );
}
