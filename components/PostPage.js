window.AppComponents = window.AppComponents || {};

window.AppComponents.PostPage = ({ 
    currentPhoto, 
    setCurrentPhoto, 
    formData, 
    setFormData, 
    errors, 
    setErrors, 
    editingItem, 
    setEditingItem, 
    handlePost 
}) => {
    const validateForm = () => {
        const newErrors = {};
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onPost = () => {
        if (!currentPhoto || !validateForm()) return;
        handlePost();
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingItem ? 'Edit Item' : 'Report Found Item'}
            </h2>
            <window.AppComponents.CameraCapture onCapture={setCurrentPhoto} />
            {currentPhoto && (
                <div className="mt-6 space-y-4">
                    <img src={currentPhoto} alt="Preview" className="w-full max-w-sm mx-auto rounded-lg shadow-md" />
                    <div>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Item description"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Found location"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                    </div>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-300"
                    >
                        <option value="General">General</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Jewelry">Jewelry</option>
                    </select>
                    <div className="flex space-x-4">
                        <button
                            onClick={onPost}
                            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                        >
                            {editingItem ? 'Update Item' : 'Post Item'}
                        </button>
                        {editingItem && (
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setCurrentPhoto(null);
                                    setFormData({ description: '', location: '', category: 'General' });
                                    setErrors({});
                                }}
                                className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};