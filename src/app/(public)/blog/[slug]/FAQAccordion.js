'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div 
            key={idx}
            className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <button
              onClick={() => toggleFaq(idx)}
              type="button"
              className="w-full text-left py-4 px-6 font-extrabold text-gray-800 hover:text-red-600 flex items-center justify-between transition-colors cursor-pointer text-sm sm:text-base"
            >
              <span className="pr-4">{faq.q}</span>
              <ChevronDown 
                className={`h-4.5 w-4.5 stroke-[2.5] text-gray-400 group-hover:text-red-500 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'transform rotate-180 text-red-600' : ''
                }`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[300px] border-t border-gray-100 bg-gray-50/50' : 'max-h-0 pointer-events-none'
              }`}
            >
              <p className="p-6 text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
