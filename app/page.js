import Nav from '@/components/Nav/Nav';
import Hero from '@/components/Hero/Hero';
import Platforms from '@/components/Platforms/Platforms';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Pricing from '@/components/Pricing/Pricing';
import Works from '@/components/Works/Works';
import Testimonials from '@/components/Testimonials/Testimonials';
import FAQ from '@/components/FAQ/FAQ';
import Audit from '@/components/Audit/Audit';
import CTA from '@/components/CTA/CTA';
import Footer from '@/components/Footer/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://kjahstudio.com',
  name: 'KJAH Studio',
  url: 'https://kjahstudio.com',
  logo: 'https://kjahstudio.com/assets/brand/logo-with-text.png',
  image: 'https://kjahstudio.com/opengraph-image',
  description:
    'KJAH Studio builds premium websites, sales funnels, and marketing automation systems for coaches, e-commerce brands, and service businesses.',
  email: 'support@kjahstudio.com',
  priceRange: '$$$',
  areaServed: 'Worldwide',
  sameAs: [
    'https://instagram.com/kjahstudio',
    'https://www.facebook.com/people/KJAH-Studio/61592219882233/',
  ],
  serviceType: ['Website Design', 'Sales Funnel', 'Marketing Automation', 'CRM Setup', 'Email Marketing'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'KJAH Studio Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Website Design & Development',
          description: 'Up to 10 pages, domain configuration, mobile-first design, back-end setup.',
        },
        price: '1000',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sales Funnel Building',
          description: 'Up to 7 pages, email automation, CRM integration, checkout flow.',
        },
        price: '1000',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Marketing Automation & CRM',
          description: 'Email sequences, workflow logic, third-party integrations, CRM setup.',
        },
        price: '2000',
        priceCurrency: 'USD',
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Platforms />
      <Services />
      <About />
      <Pricing />
      <Works />
      <Testimonials />
      <FAQ />
      <Audit />
      <CTA />
      <Footer />
    </>
  );
}
