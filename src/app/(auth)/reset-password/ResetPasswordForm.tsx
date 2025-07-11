'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import { COMMON_ERROR_MESSAGES, RESET_PASSWORD_MESSAGES, TOKEN } from '@/constants';
import apiService from '@/services/api';
import Loader from '@/components/Loader';
import { ApiResponse } from '@/types/fe';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schemas/auth';

type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get(TOKEN);

  const form = useForm<ResetPasswordFormType>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: ResetPasswordFormType) => {
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
      form.reset();

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
        fieldErrors.forEach((field: { name: string; errors: string[] }) => {
          form.setError(field.name as keyof ResetPasswordFormType, { message: field.errors[0] });
        });
      } else if (err.response) {
        const data: ApiResponse = err.response.data;
        const apiErrorMessage = data?.error?.message || data?.message || RESET_PASSWORD_MESSAGES.apiFallback;

        if (data?.error?.fieldErrors) {
          const fieldErrors = Object.entries(data.error.fieldErrors).map(([name, message]) => ({
            name,
            errors: [message as string],
          }));
          fieldErrors.forEach(({ name, errors }) => {
            form.setError(name as keyof ResetPasswordFormType, { message: errors[0] });
          });
        }

        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
      } else {
        const fallback = err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE;
        setError(fallback);
        toast.error(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <h3 className="mb-6 text-center text-2xl font-semibold text-[#FFF2E3]">Reset Password</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
          onChange={() => {
            if (error) setError(null);
          }}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base !text-[#FFF2E3]">
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#FFF2E3]" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white placeholder:text-base"
                      autoComplete="new-password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base !text-[#FFF2E3]">
                  Confirm Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#FFF2E3]" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your confirm password"
                      className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white placeholder:text-base"
                      autoComplete="new-password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-12 w-full rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button type="submit" className="h-full w-full cursor-pointer rounded-lg px-5 py-2 font-bold text-[#383937]">
              Change Password
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}
