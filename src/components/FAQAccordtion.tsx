'use client';
import { useState } from 'react';
import { FAQItem } from '@/types/fe';

export default function FAQAccordion({ data }: { data: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {data.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.id}>
            <button onClick={() => toggle(index)} className="w-full text-left transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-gray-700 py-4 text-lg font-semibold">
                <span className={isOpen ? 'gradient-text' : 'text-[#FFFFFF]'}>{faq.question}</span>
                <span className="text-[#FFFFFF]">{isOpen ? '-' : '+'}</span>
              </div>
            </button>
            {isOpen && <div className="mt-2 text-sm text-[#FFFFFF]">{faq.answer}</div>}
          </div>
        );
      })}
    </>
  );
}
