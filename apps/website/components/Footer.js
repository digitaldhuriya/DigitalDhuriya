'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            Digital<span>Dhuriya</span>
                        </Link>
                        <p className={styles.tagline}>
                            Kanpur’s Result-Driven Digital Marketing & Tech Growth Partner
                        </p>
                        <div className={styles.socials}>
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <h3>Company</h3>
                        <Link href="/about">About Us</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    <div className={styles.links}>
                        <h3>Services</h3>
                        <Link href="/services">SEO Optimization</Link>
                        <Link href="/services">Meta & Google Ads</Link>
                        <Link href="/services">Web Development</Link>
                        <Link href="/services">Lead Automation</Link>
                    </div>

                    <div className={styles.contact}>
                        <h3>Contact Us</h3>
                        <div className={styles.contactItem}>
                            <Phone size={18} />
                            <span>+91 9616135798</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Mail size={18} />
                            <span>hello@digitaldhuriya.com</span>
                        </div>
                        <div className={styles.contactItem}>
                            <MapPin size={18} />
                            <span>Kanpur, Uttar Pradesh, India</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Digital Dhuriya. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/919616135798"
                className={styles.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="30" height="30" />
            </a>
        </footer>
    );
}
