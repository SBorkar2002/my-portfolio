import React from 'react';

// Correctly import the component and the CSS
import Navbar from './components/navbar/Navbar.jsx';
import './App.css'; 

// Correctly import the image from the assets folder
import heroImage from './assets/face4.png'; 

// Import icons
import { FaLinkedinIn, FaBehance, FaGithub } from 'react-icons/fa';


function App() {
  return (
    <div className="App">
      
      <div className="main-content">
        <Navbar />
        
        <section id="home" className="hero-section">
          <div
      className="hero-background-image" 
      style={{ backgroundImage: `url(${heroImage})` }}>
      </div>
      {/* ADD THE DECORATIVE ELLIPSE HERE */}
    <div className="hero-ellipse"></div>
          {/* BACKGROUND NAME EFFECT */}
          
          <h1 className="hero-name-overlay">
            <div className="hero-intro-text">Hey! I'm</div>
            <span>SEJAL GIRISH</span>
            <span>BORKAR</span>
          </h1>
          {/* ADD THIS PART BACK */}
          <div className="hero-contact-info">
            <p>sejalborkar2002@gmail.com</p>
            <p>+91-6362518173</p>
          </div>

          {/* FOREGROUND UI - Center Image */}
          <div className="hero-image-container">
            <img src={heroImage} alt="Portrait of Sejal Borkar" className="hero-image-fg" />
          </div>
          
          

          {/* FOREGROUND UI - Right Column */}
          <div className="hero-right">
            <div className="hero-scroll-text">scroll</div>
            <div className="hero-summary">
              <p>A creative and strategic product designer who transforms user needs and business goals into thoughtful, impactful digital experiences.</p>
              <div className="hero-social-icons">{/*...icons...*/}</div>
            <div className="hero-social-icons">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer"><FaBehance /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        </div>
            </div>
          </div>

          

          {/* FOREGROUND UI - Buttons */}
          <div className="hero-buttons">
            <button className="btn btn-primary">View My Work →</button>
            <button className="btn btn-secondary">Get In Touch</button>
          </div>
        </section>
         {/* ABOUT ME SECTION START */}
      <section id="about" className="about-section">
  {/* The title is a direct child of the section */}
  <h2 className="section-title">About Me</h2>

  {/* NEW: A dedicated container for the two-column grid */}
  <div className="about-grid">
    {/* Left Column */}
    <div className="about-left">
      <p className="about-bio">
        Aspiring Product Designer passionate about crafting intuitive and user-centric digital experiences. Skilled in UI/UX design using Figma and Photoshop, with hands-on experience in building responsive web interfaces using React, HTML, and CSS. Strong communicator with proven experience working directly with clients as a freelance designer, combining creativity with technical skills to deliver impactful solutions.
      </p>
      <button className="btn btn-secondary">Download Resume</button>
    </div>

    {/* Right Column */}
    <div className="about-right">
      <h3 className="subsection-title">Skills</h3>
      <div className="skills-list">
        <div className="skill-category">
          <h4>UI/UX Design</h4>
          <p>Wireframing, Prototyping, User Research, Information Architecture</p>
        </div>
        <div className="skill-category">
          <h4>Frontend</h4>
          <p>HTML, CSS, JavaScript, React.js</p>
        </div>
        <div className="skill-category">
          <h4>Design Tools</h4>
          <p>Adobe Photoshop (4+ years), Adobe Illustrator, Figma</p>
        </div>
        <div className="skill-category">
          <h4>Additional Skills</h4>
          <p>Digital Art (4+ years), Web Design</p>
        </div>
      </div>
    </div>
  </div>

  {/* Education is now OUTSIDE the grid, so it will be full-width by default */}
    <div className="education-container">
      <h3 className="subsection-title">Education</h3>
      <div className="education-item">
        <div className="education-details">
          <p className="institution">Ramaiah Institute of Technology</p>
          <p>Master of Computer Applications</p>
          <p><strong>CGPA:</strong> 8.53</p>
        </div>
        <div className="education-location">
          <p>Bengaluru, India</p>
          <p>Feb 2024 - Jun 2025</p>
        </div>
      </div>
    </div>


  {/* Professional Experience Block */}
  <div className="education-container">
    <h3 className="subsection-title">Professional Experience</h3>
    
    <div className="experience-item">
      <div className="experience-details">
        <p className="job-title">UI/UX Design Intern</p>
        <p className="company-name">CODETECH IT Solutions Pvt. Ltd.</p>
        <ul className="job-description">
          <li>Redesigned an existing website landing page to enhance usability and visual appeal</li>
          <li>Designed and developed a fully responsive webpage using HTML, CSS, and JavaScript</li>
          <li>Created a mobile app redesign prototype addressing user pain points with improved UI/UX</li>
          <li>Designed intuitive AR/VR interface mockups focused on user interaction and accessibility</li>
        </ul>
      </div>
      <div className="experience-location">
        <p>May 2025 - Jun 2025</p>
      </div>
    </div>

    <div className="experience-item">
      <div className="experience-details">
        <p className="job-title">Digital Artist</p>
        <p className="company-name">Freelance</p>
        <ul className="job-description">
          <li>Delivered custom digital art for international clients (streamers, YouTubers) via Fiverr, Discord, and Pixiv Fanbox</li>
          <li>Showcased strong communication, creative adaptability, and timely delivery across diverse project requirements</li>
          <li>Built long-term client relationships through consistent quality and professional service</li>
        </ul>
      </div>
      <div className="experience-location">
        <p>Feb 2021 - Mar 2025</p>
      </div>
    </div>
  </div>
  </section>
      {/* ABOUT ME SECTION END */}
      
      </div>
    </div>
  );
}

export default App;