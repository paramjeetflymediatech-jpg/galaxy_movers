import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Stats from '@/components/Stats';
import Locations from '@/components/Locations';
import Testimonials from '@/components/Testimonials';
import PromoBanner from '@/components/PromoBanner';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Services />
      <WhyUs />
      <Stats />
      <Locations />
      <Testimonials />
      <PromoBanner />
      <FAQ />
    </>
  );
}
