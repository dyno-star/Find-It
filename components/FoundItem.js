
window.AppComponents = window.AppComponents || {};

window.AppComponents.FoundItem = ({ item, onDelete, onEdit }) => (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <img src={item.photo} alt={item.description} className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-800">{item.description}</h3>
            <p className="text-gray-600">Location: {item.location}</p>
            <p className="text-gray-500 text-sm">Category: {item.category}</p>
            <p className="text-gray-400 text-xs">Found: {new Date(item.timestamp).toLocaleString()}</p>
            <div className="flex space-x-4">
                <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 text-sm">
                    Edit
                </button>
                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                </button>
            </div>
        </div>
    </div>
);