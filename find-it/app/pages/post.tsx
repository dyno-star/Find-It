"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Item {
  image: string;
  description: string;
  tags: string[];
  location: string;
}

const tagSuggestions = ["Keys", "Wallet", "Phone", "Laptop", "Book", "Glasses", "Umbrella"];

export default function Post() {
  const [formData, setFormData] = useState<Item>({
    image: "",
    description: "",
    tags: [],
    location: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto fade-in">
        <h1 className="text-3xl font-bold mb-8 text-center">Post a Found Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card-bg p-8 rounded-lg shadow-md">
          {error && (
            <div className="bg-error/10 border border-error text-error p-4 rounded">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
              >
                Upload Image
              </label>
              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="mx-auto rounded object-cover"
                  />
                </div>
              )}
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
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tagSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags.includes(tag)
                      ? "bg-primary text-white"
                      : "bg-background border border-border text-secondary hover:bg-gray-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
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
  );
}