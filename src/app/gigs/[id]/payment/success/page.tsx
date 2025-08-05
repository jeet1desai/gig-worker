'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, DollarSign, User, Calendar, Download } from 'lucide-react';
import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import apiService from '@/services/api';
import { PRIVATE_API_ROUTES, PRIVATE_ROUTE } from '@/constants/app-routes';
import { PaymentPostAPIResponse } from '@/types/fe';
import { toast } from '@/lib/toast';
import Loader from '@/components/Loader';
import { downloadInvoice } from '@/utils/payment-utils';
import { formatCurrency } from '@/lib/utils';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');

  useEffect(() => {
    const capturePayment = async () => {
      if (!token) {
        setLoading(false);
        toast.error('Payment token not found. Please try again.');
        return;
      }

      try {
        const response = await apiService.post<PaymentPostAPIResponse>(
          `${PRIVATE_API_ROUTES.PAYMENT_CAPTURE_API}`,
          {
            orderId: token
          },
          {
            withAuth: true
          }
        );

        if (response.data.message) {
          const paymentData = response.data.data;
          setPaymentDetails(paymentData);
        }
      } catch (error: any) {
        const message = error?.response?.data?.error?.message || error?.message || 'Error in payment processing';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [token, payerId]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleDownloadInvoice = async () => {
    if (!paymentDetails?.paymentId) {
      toast.error('Payment ID not found');
      return;
    }

    setDownloadingInvoice(true);
    try {
      await downloadInvoice(paymentDetails.paymentId);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader isLoading={loading} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-2xl px-6">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Payment Successful!</h1>
            <p className="text-gray-400">Your payment has been processed successfully.</p>
          </div>

          {paymentDetails && (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Amount Paid</p>
                    <p className="text-xl font-semibold text-white">{formatCurrency(paymentDetails.amount, 'USD')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Payment Method</p>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      PayPal
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Transaction ID</p>
                    <p className="font-mono text-sm text-gray-300">{paymentDetails.transactionId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-sm text-gray-300">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Provider</span>
                  </div>
                  <p className="text-white">{paymentDetails.providerName}</p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Gig</span>
                  </div>
                  <p className="text-white">{paymentDetails.gigTitle}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
            </Button>
            <Button
              onClick={() => handleNavigation(PRIVATE_ROUTE.GIGS)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
            >
              View All Gigs
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation(PRIVATE_ROUTE.DASHBOARD)}
              className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSuccessPage;
