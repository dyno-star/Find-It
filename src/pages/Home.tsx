import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="page">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="home-content"
      >
        <h1>Welcome to Campus Lost & Found</h1>
        <p>
          Lost something on campus? Found an item that isn’t yours? Post or search here to reconnect
          items with their owners!
        </p>
        <div className="home-actions">
          <Link to="/post" className="btn primary">
            Post an Item
          </Link>
          <Link to="/search" className="btn secondary">
            Search Items
          </Link>
        </div>
      </motion.div>
    </div>
  );
};