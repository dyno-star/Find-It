"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/navbar";

interface Item {
  id: string;
  image: string;
  description: string;
  tags: string[];
  location: string;
}

export default function Home() {
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        // Get the 6 most recent items
        setRecentItems(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch recent items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Find It: Reunite with Your Lost Items
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Lost something on campus? Found an item that isn't yours? Use Find It to post, search, and reconnect with lost belongings.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/post"
                className="inline-flex items-center justify-center bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Post a Found Item
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-primary transition-colors"
              >
                Search for Lost Items
              </Link>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card-bg">
          <div className="max-w-7xl mx-auto text-center fade-in">
            <h2 className="text-3xl font-bold mb-6">How Find It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Post Found Items</h3>
                <p className="text-secondary">
                  Found an item? Upload a photo, add a description, and tag it with details like location and category.
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Search for Lost Items</h3>
                <p className="text-secondary">
                  Lost something? Search for your items using tags, keywords, or location.
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Reunite</h3>
                <p className="text-secondary">
                  Connect with the person who found or lost the item to arrange a pickup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto fade-in">
            <h2 className="text-3xl font-bold mb-6 text-center">Recent Found Items</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-secondary">Loading recent items...</p>
              </div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary">No items found yet. Be the first to post a found item!</p>
                <Link
                  href="/post"
                  className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Post a Found Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentItems.map((item) => (
                  <div key={item.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={item.image}
                        alt={item.description}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.description}</h3>
                      <p className="text-secondary text-sm mb-2">Found at: {item.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs text-secondary">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}