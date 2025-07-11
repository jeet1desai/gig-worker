'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { PUBLIC_ROUTE, PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { MailCheck } from 'lucide-react';
import {
  COMMON_ERROR_MESSAGES,
  EMAIL_VERIFICATION_MESSAGES,
  TOKEN,
  VERIFICATION_MESSAGES
} from '@/constants';
import apiService from '@/services/api';
import { ApiResponse } from '@/types/fe';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const pageRedirection = (path: string) => {
    router.push(path);
  };

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
        const { data, status } = await apiService.get<ApiResponse>(
          `${PUBLIC_API_ROUTES.VERIFY_EMAIL_API}?token=${token}`
        );

        if (status === 200 || status === 201) {
          setVerified(true);
          toast.success(data?.message || EMAIL_VERIFICATION_MESSAGES.SUCCESS);
        } else {
          setVerified(false);
          toast.error(data?.message || EMAIL_VERIFICATION_MESSAGES.FAILURE);
        }
      } catch (err: any) {
        setVerified(false);
        setMessage(
          err?.response?.data?.message ||
            err?.message ||
            COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-[180px] rounded bg-[#333]" />
          <Skeleton className="h-5 w-[250px] rounded bg-[#2b2b2b]" />
        </div>
      ) : verified ? (
        <>
          <h2 className="flex items-center text-2xl font-semibold text-[#FFF2E3]">
            <MailCheck className="mr-2 h-6 w-6" />
            Email Verified
          </h2>
          <p className="my-4 text-sm text-[#FFF2E3]">
            Your email address is verified successfully.
          </p>
          <div className="inline-block rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button
              className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg px-5 py-2 font-semibold text-[#383937] transition"
              onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}
            >
              Go to Login
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-[#FFF2E3]">Verification Failed</h2>
          <p className="my-4 text-sm text-[#FFF2E3]">
            {message || 'Please try again to verify your email address.'}
          </p>
          <div className="inline-block rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button
              className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg px-5 py-2 font-semibold text-[#383937] transition"
              onClick={() => pageRedirection(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)}
            >
              Back to Signup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
