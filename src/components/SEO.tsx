import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogType?: 'website' | 'article' | 'product' | 'profile';
    ogImage?: string;
    keywords?: string;
    structuredData?: Record<string, unknown> | object;
    noindex?: boolean;
}

export const SEO = ({
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage,
    keywords,
    structuredData,
    noindex = false,
}: SEOProps) => {
    const siteTitle = 'JW Group';
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - กลุ่มธุรกิจชั้นนำ | อสังหาริมทรัพย์ โรงแรม สัตวแพทย์ สุขภาพ`;

    const defaultDescription = 'JW Group - กลุ่มธุรกิจครบวงจรที่มุ่งมั่นสร้างสรรค์นวัตกรรมและคุณภาพชีวิตที่ดีกว่า ธุรกิจอสังหาริมทรัพย์ โรงแรมหรู โรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ';
    const metaDescription = description || defaultDescription;

    const siteUrl = 'https://www.jwgroupthailand.com';
    // If canonicalUrl is provided, use it. Otherwise, default to siteUrl (or window.location.href if dynamic behavior is preferred globally, but passed prop is safer)
    // Logic: if canonicalUrl starts with http, use it. If it starts with /, append to siteUrl. If undefined, use siteUrl.
    const finalCanonicalUrl = canonicalUrl
        ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`)
        : siteUrl;

    const defaultImage = `${siteUrl}/og-image.png`; // Ensure this image exists in public folder
    const metaImage = ogImage
        ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`)
        : defaultImage;

    const defaultKeywords = 'JW Group, อสังหาริมทรัพย์, โรงแรม, สัตวแพทย์, สุขภาพ, ธุรกิจ, บริษัท';
    const metaKeywords = keywords || defaultKeywords;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {noindex && <meta name="robots" content="noindex" />}
            {metaKeywords && <meta name="keywords" content={metaKeywords} />}
            <link rel="canonical" href={finalCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={finalCanonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={finalCanonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};
