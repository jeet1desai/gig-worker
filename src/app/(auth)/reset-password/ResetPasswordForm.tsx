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
import { COMMON_ERROR_MESSAGES, RESET_PASSWORD_MESSAGES, TOKEN } from '@/constants';
import { ApiResponse } from '@/types/fe';

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get(TOKEN);
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
      const { data } = await apiService.patch<ApiResponse>(PUBLIC_API_ROUTES.RESET_PASSWORD_API, payload, { withAuth: false });

      toast.success(data?.message || RESET_PASSWORD_MESSAGES.success);
      form.resetFields();
      setLoading(false);
      setTimeout(() => {
        router.push(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH);
      }, RESET_PASSWORD_MESSAGES.redirectDelay);
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
        const data: ApiResponse = err.response.data;
        const apiErrorMessage = data?.error?.message || data?.message || RESET_PASSWORD_MESSAGES.apiFallback;
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
        const fallback = err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE;
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
          <div className="mt-5 w-full rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button type="submit" className="h-full w-full cursor-pointer rounded-lg px-5 py-2 font-bold text-[#383937]">
              Change Password
            </button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
