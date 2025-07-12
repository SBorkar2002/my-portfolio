import React, { useState } from 'react';
import './ExperienceItem.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ExperienceItem = ({ experience }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="experience-item-wrapper">
      <div className="experience-header">
        
        {/* Left-side content */}
        <div className="experience-details">
          <p className="job-title">{experience.title}</p>
          <p className="company-name">{experience.company}</p>
          {/* This date is ONLY for mobile view */}
          <p className="experience-dates-mobile">{experience.dates}</p>
        </div>
        
        {/* Right-side content */}
        <div className="experience-location">
          {/* This date is ONLY for desktop view */}
          <p className="experience-dates-desktop">{experience.dates}</p>
          {/* The toggle button is now part of the right-side column */}
          <button onClick={handleToggle} className="toggle-button">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

      </div>

      {/* The collapsible description area */}
      <div className={`job-description-container ${isOpen ? 'open' : ''}`}>
        <ul className="job-description">
          {experience.description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceItem;