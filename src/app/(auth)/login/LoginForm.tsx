'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, Lock } from 'lucide-react';

import { toast } from '@/lib/toast';
import { loginSchema } from '@/schemas/auth';
import { Images } from '@/lib/images';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import Loader from '@/components/Loader';
import { COMMON_ERROR_MESSAGES, LOGIN_MESSAGES } from '@/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form
} from '@/components/ui/form';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const pageRedirection = (path: string) => {
    router.push(path);
  };

  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: PRIVATE_ROUTE.AUTH_CALLBACK_HANDLER });
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password
      });

      if (result?.error === 'Email not verified') {
        toast.error(LOGIN_MESSAGES.emailNotVerified);
        setLoading(false);
      } else if (!result?.ok) {
        toast.error(LOGIN_MESSAGES.invalidCredentials);
        setLoading(false);
      } else {
        const session = await getSession();
        if (session?.user?.subscription) {
          router.replace(PRIVATE_ROUTE.DASHBOARD);
        } else {
          router.replace(PRIVATE_ROUTE.PLANS);
        }
        // router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE);
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <h3 className="mb-6 text-center text-2xl font-semibold text-[#FFF2E3]">
        Welcome back
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="text-base text-[#FFF2E3]">Email</Label>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#FFF2E3]" />
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white placeholder:text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="text-base text-[#FFF2E3]">Password</Label>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#FFF2E3]" />
                    <Input
                      {...field}
                      placeholder="Enter your password"
                      type="password"
                      className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white placeholder:text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => pageRedirection(PUBLIC_ROUTE.FORGOT_PASSWORD_PAGE_PATH)}
              className="cursor-pointer text-sm font-medium text-[#FFF2E3] underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
            <button
              type="submit"
              className="h-full w-full cursor-pointer rounded-lg px-5 py-2 font-bold text-[#383937]"
            >
              Sign in
            </button>
          </div>
        </form>
      </Form>

      <div className="mt-6 mb-3 text-center text-sm text-[#FFF2E3]">or sign in using</div>
      <div className="mb-4 flex justify-center">
        <Image
          src={Images.googleIcon}
          alt="Google Icon"
          width={36}
          height={36}
          className="cursor-pointer"
          onClick={handleGoogleLogin}
        />
      </div>

      <div className="text-center text-sm text-[#FFF2E3]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => pageRedirection(PUBLIC_ROUTE.SIGNUP_PAGE_PATH)}
          className="cursor-pointer font-medium text-[#FFF2E3] underline"
        >
          Sign up
        </button>
      </div>
    </>
  );
}
