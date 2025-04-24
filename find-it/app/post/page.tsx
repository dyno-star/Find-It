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

  // Check camera availability
  const checkCameraAvailability = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return "Camera is not supported in this browser.";
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      if (!hasCamera) {
        return "No camera found on this device.";
      }
      return null;
    } catch {
      return "Unable to check camera availability.";
    }
  };

  // Start camera
  const startCamera = async () => {
    setIsCameraLoading(true);
    setError(null);
    setCameraError(null);

    const availabilityError = await checkCameraAvailability();
    if (availabilityError) {
      setCameraError(availabilityError);
      setIsCameraLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {
            setCameraError("Failed to start camera feed. Please try again.");
            setIsCameraActive(false);
            setIsCameraLoading(false);
          });
          setIsCameraActive(true);
          setIsCameraLoading(false);
        };
        streamRef.current = stream;
      }
    } catch (err: any) {
      let errorMessage = "Failed to access camera.";
      if (err.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera access in your browser settings and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found on this device. Please try uploading an image.";
      } else {
        errorMessage = `Camera error: ${err.message}. Please try again or upload an image.`;
      }
      setCameraError(errorMessage);
      setIsCameraActive(false);
      setIsCameraLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsCameraLoading(false);
    setCameraError(null);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
        setImagePreview(imageData);
        setFormData((prev) => ({ ...prev, image: imageData }));
        stopCamera();
      }
    }
  };

  // Handle file upload (fallback)
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

            {/* Camera Capture */}
            <div>
              <label className="block text-sm font-medium mb-2">Item Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {!isCameraActive && !imagePreview && !isCameraLoading && !cameraError && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="cursor-pointer inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                    >
                      Use Camera
                    </button>
                    <div className="text-sm text-secondary">or</div>
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
                )}
                {isCameraLoading && (
                  <div className="text-secondary">Loading camera...</div>
                )}
                {cameraError && (
                  <div className="space-y-4">
                    <p className="text-error">{cameraError}</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                    >
                      Retry Camera
                    </button>
                    <div className="text-sm text-secondary">or</div>
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
                    <p className="mt-4 text-sm text-secondary">
                      To enable camera access, check your browser's address bar or settings and allow camera permissions.
                    </p>
                  </div>
                )}
                {isCameraActive && (
                  <div className="space-y-4">
                    <video ref={videoRef} autoPlay className="w-full max-w-md mx-auto rounded" />
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