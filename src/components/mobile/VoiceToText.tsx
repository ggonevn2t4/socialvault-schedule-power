import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-mobile';

interface VoiceToTextProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceToText({ onTranscript, placeholder = "Tap to speak...", className }: VoiceToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  
  const haptic = useHapticFeedback();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
          haptic.light();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        stopVolumeMonitoring();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopVolumeMonitoring();
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopVolumeMonitoring();
    };
  }, [onTranscript, haptic]);

  const startVolumeMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setVolume(average / 255);
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVolumeMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setVolume(0);
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    setIsListening(true);
    setTranscript('');
    recognitionRef.current.start();
    startVolumeMonitoring();
    haptic.medium();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    stopVolumeMonitoring();
    haptic.light();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className={cn("flex items-center justify-center p-4 text-muted-foreground", className)}>
        <MicOff className="h-5 w-5 mr-2" />
        <span className="text-sm">Speech recognition not supported</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Voice Visualization */}
      <div className="flex items-center justify-center space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 bg-primary rounded-full transition-all duration-100",
                isListening 
                  ? "animate-pulse" 
                  : "opacity-30"
              )}
              style={{
                height: isListening 
                  ? `${Math.max(8, volume * 40 + Math.random() * 10)}px`
                  : '8px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-foreground">{transcript}</p>
          {confidence > 0 && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-background rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-200"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Control Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isListening ? "destructive" : "default"}
          onClick={toggleListening}
          className={cn(
            "h-16 w-16 rounded-full transition-all duration-200",
            isListening && "animate-pulse shadow-lg scale-110"
          )}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isListening 
            ? "Listening... Tap to stop" 
            : placeholder
          }
        </p>
      </div>
    </div>
  );
}