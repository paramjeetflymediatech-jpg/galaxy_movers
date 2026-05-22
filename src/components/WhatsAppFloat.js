'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { ABOUT } from '@/lib/constant';
export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* WhatsApp Float Button (Bottom-Left) */}
      <a
        href={`https://wa.me/${ABOUT[0].phone[0].replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 group flex items-center justify-center cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping -z-10 group-hover:hidden"></span>
        <MessageSquare className="h-6 w-6 fill-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 font-bold text-sm transition-all duration-300 ease-out whitespace-nowrap">
          Chat With Us
        </span>
      </a>

      {/* Scroll-To-Top Button (Bottom-Right) */}
      <button
        onClick={scrollToTop}
        type="button"
        className={`fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-full shadow-2xl hover:translate-y-[-4px] active:translate-y-0 transition-all duration-300 flex items-center justify-center cursor-pointer ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 stroke-[2.5]" />
      </button>
    </>
  );
}
