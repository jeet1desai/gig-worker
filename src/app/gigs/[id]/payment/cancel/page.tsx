'use client';

import { useRouter } from 'next/navigation';
import { XCircle, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIVATE_ROUTE } from '@/constants/app-routes';

const PaymentCancelPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-2xl px-6">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Payment Cancelled</h1>
            <p className="text-gray-400">Your payment was cancelled. You can try again or contact support.</p>
          </div>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-red-400" />
                What happened?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                  <p className="text-gray-300">Your payment was cancelled before completion</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                  <p className="text-gray-300">No charges were made to your account</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                  <p className="text-gray-300">You can retry the payment at any time</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="mb-2 font-medium text-white">Need help?</h3>
                <p className="text-sm text-gray-400">If you're experiencing issues with payments, please contact our support team.</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => handleNavigation(PRIVATE_ROUTE.GIGS)}
              className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700"
            >
              Back to Gigs
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentCancelPage;
