import { toast } from '@/lib/toast';
import apiService from '@/services/api';

export const downloadInvoice = async (paymentId: string) => {
  try {
    const response = await apiService.get(`/payments/invoice/${paymentId}`, {
      withAuth: true,
      responseType: 'blob'
    });

    const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Invoice downloaded successfully');
  } catch (error: any) {
    const message = error?.response?.data?.error?.message || error?.message || 'Failed to download invoice';
    toast.error(message);
    throw error;
  }
};
