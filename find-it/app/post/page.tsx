"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navbar";

interface Item {
  image: string;
  description: string;
  tags: string[];
  location: string;
}

const tagExamples = [
  "Keys", "Wallet", "Phone", "Laptop", "Book", "Glasses", "Umbrella",
  "Backpack", "ID Card", "Headphones", "Charger", "Watch", "Jewelry", "Clothing", "Water Bottle"
];

export default function Post() {
  const [formData, setFormData] = useState<Item>({
    image: "",
    description: "",
    tags: [],
    location: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for camera support
  const [isCameraSupported, setIsCameraSupported] = useState<boolean | null>(null);
  
  // Check browser support for camera on component mount
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log("Camera API is not supported in this browser");
          setIsCameraSupported(false);
          return;
        }
        
        // Try to enumerate devices to check for cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        
        console.log(`Camera support: ${hasVideoDevice ? "Available" : "Not available"}`);
        setIsCameraSupported(hasVideoDevice);
      } catch (err) {
        console.error("Error checking camera support:", err);
        // If there's an error, assume camera might be supported
        setIsCameraSupported(true);
      }
    };
    
    checkCameraSupport();
  }, []);

  // Start camera with improved error handling and timeout management
  const startCamera = async () => {
    setIsCameraLoading(true);
    setError(null);
    setCameraError(null);

    // Clear any existing timeout
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
    }

    // Set a new timeout for camera loading
    cameraTimeoutRef.current = setTimeout(() => {
      if (isCameraLoading) {
        stopCamera();
        setCameraError("Camera took too long to load. Please try again or upload an image.");
      }
    }, 10000); // 10 seconds timeout

    try {
      console.log("Requesting camera access...");
      
      // First check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser");
      }
      
      // List available devices to help with debugging
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log(`Found ${videoDevices.length} camera devices:`, videoDevices);
      
      // Request camera access with fallback options
      const constraints = {
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: { ideal: "environment" }
        }
      };
      
      console.log("Requesting media with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained successfully");
      
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error("No video track found in media stream");
      }
      
      console.log("Using camera:", videoTracks[0].label);
      
      if (videoRef.current) {
        // Ensure video element is properly initialized
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        videoRef.current.srcObject = stream;
        
        console.log("Video element initialized with stream");
        
        // Add a loadeddata event which is more reliable than loadedmetadata
        videoRef.current.onloadeddata = () => {
          console.log("Video data loaded");
          
          if (videoRef.current) {
            console.log("Attempting to play video");
            
            // Force a repaint to help with iOS Safari
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play()
                  .then(() => {
                    console.log("Video playback started successfully");
                    setIsCameraActive(true);
                    setIsCameraLoading(false);
                    
                    // Clear the timeout since camera loaded successfully
                    if (cameraTimeoutRef.current) {
                      clearTimeout(cameraTimeoutRef.current);
                      cameraTimeoutRef.current = null;
                    }
                  })
                  .catch((err) => {
                    console.error("Camera play error:", err);
                    setCameraError(`Failed to start video stream: ${err.message}. Please try again or upload an image.`);
                    stopCamera();
                  });
              }
            }, 100);
          }
        };
        
        // Handle various video events
        videoRef.current.onloadedmetadata = () => console.log("Video metadata loaded");
        videoRef.current.oncanplay = () => console.log("Video can play");
        videoRef.current.onplay = () => console.log("Video play event fired");
        
        // Handle video errors more specifically
        videoRef.current.onerror = (e) => {
          console.error("Video element error:", e);
          setCameraError(`Video playback error: ${videoRef.current?.error?.message || "Unknown error"}. Please try again.`);
          stopCamera();
        };
        
        streamRef.current = stream;
      } else {
        throw new Error("Video element reference is not available");
      }
    } catch (err: any) {
      // Clear the timeout since we already have an error
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
        cameraTimeoutRef.current = null;
      }
      
      console.error("Camera access error:", err);
      
      let errorMessage = "Failed to access camera.";
      
      if (err.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found on this device. Please try uploading an image instead.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application. Please close other apps using the camera.";
      } else if (err.name === "AbortError") {
        errorMessage = "Camera access was aborted. Please try again.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Your camera doesn't support the requested resolution. Please try again with different settings.";
      } else if (err.name === "SecurityError") {
        errorMessage = "Camera access is blocked due to security restrictions in your browser.";
      } else if (err.name === "TypeError") {
        errorMessage = "Camera constraints are not supported by your browser.";
      } else {
        errorMessage = `Camera error: ${err.message || err.name}. Please try uploading an image instead.`;
      }
      
      setCameraError(errorMessage);
      stopCamera();
    }
  };

  // Stop camera with improved cleanup
  const stopCamera = () => {
    console.log("Stopping camera...");
    
    // Clean up the video element
    if (videoRef.current) {
      console.log("Cleaning up video element");
      // Important: set srcObject to null before removing event listeners
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      
      // Remove all event handlers
      videoRef.current.onloadeddata = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.oncanplay = null;
      videoRef.current.onplay = null;
      videoRef.current.onerror = null;
    }
    
    // Stop all media tracks
    if (streamRef.current) {
      console.log("Stopping all media tracks");
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        console.log(`Stopping track: ${track.kind} (${track.label})`);
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Clear any pending timeout
    if (cameraTimeoutRef.current) {
      console.log("Clearing camera timeout");
      clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }
    
    setIsCameraActive(false);
    setIsCameraLoading(false);
  };

  // Capture photo with better error handling
  const capturePhoto = () => {
    try {
      console.log("Capturing photo...");
      
      if (!videoRef.current) {
        console.error("Video reference is null when trying to capture");
        setError("Cannot capture photo: video element not found");
        return;
      }
      
      if (!canvasRef.current) {
        console.error("Canvas reference is null when trying to capture");
        setError("Cannot capture photo: canvas element not found");
        return;
      }
      
      // Make sure video is playing
      if (videoRef.current.paused || videoRef.current.ended) {
        console.error("Cannot capture - video is paused or ended");
        setError("Cannot capture photo: video is not playing");
        return;
      }
      
      // Get video dimensions
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      if (videoWidth === 0 || videoHeight === 0) {
        console.error("Video dimensions are invalid:", videoWidth, videoHeight);
        setError("Cannot capture photo: invalid video dimensions");
        return;
      }
      
      console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
      
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        console.error("Failed to get canvas context");
        setError("Cannot capture photo: unable to get drawing context");
        return;
      }
      
      // Set canvas dimensions to match video
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      
      // Draw the video frame to the canvas
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      console.log("Video frame drawn to canvas");
      
      // Convert canvas to image data
      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
      console.log("Canvas converted to JPEG data URL");
      
      // Update state with the captured image
      setImagePreview(imageData);
      setFormData((prev) => ({ ...prev, image: imageData }));
      
      // Stop the camera
      stopCamera();
      
      console.log("Photo captured successfully");
    } catch (err) {
      console.error("Error capturing photo:", err);
      setError(`Failed to capture photo: ${err instanceof Error ? err.message : "unknown error"}`);
      stopCamera();
    }
  };

  // Handle file upload (gallery or file system)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag input
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !formData.tags.includes(trimmedTag) &&
      trimmedTag.length <= 20 &&
      formData.tags.length < 10
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleTagClick = (tag: string) => {
    addTag(tag);
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.image || !formData.description || !formData.location || formData.tags.length === 0) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to post item");
      }

      // Reset form
      setFormData({ image: "", description: "", tags: [], location: "" });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Item posted successfully!");
    } catch (err) {
      setError("Failed to post item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto fade-in">
          <h1 className="text-3xl font-bold mb-8 text-center">Post a Found Item</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-card-bg p-8 rounded-lg shadow-md">
            {error && (
              <div className="bg-error/10 border border-error text-error p-4 rounded">
                {error}
              </div>
            )}

            {/* Image Capture/Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Item Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {!isCameraActive && !imagePreview && !isCameraLoading && !cameraError && (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                      {isCameraSupported !== false && (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="cursor-pointer inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                        >
                          Take Photo
                        </button>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          ref={fileInputRef}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center justify-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/80 transition-colors"
                        >
                          Upload Image
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-secondary">
                      {isCameraSupported === false 
                        ? "Camera not supported on this device. Please upload an image from your device." 
                        : "Take a photo with your camera or upload an image from your device."}
                    </p>
                  </div>
                )}
                {isCameraLoading && (
                  <div className="text-secondary flex flex-col items-center justify-center space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading camera...</span>
                    </div>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-sm text-error hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {cameraError && (
                  <div className="space-y-4">
                    <p className="text-error">{cameraError}</p>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                      >
                        Retry Camera
                      </button>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          ref={fileInputRef}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center justify-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/80 transition-colors"
                        >
                          Upload Image
                        </label>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-secondary">
                      To enable camera access, check your browser's address bar or settings and allow camera permissions.
                    </p>
                  </div>
                )}
                {isCameraActive && (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full max-w-md mx-auto rounded bg-gray-100" 
                        style={{ minHeight: "240px" }}
                      />
                      {/* Video loading indicator */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="p-4 bg-white/70 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-600">
                            {videoRef.current && videoRef.current.readyState < 2 
                              ? "Initializing camera..." 
                              : "Camera active"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="inline-flex items-center justify-center bg-error text-white px-4 py-2 rounded hover:bg-error/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="mx-auto rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="mt-2 text-sm text-error hover:underline"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-border rounded focus:ring-primary focus:border-primary"
                rows={4}
                placeholder="Describe the item (e.g., color, brand, condition)"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                className="w-full p-3 border border-border rounded focus:ring-primary focus:border-primary"
                placeholder="Enter tags (e.g., Keys, Blue, Library) and press Enter or comma"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-sm text-secondary mb-1">Example tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tagExamples.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1 rounded-full text-sm bg-background border border-border text-secondary hover:bg-gray-100"
                      disabled={formData.tags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location Found
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-border rounded focus:ring-primary focus:border-primary"
                placeholder="e.g., Library, Cafeteria"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-border rounded text-secondary hover:bg-gray-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
              >
                Post Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}