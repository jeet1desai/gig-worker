'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleAdminLogin } from '@/controllers/AdminLoginController';
import Loader from '@/components/Loader';

interface AdminLoginFormValues {
  email: string;
  password: string;
}

export default function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: AdminLoginFormValues) => {
    handleAdminLogin(values, { setError: setFormError }, router, setError, setIsLoading);
  };

  const renderField = (name: keyof AdminLoginFormValues, label: string, type: string, Icon: React.ElementType) => (
    <div>
      <Label htmlFor={name} className="mb-1 block text-[#FFF2E3]">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-[#FFF2E3]" size={18} />
        <Input
          id={name}
          type={type}
          {...register(name, { required: `${label} is required` })}
          className="!border !border-[#444] bg-transparent pl-10 !text-white !placeholder-white"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <>
      <Loader isLoading={isLoading} />
      <h3 className="mb-6 text-center text-2xl font-semibold text-[#FFF2E3]">Admin Login</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {renderField('email', 'Email', 'email', Mail)}
        {renderField('password', 'Password', 'password', Lock)}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
          <button type="submit" className="w-full rounded-lg px-5 py-2 font-bold text-[#383937] hover:opacity-90">
            Sign In
          </button>
        </div>
      </form>
    </>
  );
}
