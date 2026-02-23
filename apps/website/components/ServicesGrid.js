'use client';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Globe,
    Megaphone,
    Palette,
    Search,
    MessageSquare
} from 'lucide-react';
import styles from './ServicesGrid.module.css';

const services = [
    {
        title: 'Social Media Marketing',
        icon: <Megaphone size={32} />,
        desc: 'Engage your audience across Meta, Instagram, and LinkedIn with strategic content.',
        link: '/services'
    },
    {
        title: 'Meta Ads & Google Ads',
        icon: <BarChart3 size={32} />,
        desc: 'Targeted advertising campaigns that drive leads and maximize ROAS.',
        link: '/services'
    },
    {
        title: 'Website Development',
        icon: <Globe size={32} />,
        desc: 'High-performance, SEO-optimized websites built for conversion.',
        link: '/services'
    },
    {
        title: 'SEO Optimization',
        icon: <Search size={32} />,
        desc: 'Rank on the first page of Google and attract organic traffic.',
        link: '/services'
    },
    {
        title: 'Branding & Creative Design',
        icon: <Palette size={32} />,
        desc: 'Minimalist, startup-style branding that builds trust and authority.',
        link: '/services'
    },
    {
        title: 'WhatsApp & Lead Automation',
        icon: <MessageSquare size={32} />,
        desc: 'Automate your customer engagement and lead management workflows.',
        link: '/services'
    }
];

export default function ServicesGrid() {
    return (
        <section className={styles.services}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.tagline}>Our Expertise</span>
                    <h2 className={styles.title}>Comprehensive Tech & Marketing Solutions</h2>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.icon}>{service.icon}</div>
                            <h3 className={styles.serviceTitle}>{service.title}</h3>
                            <p className={styles.desc}>{service.desc}</p>
                            <a href={service.link} className={styles.link}>Explore &rarr;</a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
