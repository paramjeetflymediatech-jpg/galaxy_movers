import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen pt-[72px]">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
