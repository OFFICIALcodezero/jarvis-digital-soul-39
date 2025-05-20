import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationType?: 'typing' | 'fade' | 'char-by-char';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className,
  delay = 0,
  animationType = 'fade'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Character by character animation effect
  useEffect(() => {
    if (animationType !== 'char-by-char' || !containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    const characters = text.split('');
    characters.forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.opacity = '0';
      span.style.animation = `fade-in 0.2s forwards`;
      span.style.animationDelay = `${delay + (index * 0.05)}s`;
      container.appendChild(span);
    });
  }, [text, delay, animationType]);
  
  // Typing effect animation
  useEffect(() => {
    if (animationType !== 'typing' || !containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    const span = document.createElement('span');
    span.className = 'typing-effect';
    span.style.setProperty('--typing-duration', `${text.length * 0.05}s`);
    span.style.setProperty('--typing-delay', `${delay}s`);
    span.innerText = text;
    
    container.appendChild(span);
  }, [text, delay, animationType]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "overflow-hidden",
        {
          "typing-container": animationType === 'typing',
        }, 
        className
      )}
    >
      {animationType === 'fade' && (
        <p 
          className="animate-fade-in" 
          style={{ animationDelay: `${delay}s` }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export const GradientText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span className={cn("bg-gradient-to-r from-jarvis-purple via-purple-500 to-indigo-400 bg-clip-text text-transparent", className)}>
      {text}
    </span>
  );
};

export const ShimmeringText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span 
      className={cn(
        "relative inline-block", 
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(to right, #9b87f5, #d8b4fe)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundSize: "200% auto",
      }}
    >
      {text}
    </span>
  );
};

export const TypewriterText: React.FC<AnimatedTextProps> = ({ text, className, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    const charDelay = 50; // ms per character
    let i = 0;
    
    setTimeout(() => {
      const typeNextChar = () => {
        if (i < text.length) {
          container.textContent += text.charAt(i);
          i++;
          setTimeout(typeNextChar, charDelay);
        }
      };
      typeNextChar();
    }, delay * 1000);
  }, [text, delay]);
  
  return (
    <div ref={containerRef} className={cn("font-mono", className)}></div>
  );
};

export const GlitchText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <div className={cn("glitch-text relative", className)} data-text={text}>
      <span className="relative z-10 text-white">{text}</span>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .glitch-text {
          position: relative;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #9b87f5;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 #d946ef;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim-1 {
          0%, 100% { clip-path: inset(80% 0 0 0); }
          20% { clip-path: inset(20% 0 80% 0); }
          40% { clip-path: inset(60% 0 20% 0); }
          60% { clip-path: inset(40% 0 40% 0); }
          80% { clip-path: inset(0 0 70% 0); }
        }
        
        @keyframes glitch-anim-2 {
          0%, 100% { clip-path: inset(30% 0 0 0); }
          25% { clip-path: inset(50% 0 20% 0); }
          50% { clip-path: inset(10% 0 70% 0); }
          75% { clip-path: inset(80% 0 10% 0); }
        }
      `}} />
    </div>
  );
};
