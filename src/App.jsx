import React, { useState } from 'react'; // Import useState

// Correctly import the component and the CSS
import Navbar from './components/navbar/Navbar.jsx';
import './App.css'; 

// --- Import All Images ---
// Hero
import heroImage from './assets/face4.png'; 
import { FaLinkedinIn, FaBehance, FaGithub, FaArtstation, FaInstagram } from 'react-icons/fa'; // Added art icons

// UI/UX Projects
import uiIndeed from './assets/uiindeed.png';
import uiSourced from './assets/uisourced.png';
import uiMaggi from './assets/uimaggi.png';
import uiTea from './assets/uitea.png';

// Web Dev Projects
import webDev from './assets/webdev.png';

// Digital Art
import artSakura from './assets/2SAKURA.png';
import artWanda from './assets/WANDA.PNG';
import artHoshino from './assets/hoshinoai.png';
import artDream from './assets/dreamfinal.png';
import artBubble from './assets/bubble61.png';
import artHimeno from './assets/himeno.png';


// --- Project Data ---
const uiuxProjects = [
  { img: uiIndeed, title: 'Indeed Redesign', desc: 'Worked on a redesign job portal Indeed focusing no pain points', tags: ['UX Research', 'Figma', 'Mobile UI', 'Prototyping'], link: '#' },
  { img: uiSourced, title: 'Sourced - Artist Accountability & Segregation Platform:', desc: 'Designed a UX case study for an art-focused platform that separates AI-generated and traditional artwork.', tags: ['UX Research', 'Figma', 'Mobile UI', 'Prototyping', 'UX Case Study'], link: '#' },
  { img: uiMaggi, title: 'Maggilicious Cafe Landing Page', desc: 'Designed a landing page for Maggilicious Cafe - an anime-themed cafe in karwar', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage'], link: '#' },
  { img: uiTea, title: 'Lush & Leaf', desc: 'Designed a tea selling e-commerce page where users can purchase various of types of tea powder', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage'], link: '#' },
];

const webDevProjects = [
  { img: webDev, title: 'Digital Artist Portfolio Website', desc: 'Designed and developed a responsive personal portfolio site to showcase digital art projects.', tags: ['React.js', 'HTML', 'CSS', 'JavaScript'], link: '#' },
];


function App() {
  const [activeCategory, setActiveCategory] = useState('UI/UX Design');

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


      {/* PROJECTS SECTION START */}
        <section id="projects" className="projects-section">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">A comprehensive showcase of my projects spanning UI/UX design, web development, and digital art.</p>

          <div className="filter-buttons">
            <button onClick={() => setActiveCategory('UI/UX Design')} className={activeCategory === 'UI/UX Design' ? 'active' : ''}>UI/UX Design</button>
            <button onClick={() => setActiveCategory('Web Development')} className={activeCategory === 'Web Development' ? 'active' : ''}>Web Development</button>
            <button onClick={() => setActiveCategory('Digital Art')} className={activeCategory === 'Digital Art' ? 'active' : ''}>Digital Art</button>
            <button onClick={() => setActiveCategory('Graphic Design')} className={activeCategory === 'Graphic Design' ? 'active' : ''}>Graphic Design</button>
          </div>

          <div className="projects-content">
            {activeCategory === 'UI/UX Design' && (
              <div className="project-grid">
                {uiuxProjects.map(p => (
                  <div className="project-card" key={p.title}>
                    <img src={p.img} alt={p.title} className="project-image"/>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                    <div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                    <a href={p.link} className="project-link">View Project</a>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'Web Development' && (
              <div className="project-grid">
                {webDevProjects.map(p => (
                  <div className="project-card" key={p.title}>
                    <img src={p.img} alt={p.title} className="project-image"/>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                    <div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                    <a href={p.link} className="project-link">View Project</a>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'Digital Art' && (
              <div className="digital-art-container">
                <p>Worked under the name Jeneko for over 4 years across platforms like Fiverr, Pixiv Fanbox and Discord.</p>
                <div className="bento-grid">
                  <div className="bento-item bento-item-1"><img src={artSakura} alt="Sakura digital art"/></div>
                  <div className="bento-item bento-item-2"><img src={artWanda} alt="Wanda Maximoff digital art"/></div>
                  <div className="bento-item bento-item-3"><img src={artHoshino} alt="Hoshino Ai digital art"/></div>
                  <div className="bento-item bento-item-4"><img src={artDream} alt="Dream Angel digital art"/></div>
                  <div className="bento-item bento-item-5"><img src={artBubble} alt="Bubble girl digital art"/></div>
                  <div className="bento-item bento-item-6"><img src={artHimeno} alt="Himeno digital art"/></div>
                </div>
                <div className="art-links">
                  <span>Find More of my Artworks on →</span>
                  <a href="#" target="_blank"><FaArtstation /></a>
                  <a href="#" target="_blank"><FaInstagram /></a>
                </div>
              </div>
            )}

            {activeCategory === 'Graphic Design' && (
              <div className="placeholder-text">Graphic design projects coming soon!</div>
            )}
          </div>
        </section>
        {/* PROJECTS SECTION END */}
      
      </div>
    </div>
  );
}

export default App;