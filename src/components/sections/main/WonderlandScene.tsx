"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Music, PenTool, Camera, FileText } from 'lucide-react';
import InteractiveObject from './InteractiveObject';

interface InteractiveElement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: { top: string; left: string };
  animDelay: number;
  path: string;
}

interface WonderlandSceneProps {
  onNavigate: (path: string) => void;
}

const WonderlandScene = ({ onNavigate }: WonderlandSceneProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate scene loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const interactiveElements: InteractiveElement[] = [
    {
      id: 'projects',
      title: 'Projects',
      description: 'Explore my digital creations',
      icon: <Book className="w-8 h-8 text-wonder-dark" />,
      position: { top: '35%', left: '70%' },
      animDelay: 0.2,
      path: '/projects',
    },
    {
      id: 'music',
      title: 'Music',
      description: 'Listen to my compositions',
      icon: <Music className="w-8 h-8 text-wonder-dark" />,
      position: { top: '65%', left: '60%' },
      animDelay: 0.4,
      path: '/music',
    },
    {
      id: 'poems',
      title: 'Poems',
      description: 'Read my poetic words',
      icon: <PenTool className="w-8 h-8 text-wonder-dark" />,
      position: { top: '30%', left: '25%' },
      animDelay: 0.6,
      path: '/poems',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'View captured moments',
      icon: <Camera className="w-8 h-8 text-wonder-dark" />,
      position: { top: '70%', left: '25%' },
      animDelay: 0.8,
      path: '/gallery',
    },
    {
      id: 'publications',
      title: 'Publications',
      description: 'Read my academic works',
      icon: <FileText className="w-8 h-8 text-wonder-dark" />,
      position: { top: '50%', left: '45%' },
      animDelay: 1,
      path: '/publications',
    },
  ];
  
  return (
    <div className="relative h-screen w-screen">
      {/* Scene backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* This will be replaced with Three.js scene in the future */}
        <div className="relative w-full h-full">
          {/* Background elements */}
          <motion.div 
            className="absolute w-[600px] h-[600px] rounded-full bg-wonder/5 border border-wonder/10"
            style={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          <motion.div 
            className="absolute w-[400px] h-[400px] rounded-full bg-wonder/10"
            style={{ top: '60%', left: '30%', transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          />
          
          {/* Interactive elements */}
          {isLoaded && interactiveElements.map((element) => (
            <InteractiveObject
              key={element.id}
              title={element.title}
              description={element.description}
              icon={element.icon}
              style={element.position}
              animDelay={element.animDelay}
              onClick={() => onNavigate(element.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WonderlandScene;