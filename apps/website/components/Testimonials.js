'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        name: 'Rajesh Kumar',
        business: 'Retail Hub Kanpur',
        text: 'Digital Dhuriya transformed our business online. Our sales grew by 40% within 3 months of their SEO strategy.',
        rating: 5
    },
    {
        name: 'Sneha Gupta',
        business: 'EduPath Academy',
        text: 'The best digital partner in Kanpur. Their Meta ads strategy is highly effective and result-oriented.',
        rating: 5
    },
    {
        name: 'Amit Singh',
        business: 'Kanpur Rural NGO',
        text: 'Their vision for rural empowerment is truly inspiring. They helped us reach more donors through digital tools.',
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.tagline}>Testimonials</span>
                    <h2 className={styles.title}>What Our Clients Say</h2>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={styles.card}
                        >
                            <div className={styles.stars}>
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="var(--secondary)" color="var(--secondary)" />
                                ))}
                            </div>
                            <p className={styles.text}>"{item.text}"</p>
                            <div className={styles.author}>
                                <strong>{item.name}</strong>
                                <span>{item.business}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
