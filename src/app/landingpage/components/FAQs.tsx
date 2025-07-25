'use client';
import FAQAccordion from '@/components/FAQAccordtion';
import Loader from '@/components/Loader';
import { static_faqs } from '@/constants';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { toast } from '@/lib/toast';
import apiService from '@/services/api';
import { FAQItem, FAQsHomeResponse } from '@/types/fe';
import { useCallback, useEffect, useState } from 'react';

function FAQs() {
  const [faqsList, setFaqsList] = useState<FAQItem[]>(static_faqs as FAQItem[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllFAQsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<FAQsHomeResponse>(PUBLIC_API_ROUTES.LANDING_PAGE_FAQS_LIST_API, { withAuth: false });

      if (response.data.data && response.data.data.length > 0 && response.status === HttpStatusCode.OK && response.data.message) {
        setFaqsList(response.data.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching faqs', error);
      toast.error('Error fetching faqs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllFAQsList();
  }, []);

  return (
    <section className="w-full bg-[#111111] py-16">
      <Loader isLoading={isLoading} />
      <div className="mx-auto max-w-[1920px]">
        <h2 className="mb-3 text-center text-2xl font-bold">FAQs</h2>
        <div className="mb-8 text-center text-sm font-[500] text-[#C7C7C7]">
          Find answers to commonly asked questions about our Platform and Services
        </div>
        <div className="mx-auto max-w-full space-y-4 px-4 sm:max-w-[50%] sm:px-0 md:max-w-[50%] md:px-0">
          <FAQAccordion data={faqsList} />
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-sm text-[#FFF2E3]">Contact our Support team for assistance</p>
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#A8E5EC] via-[#AB9EF5] to-[#FFC29F] p-[1px]">
            <button className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg bg-[#111111] px-5 py-2 text-[#FFF2E3] transition">
              Contact
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQs;
