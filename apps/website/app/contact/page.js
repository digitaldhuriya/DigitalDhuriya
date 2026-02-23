'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import styles from './Contact.module.css';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setTimeout(() => {
            setStatus('Message sent successfully! We will get back to you soon.');
            e.target.reset();
        }, 1500);
    };

    return (
        <main>
            <Header />
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>Let's Start Your Growth Journey</p>
                </div>
            </section>

            <section className={styles.contact}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.details}>
                            <h2>Contact Information</h2>
                            <p>Fill out the form and our team will get back to you within 24 hours.</p>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <div className={styles.icon}><Phone size={24} /></div>
                                    <div>
                                        <h3>Call Us</h3>
                                        <p>+91 9616135798</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={styles.icon}><Mail size={24} /></div>
                                    <div>
                                        <h3>Email Us</h3>
                                        <p>hello@digitaldhuriya.com</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={styles.icon}><MapPin size={24} /></div>
                                    <div>
                                        <h3>Visit Us</h3>
                                        <p>Kanpur, Uttar Pradesh, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.map}>
                                {/* Embed Google Map placeholder */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114312.4497676646!2d80.2586714168434!3d26.44710185122176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4770b127c46f%3A0x1778302aee9e0247!2sKanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '20px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>

                        <div className={styles.formContainer}>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Service Interested In</label>
                                    <select>
                                        <option>SEO Optimization</option>
                                        <option>Ads Management</option>
                                        <option>Web Development</option>
                                        <option>Branding</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Message</label>
                                    <textarea rows="5" placeholder="Tell us about your project..." required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    Send Message <Send size={18} style={{ marginLeft: '10px' }} />
                                </button>
                                {status && <p className={styles.status}>{status}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
