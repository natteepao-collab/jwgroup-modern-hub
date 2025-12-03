import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export const NewsCard = ({ id, title, excerpt, category, date, image }: NewsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-2">
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={`${title} - ${category}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
            {category}
          </Badge>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
          <Link to={`/news/${id}`}>{t('news.readMore')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
