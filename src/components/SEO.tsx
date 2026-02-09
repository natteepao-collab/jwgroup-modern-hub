import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}: SEOProps) => {
    const siteTitle = 'JW Group';
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - กลุ่มธุรกิจชั้นนำ | อสังหาริมทรัพย์ โรงแรม สัตวแพทย์ สุขภาพ`;

    const defaultDescription = 'JW Group - กลุ่มธุรกิจครบวงจรที่มุ่งมั่นสร้างสรรค์นวัตกรรมและคุณภาพชีวิตที่ดีกว่า ธุรกิจอสังหาริมทรัพย์ โรงแรมหรู โรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ';
    const metaDescription = description || defaultDescription;

    const defaultKeywords = 'JW Group, อสังหาริมทรัพย์, โรงแรม, สัตวแพทย์, สุขภาพ, ธุรกิจ, บริษัท';
    const metaKeywords = keywords || defaultKeywords;

    const siteUrl = 'https://www.jwgroupthailand.com';
    const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;

    const defaultImage = `${siteUrl}/og-image.png`;
    const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />
        </Helmet>
    );
};
