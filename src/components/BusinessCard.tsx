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
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-6">
        <img
          src={image}
          alt={`${name} - ${description}`}
          className="max-w-[80%] max-h-[80%] w-auto h-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-md"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>
      <div className="px-4 pt-4">
        <h3 className="text-foreground text-xl font-bold transition-colors duration-300 group-hover:text-primary">{name}</h3>
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
