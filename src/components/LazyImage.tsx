import { useState, useRef, useEffect, ImgHTMLAttributes, memo } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback shown while loading */
  placeholderClass?: string;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

/**
 * LazyImage - loads images only when they enter the viewport.
 * Uses native loading="lazy" + IntersectionObserver for broad support.
 */
const LazyImage = memo(({
  src,
  alt = '',
  className = '',
  placeholderClass = 'bg-muted animate-pulse',
  rootMargin = '200px',
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    // If IntersectionObserver not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      className={`${className} transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      {...props}
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;