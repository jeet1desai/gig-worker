'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Lock } from 'lucide-react';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { COMMON_ERROR_MESSAGES } from '@/constants';
import { BackArrowIconSvg } from '@/components/icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const verifyOtpSchema = Yup.object().shape({
  otp: Yup.string().required('OTP is required'),
});

type OtpFormData = {
  otp: string;
};

export default function VerifyOtpForm() {
  const router = useRouter();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<OtpFormData>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const handleSubmit = async (values: OtpFormData) => {
    try {
      await verifyOtpSchema.validate(values, { abortEarly: false });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const fieldErrors = err.inner.map((e: any) => ({
          name: e.path,
          errors: [e.message],
        }));
        form.setError('otp', { message: fieldErrors[0].errors[0] });
      } else {
        form.setError('otp', { message: COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE });
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
      <h3 className="relative mb-6 flex w-full items-center justify-center text-center text-2xl font-semibold text-[#FFF2E3]">
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.FORGOT_PASSWORD_PAGE_PATH)}
          className="absolute left-0 cursor-pointer border-none bg-transparent p-0 focus:outline-none"
          aria-label="Back to Forgot Password"
        >
          <BackArrowIconSvg />
        </button>
        Verify OTP
      </h3>

      <p className="mb-6 block text-center text-[#9d9893]">Kindly enter the confirmation code sent to the following email: xyz@gmail.com</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 flex items-center justify-between">
                  <FormLabel className="font-medium text-[#FFF2E3]">
                    OTP <span className="text-red-500">*</span>
                  </FormLabel>
                  {canResend ? (
                    <button type="button" onClick={handleResend} className="text-sm font-medium text-[#FFF2E3] underline">
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-sm text-[#9d9893]">Resend OTP in {timer}s</span>
                  )}
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 !text-[#FFF2E3]" />
                    <Input
                      {...field}
                      placeholder="Enter your OTP"
                      type="text"
                      className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white"
                      autoComplete="one-time-code"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 w-full rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button type="submit" className="h-full w-full cursor-pointer rounded-lg px-5 py-2 font-bold text-[#383937]">
              Submit
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}
