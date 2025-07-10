import React, { useState } from 'react';
import './ExperienceItem.css';

const ExperienceItem = ({ jobTitle, companyName, jobDescription, location, duration }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`experience-item ${isOpen ? 'open' : ''}`}>
      <div className="experience-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="experience-details">
          <p className="job-title">{jobTitle}</p>
          <p className="company-name">{companyName}</p>
        </div>
        <div className="experience-location">
          <p>{duration}</p>
        </div>
      </div>
      {isOpen && (
        <div className="experience-body">
          <ul className="job-description">
            {jobDescription.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExperienceItem;
