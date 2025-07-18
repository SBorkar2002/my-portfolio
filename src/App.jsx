import React, { useState, useRef} from 'react';


import Navbar from './components/navbar/Navbar.jsx';
import ExperienceItem from './components/experienceItem/ExperienceItem.jsx';
import './App.css'; 
import useMousePosition from './hooks/useMousePosition.jsx';

// Hero
import heroImage from './assets/face4.png'; 
import { FaLinkedinIn, FaBehance, FaGithub, FaArtstation, FaInstagram } from 'react-icons/fa'; // Added art icons
import { MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from 'react-icons/md';

// UI/UX Projects
import uiIndeed from './assets/uiindeed.png';
import uiSourced from './assets/uisourced.png';
import uiMaggi from './assets/uimaggi.png';
import uiTea from './assets/uitea.png';
import uijeneko from './assets/uijeneko.png';
import uibooking from './assets/uibooking.png';
import uimiki from './assets/uimiki.png';
import green from './assets/greengallery.png';

// Web Dev Projects
import webDev from './assets/webdev.png';
import websejal from './assets/websejal.png';


// Digital Art
import artSakura from './assets/sakura.png';
import artWanda from './assets/wanda1.png';
import artHoshino from './assets/hoshinoai.png';
import artDream from './assets/dreamfinal.png';
import artBubble from './assets/bubble61.png';
import artHimeno from './assets/himeno.png';
import artDesi from './assets/desi.png';

// Graphic Design
import graphicburger1 from './assets/burger1.png';
import graphicburger2 from './assets/burger2.png';
import graphicposter from './assets/poster.png';
import graphicopen1 from './assets/open1.png';
import graphicramen from './assets/ramen.png';
import graphiccerti from './assets/certi.png';
import graphicmomos from './assets/momos.png';
import graphicwings from './assets/wings.png';



// --- Project Data ---
const uiuxProjects = [
  { img: uiIndeed, title: 'Indeed Redesign', desc: 'Worked on a redesign job portal Indeed focusing on pain points', tags: ['UX Research', 'Figma', 'Mobile UI', 'Prototyping'], link: 'https://www.behance.net/gallery/228663695/Indeed-Redesign-App-UXUI-Design' },
  { img: uiSourced, title: 'Sourced - Artist Accountability & Segregation Platform', desc: 'Designed a UX case study for an art-focused platform that separates AI-generated and traditional artwork.', tags: ['UX Research', 'Figma', 'Mobile UI', 'Prototyping', 'UX Case Study'], link: 'https://www.behance.net/gallery/225405095/Sourced-UX-Case-Study' },
  { img: uiMaggi, title: 'Maggilicious Cafe Landing Page', desc: 'Designed a landing page for Maggilicious Cafe - an anime-themed cafe in karwar', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage'], link: 'https://www.behance.net/gallery/223118023/Maggilicious-Cafe-Home-Page' },
  { img: uibooking, title: 'Booking.com Redesign', desc: 'Reworked and redesigned the booking.com website addressing the pain points', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage','UX Research'], link: 'https://www.behance.net/gallery/227659831/Bookingcom-Redesign' },
  { img: uiTea, title: 'Lush & Leaf', desc: 'Designed a tea selling e-commerce page where users can purchase various of types of tea powder', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage'], link: 'https://www.behance.net/gallery/226337603/Lush-and-Leaf-Homepage' },
  { img: webDev, title: 'Digital Art Portfolio', desc: 'Designed a digital art based portfolio where an artist displays thier artwork with separate sections for personel projects and commisioned work', tags: ['Desktop', 'Figma', 'Landing Page', 'Webpage','Responsive'], link: 'https://www.behance.net/gallery/229460931/Digital-Artist-Portfolio' },
  { img: uimiki, title: 'Make it 10 Game UI design', desc: 'A prototype for a children math game application called "Mikis Math Adventure" an interactive make it 10 game', tags: ['iPad', 'Figma', 'Home Screen', 'Application','Prototyping'], link: 'https://www.behance.net/gallery/227542669/Mikis-Math-Adventure' },
  { img: green, title: 'Green Gallery - UI/UX Design | Case Study', desc: 'Green Gallery lets you donate unwanted plants to loving new homes, explore expert care tips, and learn about medicinal, indoor, flowering, and cactus varieties. Contribute to a greener planet and earn a certificate for your kind gesture.', tags: ['Desktop', 'Mobile','Figma', 'Webpage', 'Application','Responsive','UX Case Study','Prototyping'], link: 'https://www.behance.net/gallery/230598001/Green-Gallery-UIUX-Design-Landing-Page' },
];

const webDevProjects = [
  { img: websejal, title: 'Personel Portfolio Website', desc: 'Designed and developed a responsive portfolio site to showcase UI/UX designs, graphic designs, responsive webpages and digital art projects.', tags: ['React.js', 'HTML', 'CSS', 'JavaScript','Responsive'], isCurrentSite: true, githubLink: 'https://github.com/SBorkar2002/my-portfolio' },
  { img: uijeneko, title: 'Digital Artist Portfolio Website', desc: 'Designed and developed a responsive personal portfolio site to showcase digital art projects.', tags: ['React.js', 'HTML', 'CSS', 'JavaScript','Responsive'], link: 'https://jeneko.vercel.app/' },
];




// --- NEW Digital Art Data ---
const digitalArtProjects = [
  { img: artSakura, desc: 'A serene portrait of Sakura.', gridClass: 'bento-item-1' },
  { img: artWanda, desc: 'The Scarlet Witch herself.', gridClass: 'bento-item-2' },
  { img: artDesi, desc: 'An artwork dedicated to Indian attire.', gridClass: 'bento-item-7' },
  { img: artHoshino, desc: 'A vibrant concert scene featuring the idol Hoshino Ai.', gridClass: 'bento-item-3' },
  { img: artDream, desc: 'Attack on Titan fanart potraying dream and nightmare at the same time', gridClass: 'bento-item-4' },
  { img: artBubble, desc: 'This is Sienna, An OC created by me.', gridClass: 'bento-item-5' },
  { img: artHimeno, desc: 'A Himeno fanart', gridClass: 'bento-item-6' },
];





// --- Experience Data ---
const professionalExperience = [
  {
    title: 'UI/UX Design Intern',
    company: 'CODETECH IT Solutions Pvt. Ltd.',
    dates: 'May 2025 - Jun 2025',
    description: [
      'Redesigned a landing page, improving navigation flow and reducing bounce rate by an estimated 25% based on client feedback and testing.',
      'Developed a fully responsive webpage using HTML, CSS, and JavaScript, achieving 100% cross-device compatibility.',
      'Created a mobile app redesign prototype, reducing user pain points by 30% as identified through usability surveys.',
      'Designed AR/VR interface mockups focused on accessibility, enhancing interaction clarity for diverse user groups.'
    ]
  },
  {
    title: 'Digital Artist',
    company: 'Freelance',
    dates: 'Feb 2021 - Mar 2025',
    description: [
      'Created custom artwork through Fiverr, Discord, and Pixiv Fanbox, maintaining a 4.9/5 average client rating while securing commissions from over 5 new international clients.',
    ]
  }
];








function App() {
  const [activeCategory, setActiveCategory] = useState('UI/UX Design');

  const { x, y } = useMousePosition();

    const handleExternalLink = (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const handleScrollTo = (ref) => {
  ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start', 
  });
};

  return (
    <div 
    className="spotlight-container" 
    style={{ '--mouse-x': `${x}px`, '--mouse-y': `${y}px` }}>
    <div className="App">
      <div className="main-content">
        <Navbar />
        
        <section id="home" className="hero-section">
          <div
      className="hero-background-image" 
      style={{ backgroundImage: `url(${heroImage})` }}>
      </div>
     
    <div className="hero-ellipse"></div>
          {/* BACKGROUND NAME EFFECT */}
          
          <h1 className="hero-name-overlay">
            <div className="hero-intro-text">Hey! I'm</div>
            <span>SEJAL GIRISH</span>
            <span>BORKAR</span>
          </h1>
       
          <div className="hero-contact-info">
            <p>sejalborkar2002@gmail.com</p>
            <p>+91-6362518173</p>
          </div>

          {/* FOREGROUND UI - Center Image */}
          <div className="hero-image-container">
            <img src={heroImage} alt="Portrait of Sejal Borkar" className="hero-image-fg" />
          </div>
          
          {/* contact info for MOBILE */}
          <div className="hero-contact-info-mobile">
          <p>sejalborkar2002@gmail.com</p>
          <p>+91-6362518173</p>
          </div>
          

          {/* FOREGROUND UI - Right Column */}
          <div className="hero-right">
            <div className="hero-scroll-text">scroll</div>
            <div className="hero-summary">
              <p>A creative and strategic product designer who transforms user needs and business goals into thoughtful, impactful digital experiences.</p>
              <div className="hero-social-icons"></div>
            <div className="hero-social-icons">
          <a href="https://www.linkedin.com/in/sejalborkar/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          <a href="https://behance.net/sejalborkar04" target="_blank" rel="noopener noreferrer"><FaBehance /></a>
          <a href="https://github.com/SBorkar2002" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        </div>
            </div>
          </div>

          

          {/* FOREGROUND UI - Buttons */}
          <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => handleScrollTo(projectsRef)}>
            View My Work →
          </button>
          <button className="btn btn-secondary" onClick={() => handleScrollTo(contactRef)}>
            Get In Touch
          </button>
        </div>
        </section>














         {/* ABOUT ME SECTION START */}
      <section id="about" className="about-section">
  
  <h2 className="section-title">About Me</h2>

  
  <div className="about-grid">
    {/* Left Column */}
    <div className="about-left">
      <p className="about-bio">
        Aspiring Product Designer with a passion for crafting intuitive and user-centered digital experiences. Skilled in UI/UX design using Figma and Photoshop, with hands-on experience developing responsive web interfaces using React, HTML, and CSS. Adept at collaborating directly with clients as a freelance designer, delivering creative and impactful solutions by combining strong communication with technical expertise.
      </p>
        <a 
    href="/Sejal_Borkar_Resume.pdf" 
    download="Sejal_Borkar_Resume.pdf"
    className="btn btn-secondary"
    target="_blank"
    rel="noopener noreferrer">
      Download Resume
    </a>
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
  
  
  {professionalExperience.map((exp, index) => (
    <ExperienceItem key={index} experience={exp} />
  ))}
</div>
  </section>
      {/* ABOUT ME SECTION END */}












      {/* PROJECTS SECTION START */}
        <section id="projects" ref={projectsRef} className="projects-section">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">A comprehensive showcase of my projects spanning UI/UX design, web development, digital art and graphic design.</p>

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
                    <a href={p.link} className="project-link" target="_blank" rel="noopener noreferrer">View Project</a>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'Web Development' && (
 
  <div className="web-dev-layout">

    {/* contains the project cards */}
    <div className="project-grid">
      {webDevProjects.map(p => (
        <div className="project-card" key={p.title}>
          <img src={p.img} alt={p.title} className="project-image"/>
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
          <div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
          
          {p.isCurrentSite ? (
            <div className="project-links-special">
              <span className="current-site-text">✓ Currently Viewing</span>
              <a 
                href={p.githubLink} 
                className="project-link"
                target="_blank"
                rel="noopener noreferrer">
                Check out the code on GitHub
              </a>
            </div>
          ) : (
            <a href={p.link} className="project-link" target="_blank" rel="noopener noreferrer">View Project</a>
          )}
        </div>
      ))}
    </div>

           
            <div className="web-links">
              <span>Find More of my Code on</span>
              <div className="art-links-icons">
                <a href="https://github.com/SBorkar2002" target="_blank"><FaGithub /></a>
              </div>
            </div>
            
          </div>
        )}
            
            

          
          {activeCategory === 'Digital Art' && (
            <div className="digital-art-container">
              <p>Worked under the name Jeneko for over 4 years across platforms like Fiverr, Pixiv Fanbox and Discord.</p>
              
{/* --- DYNAMIC BENTO GRID --- */}
              <div className="bento-grid">
                {digitalArtProjects.map((art, index) => (
                  <div className={`bento-item ${art.gridClass}`} key={index}>
                    <img src={art.img} alt={art.desc} />
                    {/* This is the new overlay element */}
                    <div className="bento-overlay">
                      <p>{art.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
{/* --- END OF NEW GRID --- */}
                <div className="art-links">
                  <span>Find More of my Artworks on </span>
                  <div className="art-links-icons">
                  <a href="#" onClick={() => handleExternalLink('https://www.artstation.com/jen_chan')}><FaArtstation /></a>
    <a href="#" onClick={() => handleExternalLink('https://www.instagram.com/_jeneko/')}><FaInstagram /></a>
                </div>
                </div>
              </div>
            )}



          {/* --- graphic design --- */}

          {activeCategory === 'Graphic Design' && (
          <div className="graphic-art-container">
          <div className="graphicbento-grid">
            <div className="graphicbento-item graphicbento-item-1">
        <img src={graphicburger1} alt="Burger Advertisement"/>
        <div className="bento-overlay"><p>Carousel post 1st half.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-2">
        <img src={graphicburger2} alt="Burger Advertisement 2"/>
        <div className="bento-overlay"><p>Carousel post 2nd half.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-3">
        <img src={graphicopen1} alt="Cafe Opening Poster"/>
        <div className="bento-overlay"><p>New timings announcement post for maggilicious cafe.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-4">
        <img src={graphiccerti} alt="Certificate Design"/>
        <div className="bento-overlay"><p>A formal certificate design for completing a plant donation.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-5">
        <img src={graphicposter} alt="Art Contest Poster"/>
        <div className="bento-overlay"><p>Eye-catching poster design for Korean Ramen.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-6">
        <img src={graphicramen} alt="Ramen Shop Poster"/>
        <div className="bento-overlay"><p>Christmas offer instagram post for maggilicious cafe.</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-7">
        <img src={graphicmomos} alt="Momos Poster"/>
        <div className="bento-overlay"><p>Momos added to menu on zomato!</p></div>
      </div>
      
      <div className="graphicbento-item graphicbento-item-8">
        <img src={graphicwings} alt="Wings Poster"/>
        <div className="bento-overlay"><p>Chicken wings added to menu on zomato!</p></div>
      </div>
          </div>
      
          <div className="graphic-links">
            <span>Find More of my Graphic Designs on </span>
            <div className="art-links-icons">
            <a href="#" onClick={() => handleExternalLink('https://www.instagram.com/maggilicious_cafe/')}><FaInstagram /></a>
            </div>
            </div>
          </div>
        )}
          </div>
        </section>
        {/* PROJECTS SECTION END */}













        {/* CONTACT SECTION START */}
      <section id="contact" ref={contactRef} className="contact-section">
        <h2 className="section-title">Contact</h2>
        <div className="contact-grid">
          {/* Left Column */}
          <div className="contact-left">
            <h2 className="contact-headline">Let's Connect &<br/>Collaborate</h2>
            <p className="contact-intro">
              I'm always excited to discuss new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="info-group">
              <h4>Get in Touch</h4>
              <ul className="contact-info-list">
                <li><MdOutlineEmail className="contact-icon" /> <div><span>Email:</span><p>sejalborkar2002@gmail.com</p></div></li>
                <li><MdOutlinePhone className="contact-icon" /> <div><span>Phone:</span><p>+91-6362518173</p></div></li>
                <li><MdOutlineLocationOn className="contact-icon" /> <div><span>Location:</span><p>Bengaluru</p></div></li>
              </ul>
            </div>

            <div className="info-group">
              <h4>Find Me Online</h4>
              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/sejalborkar/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                <a href="https://www.behance.net/sejalborkar04" target="_blank" rel="noopener noreferrer"><FaBehance /></a>
                <a href="https://github.com/SBorkar2002" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="contact-right">
            <form 
              action="https://formspree.io/f/mqalzeqn"  // <<<  FORMSPREE URL 
              method="POST"
              className="contact-form">

              <div className="form-group">
                <label htmlFor="name">Name*</label>
                <input type="text" id="name" name="name" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input type="email" id="email" name="email" placeholder="Email Address" required />
              </div>
              <div className="form-group form-group-stretch"> 
              <label htmlFor="message">Message*</label>
               <textarea id="message" name="message" rows="5" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      {/* CONTACT SECTION END */}
      
      {/* FOOTER START */}
      <footer className="footer">
        <div className="footer-credit">
          Designed and built with ❤️ by Sejal Borkar using React.js and Figma.
        </div>
        <div className="footer-copyright">
          © 2025 Sejal Borkar. All Rights Reserved.
        </div>
      </footer>
      {/* FOOTER END */}
      
      </div>
    </div>
    </div>

    
  );
}

export default App;