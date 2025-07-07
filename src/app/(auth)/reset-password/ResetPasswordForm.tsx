'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import TextField from '@/components/TextField';
import { resetPasswordSchema } from '@/schemas/auth';
import { PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import apiService from '@/services/api';
import Loader from '@/components/Loader';

interface ResetPasswordResponse {
  message?: string;
  error?: {
    message?: string;
    fieldErrors?: {
      [key: string]: string;
    };
  };
}

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { Title } = Typography;

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      setError(null);
      setLoading(true);
      const payload = {
        ...values,
        token,
      };
      await resetPasswordSchema.validate(payload, { abortEarly: false });
      const { data } = await apiService.patch<ResetPasswordResponse>(PUBLIC_API_ROUTES.RESET_PASSWORD_API, payload, { withAuth: false });

      toast.success(data?.message || 'Password has been reset successfully.');
      form.resetFields();
      setLoading(false);
      setTimeout(() => {
        router.push(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH);
      }, 3000);
    } catch (err: any) {
      setLoading(false);
      if (err.name === 'ValidationError') {
        const fieldErrors = err.inner.map((e: any) => ({
          name: e.path,
          errors: [e.message],
        }));
        form.setFields(fieldErrors);
        return;
      }
      if (err.response) {
        const data: ResetPasswordResponse = err.response.data;
        const apiErrorMessage = data?.error?.message || data?.message || 'Failed to reset password.';
        if (data?.error?.fieldErrors) {
          const fieldErrors = Object.entries(data.error.fieldErrors).map(([name, message]) => ({
            name,
            errors: [message as string],
          }));
          form.setFields(fieldErrors);
        }
        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
      } else {
        const fallback = err?.message || 'Something went wrong.';
        setError(fallback);
        toast.error(fallback);
      }
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <Title level={3} className="mb-6 text-center !text-2xl">
        <span className="text-[#FFF2E3]">Reset password</span>
      </Title>

      <Form
        name="resetpassword"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="w-full"
        initialValues={{ password: '', confirmPassword: '' }}
        requiredMark={false}
        onFieldsChange={() => {
          if (error) setError('');
        }}
      >
        <TextField
          name="password"
          label="Password"
          required
          type="password"
          placeholder="Enter your password"
          icon={<LockOutlined className="text-[#FFF2E3]" />}
          className="border border-[#444] bg-transparent text-white placeholder-white"
          labelClassName="text-[#FFF2E3]"
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          required
          type="password"
          placeholder="Enter your confirm password"
          icon={<LockOutlined className="text-[#FFF2E3]" />}
          className="border border-[#444] bg-transparent text-white placeholder-white"
          labelClassName="text-[#FFF2E3]"
        />
        <Form.Item>
          <Button htmlType="submit" block size="large" className="font-large mt-5 border-none bg-[#635d57] text-[#FFF2E3] shadow-none">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
