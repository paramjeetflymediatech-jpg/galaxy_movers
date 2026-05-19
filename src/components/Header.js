'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Menu, X, PhoneCall } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const navLinks = [
    { name: 'Services', href: isHome ? '#services' : '/#services' },
    { name: 'Why Us', href: isHome ? '#why-us' : '/#why-us' },
    { name: 'Cities', href: isHome ? '#cities' : '/#cities' },
    { name: 'Reviews', href: isHome ? '#testimonials' : '/#testimonials' },
    { name: 'FAQ', href: isHome ? '#faq' : '/#faq' },
    { name: 'Blog', href: '/blog' }
  ];

  const handleLinkClick = (e, href) => {
    setIsOpen(false);
    if (href.startsWith('#') && isHome) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-red-600 text-white p-2 rounded-lg transition-transform group-hover:scale-105 duration-200">
              <Truck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                GALAXY MOVERS
              </span>
              <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                Canada Coast to Coast
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-semibold text-sm transition-colors duration-200 hover:text-red-600 ${
                  pathname === link.href 
                    ? 'text-red-600 nav-link-underline active' 
                    : 'text-gray-600 nav-link-underline'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Call & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="tel:18005551234" 
              className="flex items-center text-sm font-bold text-gray-700 hover:text-red-600 transition-colors"
            >
              <PhoneCall className="h-4 w-4 mr-2 text-red-600 animate-pulse" />
              <span>(800) 555-1234</span>
            </a>
            
            <Link 
              href={isHome ? '#quote-form' : '/#quote-form'}
              onClick={(e) => handleLinkClick(e, isHome ? '#quote-form' : '/#quote-form')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-red-600/20 hover:-translate-y-0.5 transition-all duration-200 text-sm cursor-pointer"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 py-4 border-t border-gray-100 bg-white' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                pathname === link.href 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <a 
              href="tel:18005551234" 
              className="flex items-center px-3 py-2 text-base font-bold text-gray-700 hover:text-red-600 transition-colors"
            >
              <PhoneCall className="h-5 w-5 mr-3 text-red-600" />
              <span>(800) 555-1234</span>
            </a>
            
            <Link
              href={isHome ? '#quote-form' : '/#quote-form'}
              onClick={(e) => handleLinkClick(e, isHome ? '#quote-form' : '/#quote-form')}
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:shadow-red-600/20 transition-all duration-200 text-base"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
