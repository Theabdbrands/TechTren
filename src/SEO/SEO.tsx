import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
}

export const SEO = ({
    title,
    description,
    keywords,
    canonical,
    ogImage = 'https://res.cloudinary.com/dbzbetuin/image/upload/v1763747017/iys6hjwcgxs5hzkt00at.png',
    ogType = 'website'
}: SEOProps) => {
    const fullTitle = title.includes('Tech Tren') ? title : `${title} | Tech Tren`;
    const fullCanonical = canonical || window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical URL */}
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${title} - Tech Tren Platform`} />
            <meta property="og:site_name" content="Tech Tren" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={`${title} - Tech Tren Platform`} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="author" content="Tech Tren" />
        </Helmet>
    );
};