
import React, { useRef, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface FaceRecognitionProps {
  onFaceDetected?: (faceData: any) => void;
  onFaceNotDetected?: () => void;
  onError?: (error: string) => void;
  isActive: boolean;
  toggleActive: () => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({
  onFaceDetected,
  onFaceNotDetected,
  onError,
  isActive,
  toggleActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize face recognition
  useEffect(() => {
    if (!isActive) return;
    
    const initFaceDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setCameraPermission('granted');
        }
        
        if (!(window as any).faceapi) {
          toast({
            title: "Face API",
            description: "Loading face recognition capabilities...",
          });
          
          // Simulate face detection for this demo
          setIsInitialized(true);
          setCameraPermission('granted');
          return;
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing face detection:', error);
        onError?.('Failed to initialize face detection');
        toast({
          title: "Error",
          description: "Failed to initialize face detection",
          variant: "destructive"
        });
      }
    };
    
    initFaceDetection();
  }, [isActive, onError]);
  
  // Start webcam when active
  useEffect(() => {
    if (!isActive || !isInitialized) return;
    
    let stream: MediaStream | null = null;
    
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: 640,
            height: 480,
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraPermission('granted');
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setCameraPermission('denied');
        onError?.('Failed to access webcam');
        toast({
          title: "Camera Error",
          description: "Failed to access your camera. Please check permissions.",
          variant: "destructive"
        });
      }
    };
    
    startWebcam();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isInitialized, onError]);
  
  // Detect faces when webcam is active - with stabilization to prevent flicker
  useEffect(() => {
    if (!isActive || !isInitialized || cameraPermission !== 'granted') return;
    
    let animationFrameId: number;
    
    // Use consistent detection status with debounce mechanism
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }
    
    const stableFaceDetection = setInterval(() => {
      // Simulated face detection for demo purposes
      // In a real implementation, we would use face-api.js here
      
      // Simulate face detection with higher probability of success (90%)
      const randomFaceDetection = Math.random() > 0.1; 
      
      if (randomFaceDetection) {
        if (!faceDetected) {
          setFaceDetected(true);
          onFaceDetected?.({
            confidence: 0.95,
            landmarks: {},
            expressions: {
              neutral: 0.8,
              happy: 0.2
            }
          });
        }
        
        // Draw face box on canvas for visualization
        if (canvasRef.current && videoRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            context.strokeStyle = '#33c3f0';
            context.lineWidth = 3;
            
            // Draw simulated face box
            const centerX = canvasRef.current.width / 2;
            const centerY = canvasRef.current.height / 2;
            const boxWidth = 150;
            const boxHeight = 200;
            
            context.strokeRect(
              centerX - boxWidth/2,
              centerY - boxHeight/2,
              boxWidth,
              boxHeight
            );
            
            // Add face detection markers
            context.fillStyle = '#33c3f0';
            context.beginPath();
            context.arc(centerX - 30, centerY - 30, 3, 0, 2 * Math.PI);
            context.fill();
            
            context.beginPath();
            context.arc(centerX + 30, centerY - 30, 3, 0, 2 * Math.PI);
            context.fill();
            
            context.beginPath();
            context.arc(centerX, centerY + 30, 3, 0, 2 * Math.PI);
            context.fill();
          }
        }
      } else if (faceDetected) {
        setFaceDetected(false);
        onFaceNotDetected?.();
        
        // Clear canvas
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      }
    }, 1000); // More stable interval for detection status changes
    
    setDetectionInterval(stableFaceDetection);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, isInitialized, cameraPermission, faceDetected, onFaceDetected, onFaceNotDetected]);
  
  return (
    <div className="relative w-full">
      {isActive && (
        <div className="relative rounded-lg overflow-hidden border border-[#33c3f0]/30 bg-black/20">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width={320}
            height={240}
            className="w-full h-full object-cover"
            style={{ display: cameraPermission === 'granted' ? 'block' : 'none' }}
          />
          <canvas 
            ref={canvasRef}
            width={320}
            height={240}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {cameraPermission === 'pending' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
              <p>Requesting camera permission...</p>
            </div>
          )}
          
          {cameraPermission === 'denied' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
              <p className="mb-2 text-center">Camera access denied. Face recognition requires camera permission.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 bg-[#33c3f0]/20 border-[#33c3f0] text-white"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {faceDetected && (
            <div className="absolute top-2 right-2 bg-[#33c3f0]/80 px-2 py-1 rounded text-xs">
              Face Detected
            </div>
          )}
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleActive}
        className={`mt-2 ${
          isActive 
            ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
            : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
        } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
      >
        {isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
        {isActive ? 'Disable Face Recognition' : 'Enable Face Recognition'}
      </Button>
    </div>
  );
};

export default FaceRecognition;
