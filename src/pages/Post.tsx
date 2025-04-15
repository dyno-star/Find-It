import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { LostItemForm } from '../components/LostItemForm';
import { Item } from '../types/Item';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Post = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedItems = localStorage.getItem('lostItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
    setLoading(false);
  }, []);

  const handleSubmit = (newItem: Item) => {
    setLoading(true);
    const updatedItems = [...items, newItem];
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
        <LostItemForm onSubmit={handleSubmit} />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};