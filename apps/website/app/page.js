import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutBrief from '@/components/AboutBrief';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main>
            <Header />
            <Hero />
            <AboutBrief />
            <ServicesGrid />
            <WhyChooseUs />
            <Portfolio />
            <Testimonials />
            <CTASection />
            <Footer />
        </main>
    );
}
