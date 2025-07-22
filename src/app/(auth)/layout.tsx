'use client';
import Image from 'next/image';
import { Images } from '@/lib/images';
import { useRouter } from 'next/navigation';
import { PUBLIC_ROUTE } from '@/constants/app-routes';

function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pageRedirection = (path: string) => router.push(path);
  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/bg-img.jpg')" }}
    >
      <div className="no-scrollbar flex max-h-[85vh] w-full max-w-lg flex-col items-center overflow-y-auto rounded-3xl bg-[#181820eb] px-6 py-10 shadow-xl sm:px-10 sm:py-12">
        <div className="mb-6 flex cursor-pointer items-center justify-center">
          <Image src={Images.logo} alt="Company Logo" width={80} height={80} priority onClick={() => pageRedirection(PUBLIC_ROUTE.HOME)} />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Layout;
