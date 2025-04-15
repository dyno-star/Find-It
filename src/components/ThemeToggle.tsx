import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FC } from 'react';

const SunIcon: FC<{ size?: number }> = ({ size }) => <FiSun size={size} />;
const MoonIcon: FC<{ size?: number }> = ({ size }) => <FiMoon size={size} />;

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};