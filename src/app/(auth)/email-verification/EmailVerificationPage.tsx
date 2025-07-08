'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin, Typography } from 'antd';
import { PUBLIC_ROUTE, PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { MailCheck } from 'lucide-react';
import apiService from '@/services/api';
import { toast } from 'react-toastify';
import { COMMON_ERROR_MESSAGES, EMAIL_VERIFICATION_MESSAGES, TOKEN, VERIFICATION_MESSAGES } from '@/constants';
import { ApiResponse } from '@/types/fe';

const { Title, Text } = Typography;

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get(TOKEN);
    if (!token) {
      setVerified(false);
      setMessage(VERIFICATION_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const token = searchParams.get(TOKEN);
        const { data, status } = await apiService.get<ApiResponse>(`${PUBLIC_API_ROUTES.VERIFY_EMAIL_API}?token=${token}`);

        if (status === 200 || status === 201) {
          setVerified(true);
          toast.success(data?.message || EMAIL_VERIFICATION_MESSAGES.SUCCESS);
        } else {
          setVerified(false);
          toast.error(data?.message || EMAIL_VERIFICATION_MESSAGES.FAILURE);
        }
      } catch (err: any) {
        setVerified(false);
        setMessage(err?.response?.data?.message || err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <Spin size="large" className="mb-6" />
          <Title level={4} className="!text-[#FFF2E3]">
            Verifying your email...
          </Title>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {verified ? (
            <>
              <Title level={3} className="mt-4 flex items-center !text-[#FFF2E3]">
                <MailCheck className="mr-2" /> Email Verified
              </Title>
              <Text className="mb-6 !text-[#FFF2E3]">Your email address is verified successfully.</Text>
              <div className="inline-block rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
                <button
                  className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg px-5 py-2 text-[#383937] transition"
                  onClick={() => router.push(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}
                >
                  Go to Login
                </button>
              </div>
            </>
          ) : (
            <>
              <Title level={3} className="mt-4 !text-[#FFF2E3]">
                Verification Failed
              </Title>
              <Text className="mb-6 !text-[#FFF2E3]">Please try again to verify your email address.</Text>
              <div className="inline-block rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
                <button
                  className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg px-5 py-2 text-[#383937] transition"
                  onClick={() => router.push(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)}
                >
                  Back to Signup
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
