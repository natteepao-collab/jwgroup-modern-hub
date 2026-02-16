import { m, AnimatePresence, Variants, Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Enhanced page variants with smoother, more premium feel
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    filter: 'blur(4px)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: 'blur(2px)',
  },
};

// Smooth spring-based transition for natural movement
const pageTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

// Alternative tween transition for specific routes
const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth feel
  duration: 0.5,
};

// Slide variants for different navigation directions
const slideVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  in: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

// Fade up variant for a gentle entrance
const fadeUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  // Determine if this is an admin/auth route for different animation
  const isSpecialRoute = location.pathname === '/admin' || location.pathname === '/auth';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={isSpecialRoute ? fadeUpVariants : pageVariants}
        transition={isSpecialRoute ? smoothTransition : pageTransition}
        className="w-full will-change-transform"
        style={{ transformOrigin: 'center top' }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

// Export variants for use in child components for staggered animations
export const staggerContainer: Variants = {
  initial: {},
  in: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
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

// Fade in animation for sections
export const fadeInSection: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Scale up animation
export const scaleUp: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export { slideVariants, fadeUpVariants };
export default PageTransition;
