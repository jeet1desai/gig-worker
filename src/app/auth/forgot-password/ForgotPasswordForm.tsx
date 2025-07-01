'use client';

import { useState } from 'react';
import { Form, Button, Typography } from 'antd';
import { LeftOutlined, MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { forgotPasswordSchema } from '../../../schemas/auth';
import { useRouter } from 'next/navigation';
import { BackArrowIconSvg } from '@/components/icons';
import { PUBLIC_ROUTE } from '@/constants/app-routes';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { Title } = Typography;

  const handleSubmit = async (values: { email: string }) => {
    try {
      setError(null);
      await forgotPasswordSchema.validate(values, { abortEarly: false });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const fieldErrors = err.inner.map((e: any) => ({
          name: e.path,
          errors: [e.message],
        }));
        form.setFields(fieldErrors);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <>
      <Title
        level={3}
        className="relative mb-6 flex w-full items-center justify-center text-center !text-2xl"
      >
        <button
          type="button"
          onClick={() => router.push(PUBLIC_ROUTE.LOGIN)}
          className="absolute left-0 cursor-pointer border-none bg-transparent p-0 focus:outline-none"
          aria-label="Back to login"
        >
          <BackArrowIconSvg />
        </button>
        <span className="text-[#FFF2E3]">Forgot password</span>
      </Title>
      <span className="mb-6 text-center text-[#9d9893]">
        No worries, we’ll send you an OTP to your mail id
      </span>
      <Form
        name="email"
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        className="w-full"
        initialValues={{ email: '' }}
        requiredMark={false}
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
        <Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            className="font-large mt-2 border-none bg-[#635d57] text-[#FFF2E3] shadow-none"
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>

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
