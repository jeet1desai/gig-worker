'use client';

import { useCallback, useState } from 'react';
import { Form, Button, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { signupSchema } from '../../../schemas/fe/auth';
import TextField from '@/components/TextField';
import Link from 'next/link';
import { Images } from '@/lib/images';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const { Title } = Typography;
interface SignupFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignupForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const pageRedirection = (path: string) => {
    router.push(path);
  }
  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setError(null);
      await signupSchema.validate(values, { abortEarly: false });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const fieldErrors = err.inner.map((e: any) => ({
          name: e.path,
          errors: [e.message],
        }));
        form.setFields(fieldErrors);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };
  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: PRIVATE_ROUTE.DASHBOARD });
  }, []);

  return (
    <>
      <Title level={3} className="mb-6 text-center !text-2xl">
        <span className="text-[#FFF2E3]">Join Us</span>
      </Title>
      <div className="w-full">
        <Form
          form={form}
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          className="w-full"
          initialValues={{
            firstName: '',
            lastName: '',
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

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              { required: true, message: 'You must accept the terms and conditions' },
            ]}
          >
            <Checkbox>
              <span className="!text-[#FFF2E3]">
                Accept{' '}
                <Link href="#" className="font-medium !text-[#FFF2E3] underline">
                  terms & conditions
                </Link>
              </span>
            </Checkbox>
          </Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            className="mt-5 w-full border-none bg-[#635d57] font-bold text-[#FFF2E3] shadow-none"
          >
            Sign up
          </Button>
        </Form>
        <div className="mt-6 mb-3 text-center text-[#fff2e3]">or sign in using</div>
        <div className="mb-4 flex justify-center">
          <Image
            src={Images.googleIcon}
            alt="Google Icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={handleGoogleLogin}
          />
        </div>
        <div className="text-center text-[#fff2e3]">
          Already have an account?{' '}
          <a className="font-medium text-[#fff2e3] underline cursor-pointer" onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}>
            Log In
          </a>
        </div>
      </div>
    </>
  );
}
