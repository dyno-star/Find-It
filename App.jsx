// app.js
window.AppComponents = window.AppComponents || {};

const App = () => {
    const [foundItems, setFoundItems] = React.useState(() => JSON.parse(localStorage.getItem('foundItems')) || []);
    const [currentPhoto, setCurrentPhoto] = React.useState(null);
    const [formData, setFormData] = React.useState({ description: '', location: '', category: 'General' });
    const [searchTerm, setSearchTerm] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [page, setPage] = React.useState('home');
    const [editingItem, setEditingItem] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('foundItems', JSON.stringify(foundItems));
    }, [foundItems]);

    const handlePost = () => {
        if (editingItem) {
            setFoundItems(foundItems.map(item =>
                item.id === editingItem.id ? { ...item, ...formData, photo: currentPhoto } : item
            ));
            setEditingItem(null);
        } else {
            const newItem = {
                id: Date.now(),
                photo: currentPhoto,
                ...formData,
                timestamp: Date.now()
            };
            setFoundItems([newItem, ...foundItems]);
        }
        setCurrentPhoto(null);
        setFormData({ description: '', location: '', category: 'General' });
        setErrors({});
        setPage('home');
    };

    const handleDelete = (id) => setFoundItems(foundItems.filter(item => item.id !== id));
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ description: item.description, location: item.location, category: item.category });
        setCurrentPhoto(item.photo);
        setPage('post');
    };

    const filteredItems = foundItems.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const PageComponent = {
        home: <window.AppComponents.HomePage setPage={setPage} filteredItems={filteredItems} handleDelete={handleDelete} handleEdit={handleEdit} />,
        post: <window.AppComponents.PostPage currentPhoto={currentPhoto} setCurrentPhoto={setCurrentPhoto} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} editingItem={editingItem} setEditingItem={setEditingItem} handlePost={handlePost} />,
        search: <window.AppComponents.SearchPage filteredItems={filteredItems} setSearchTerm={setSearchTerm} searchTerm={searchTerm} handleDelete={handleDelete} handleEdit={handleEdit} />,
        about: <window.AppComponents.AboutPage />
    }[page];

    return (
        <div>
            <window.AppComponents.Navbar setPage={setPage} currentPage={page} />
            <main className="max-w-5xl mx-auto px-4 py-8">{PageComponent}</main>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);