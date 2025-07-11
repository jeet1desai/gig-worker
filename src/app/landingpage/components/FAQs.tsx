'use client';
import { faqs } from '@/constants/LandingPage';
import { useState } from 'react';

function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="w-full bg-[#111111] py-16">
      <div className="mx-auto max-w-[1920px]">
        <h2 className="mb-3 text-center text-2xl font-bold">FAQs</h2>
        <div className="mb-8 text-center text-sm font-[500] text-[#C7C7C7]">
          Find answers to commonly asked questions about our Platform and Services
        </div>
        <div className="mx-auto max-w-full space-y-4 px-4 sm:max-w-[50%] sm:px-0 md:max-w-[50%] md:px-0">
          {faqs.map((q, index) => (
            <div key={index}>
              <button
                onClick={() => toggle(index)}
                className={`w-full text-left transition-colors duration-300 ${
                  openIndex === index ? 'bg-clip-text text-transparent' : 'text-[#FFFFFF]'
                }`}
                style={{
                  backgroundImage:
                    openIndex === index
                      ? 'linear-gradient(271.26deg, #A8E5EC -32.48%, #1CBAE0 -6.29%, #6C98EE 19.89%, #AB9EF5 55.1%, #CF8CCC 88.51%, #FFB9C7 111.09%, #FFC29F 140.88%)'
                      : ''
                }}
              >
                <div className="flex items-center justify-between border-b border-gray-700 py-4 text-lg font-semibold">
                  {q}
                  <span>{openIndex === index ? '-' : '+'}</span>
                </div>
              </button>
              {openIndex === index && (
                <div className="mt-2 text-sm text-[#FFFFFF]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis iste
                  eveniet exercitationem ipsum voluptates quod impedit assumenda qui
                  voluptatibus pariatur beatae, numquam inventore, esse sunt placeat
                  consequatur rerum alias quibusdam.
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-sm text-[#FFF2E3]">
            Contact our Support team for assistance
          </p>
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
