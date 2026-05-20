import Link from 'next/link';
import { Truck, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Residential Moving', href: '/#services' },
    { name: 'Commercial & Office Moves', href: '/#services' },
    { name: 'Long Distance Moving', href: '/#services' },
    { name: 'Professional Packing', href: '/#services' },
    { name: 'Furniture Assembly', href: '/#services' },
    { name: 'Secure Storage Solutions', href: '/#services' }
  ];

  const quickLinks = [
    { name: 'About Our Company', href: '/about' },
    { name: 'Book Appointment', href: '/book-appointment' },
    { name: 'Our Services', href: '/#services' },
    { name: 'Why Choose Us', href: '/#why-us' },
    { name: 'Customer Reviews', href: '/#testimonials' },
    { name: 'Our Blog & Tips', href: '/blog' }
  ];


  const cities = [
    { name: 'Vancouver, BC', href: '/locations' },
    { name: 'Toronto, ON', href: '/locations' },
    { name: 'Calgary, AB', href: '/locations' },
    { name: 'Montreal, QC', href: '/locations' },
    { name: 'Edmonton, AB', href: '/locations' },
    { name: 'Ottawa, ON', href: '/locations' },
    { name: 'Winnipeg, MB', href: '/locations' },
    { name: 'Quebec City, QC', href: '/locations' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: About & Socials */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <Truck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                  GALAXY MOVERS
                </span>
                <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                  Canada
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Canada's most trusted moving company. Providing professional packing, local, and long-distance moving services coast to coast. Stress-free solutions guaranteed.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-800/80">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-800/80">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-800/80">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-800/80">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-red-600">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Coast to Coast Service Cities */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-red-600">
              Service Areas
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
              {cities.map((city) => (
                <Link key={city.name} href={city.href} className="hover:text-white transition-colors">
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-red-600">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Emergency Moving Support</span>
                  <a href="tel:18005551234" className="text-white font-bold hover:text-red-500 transition-colors">
                    (800) 555-1234
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Email Queries</span>
                  <a href="mailto:info@galaxymovers.ca" className="text-white font-semibold hover:text-red-500 transition-colors">
                    info@galaxymovers.ca
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase">HQ Locations</span>
                  <span className="text-white font-medium">Multiple Stations Across Canada</span>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Availability</span>
                  <span className="text-white font-medium">24/7 Direct Call Support</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          <p>
            &copy; {currentYear} Galaxy Movers Canada. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
