import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import styles from './About.module.css';

export default function AboutPage() {
    return (
        <main>
            <Header />
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Our Story & Mission</h1>
                    <p className={styles.subtitle}>Empowering Kanpur's Digital Future</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.textBlock}>
                            <h2>Founder Story</h2>
                            <p>
                                Digital Dhuriya was born out of a vision to democratize digital growth in Kanpur. Founded with the mission to bridge the gap between local businesses and global digital standards.
                            </p>

                            <h2>Our Mission</h2>
                            <p>
                                To empower local businesses, startups, and rural communities with cutting-edge digital tools and result-oriented marketing strategies.
                            </p>

                            <h2>Our Vision</h2>
                            <p>
                                To become the primary tech growth partner for Uttar Pradesh, fostering an ecosystem where every entrepreneur can thrive in the digital economy.
                            </p>
                        </div>

                        <div className={styles.stickySidebar}>
                            <div className={styles.card}>
                                <h3>Rural Digital Empowerment</h3>
                                <p>We are dedicated to taking digital literacy and tools to the grassroots level, ensuring inclusive growth.</p>
                            </div>
                            <div className={styles.card}>
                                <h3>Future Roadmap</h3>
                                <p>Building a robust tech platform and marketplace to connect Kanpur's talent with global opportunities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
            <Footer />
        </main>
    );
}
