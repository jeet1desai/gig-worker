'use client';

import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layouts/layout';

export default function NewGigPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {};

  return (
    <DashboardLayout>
      <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg bg-white p-6 shadow"></div>
        </div>
      </main>
    </DashboardLayout>
  );
}
