import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '../constants';
import { SwipeDirection } from '../types';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
    zIndex: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

const Carousel: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We wrap the index to allow infinite looping if desired, 
  // but for a book/program, strictly linear (clamped) usually feels better.
  // Here we implement bounded linear navigation.
  const imageIndex = page;

  const paginate = useCallback((newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < IMAGES.length) {
      setPage([newPage, newDirection]);
    } else {
      // Optional: Visual feedback for end of book?
    }
  }, [page]);

  // Handle keyboard navigation for desktop accessibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') paginate(SwipeDirection.RIGHT);
      if (e.key === 'ArrowLeft') paginate(SwipeDirection.LEFT);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-stone-900">
      {/* Viewport Container */}
      <div className="relative w-full h-full max-w-lg max-h-[90vh] aspect-[9/16] mx-auto touch-pan-y">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={IMAGES[imageIndex].url}
            alt={IMAGES[imageIndex].alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            // Drag logic
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(SwipeDirection.RIGHT);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(SwipeDirection.LEFT);
              }
            }}
            className="absolute w-full h-full object-contain drop-shadow-2xl cursor-grab active:cursor-grabbing rounded-sm touch-pan-y"
          />
        </AnimatePresence>
      </div>

      {/* Instagram-style Progress Indicator at Top */}
      <div className="absolute top-3 left-2 right-2 flex justify-center items-center gap-1 z-20">
        {IMAGES.map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
              idx === imageIndex
                ? 'bg-white/90'
                : idx < imageIndex
                  ? 'bg-white/60'
                  : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Desktop Navigation Arrows (Hidden on touch devices largely via CSS logic or just subtle overlays) */}
      {page > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 backdrop-blur-sm transition-all hidden md:flex"
          onClick={() => paginate(SwipeDirection.LEFT)}
        >
          <ChevronLeft size={32} />
        </button>
      )}
      
      {page < IMAGES.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 backdrop-blur-sm transition-all hidden md:flex"
          onClick={() => paginate(SwipeDirection.RIGHT)}
        >
          <ChevronRight size={32} />
        </button>
      )}
      
      {/* Invisible tap areas for easier mobile navigation (optional enhancement to swipe) */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-[15%] z-10 md:hidden"
        onClick={() => paginate(SwipeDirection.LEFT)}
      />
      <div 
        className="absolute top-0 bottom-0 right-0 w-[15%] z-10 md:hidden"
        onClick={() => paginate(SwipeDirection.RIGHT)}
      />
    </div>
  );
};

export default Carousel;