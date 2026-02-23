import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

export const metadata = {
    title: 'Digital Dhuriya | Kanpur\'s Premier Digital Marketing Agency',
    description: 'Grow your business digitally with Digital Dhuriya. Kanpur\'s result-driven digital marketing and tech growth partner for startups, NGOs, and local businesses.',
    keywords: 'digital marketing kanpur, seo kanpur, social media marketing india, web development kanpur, digital dhuriya',
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Digital Dhuriya",
        "image": "https://digitaldhuriya.com/logo.png",
        "@id": "",
        "url": "https://digitaldhuriya.com",
        "telephone": "+91 9616135798",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kanpur",
            "addressLocality": "Kanpur",
            "addressRegion": "UP",
            "postalCode": "208001",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.4499,
            "longitude": 80.3319
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "19:00"
        },
        "sameAs": [
            "https://www.facebook.com/digitaldhuriya",
            "https://www.instagram.com/digitaldhuriya",
            "https://www.linkedin.com/company/digitaldhuriya"
        ]
    };

    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {/* Google Analytics Placeholder - Replace G-XXXXXXX with your ID */}
                {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-XXXXXXX');
                        `,
                    }}
                /> */}

                {/* Meta Pixel Placeholder - Replace XXXXXXXXXXXXXXX with your ID */}
                {/* <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', 'XXXXXXXXXXXXXXX');
                            fbq('track', 'PageView');
                        `,
                    }}
                /> */}
            </head>
            <body>{children}</body>
        </html>
    );
}
