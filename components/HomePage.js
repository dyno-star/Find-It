// components/HomePage.js
window.AppComponents = window.AppComponents || {};

window.AppComponents.HomePage = ({ setPage, filteredItems, handleDelete, handleEdit }) => (
    <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome</h2>
            <p className="text-gray-600 mb-4">
                Help reunite lost items with their owners! Post found items or search for something you've lost.
            </p>
            <div className="flex space-x-4">
                <button
                    onClick={() => setPage('post')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                    Post an Item
                </button>
                <button
                    onClick={() => setPage('search')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                    Search Items
                </button>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Recent Items</h2>
            {filteredItems.length === 0 ? (
                <p className="text-white text-center">No items posted yet</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.slice(0, 4).map(item => (
                        <window.AppComponents.FoundItem 
                            key={item.id} 
                            item={item} 
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
);