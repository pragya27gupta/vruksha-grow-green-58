import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Square, RotateCcw, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCameraScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanResult: (result: string) => void;
}

export const QRCameraScanner: React.FC<QRCameraScannerProps> = ({
  open,
  onOpenChange,
  onScanResult
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, facingMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsScanning(true);
        startScanning();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = window.setInterval(() => {
      captureFrame();
    }, 1000); // Scan every second
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simulate QR detection (in a real implementation, you'd use a QR library here)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrResult = simulateQRDetection(imageData);
    
    if (qrResult) {
      handleScanSuccess(qrResult);
    }
  };

  const simulateQRDetection = (imageData: ImageData): string | null => {
    // This is a simulation - in reality, you'd use a QR detection library
    // For demo purposes, we'll randomly return a QR code after a few seconds
    const randomChance = Math.random();
    if (randomChance > 0.95) { // 5% chance per scan attempt
      return 'VRC001'; // Simulate finding the demo QR code
    }
    return null;
  };

  const handleScanSuccess = (result: string) => {
    stopCamera();
    onScanResult(result);
    onOpenChange(false);
    toast({
      title: "QR Code Detected!",
      description: `Product ID: ${result}`
    });
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const handleManualCapture = () => {
    // Simulate successful scan for demo
    handleScanSuccess('VRC001');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
          <DialogDescription>
            Position the QR code within the camera frame
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg animate-pulse" />
                    <div className="absolute inset-0 border-4 border-transparent">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br" />
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-xs">{isScanning ? 'Scanning...' : 'Camera Off'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3">
            <Button 
              onClick={switchCamera}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Switch Camera
            </Button>
            
            <Button 
              onClick={handleManualCapture}
              size="sm"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Capture (Demo)
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>📱 Position the QR code clearly within the frame</p>
            <p>💡 Ensure good lighting for best results</p>
            <p>🔄 Use "Capture (Demo)" button for demo mode</p>
          </div>

          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};