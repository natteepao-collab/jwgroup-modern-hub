// Shared JSON-LD schema builders for SEO
const SITE_URL = 'https://www.jwgroupthailand.com';

export const buildBreadcrumb = (
  items: { name: string; path: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
    ...items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  ],
});

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "JW Group",
  image: `${SITE_URL}/og-image.png`,
  url: SITE_URL,
  telephone: "+66-2-566-1111",
  email: "jwgroupmkt@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "เลขที่ 9 ซอยสรณคมน์ 12 ถนนสรณคมน์",
    addressLocality: "แขวงสีกัน เขตดอนเมือง",
    addressRegion: "กรุงเทพมหานคร",
    postalCode: "10210",
    addressCountry: "TH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.9125,
    longitude: 100.5950,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
  ],
  sameAs: [
    "https://www.facebook.com/JwRealestateCoLtd/",
    "https://www.youtube.com/@JWgroupthai",
  ],
};
