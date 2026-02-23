'use client';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={styles.textContent}
                >
                    <h1 className={styles.title}>
                        Grow Your Business Digitally with <span className="gradient-text">Digital Dhuriya</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Kanpur’s Result-Driven Digital Marketing & Tech Growth Partner
                    </p>
                    <div className={styles.ctas}>
                        <a href="/contact" className="btn btn-primary">Get Free Consultation</a>
                        <a href="/services" className="btn btn-outline">View Services</a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.imageContent}
                >
                    {/* We'll use a placeholder or SVG for now, or just a stylized div */}
                    <div className={styles.techIllustration}>
                        <div className={styles.blob}></div>
                        <div className={styles.floatingCard}>
                            <span>SEO</span>
                            <div className={styles.bar}></div>
                        </div>
                        <div className={`${styles.floatingCard} ${styles.card2}`}>
                            <span>ADS</span>
                            <div className={styles.bar}></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
