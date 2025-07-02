'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { handleAdminLogin } from '@/controllers/AdminLoginController';

const { Title } = Typography;

export default function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: { email: string; password: string }) => {
    handleAdminLogin(values, form, router, setError);
  };

  return (
    <>
      <Title level={3} className="mb-6 text-center !text-2xl">
        <span className="text-[#FFF2E3]">Admin Login</span>
      </Title>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
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
          placeholder="Enter your password"
          icon={<LockOutlined className="text-[#FFF2E3]" />}
          className="border border-[#444] bg-transparent text-white placeholder-white"
          labelClassName="text-[#FFF2E3]"
        />

        {error && <div className="mb-3 text-start text-sm text-red-400">{error}</div>}

        <Form.Item>
          <Button htmlType="submit" block size="large" className="font-large mt-5 border-none bg-[#635d57] text-[#FFF2E3] shadow-none">
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
