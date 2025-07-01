'use client';

import { useEffect, useState } from 'react';
import { Form, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import TextField from '@/components/TextField';
import { verifyOtpSchema } from '../../../schemas/auth';
import { BackArrowIconSvg } from '@/components/icons';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { useRouter } from 'next/navigation';

export default function VerifyOtpForm() {
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const [timer, setTimer] = useState(60);
  const { Title } = Typography;

  const pageRedirection = (path: string) => {
    router.push(path);
  }

  const handleSubmit = async (values: { email: string }) => {
    try {
      setError(null);
      await verifyOtpSchema.validate(values, { abortEarly: false });
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
  };

  return (
    <>
      <Title level={3} className="relative flex items-center justify-center text-center mb-6 !text-2xl w-full">
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.FORGOT_PASSWORD_PAGE_PATH)}
          className="absolute left-0 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
          aria-label="Back to login"
        >
          <BackArrowIconSvg />
        </button>
        <span className="text-[#FFF2E3]">Verify OTP</span>
      </Title>
      <span className="text-[#9d9893] mb-6 text-center block">Kindly enter the confirmation code sent to the following email: xyz@gmail.com</span>
      <Form form={form} name="otp" onFinish={handleSubmit} layout="vertical" className="w-full" requiredMark={false}>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="otp" className="font-medium text-[#FFF2E3]">
            OTP <span className="text-red-500">*</span>
          </label>
          <span className="text-sm">
            {canResend ? (
              <Button type="link" className="p-0 m-0 !text-[#FFF2E3] font-medium" onClick={handleResend}>
                Resend OTP
              </Button>
            ) : (
              <span className="text-[#9d9893]">Resend OTP in {timer}s</span>
            )}
          </span>
        </div>
        <Form.Item>
          <TextField
            name="otp"
            required
            type="text"
            placeholder="Enter your otp"
            icon={<LockOutlined className="text-[#FFF2E3]" />}
            className="bg-transparent text-white border border-[#444] placeholder-white"
            label={''}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block size="large" className="bg-[#635d57] text-[#FFF2E3] border-none shadow-none font-large mt-2">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
