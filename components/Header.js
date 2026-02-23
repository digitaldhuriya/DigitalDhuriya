'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContent}`}>
                <Link href="/" className={styles.logo}>
                    Digital<span>Dhuriya</span>
                </Link>

                <nav className={`${styles.nav} ${isOpen ? styles.active : ''}`}>
                    <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
                    <Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
                    <Link href="/contact" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                        Get Free Consultation
                    </Link>
                </nav>

                <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}
