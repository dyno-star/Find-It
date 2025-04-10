// components/Navbar.js
window.AppComponents = window.AppComponents || {};

window.AppComponents.Navbar = ({ setPage, currentPage }) => (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Find-It</h1>
                <div className="flex space-x-6">
                    {['Home', 'Post', 'Search', 'About'].map(page => (
                        <button
                            key={page}
                            onClick={() => setPage(page.toLowerCase())}
                            className={`font-medium transition-colors duration-200 ${
                                currentPage === page.toLowerCase() 
                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                    : 'text-gray-700 hover:text-blue-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </nav>
);