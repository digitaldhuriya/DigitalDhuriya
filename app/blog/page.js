import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './Blog.module.css';

const posts = [
    {
        title: 'How to Grow Your Local Business with Google Ads',
        category: 'Ads',
        date: 'Feb 20, 2026',
        excerpt: 'Discover how small businesses in Kanpur are doubling their leads using targeted Google Ads campaigns.'
    },
    {
        title: 'SEO Trends 2026: A Guide for Indian Startups',
        category: 'SEO',
        date: 'Feb 15, 2026',
        excerpt: 'Stay ahead of the curve with these essential SEO strategies tailored for the Indian market.'
    },
    {
        title: 'The Power of WhatsApp Automation for NGOs',
        category: 'Business Growth',
        date: 'Feb 10, 2026',
        excerpt: 'Learn how to automate donor engagement and outreach using modern WhatsApp API tools.'
    }
];

export default function BlogPage() {
    return (
        <main>
            <Header />
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Digital Growth Blog</h1>
                    <p className={styles.subtitle}>Insights & Strategies for Tech Success</p>
                </div>
            </section>

            <section className={styles.blog}>
                <div className="container">
                    <div className={styles.categories}>
                        <span className={styles.active}>All</span>
                        <span>Digital Marketing</span>
                        <span>SEO</span>
                        <span>Ads</span>
                        <span>Business Growth</span>
                    </div>

                    <div className={styles.grid}>
                        {posts.map((post, index) => (
                            <article key={index} className={styles.card}>
                                <div className={styles.cardImg}></div>
                                <div className={styles.cardContent}>
                                    <span className={styles.category}>{post.category}</span>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <div className={styles.footer}>
                                        <span>{post.date}</span>
                                        <a href="#" className={styles.readMore}>Read More &rarr;</a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
