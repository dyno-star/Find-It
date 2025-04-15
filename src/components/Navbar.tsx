import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar"
    >
      <div className="nav-brand">Campus Lost & Found</div>
      <div className="nav-right">
        <ul className="nav-links">
          {['Home', 'Post', 'Search'].map((item) => (
            <li key={item}>
              <NavLink
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
};