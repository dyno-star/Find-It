import { LostItemForm } from '../components/LostItemForm';
import { Item } from '../types/Item';
import { Navbar } from '../components/Navbar';

export const Post = () => {
  const handleSubmit = (item: Item) => {
    console.log('Submitted item:', item);
    // Add logic to save the item (e.g., API call)
  };

  return (
    <div className="post-page">
      <Navbar />
      <div className="content">
        <LostItemForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};