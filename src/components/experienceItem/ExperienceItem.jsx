import React, { useState } from 'react';
import './ExperienceItem.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icons for the toggle

const ExperienceItem = ({ experience }) => {
  const [isOpen, setIsOpen] = useState(false); // Each item manages its own state

  const handleToggle = () => {
    setIsOpen(!isOpen); // Toggles the state from open to closed
  };

  return (
    <div className="experience-item-wrapper">

            <div className="experience-header">
        <div className="experience-details">
          <p className="job-title">{experience.title}</p>
          <div className="company-container">
            <p className="company-name">{experience.company}</p>
          </div>
          {/* ADD THIS LINE: This is the date for mobile view */}
          <p className="experience-dates-mobile">{experience.dates}</p>
        </div>

        <div className="experience-location">
          {/* We add a class to the existing date to target it */}
          <p className="experience-dates-desktop">{experience.dates}</p>
          <button onClick={handleToggle} className="toggle-button">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {/* The job description is now conditionally rendered based on the 'isOpen' state */}
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