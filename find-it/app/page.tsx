import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/navbar";

export default function Home() {
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

        {/* Recent Posts Section (Mock) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto fade-in">
            <h2 className="text-3xl font-bold mb-6 text-center">Recent Found Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Lost item"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">Lost Keys</h3>
                    <p className="text-secondary">Found near Library on Apr 20, 2025</p>
                    <p className="text-sm mt-2">Tags: Keys, Silver, Keychain</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}