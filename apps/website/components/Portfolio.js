'use client';
import { motion } from 'framer-motion';
import styles from './Portfolio.module.css';

const projects = [
    { title: 'Local E-commerce Growth', metric: '+150% Leads', category: 'Ads & SEO' },
    { title: 'NGO Awareness Campaign', metric: '1M+ Reach', category: 'Social Media' },
    { title: 'EduTech Platform', metric: 'User-Friendly UI', category: 'Web Dev' }
];

export default function Portfolio() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.tagline}>Success Stories</span>
                    <h2 className={styles.title}>Results That Speak Volume</h2>
                </div>

                <div className={styles.grid}>
                    {projects.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={styles.projectCard}
                        >
                            <div className={styles.category}>{item.category}</div>
                            <h3 className={styles.projectTitle}>{item.title}</h3>
                            <div className={styles.metric}>{item.metric}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
