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
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          asChild
          variant="default"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            {t('business.viewWebsite')}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
