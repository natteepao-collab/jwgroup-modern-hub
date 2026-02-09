import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { BentoNewsSection } from '@/components/BentoNewsSection';
import { useNews } from '@/hooks/useNews';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';

const News = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { news, isLoading } = useNews(false); // Show all news, not just featured

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={t('news.title')}
        description="ติดตามข่าวสารและความเคลื่อนไหวล่าสุดจาก JW Group"
        url="/news"
      />
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('news.title')}</h1>
          <p className="text-lg text-muted-foreground">
            ติดตามข่าวสารและความเคลื่อนไหวล่าสุดจาก JW Group
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <BentoNewsSection news={news} showFilters={true} />
        )}
      </div>
    </div>
  );
};

export default News;
