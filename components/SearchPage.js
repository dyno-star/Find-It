// components/SearchPage.js
window.AppComponents = window.AppComponents || {};

window.AppComponents.SearchPage = ({ filteredItems, setSearchTerm, searchTerm, handleDelete, handleEdit }) => {
    const [categoryFilter, setCategoryFilter] = React.useState('All');
    const filteredByCategory = categoryFilter === 'All' 
        ? filteredItems 
        : filteredItems.filter(item => item.category === categoryFilter);

    return (
        <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Items</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description, location, or category..."
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 mb-4"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                >
                    <option value="All">All Categories</option>
                    <option value="General">General</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Jewelry">Jewelry</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredByCategory.length === 0 ? (
                    <p className="text-white text-center text-lg col-span-full">No items found</p>
                ) : (
                    filteredByCategory.map(item => (
                        <window.AppComponents.FoundItem 
                            key={item.id} 
                            item={item} 
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
};