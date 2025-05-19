
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Volume2, MessageCircle, Zap, Smartphone, User } from 'lucide-react';
import { GradientText } from '@/components/ui/animated-text';
import { FloatingParticles } from '@/components/ui/floating-particle';
import { HeroSection } from '@/components/ui/hero-section';
import { FeatureCard, FeatureShowcase } from '@/components/ui/feature-card';
import { CreatorSection } from '@/components/ui/creator-section';
import { CallToAction } from '@/components/ui/call-to-action';
import { SoundWave, NetworkNodes } from '@/components/ui/visual-elements';
import HeroCore from '@/components/HeroCore';
import JarvisNavigationBar from '@/components/JarvisNavigationBar';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleStartupClick = () => {
    navigate('/startup');
  };
  
  const handleInterfaceClick = () => {
    navigate('/interface');
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
      
      {/* Tech grid background */}
      <div className="fixed inset-0 tech-grid opacity-10 pointer-events-none"></div>
      
      {/* Floating particles for ambient effect */}
      <FloatingParticles className="fixed inset-0" />
      
      {/* Navigation */}
      <JarvisNavigationBar />
      
      {/* Main content */}
      <main className="relative pt-20">
        {/* Hero section */}
        <HeroSection
          title={
            <>
              Introducing <GradientText text="J.A.R.V.I.S" className="leading-tight" />
              <br />
              <span className="text-2xl md:text-3xl font-light text-gray-300">Your Personal AI Assistant</span>
            </>
          }
          subtitle="Powered by advanced artificial intelligence to assist with your daily tasks, provide information, and control your digital environment."
          primaryActionLabel="Get Started"
          primaryActionOnClick={handleStartupClick}
          secondaryActionLabel="Explore Interface"
          secondaryActionOnClick={handleInterfaceClick}
          visual={<HeroCore isAnimating={true} />}
        />
        
        {/* Voice Interaction Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 relative">
                <div className="bg-gradient-to-br from-black/40 to-jarvis/5 p-8 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="flex justify-center mb-8">
                    <SoundWave isActive={true} className="h-16" />
                  </div>
                  <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                    <p className="text-jarvis">"What's the weather like today?"</p>
                    <p className="text-gray-400">Processing voice command...</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <GradientText text="Voice Interaction" />
                </h2>
                <p className="text-lg text-gray-300">
                  Communicate naturally with JARVIS using voice commands. The advanced speech recognition understands context and responds intelligently to your requests.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-jarvis"></div>
                    <span>Natural language processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-jarvis"></div>
                    <span>Context-aware responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-jarvis"></div>
                    <span>Multiple voice profiles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Assistance Features Section */}
        <FeatureShowcase
          title="AI Assistance"
          description="JARVIS provides intelligent assistance across various domains, learning from your interactions to become more helpful over time."
          align="center"
          className="bg-black/30"
        >
          <FeatureCard
            icon={MessageCircle}
            title="Summarize Articles"
            description="Extract key points from lengthy articles and documents, saving you time while keeping you informed."
          />
          <FeatureCard
            icon={Zap}
            title="Smart Recommendations"
            description="Receive personalized suggestions based on your preferences and past interactions."
          />
          <FeatureCard
            icon={Volume2}
            title="Voice Assistant"
            description="Control your digital environment using natural voice commands for a seamless experience."
          />
        </FeatureShowcase>
        
        {/* Automation Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col-reverse md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <GradientText text="Automation" />
                </h2>
                <p className="text-lg text-gray-300">
                  Streamline your workflow with intelligent automation. JARVIS can handle repetitive tasks, schedule events, and coordinate between different systems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-jarvis mb-2">Task Scheduling</h4>
                    <p className="text-sm text-gray-300">Automated reminders and task management to keep you on track.</p>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-jarvis mb-2">Workflow Integration</h4>
                    <p className="text-sm text-gray-300">Connect your tools and services for seamless operation.</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0">
                  <NetworkNodes />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-jarvis to-purple-600 shadow-lg shadow-jarvis/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Control Everything Section */}
        <section className="py-16 md:py-24 bg-black/30 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                <div className="bg-gradient-to-br from-jarvis/10 to-purple-600/10 rounded-xl h-full w-full flex items-center justify-center overflow-hidden border border-white/10">
                  <div className="relative w-full h-full">
                    <div className="absolute top-4 left-4 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-jarvis animate-pulse"></div>
                      <span className="text-sm">Living Room Lights: ON</span>
                    </div>
                    
                    <div className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                      <span className="text-sm">Temperature: 72°F</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm">Security: Armed</span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-sm">Garage Door: Closed</span>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 flex items-center justify-center shadow-xl">
                        <Smartphone className="w-12 h-12 text-jarvis" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <GradientText text="Control Everything" />
                </h2>
                <p className="text-lg text-gray-300">
                  Take command of your digital ecosystem with JARVIS as the central hub. Connect and control all your smart devices and online services.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-jarvis/20 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-jarvis"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Smart Home Integration</h4>
                      <p className="text-sm text-gray-400">Control lights, thermostats, and security systems with simple voice commands.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-jarvis/20 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-jarvis"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Media Control</h4>
                      <p className="text-sm text-gray-400">Play music, videos, and manage your entertainment systems effortlessly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About the Creator Section */}
        <CreatorSection
          name="Tony Stark"
          title="Inventor & AI Enthusiast"
          bio="A passionate technologist with a focus on artificial intelligence and innovative interfaces. JARVIS was created to push the boundaries of what's possible with personal AI assistants, combining cutting-edge technology with intuitive design for a seamless user experience."
          badges={["AI Developer", "UX Designer", "Futurist", "Engineer"]}
          socialLinks={{
            github: "https://github.com",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com"
          }}
        />
        
        {/* Final Call to Action */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <CallToAction
              variant="gradient"
              title="Ready to experience JARVIS?"
              description="Launch the interface and explore the future of AI assistance"
              primaryActionLabel="Get Started Now"
              primaryActionOnClick={handleStartupClick}
              secondaryActionLabel="Learn More"
              secondaryActionOnClick={() => navigate('/features')}
            />
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-black py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-jarvis to-purple-600 flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="text-xl font-bold text-white">JARVIS</span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="mt-6 text-center md:text-left text-xs text-gray-500">
            <p>© {new Date().getFullYear()} JARVIS Digital Soul • All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
