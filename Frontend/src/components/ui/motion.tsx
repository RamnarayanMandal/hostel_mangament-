import { motion, MotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Common animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    x: -50, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    x: 50, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const bounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.175, 0.885, 0.32, 1.275]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.3, 
    transition: { 
      duration: 0.3 
    } 
  }
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Hover animations
export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: { 
      duration: 0.2, 
      ease: "easeInOut" 
    } 
  },
  tap: { 
    scale: 0.95, 
    transition: { 
      duration: 0.1 
    } 
  }
};

export const hoverLiftVariants: Variants = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: { 
    y: -4, 
    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.2, 
      ease: "easeInOut" 
    } 
  },
  tap: { 
    y: -2, 
    transition: { 
      duration: 0.1 
    } 
  }
};

// Page transitions
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  out: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Loading animations
export const pulseVariants: Variants = {
  initial: { opacity: 1 },
  pulse: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spinVariants: Variants = {
  initial: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Component interfaces
interface MotionComponentProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

interface StaggerProps extends MotionComponentProps {
  staggerDelay?: number;
}

// Base Motion Components
export const MotionDiv = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  ...props 
}: MotionComponentProps) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ delay, duration }}
    {...props}
  >
    {children}
  </motion.div>
);

// Specific Animation Components
export const FadeIn = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={fadeInVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const SlideUp = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={slideUpVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const SlideDown = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={slideDownVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const SlideLeft = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={slideLeftVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const SlideRight = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={slideRightVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const Scale = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={scaleVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const Bounce = ({ children, className = "", delay = 0, ...props }: MotionComponentProps) => (
  <MotionDiv
    className={className}
    variants={bounceVariants}
    delay={delay}
    {...props}
  >
    {children}
  </MotionDiv>
);

// Hover Components
export const HoverScale = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={hoverScaleVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.div>
);

export const HoverLift = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={hoverLiftVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger Components
export const StaggerContainer = ({ 
  children, 
  className = "", 
  staggerDelay = 0.1,
  ...props 
}: StaggerProps) => (
  <motion.div
    className={className}
    variants={staggerContainerVariants}
    initial="hidden"
    animate="visible"
    transition={{ staggerChildren: staggerDelay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={staggerItemVariants}
    {...props}
  >
    {children}
  </motion.div>
);

// Loading Components
export const Pulse = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={pulseVariants}
    initial="initial"
    animate="pulse"
    {...props}
  >
    {children}
  </motion.div>
);

export const Spin = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={spinVariants}
    initial="initial"
    animate="spin"
    {...props}
  >
    {children}
  </motion.div>
);

// Page Transition Component
export const PageTransition = ({ children, className = "", ...props }: MotionComponentProps) => (
  <motion.div
    className={className}
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    {...props}
  >
    {children}
  </motion.div>
);

// Utility function to create custom motion components
export const createMotionComponent = (variants: Variants, defaultDelay = 0) => {
  const MotionComponent = ({ children, className = "", delay = defaultDelay, ...props }: MotionComponentProps) => (
    <MotionDiv
      className={className}
      variants={variants}
      delay={delay}
      {...props}
    >
      {children}
    </MotionDiv>
  );
  
  MotionComponent.displayName = 'MotionComponent';
  return MotionComponent;
};

 