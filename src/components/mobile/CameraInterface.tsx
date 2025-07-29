import React, { useState, useRef, useCallback } from 'react';
import { Camera, Mic, Image, Video, X, FlipHorizontal, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-mobile';

interface CameraInterfaceProps {
  onPhotoCapture: (blob: Blob) => void;
  onVideoCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function CameraInterface({ onPhotoCapture, onVideoCapture, onClose }: CameraInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPhoto, setIsPhoto] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const haptic = useHapticFeedback();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: !isPhoto
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [facingMode, isPhoto]);

  React.useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    
    // Countdown animation
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      haptic.light();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(0);
    
    haptic.heavy();
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          onPhotoCapture(blob);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onVideoCapture(blob);
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
    haptic.medium();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      haptic.medium();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    haptic.light();
  };

  const switchMode = () => {
    setIsPhoto(!isPhoto);
    haptic.light();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Countdown Overlay */}
      {countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-8xl font-bold animate-pulse">
            {countdown}
          </div>
        </div>
      )}
      
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchCamera}
            className="text-white hover:bg-white/20"
          >
            <FlipHorizontal className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={switchMode}
            className={cn(
              "text-white hover:bg-white/20",
              isPhoto ? "bg-white/20" : ""
            )}
          >
            {isPhoto ? <Camera className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center space-x-8">
          {/* Gallery Button */}
          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 h-16 w-16 rounded-full"
          >
            <Image className="h-6 w-6" />
          </Button>
          
          {/* Capture Button */}
          <Button
            size="lg"
            onClick={isPhoto ? capturePhoto : isRecording ? stopRecording : startRecording}
            className={cn(
              "h-20 w-20 rounded-full border-4 border-white transition-all duration-200",
              isPhoto 
                ? "bg-white hover:bg-gray-200" 
                : isRecording 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                  : "bg-white hover:bg-gray-200"
            )}
            disabled={countdown > 0}
          >
            {isPhoto ? (
              <div className="w-16 h-16 rounded-full bg-black" />
            ) : isRecording ? (
              <div className="w-6 h-6 rounded bg-white" />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-red-500" />
            )}
          </Button>
          
          {/* Switch Mode */}
          <Button
            variant="ghost"
            size="lg"
            onClick={switchMode}
            className="text-white hover:bg-white/20 h-16 w-16 rounded-full"
          >
            {isPhoto ? <Video className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mode Indicator */}
        <div className="flex justify-center mt-4">
          <div className="bg-black/30 rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {isPhoto ? 'PHOTO' : isRecording ? 'RECORDING' : 'VIDEO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}