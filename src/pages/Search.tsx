import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchItems } from '../components/SearchItems';
import { LostItemForm } from '../components/LostItemForm';
import { Modal } from '../components/Modal';
import { Item } from '../types/Item';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Search = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const storedItems = localStorage.getItem('lostItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
    setLoading(false);
  }, []);

  const handleEdit = (item: Item) => {
    setEditingItem(item);
  };

  const handleUpdate = (updatedItem: Item) => {
    setLoading(true);
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    localStorage.setItem('lostItems', JSON.stringify(updatedItems));
    setEditingItem(null);
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('lostItems', JSON.stringify(updatedItems));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="page loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        {editingItem ? (
          <LostItemForm
            onSubmit={handleUpdate}
            initialItem={editingItem}
            isEdit
          />
        ) : (
          <SearchItems
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={setSelectedItem}
          />
        )}
      </div>
      <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};