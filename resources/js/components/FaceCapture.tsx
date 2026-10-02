import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, CheckCircle, User } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';

interface FaceCaptureProps {
  onCapture: (imageData: string, descriptor?: number[]) => void;
  onClose: () => void;
  mode?: 'register' | 'verify';
}

export default function FaceCapture({ onCapture, onClose, mode = 'register' }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [showFaceGuide, setShowFaceGuide] = useState(false);
  const lastBlinkTime = useRef(0);
  const blinkThreshold = 150; // ms

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);

        // Use absolute URL to Laravel backend - determine port based on environment
        // In development, Vite is on 5173/5174, Laravel is on 8000
        const isDev = window.location.port === '5173' || window.location.port === '5174';
        const LARAVEL_URL = isDev ? 'http://127.0.0.1:8000' : window.location.origin;
        const MODEL_PATH = `${LARAVEL_URL}/storage/models`;

        console.log('Loading models from:', MODEL_PATH);

        // Load all models needed
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH);
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_PATH);

        // Load face recognition model for descriptor extraction (only in register mode)
        if (mode === 'register') {
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH);
        }

        console.log('✅ All models loaded successfully!');
        setModelsLoaded(true);
        setError(null);
        setIsLoading(false);

      } catch (err: any) {
        console.error('Model loading error:', err);
        setError('Gagal memuat model deteksi wajah. Error: ' + (err.message || 'Unknown error'));
        setIsLoading(false);
      }
    };
    loadModels();
  }, [mode]);

  // Start camera
  useEffect(() => {
    if (!modelsLoaded) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Kamera tidak tersedia atau izin ditolak');
      }
    };
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [modelsLoaded]);

  // Face detection and blink detection
  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) return;

    const video = videoRef.current;
    let animationId: number;

    const detectFace = async () => {
      if (video.paused || video.ended) {
        animationId = requestAnimationFrame(detectFace);
        return;
      }

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5
      });

      const detection = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks(true);

      if (detection) {
        setIsReady(true);

        // Blink detection
        const landmarks = detection.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);
        const ear = (leftEAR + rightEAR) / 2;

        const now = Date.now();
        // Stricter threshold to reduce false positives
        if (ear < 0.22 && now - lastBlinkTime.current > 400) {
          console.log('Blink detected! EAR:', ear.toFixed(3));
          setBlinkCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 2 && !blinkDetected) {
              console.log('✅ Liveness verified! Blinks:', newCount);
              setBlinkDetected(true);
            }
            return newCount;
          });
          lastBlinkTime.current = now;
        }
      } else {
        setIsReady(false);
      }

      animationId = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [modelsLoaded, blinkDetected]);

  // Calculate Eye Aspect Ratio
  const calculateEAR = (eye: faceapi.Point[]) => {
    const vertical1 = Math.sqrt(
      Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
    );
    const vertical2 = Math.sqrt(
      Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
    );
    const horizontal = Math.sqrt(
      Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
    );
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCaptured(true);

      // Extract face descriptor for verification
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5
      });

      const detection = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      let descriptor: number[] | undefined;
      if (detection) {
        descriptor = Array.from(detection.descriptor);
        console.log('Face descriptor extracted, length:', descriptor.length);
      }

      // Pass image data and descriptor to parent
      onCapture(imageData, descriptor);
    }
  };

  const retake = () => {
    setCaptured(false);
    setBlinkCount(0);
    setBlinkDetected(false);
  };

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isReady && modelsLoaded ? 'opacity-50' : ''}`}
        />

        {/* Face guide overlay */}
        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-4 border-green-500 rounded-full opacity-50" />
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2" />
              <p>Memuat model deteksi wajah...</p>
            </div>
          </div>
        )}

      {/* Blink counter */}
      <div className="absolute top-4 right-4 bg-black/50 rounded-lg px-3 py-1">
        <span className="text-white text-sm">
          {isReady ? (
            <span className="text-green-400">Wajah Terdeteksi ✓</span>
          ) : (
            <span>Posisikan wajah Anda</span>
          )}
        </span>
      </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!modelsLoaded && !error && (
        <div className="text-center text-gray-500">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Memuat kamera...</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        {isReady ? (
          <p className="text-green-600">✅ Wajah terdeteksi! Silakan ambil foto</p>
        ) : (
          <p>Posisikan wajah Anda dalam frame</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Batal
        </Button>
        {captured ? (
          <Button variant="outline" onClick={retake} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Ambil Ulang
          </Button>
        ) : (
          <Button
            onClick={capturePhoto}
            disabled={!isReady}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Ambil Foto
          </Button>
        )}
      </div>
    </div>
  );
}
