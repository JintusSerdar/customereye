"use client";

import { useState, useEffect, useRef } from 'react';

type Branch = {
  id: string;
  points: { x: number; y: number }[];
  width: number;
  opacity: number;
  color: string;
};

type LightningBolt = {
  id: number;
  position: { x: number; y: number };
  branches: Branch[];
  lifespan: number;
  createdAt: number;
};

export default function LightningEffect() {
  const [bolts, setBolts] = useState<LightningBolt[]>([]);
  const [counter, setCounter] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Colors for lightning from lighter to deeper
  const colors = ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'];

  // Create a new lightning bolt
  const createLightningBolt = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    // Position in upper portion of the screen
    const position = {
      x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
      y: Math.random() * screenHeight * 0.3 + screenHeight * 0.1
    };
    
    // Initial main branch
    const initialBranch: Branch = {
      id: `bolt-${counter}-branch-0`,
      points: [{ x: 0, y: 0 }], // Starting at origin (relative to position)
      width: 3 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * 3)] // Start with lighter colors
    };
    
    const newBolt: LightningBolt = {
      id: counter,
      position,
      branches: [initialBranch],
      lifespan: 5000 + Math.random() * 5000, // 5-10 seconds lifespan
      createdAt: Date.now()
    };
    
    setBolts(prev => [...prev, newBolt]);
    setCounter(prev => prev + 1);
  };

  // Grow branches for a lightning bolt
  const growBranches = (bolt: LightningBolt, timeDelta: number): LightningBolt => {
    const age = Date.now() - bolt.createdAt;
    const lifeProgress = age / bolt.lifespan; // 0-1 progress through lifespan
    
    // Don't grow if too old
    if (lifeProgress > 0.8) return bolt;
    
    // Copy branches for modification
    const updatedBranches = [...bolt.branches];
    
    // Grow existing branches
    updatedBranches.forEach((branch, index) => {
      const growChance = 0.6 - (branch.points.length * 0.005); // Slower decay, allowing longer branches
      
      if (Math.random() < growChance * timeDelta/16) {
        // Get last point
        const lastPoint = branch.points[branch.points.length - 1];
        
        // New direction with slight randomness - increased growth distance
        const newX = lastPoint.x + (Math.random() * 15 - 5) * (branch.width / 3);
        const newY = lastPoint.y + (8 + Math.random() * 20) * (branch.width / 3); // Mostly downward, longer steps
        
        branch.points.push({ x: newX, y: newY });
        
        // Change color based on growth for color evolution
        const colorIndex = Math.min(
          Math.floor(lifeProgress * colors.length * 1.5 + index % 3),
          colors.length - 1
        );
        branch.color = colors[colorIndex];
        
        // Reduce width slightly as it grows, but not as quickly
        branch.width *= 0.99;
      }
    });
    
    // Add new branches occasionally - increased branching chance
    const shouldAddBranch = 
      updatedBranches.length < 12 && // Max 12 branches per bolt (increased from 8)
      Math.random() < 0.06 * timeDelta/16 && // Higher random chance (doubled)
      lifeProgress > 0.05 && // Branch earlier
      lifeProgress < 0.7; // Branch later into lifetime
    
    if (shouldAddBranch) {
      // Pick a random existing branch to fork from
      const parentIndex = Math.floor(Math.random() * updatedBranches.length);
      const parent = updatedBranches[parentIndex];
      
      // Pick a random point to fork from (not the first or last point)
      const minForkPoint = 1;
      const maxForkPoint = Math.max(1, parent.points.length - 2);
      const forkPointIndex = minForkPoint + Math.floor(Math.random() * (maxForkPoint - minForkPoint + 1));
      const forkPoint = parent.points[forkPointIndex];
      
      // Create new branch - longer initial branch
      const newBranch: Branch = {
        id: `bolt-${bolt.id}-branch-${Date.now()}`,
        points: [
          { x: forkPoint.x, y: forkPoint.y },
          { 
            x: forkPoint.x + (Math.random() * 30 - 15), // Wider initial spread
            y: forkPoint.y + (Math.random() * 15 + 10) // Longer initial branch
          }
        ],
        width: parent.width * (0.6 + Math.random() * 0.3), // Slightly thicker branches
        opacity: parent.opacity * (0.7 + Math.random() * 0.3),
        color: parent.color
      };
      
      updatedBranches.push(newBranch);
    }
    
    return {
      ...bolt,
      branches: updatedBranches
    };
  };

  // Animation loop
  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const timeDelta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    setBolts(currentBolts => {
      // Grow branches for each bolt
      const updatedBolts = currentBolts.map(bolt => growBranches(bolt, timeDelta));
      
      // Remove expired bolts
      const activeBolts = updatedBolts.filter(bolt => {
        const age = time - bolt.createdAt;
        return age < bolt.lifespan;
      });
      
      return activeBolts;
    });
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Avoid running in SSR
    if (typeof window === 'undefined') return;
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Create new lightning bolts at random intervals - more frequent
    const interval = setInterval(() => {
      if (Math.random() < 0.85) { // 85% chance to create lightning each interval (increased from 70%)
        createLightningBolt();
      }
    }, 1000 + Math.random() * 1500); // 1-2.5 seconds interval (reduced from 2-5)
    
    // Initial bolts with delay - create multiple
    setTimeout(() => {
      createLightningBolt();
      setTimeout(() => createLightningBolt(), 500);
      setTimeout(() => createLightningBolt(), 1000);
    }, 500);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(interval);
    };
  }, []);

  // Convert lightning data to SVG path
  const branchToPath = (branch: Branch): string => {
    if (branch.points.length < 2) return '';
    
    return branch.points.reduce((path, point, index) => {
      if (index === 0) return `M${point.x},${point.y}`;
      return `${path} L${point.x},${point.y}`;
    }, '');
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden opacity-70">
      {bolts.map(bolt => {
        const age = Date.now() - bolt.createdAt;
        const opacity = Math.min(1, Math.min(age / 1000, (bolt.lifespan - age) / 1000));
        
        return (
          <div
            key={bolt.id}
            className="absolute"
            style={{
              left: bolt.position.x,
              top: bolt.position.y,
              opacity
            }}
          >
            <svg width="500" height="800" viewBox="-250 -100 500 800" fill="none">
              {bolt.branches.map(branch => {
                const path = branchToPath(branch);
                if (!path) return null;
                
                return (
                  <g key={branch.id} opacity={branch.opacity}>
                    {/* Outer glow */}
                    <path
                      d={path}
                      stroke={branch.color}
                      strokeWidth={branch.width * 4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'blur(8px)' }}
                      opacity="0.3"
                    />
                    
                    {/* Inner glow */}
                    <path
                      d={path}
                      stroke={branch.color}
                      strokeWidth={branch.width * 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'blur(4px)' }}
                      opacity="0.5"
                    />
                    
                    {/* Core */}
                    <path
                      d={path}
                      stroke={branch.color}
                      strokeWidth={branch.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        );
      })}
    </div>
  );
} 