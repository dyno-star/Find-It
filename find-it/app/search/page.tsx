"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navbar";

interface Item {
  id: string;
  image: string;
  description: string;
  tags: string[];
  location: string;
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const tagSuggestions = ["Keys", "Wallet", "Phone", "Laptop", "Book", "Glasses", "Umbrella"];

  useEffect(() => {
    // Fetch items (mock API call)
    const fetchItems = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag));
    const matchesLocation = !location || item.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesTags && matchesLocation;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto fade-in">
          <h1 className="text-3xl font-bold mb-8 text-center">Search for Lost Items</h1>

          {/* Search and Filters */}
          <div className="bg-card-bg p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium mb-2">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-border rounded focus:ring-primary focus:border-primary"
                  placeholder="Search by description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-background border border-border text-secondary hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-border rounded focus:ring-primary focus:border-primary"
                  placeholder="e.g., Library, Cafeteria"
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length === 0 ? (
              <p className="text-center text-secondary col-span-full">
                No items found. Try adjusting your filters.
              </p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.description}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.description}</h3>
                    <p className="text-secondary">Found at: {item.location}</p>
                    <p className="text-sm mt-2">Tags: {item.tags.join(", ")}</p>
                    <Link
                      href={`/item/${item.id}`}
                      className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}