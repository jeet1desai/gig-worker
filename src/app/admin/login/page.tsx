import Image from 'next/image';
import { Images } from '@/lib/images';
import AdminLoginForm from './AdminLoginForm';
import AdminPublicRoute from '@/components/routing/AdminPublicRoute';

export default function LoginPage() {
  return (
    <AdminPublicRoute>
      <div
        className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/images/bg-img.jpg')" }}
      >
        <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-[#181820eb] px-6 py-10 shadow-xl sm:px-10 sm:py-12">
          <div className="mb-6 flex items-center justify-center">
            <Image src={Images.logo} alt="Company Logo" width={80} height={80} priority />
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </AdminPublicRoute>
  );
}
