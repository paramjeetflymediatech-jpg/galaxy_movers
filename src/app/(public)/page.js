import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Stats from '@/components/Stats';
import Cities from '@/components/Cities';
import Testimonials from '@/components/Testimonials';
import PromoBanner from '@/components/PromoBanner';
import QuoteForm from '@/components/QuoteForm';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Services />
      <WhyUs />
      <Stats />
      <Cities />
      <Testimonials />
      <PromoBanner />
      <QuoteForm />
      <FAQ />
    </>
  );
}
