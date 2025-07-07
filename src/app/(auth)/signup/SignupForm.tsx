'use client';

import { useCallback, useState } from 'react';
import { Form, Button, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { signupSchema } from '../../../schemas/fe/auth';
import TextField from '@/components/TextField';
import Link from 'next/link';
import { Images } from '@/lib/images';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE, PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import apiService from '@/services/api';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

const { Title } = Typography;
interface SignupFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface SignupApiResponse {
  message?: string;
  error?: {
    message?: string;
    fieldErrors?: Record<string, string>;
  };
}

export default function SignupForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setError(null);
      setLoading(true);
      await signupSchema.validate(values, { abortEarly: false });

      const payload = {
        first_name: values.firstname,
        last_name: values.lastname,
        email: values.email,
        password: values.password,
      };

      const { data } = await apiService.post<SignupApiResponse>(PUBLIC_API_ROUTES.SIGNUP_API, payload, { withAuth: false });

      if (data?.error) {
        const apiErrorMessage = data?.error?.message || data?.message || 'Signup failed. Please try again.';

        if (data?.error?.fieldErrors) {
          const fieldErrors = Object.entries(data.error.fieldErrors).map(([name, message]) => ({
            name,
            errors: [message as string],
          }));
          form.setFields(fieldErrors);
        }
        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
        setLoading(false);
        return;
      }
      setSuccess(true);
      toast.success(data?.message || 'Signup successful!');
      form.resetFields();
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err.name === 'ValidationError') {
        const fieldErrors = err.inner.map((e: any) => ({
          name: e.path,
          errors: [e.message],
        }));
        form.setFields(fieldErrors);
      } else if (err.response) {
        const data: SignupApiResponse = err.response.data;
        const apiErrorMessage = data?.error?.message || data?.message || 'Signup failed. Please try again.';

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
        const errorMessage = err?.message || 'Something went wrong.';
        setError(errorMessage);
        toast.error(errorMessage);
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
        <span className="text-[#FFF2E3]">Join Us</span>
      </Title>
      <div className="w-full">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-6 rounded border border-green-700 bg-green-900/40 px-6 py-5 text-center">
              <div className="mb-2 text-lg font-semibold text-[#FFF2E3]">Check your email</div>
              <div className="text-[#FFF2E3]">Please check your email to verify your email address and complete your registration.</div>
            </div>
          </div>
        ) : (
          <>
            <Form
              form={form}
              name="signup"
              onFinish={handleSubmit}
              layout="vertical"
              className="w-full"
              initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: '',
                terms: false,
              }}
              requiredMark={false}
            >
              <TextField
                name="firstname"
                label="First name"
                required
                type="text"
                placeholder="Enter your firstname"
                icon={<UserOutlined className="text-[#FFF2E3]" />}
                className="border border-[#444] bg-transparent text-white placeholder-white"
                labelClassName="text-[#FFF2E3]"
              />
              <TextField
                name="lastname"
                label="Last name"
                required
                type="text"
                placeholder="Enter your lastname"
                icon={<UserOutlined className="text-[#FFF2E3]" />}
                className="border border-[#444] bg-transparent text-white placeholder-white"
                labelClassName="text-[#FFF2E3]"
              />
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
                name="password"
                label="Password"
                required
                type="password"
                placeholder="Enter your password"
                icon={<LockOutlined className="!text-[#FFF2E3]" />}
                className="border border-[#444] bg-transparent text-white placeholder-white"
                labelClassName="text-[#FFF2E3]"
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                required
                type="password"
                placeholder="Enter Confirm password"
                icon={<LockOutlined className="!text-[#FFF2E3]" />}
                className="border border-[#444] bg-transparent text-white placeholder-white"
                labelClassName="text-[#FFF2E3]"
              />
              <Form.Item name="terms" valuePropName="checked" rules={[{ required: true, message: 'You must accept the terms and conditions' }]}>
                <Checkbox>
                  <span className="!text-[#FFF2E3]">
                    Accept{' '}
                    <Link href="#" className="font-medium !text-[#FFF2E3] underline">
                      terms & conditions
                    </Link>
                  </span>
                </Checkbox>
              </Form.Item>
              <Button htmlType="submit" block size="large" className="mt-5 w-full border-none bg-[#635d57] font-bold text-[#FFF2E3] shadow-none">
                Sign up
              </Button>
            </Form>
            <div className="mt-6 mb-3 text-center text-[#fff2e3]">or sign in using</div>
            <div className="mb-4 flex justify-center">
              <Image src={Images.googleIcon} alt="Google Icon" width={24} height={24} className="cursor-pointer" onClick={handleGoogleLogin} />
            </div>
            <div className="text-center text-[#fff2e3]">
              Already have an account?{' '}
              <a className="cursor-pointer font-medium text-[#fff2e3] underline" onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}>
                Log In
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
