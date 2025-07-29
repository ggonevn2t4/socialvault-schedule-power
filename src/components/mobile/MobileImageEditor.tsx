import { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCw, Move, ZoomIn, ZoomOut, Crop, Download, X, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-mobile';

interface MobileImageEditorProps {
  imageBlob: Blob;
  onSave: (editedBlob: Blob) => void;
  onClose: () => void;
}

interface Transform {
  scale: number;
  rotation: number;
  x: number;
  y: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MobileImageEditor({ imageBlob, onSave, onClose }: MobileImageEditorProps) {
  const [transform, setTransform] = useState<Transform>({ scale: 1, rotation: 0, x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const haptic = useHapticFeedback();

  useEffect(() => {
    const url = URL.createObjectURL(imageBlob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageBlob]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      haptic.light();
    } else if (e.touches.length === 2) {
      // Handle pinch gesture for zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastTouch({ x: distance, y: 0 });
    }
  }, [haptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging && lastTouch) {
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && lastTouch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = distance / lastTouch.x;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale * scale))
      }));
      
      setLastTouch({ x: distance, y: 0 });
    }
  }, [isDragging, lastTouch]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouch(null);
  }, []);

  const rotate = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    haptic.medium();
  };

  const resetTransform = () => {
    setTransform({ scale: 1, rotation: 0, x: 0, y: 0 });
    haptic.light();
  };

  const startCrop = () => {
    setIsCropping(true);
    setCropArea({ x: 50, y: 50, width: 200, height: 200 });
    haptic.medium();
  };

  const removeBackground = async () => {
    setIsProcessing(true);
    haptic.heavy();
    
    try {
      // Load the background removal function dynamically
      const { removeBackground: removeBg, loadImage } = await import('@/utils/backgroundRemoval');
      const imageElement = await loadImage(imageBlob);
      const processedBlob = await removeBg(imageElement);
      
      // Update the image
      const newUrl = URL.createObjectURL(processedBlob);
      setImageUrl(newUrl);
      haptic.heavy();
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveImage = async () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale, transform.scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.translate(transform.x, transform.y);
    
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    
    // Apply crop if active
    if (cropArea) {
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      
      if (croppedCtx) {
        croppedCanvas.width = cropArea.width;
        croppedCanvas.height = cropArea.height;
        croppedCtx.drawImage(
          canvas, 
          cropArea.x, cropArea.y, cropArea.width, cropArea.height,
          0, 0, cropArea.width, cropArea.height
        );
        
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            onSave(blob);
            haptic.heavy();
          }
        }, 'image/jpeg', 0.9);
        return;
      }
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
        haptic.heavy();
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          <X className="h-5 w-5" />
        </Button>
        <h2 className="text-white font-semibold">Edit Image</h2>
        <Button variant="ghost" size="sm" onClick={saveImage} className="text-white">
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Edit"
          className={cn(
            "absolute inset-0 m-auto max-w-full max-h-full object-contain transition-transform duration-200",
            isDragging && "transition-none"
          )}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`
          }}
        />
        
        {/* Crop Overlay */}
        {isCropping && cropArea && (
          <div
            className="absolute border-2 border-white bg-transparent"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
              boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)'
            }}
          >
            {/* Crop handles */}
            <div className="absolute w-4 h-4 bg-white -top-2 -left-2 rounded-full" />
            <div className="absolute w-4 h-4 bg-white -top-2 -right-2 rounded-full" />
            <div className="absolute w-4 h-4 bg-white -bottom-2 -left-2 rounded-full" />
            <div className="absolute w-4 h-4 bg-white -bottom-2 -right-2 rounded-full" />
          </div>
        )}
        
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p>Processing image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="bg-black/90 p-4 space-y-4">
        {/* Zoom Slider */}
        <div className="flex items-center space-x-4">
          <ZoomOut className="h-5 w-5 text-white" />
          <Slider
            value={[transform.scale]}
            onValueChange={([value]) => setTransform(prev => ({ ...prev, scale: value }))}
            min={0.5}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="h-5 w-5 text-white" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around">
          <Button
            variant="ghost"
            size="lg"
            onClick={rotate}
            className="text-white hover:bg-white/20 flex-col h-16"
          >
            <RotateCw className="h-6 w-6 mb-1" />
            <span className="text-xs">Rotate</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={startCrop}
            className={cn(
              "text-white hover:bg-white/20 flex-col h-16",
              isCropping && "bg-white/20"
            )}
          >
            <Crop className="h-6 w-6 mb-1" />
            <span className="text-xs">Crop</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={removeBackground}
            disabled={isProcessing}
            className="text-white hover:bg-white/20 flex-col h-16"
          >
            <Wand2 className="h-6 w-6 mb-1" />
            <span className="text-xs">Remove BG</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={resetTransform}
            className="text-white hover:bg-white/20 flex-col h-16"
          >
            <Move className="h-6 w-6 mb-1" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}