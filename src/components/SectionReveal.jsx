// Scroll-reveal wrapper for sections and child elements.
// opacity 0→1, translateY 20px→0 over 600ms ease-out.
// Children can be staggered 80ms apart by passing `stagger`.
// Respects prefers-reduced-motion — skips animation entirely.

import { motion, useReducedMotion } from "framer-motion";

export function SectionReveal({ children, className = "", stagger = false, delay = 0 }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay },
    },
  };

  const containerVariants = stagger
    ? {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }
    : variants;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual child item for use inside a staggered SectionReveal.
export function RevealItem({ children, className = "" }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
