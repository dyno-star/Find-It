const AboutPage = () => (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">About Find-It</h2>
        <p className="text-gray-600">
            This application is designed to help you reunite lost items with their owners. Whether on campus or elsewhere, our goal is to make lost and found simple and effective.
        </p>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Post items with photos using your webcam</li>
                <li>Search by description, location, or category</li>
                <li>Edit or delete your posts</li>
                <li>Persistent storage in your browser</li>
                <li>Responsive design for all devices</li>
            </ul>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h3>
            <p className="text-gray-600">
                Navigate using the top bar. Post items from "Post", search for lost items in "Search", or return to "Home" to see recent posts.
            </p>
        </div>
        <p className="text-gray-600 text-sm">
            Built with React and Tailwind CSS by xAI, April 2025.
        </p>
    </div>
);