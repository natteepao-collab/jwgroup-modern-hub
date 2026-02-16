import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SEO
        title="404 - Page Not Found"
        noindex={true}
      />
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            {t('common.notFound', 'Page Not Found')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('common.notFoundDescription', "Sorry, we couldn't find the page you're looking for.")}
          </p>
        </div>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t('common.backToHome', 'Back to Home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
