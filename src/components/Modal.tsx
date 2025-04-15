import { Item } from '../types/Item';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { FC } from 'react';

interface ModalProps {
  item: Item | null;
  onClose: () => void;
}

const CloseIcon: FC<{ size?: number }> = ({ size }) => <FiX size={size} />;

export const Modal = ({ item, onClose }: ModalProps) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{item.title}</h2>
            <button onClick={onClose} className="close-btn">
              <CloseIcon size={24} />
            </button>
          </div>
          {item.image && <img src={item.image} alt={item.title} className="modal-image" />}
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          <p>
            <strong>Location:</strong> {item.location}
          </p>
          <p>
            <strong>Date:</strong> {item.date}
          </p>
          <p>
            <strong>Contact:</strong> {item.contact}
          </p>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Status:</strong> {item.status}
          </p>
          <button
            onClick={() => (window.location.href = `mailto:${item.contact}`)}
            className="contact-btn"
          >
            Contact Poster
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};