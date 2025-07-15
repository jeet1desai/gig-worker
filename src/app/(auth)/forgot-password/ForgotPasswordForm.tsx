'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/lib/toast';
import * as Yup from 'yup';
import { Mail } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Loader';
import { BackArrowIconSvg } from '@/components/icons';
import { PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import { FORGOT_PASSWORD_MESSAGES, COMMON_ERROR_MESSAGES } from '@/constants';
import apiService from '@/services/api';
import { ApiResponse } from '@/types/fe';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required')
});

type ForgotPasswordValues = {
  email: string;
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      setServerError(null);
      setLoading(true);

      const { data } = await apiService.post<ApiResponse>(PUBLIC_API_ROUTES.FORGOT_PASSWORD_API, values, { withAuth: false });

      toast.success(data?.message || FORGOT_PASSWORD_MESSAGES.success);
      form.reset();
    } catch (err: any) {
      if (err.response) {
        const data: ApiResponse = err.response.data;
        const apiErrorMessage = data?.error?.message || data?.message || FORGOT_PASSWORD_MESSAGES.error;

        if (data?.error?.fieldErrors) {
          Object.entries(data.error.fieldErrors).forEach(([key, message]) => {
            form.setError(key as keyof ForgotPasswordValues, {
              type: 'server',
              message
            });
          });
        }

        setServerError(apiErrorMessage);
        toast.error(apiErrorMessage);
      } else {
        const message = err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE;
        setServerError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Loader isLoading={loading} />

      <div className="relative mb-6 flex w-full items-center justify-center text-center">
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)}
          className="absolute left-0 cursor-pointer"
          aria-label="Back to login"
        >
          <BackArrowIconSvg />
        </button>
        <h3 className="text-2xl font-semibold text-[#FFF2E3]">Forgot password</h3>
      </div>

      <p className="mb-6 text-center text-[#9d9893]">No worries, we’ll send you an OTP to your mail ID</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base !text-[#FFF2E3]">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#FFF2E3]" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className={`!border !pl-9 ${
                        form.formState.errors.email ? '!border-red-500' : '!border-[#444]'
                      } bg-transparent !text-white !placeholder-white placeholder:text-base`}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && <p className="text-sm text-red-400">{serverError}</p>}

          <div className="mt-12 rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button type="submit" className="w-full rounded-lg px-5 py-2 font-bold text-[#383937]">
              Confirm
            </button>
          </div>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-[#FFF2E3]">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={() => pageRedirection(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)} className="cursor-pointer text-[#FFF2E3] underline">
          Sign up
        </button>
      </div>
    </div>
  );
}
