'use client';

import { useState } from 'react';
import { Form, Button, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { BackArrowIconSvg } from '@/components/icons';
import { PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schemas/auth';
import { toast } from 'react-toastify';
import { APPLICATION_JSON, CONTENT_TYPE, POST } from '@/constants';

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const onFinish = async (values: { email: string }) => {
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
  };

  return (
    <>
      <Title
        level={3}
        className="relative mb-6 flex w-full items-center justify-center text-center !text-2xl"
      >
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}
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
        onFinish={onFinish}
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
          onClick={() => pageRedirection(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)}
          className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#FFF2E3] underline"
        >
          Sign up
        </button>
      </div>
    </>
  );
}
