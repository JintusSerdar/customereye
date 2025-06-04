import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InteractiveObjectProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  style: React.CSSProperties;
  animDelay: number;
  onClick: () => void;
}

const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  title,
  description,
  icon,
  style,
  animDelay,
  onClick
}) => {
  return (
    <motion.div
      className="absolute"
      style={style}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: animDelay
      }}
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="dream-card interactive-element flex flex-col items-center justify-center p-4 w-24 h-24"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onClick}
            >
              <motion.div 
                className="mb-2"
                animate={{ y: [0, -5, 0] }} 
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                {icon}
              </motion.div>
              <span className="text-sm font-medium text-center text-wonder-dark">
                {title}
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="bg-wonder-light border-wonder text-wonder-dark">
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default InteractiveObject;