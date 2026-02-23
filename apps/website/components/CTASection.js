'use client';
import styles from './CTASection.module.css';

export default function CTASection() {
    return (
        <section className={styles.cta}>
            <div className="container">
                <div className={styles.box}>
                    <h2 className={styles.title}>Ready to Take Your Business Online?</h2>
                    <p className={styles.desc}>
                        Join hands with Kanpur's most trusted digital growth partner. Let's build your success story together.
                    </p>
                    <a href="/contact" className="btn btn-primary">Book Free Strategy Call</a>
                </div>
            </div>
        </section>
    );
}
