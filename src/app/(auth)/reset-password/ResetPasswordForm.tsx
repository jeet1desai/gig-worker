'use client';

import { Form, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { useState } from 'react';
import { resetPasswordSchema } from '@/schemas/auth';
import { toast } from 'react-toastify';
import { APPLICATION_JSON, CONTENT_TYPE, PATCH } from '@/constants';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { Title } = Typography;

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      setError(null);
      const payload = {
        ...values,
        token,
      };
      await resetPasswordSchema.validate(payload, { abortEarly: false });
      const response = await fetch('/api/auth/reset-password', {
        method: PATCH,
        headers: { [CONTENT_TYPE]: APPLICATION_JSON },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok) {
        const apiErrorMessage =
          data?.error?.message || data?.message || 'Failed to reset password.';
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
        toast.success(data?.message || 'Password has been reset successfully.');
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
          <Button
            htmlType="submit"
            block
            size="large"
            className="font-large mt-5 border-none bg-[#635d57] text-[#FFF2E3] shadow-none"
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
