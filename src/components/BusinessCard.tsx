import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessCardProps {
  name: string;
  description: string;
  url: string;
  image: string;
}

export const BusinessCard = ({ name, description, url, image }: BusinessCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="group hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-2">
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={`${name} - ${description}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-primary/80 group-hover:via-primary/30 transition-all duration-500" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold drop-shadow-lg transition-transform duration-300 group-hover:translate-y-[-4px]">{name}</h3>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          asChild
          variant="default"
          className="w-full"
        >
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            {t('business.viewWebsite')}
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
