'use client';
import { motion } from 'framer-motion';
import styles from './AboutBrief.module.css';

export default function AboutBrief() {
    return (
        <section className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.imageBox}
                    >
                        <div className={styles.accentBox}></div>
                        <div className={styles.mainImg}>
                            <h2 className={styles.imgText}>Empowering Digital Growth</h2>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.textContent}
                    >
                        <span className={styles.tagline}>About Digital Dhuriya</span>
                        <h2 className={styles.title}>Your Partner in Digital Transformation</h2>
                        <p className={styles.text}>
                            Digital Dhuriya is a Kanpur-based digital marketing and tech startup empowering businesses and rural communities with digital tools, marketing solutions, and online growth strategies.
                        </p>
                        <p className={styles.text}>
                            We bridge the gap between traditional business and modern technology, ensuring that local entrepreneurs have the same competitive edge as global startups.
                        </p>
                        <a href="/about" className="btn btn-primary">Learn More</a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
