
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface CreatorSectionProps {
  name: string;
  title: string;
  bio: string;
  imageSrc?: string;
  badges?: string[];
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  className?: string;
}

export const CreatorSection: React.FC<CreatorSectionProps> = ({
  name,
  title,
  bio,
  imageSrc,
  badges = [],
  socialLinks = {},
  className
}) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          About the Creator
        </h2>
        
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {imageSrc && (
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-jarvis to-purple-600 p-1">
                <img 
                  src={imageSrc} 
                  alt={name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            )}
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white">{name}</h3>
                <p className="text-jarvis">{title}</p>
              </div>
              
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {badges.map((badge, index) => (
                    <Badge key={index} className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-gray-300 leading-relaxed">{bio}</p>
              
              {Object.keys(socialLinks).length > 0 && (
                <div className="flex gap-4 justify-center md:justify-start">
                  {socialLinks.github && (
                    <a 
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a 
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a 
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
