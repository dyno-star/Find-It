import { useState } from 'react';
import { Item } from '../types/Item';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface LostItemFormProps {
  onSubmit: (item: Item) => void;
  initialItem?: Item;
  isEdit?: boolean;
}

export const LostItemForm = ({ onSubmit, initialItem, isEdit = false }: LostItemFormProps) => {
  const [title, setTitle] = useState(initialItem?.title || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [contact, setContact] = useState(initialItem?.contact || '');
  const [category, setCategory] = useState(initialItem?.category || '');
  const [status, setStatus] = useState<Item['status']>(initialItem?.status || 'Lost');
  const [image, setImage] = useState<string | undefined>(initialItem?.image);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!location) newErrors.location = 'Location is required';
    if (!contact) newErrors.contact = 'Contact is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newItem: Item = {
      id: initialItem?.id || uuidv4(),
      title,
      description,
      location,
      date: initialItem?.date || new Date().toISOString().split('T')[0],
      contact,
      category,
      image,
      status,
    };

    onSubmit(newItem);
    toast.success(isEdit ? 'Item updated!' : 'Item posted!');
    if (!isEdit) {
      setTitle('');
      setDescription('');
      setLocation('');
      setContact('');
      setCategory('');
      setStatus('Lost');
      setImage(undefined);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="lost-item-form"
    >
      <h2>{isEdit ? 'Edit Item' : 'Post a Lost Item'}</h2>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Lost Blue Backpack"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the item..."
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Library"
        />
        {errors.location && <span className="error">{errors.location}</span>}
      </div>
      <div className="form-group">
        <label>Contact</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="e.g., email or phone"
        />
        {errors.contact && <span className="error">{errors.contact}</span>}
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {['Electronics', 'Clothing', 'Books', 'Other'].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as Item['status'])}>
          {['Lost', 'Found', 'Claimed'].map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Preview" className="image-preview" />}
      </div>
      <button type="submit">{isEdit ? 'Update' : 'Submit'}</button>
    </motion.form>
  );
};