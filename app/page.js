import Nav from '@/components/Nav/Nav';
import Hero from '@/components/Hero/Hero';
import Platforms from '@/components/Platforms/Platforms';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Pricing from '@/components/Pricing/Pricing';
import Works from '@/components/Works/Works';
import Testimonials from '@/components/Testimonials/Testimonials';
import CTA from '@/components/CTA/CTA';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Platforms />
      <Services />
      <About />
      <Pricing />
      <Works />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
