import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import {
    BarChart3,
    Globe,
    Megaphone,
    Palette,
    Search,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        title: 'Social Media Marketing',
        icon: <Megaphone size={40} />,
        desc: 'Strategic management of your social presence on Meta, Instagram, and LinkedIn. We create content that resonates and engages.',
        tools: ['Meta Business Suite', 'Canva', 'Later'],
        range: '₹15,000 - ₹50,000/mo'
    },
    {
        title: 'Meta & Google Ads',
        icon: <BarChart3 size={40} />,
        desc: 'High-conversion ad campaigns designed to maximize your ROI. We handle everything from creative to targeting.',
        tools: ['FB Ads Manager', 'Google Ads', 'Analytics'],
        range: '₹20,000 - ₹1,00,000/mo'
    },
    {
        title: 'Website Development',
        icon: <Globe size={40} />,
        desc: 'Modern, responsive, and SEO-optimized websites. We build for performance and conversion.',
        tools: ['Next.js', 'React', 'Node.js'],
        range: '₹25,000 - ₹1,50,000'
    }
];

export default function ServicesPage() {
    return (
        <main>
            <Header />
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Our Specialized Services</h1>
                    <p className={styles.subtitle}>Tech-Driven Growth Strategies</p>
                </div>
            </section>

            <section className={styles.list}>
                <div className="container">
                    {services.map((item, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <div className={styles.icon}>{item.icon}</div>
                            <div className={styles.info}>
                                <h2>{item.title}</h2>
                                <p>{item.desc}</p>
                                <div className={styles.details}>
                                    <div>
                                        <strong>Tools we use:</strong>
                                        <div className={styles.tools}>
                                            {item.tools.map(tool => <span key={tool}>{tool}</span>)}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Pricing starts at:</strong>
                                        <p className={styles.price}>{item.range}</p>
                                    </div>
                                </div>
                                <a href="/contact" className="btn btn-primary">Get Quote <ArrowRight size={18} /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CTASection />
            <Footer />
        </main>
    );
}
