'use client';

import { motion } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-wonder-dark"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-wonder rounded-full opacity-50 animate-pulse-soft"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-playfair text-2xl">
              SA
            </div>
          </div>
        </motion.div>
        <motion.h1 
          className="text-3xl font-playfair text-white"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.5, 1], ease: "easeInOut" }}
        >
          Entering Serdar&apos;s Wonderland
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default IntroSequence; 