import { m, AnimatePresence, Variants, Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Simplified page variants - removed blur filter for better GPU performance
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
  },
};

// Faster tween transition instead of spring
const pageTransition: Transition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3,
};

// Fade up variant for special routes
const fadeUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const isSpecialRoute = location.pathname === '/admin' || location.pathname === '/auth';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={isSpecialRoute ? fadeUpVariants : pageVariants}
        transition={pageTransition}
        className="w-full"
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

// Export variants for use in child components
export const staggerContainer: Variants = {
  initial: {},
  in: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeInSection: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scaleUp: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Slide variants kept for export compatibility
const slideVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export { slideVariants, fadeUpVariants };
export default PageTransition;