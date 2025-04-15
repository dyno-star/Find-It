import { SearchItems } from '../components/SearchItems';
import { Modal } from '../components/Modal';
import { Navbar } from '../components/Navbar';
import { Item } from '../types/Item';
import { useState } from 'react';

export const Search = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleEdit = (item: Item) => {
    console.log('Edit item:', item);
    // Add edit logic
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleView = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="content">
        <SearchItems
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </div>
  );
};