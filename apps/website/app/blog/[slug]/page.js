import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import styles from './BlogPost.module.css';

export default function BlogPost({ params }) {
    // In a real app, you'd fetch the post by slug
    const post = {
        title: 'The Future of Digital Marketing in Kanpur',
        date: 'Feb 24, 2026',
        category: 'Business Growth',
        content: `
      <p>Digital marketing is no longer a luxury but a necessity for businesses in Kanpur. As the city transforms into a tech hub, local entrepreneurs are leveraging tools like SEO and Meta Ads to reach a global audience.</p>
      <p>At Digital Dhuriya, we believe in the power of localized strategies. Kanpur has a unique market dynamic—a mix of industrial heritage and startup energy. To succeed here, one needs to understand the local pulse while applying global best practices.</p>
      <h3>Why SEO Matters for Local Businesses</h3>
      <p>When someone searches for "Best Hardware Store in Kanpur", being on the first page of Google can mean the difference between a thriving business and a struggling one. SEO isn't just about keywords; it's about trust and visibility.</p>
    `
    };

    return (
        <main>
            <Header />
            <article className={styles.article}>
                <div className="container">
                    <div className={styles.header}>
                        <span className={styles.category}>{post.category}</span>
                        <h1 className={styles.title}>{post.title}</h1>
                        <div className={styles.meta}>
                            <span>{post.date}</span> • <span>5 min read</span>
                        </div>
                    </div>

                    <div className={styles.banner}></div>

                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
            <CTASection />
            <Footer />
        </main>
    );
}
