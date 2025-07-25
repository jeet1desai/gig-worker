'use client';
import { FAQItem } from '@/types/fe';
import FAQAccordion from './FAQAccordtion';

export default function FAQPage({ data, title }: { data: FAQItem[]; title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <FAQAccordion data={data} />
    </div>
  );
}
