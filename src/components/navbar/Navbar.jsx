import React, { useState } from 'react';
import './navbar.css';
// Import icons for the hamburger menu
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  // State to manage the mobile menu's open/closed status
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">SEJAL GIRISH BORKAR</a>
      </div>

      {/* Navigation links - now with a conditional 'open' class */}
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><a href="#home" onClick={toggleMenu}>Home</a></li>
        <li><a href="#about" onClick={toggleMenu}>About Me</a></li>
        <li><a href="#projects" onClick={toggleMenu}>Projects</a></li>
        <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
      </ul>

      {/* Hamburger Menu Icon */}
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;