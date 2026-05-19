'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqsList = [
    {
      q: 'How much does a move typically cost?',
      a: 'Moving costs vary based on distance, volume, and services needed. We provide free, transparent quotes with no hidden fees. Contact us for an accurate estimate based on your specific needs.'
    },
    {
      q: 'How far in advance should I book my move?',
      a: 'We recommend booking 2-4 weeks in advance, especially during peak season (May-September). However, we also offer same-day moving services for urgent situations.'
    },
    {
      q: 'Do you provide packing materials?',
      a: 'Yes! We offer professional packing services with high-quality materials including boxes, bubble wrap, packing paper, and specialty containers for fragile items.'
    },
    {
      q: 'Are my belongings insured during the move?',
      a: 'Absolutely. All moves are fully insured, and we handle your belongings with the utmost care. We offer additional insurance options for high-value items.'
    },
    {
      q: 'What areas do you serve?',
      a: 'We provide moving services across all major Canadian cities including Vancouver, Toronto, Calgary, Montreal, Ottawa, and more. We handle both local and long-distance moves.'
    },
    {
      q: 'Do you offer storage solutions?',
      a: 'Yes, we have secure, climate-controlled storage facilities nationwide. Whether you need short-term or long-term storage, we have flexible options available.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="bg-white py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            FAQ Section
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Got Questions? We\'ve Got Answers
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium">
            Everything you need to know about our moving services and processes.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  type="button"
                  className="w-full text-left py-5 px-6 font-extrabold text-gray-800 hover:text-red-600 flex items-center justify-between transition-colors cursor-pointer text-base"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`h-5 w-5 stroke-[2.5] text-gray-400 group-hover:text-red-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-red-600' : ''
                    }`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] border-t border-gray-100 bg-gray-50/50' : 'max-h-0 pointer-events-none'
                  }`}
                >
                  <p className="p-6 text-sm text-gray-500 font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
