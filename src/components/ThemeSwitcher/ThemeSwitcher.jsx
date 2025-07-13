import React from 'react';
import './ThemeSwitcher.css';
import { FaSun, FaMoon } from 'react-icons/fa'; 

const ThemeSwitcher = ({ theme, toggleTheme }) => {
  return (
    <button className="theme-switcher" onClick={toggleTheme}>
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeSwitcher;