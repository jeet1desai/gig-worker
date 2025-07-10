'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { toast } from '@/lib/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Loader from '@/components/Loader';
import { Images } from '@/lib/images';
import apiService from '@/services/api';
import { PRIVATE_ROUTE, PUBLIC_API_ROUTES, PUBLIC_ROUTE } from '@/constants/app-routes';
import { COMMON_ERROR_MESSAGES, SIGNUP_MESSAGES } from '@/constants';
import { ApiResponse } from '@/types/fe';
import { Mail, Lock, User } from 'lucide-react';
import { signupSchema } from '@/schemas/fe/auth';

interface SignupFormValues {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const pageRedirection = (path: string) => router.push(path);

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setLoading(true);
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      };

      const { data } = await apiService.post<ApiResponse>(PUBLIC_API_ROUTES.SIGNUP_API, payload, {
        withAuth: false,
      });

      if (data?.error) {
        const apiErrorMessage = data?.error?.message || data?.message || SIGNUP_MESSAGES.failure;

        if (data?.error?.fieldErrors) {
          Object.entries(data.error.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SignupFormValues, {
              type: 'manual',
              message: message as string,
            });
          });
        }

        toast.error(apiErrorMessage);
        return;
      }

      setSuccess(true);
      toast.success(data?.message || SIGNUP_MESSAGES.success);
      reset();
    } catch (err: any) {
      const apiErrorMessage =
        err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE;

      toast.error(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: PRIVATE_ROUTE.DASHBOARD });
  }, []);

  const renderField = (name: keyof SignupFormValues, label: string, type: string, Icon: React.ElementType) => (
    <div>
      <Label htmlFor={name} className="mb-1 block text-base text-[#FFF2E3]">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-[#FFF2E3]" size={18} />
        <Input
          id={name}
          type={type}
          {...register(name)}
          className="!border !border-[#444] bg-transparent !pl-10 !text-white !placeholder-white placeholder:text-base"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <>
      <Loader isLoading={loading} />
      <h3 className="mb-6 text-center text-2xl font-semibold text-[#FFF2E3]">Join Us</h3>

      <div className="w-full">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-6 rounded border border-green-700 bg-green-900/40 px-6 py-5 text-center">
              <div className="mb-2 text-lg font-semibold text-[#FFF2E3]">Check your email</div>
              <div className="text-[#FFF2E3]">Please verify your email address to complete your registration.</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {renderField('first_name', 'First name', 'text', User)}
            {renderField('last_name', 'Last name', 'text', User)}
            {renderField('email', 'Email', 'email', Mail)}
            {renderField('password', 'Password', 'password', Lock)}
            {renderField('confirmPassword', 'Confirm Password', 'password', Lock)}

            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
                  <Label htmlFor="terms" className="leading-snug text-[#FFF2E3]">
                    Accept{' '}
                    <Link href="#" className="underline">
                      terms & conditions
                    </Link>
                  </Label>
                </div>
              )}
            />
            {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}

            <div className="rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
              <button type="submit" className="w-full rounded-lg px-5 py-2 font-bold text-[#383937] hover:opacity-90">
                Sign up
              </button>
            </div>
          </form>
        )}
      </div>

      {!success && (
        <>
          <div className="mt-6 mb-3 text-center text-[#fff2e3]">or sign in using</div>
          <div className="mb-4 flex justify-center">
            <Image src={Images.googleIcon} alt="Google Icon" width={24} height={24} className="cursor-pointer" onClick={handleGoogleLogin} />
          </div>
          <div className="text-center text-[#fff2e3]">
            Already have an account?{' '}
            <button type="button" onClick={() => pageRedirection(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH)} className="cursor-pointer font-medium underline">
              Log In
            </button>
          </div>
        </>
      )}
    </>
  );
}
