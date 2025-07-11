'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/layout';

export default function EditGigPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">Edit Gig</h1>
          <div className="rounded-lg bg-white p-6 shadow"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
