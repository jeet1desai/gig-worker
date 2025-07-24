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
            <button
              onClick={() => toggle(index)}
              className={`w-full text-left transition-colors duration-300 ${isOpen ? 'bg-clip-text text-transparent' : 'text-[#FFFFFF]'}`}
              style={{
                backgroundImage: isOpen
                  ? 'linear-gradient(271.26deg, #A8E5EC -32.48%, #1CBAE0 -6.29%, #6C98EE 19.89%, #AB9EF5 55.1%, #CF8CCC 88.51%, #FFB9C7 111.09%, #FFC29F 140.88%)'
                  : ''
              }}
            >
              <div className="flex items-center justify-between border-b border-gray-700 py-4 text-lg font-semibold">
                {faq.question}
                <span>{isOpen ? '-' : '+'}</span>
              </div>
            </button>
            {isOpen && <div className="mt-2 text-sm text-[#FFFFFF]">{faq.answer}</div>}
          </div>
        );
      })}
    </>
  );
}
