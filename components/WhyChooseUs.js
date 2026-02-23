'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const benefits = [
    'Local Market Understanding (Kanpur Focused)',
    'Affordable Pricing',
    'Result-Oriented Strategy',
    'Startup & Rural Empowerment Vision',
    'Dedicated Support'
];

export default function WhyChooseUs() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.textContent}
                    >
                        <span className={styles.tagline}>Why Digital Dhuriya?</span>
                        <h2 className={styles.title}>Empowering Kanpur's Tech Ecosystem</h2>
                        <div className={styles.list}>
                            {benefits.map((benefit, index) => (
                                <div key={index} className={styles.item}>
                                    <CheckCircle2 className={styles.icon} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={styles.visual}
                    >
                        <div className={styles.statCard}>
                            <span className={styles.statNum}>100%</span>
                            <span className={styles.statLabel}>Dedication</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.statCard2}`}>
                            <span className={styles.statNum}>Growth</span>
                            <span className={styles.statLabel}>Mindset</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
