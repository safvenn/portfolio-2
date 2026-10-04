import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Download,
  Phone,
  MapPin,
  Star,
} from "lucide-react";
import Resume from "./components/Resume";
import { HeroArtwork, Reveal, ScrollProgress } from "./components/ScrollMotion";
import {
  projects,
  services,
  experiences,
  certifications,
  tools,
  interests,
  email,
} from "./portfolioData";

const links = [
  ["Home", "#hero"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
];
const socials = [
  { label: "GitHub", href: "https://github.com/safvenn", Icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/safvenn",
    Icon: Linkedin,
  },
  { label: "Email", href: `mailto:${email}`, Icon: Mail },
];

function Ticker({ large = false }) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={`ticker ${large ? "ticker-large" : ""}`}
      aria-label="Machine learning, Python, data analytics, FastAPI, generative AI"
    >
      <div
        className="ticker-track"
        style={{ animationPlayState: paused ? "paused" : undefined }}
      >
        {[0, 1].map((copy) => (
          <div className="ticker-copy" key={copy} aria-hidden="true">
            {[
              "Machine Learning",
              "Python",
              "Data Analytics",
              "FastAPI",
              "Generative AI",
            ].map((word) => (
              <span key={word}>
                {word}
                <span className="ticker-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        className="ticker-pause"
        aria-label={paused ? "Resume scrolling text" : "Pause scrolling text"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
    </div>
  );
}

function Socials() {
  return (
    <div className="socials">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          target={social.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          <social.Icon size={25} strokeWidth={1.7} />
        </a>
      ))}
    </div>
  );
}

function Modal({ title, onClose, children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const siblings = [...document.querySelector("#root").children].filter(
      (el) => !el.contains(ref.current),
    );
    const inertStates = siblings.map((el) => el.inert);
    siblings.forEach((el) => {
      el.inert = true;
    });
    document.body.style.overflow = "hidden";
    ref.current.querySelector("button")?.focus();
    const keydown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = [
          ...ref.current.querySelectorAll(
            'a[href], button, iframe, [tabindex="0"]',
          ),
        ].filter((el) => el.getClientRects().length);
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      siblings.forEach((el, i) => {
        el.inert = inertStates[i];
      });
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className={`modal-backdrop ${className}`} onClick={onClose}>
      <div
        className="modal-panel"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-bar">
          <span>{title}</span>
          <button onClick={onClose} aria-label="Close dialog">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [resume, setResume] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const closeCertificate = useCallback(() => setCertificate(null), []);
  const closeResume = useCallback(() => setResume(false), []);
  useEffect(() => {
    const open = () => setResume(true);
    window.addEventListener("open-resume", open);
    return () => window.removeEventListener("open-resume", open);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.querySelector(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Ticker />
      <header className="site-header">
        <ScrollProgress />
        <div className="nav-inner">
          <a className="wordmark" href="#hero" aria-label="Safvan home">
            <img
              src="/safvan-logo-transparent.png"
              alt="Safvan"
              width="1280"
              height="640"
            />
          </a>
          <button
            className="menu-toggle"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="navigation"
            className={menu ? "navigation is-open" : "navigation"}
            aria-label="Main navigation"
          >
            {links.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </nav>
          <a className="button nav-cta" href={`mailto:${email}`}>
            Let’s talk <ArrowUpRight size={19} />
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero wrap" id="hero">
          <Reveal className="hero-portrait">
            <HeroArtwork>
            <figure className="polaroid">
              <img
                src="/safvan-hero.jpg"
                alt="Safvan Sidheeq working on his laptop"
                width="960"
                height="1280"
                fetchPriority="high"
              />
              <figcaption>
                Building intelligent things <span>✦</span>
              </figcaption>
            </figure>
            </HeroArtwork>
            <span className="portrait-note">
              A little curiosity.
              <br />A lot of possibilities.
            </span>
          </Reveal>
          <Reveal className="hero-copy" order={1}>
            <div className="availability">
              <span /> AI, data, and automation systems
            </div>
            <p className="hero-name">SAFVAN</p>
            <p className="surname">Sidheeq</p>
            <h1>
              AI Engineer
              <br />& Data Analyst
            </h1>
            <p className="hero-description">
              Machine Learning, Generative AI, FastAPI backend engineering, and
              Data Analytics. Building intelligent applications and data
              pipelines.
            </p>
            <Socials />
            <a className="text-link" href="#projects">
              Explore my work <ArrowRight size={20} />
            </a>
          </Reveal>
        </section>

        <section className="about wrap section-space" id="about">
          <div className="about-panel">
            <Reveal>
              <span className="script-heading">A little about me</span>
              <h2>
                Curiosity.
                <br />
                Code.
                <br />
                Possibility.
              </h2>
              <a
                className="button pale"
                href="/resume_ats.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                View my résumé <ArrowUpRight size={18} />
              </a>
            </Reveal>
            <Reveal className="about-copy" order={1}>
              <p>
                I’m Safvan Sidheeq, an AI Engineer focused on Machine Learning,
                Generative AI, Data Analytics and scalable backend systems.
                Building production-grade intelligent pipelines, autonomous
                agents, and high-throughput APIs.
              </p>
              <p>
                I turn raw data and business problems into clear dashboards,
                intelligent automations, and backend systems that are ready to
                use.
              </p>
              <div className="education-note">
                <span>Education</span>
                <strong>BCA — MES Kalladi College</strong>
                <p>University of Calicut · Kerala, India</p>
                <p>BCA (Final Year) · Expected Graduation: 2026</p>
              </div>
              <div className="about-expertise">
                <strong>Core expertise</strong>
                <p>
                  Machine Learning · Generative AI · Data Science · Backend
                  Engineering · AI Automation · Agentic Workflows · MLOps
                </p>
                <p>
                  Python, FastAPI, SQL, PostgreSQL, MongoDB, Pandas, NumPy,
                  Scikit-learn, LangChain, RAG, LLMs, React, Oracle Database,
                  TensorFlow, OpenAI API, MERN Stack
                </p>
              </div>
            </Reveal>
          </div>
          <div className="stats">
            {[
              ["4+", "Projects"],
              ["3+", "Internships"],
              ["10+", "Tech Tools"],
              ["5", "Certifications"],
            ].map(([value, label], i) => (
              <Reveal key={label} order={i}>
                <strong>{value}</strong>
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="services section-space" id="services">
          <div className="wrap">
            <Reveal className="section-heading">
              <span className="ornament" aria-hidden="true">
                ✺
              </span>
              <h2>What I Build</h2>
              <p>Intelligent systems. Thoughtful interfaces.</p>
            </Reveal>
            <div className="service-grid" id="what-i-build">
              {services.map((service, i) => (
                <Reveal as="article" className="service" key={service.index} order={i % 3}>
                  <span className="service-number">{service.index}</span>
                  <h3>{service.heading.replace("\n", " ")}</h3>
                  <p>{service.body}</p>
                  <a
                    className="text-link"
                    href={service.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {service.cta}
                    <ArrowUpRight size={18} />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <Ticker large />

        <section className="projects section-space" id="projects">
          <div className="wrap">
            <Reveal className="section-heading">
              <span className="script-heading">My Featured</span>
              <h2>Works</h2>
              <p>Real projects. From raw data to something useful.</p>
            </Reveal>
            <div className="project-list">
              {projects.map((project, i) => (
                <Reveal as="article" className="project" key={project.title}>
                  <a
                    className="project-image"
                    href={project.liveUrl || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`0${i + 1} — Explore ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} project preview`}
                      width="1200"
                      height="800"
                      loading="lazy"
                    />
                    <span className="image-arrow">
                      <ArrowUpRight size={28} />
                    </span>
                    <span className="project-index">0{i + 1}</span>
                  </a>
                  <div className="project-copy">
                    <p className="project-subtitle">{project.subtitle}</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul className="project-highlights">
                      {project.highlights.map((item) => (
                        <li key={item}>
                          <Star size={13} fill="currentColor" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="tags">
                      {project.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                    <div className="project-actions">
                      <a
                        className="text-link"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View source <Github size={17} />
                      </a>
                      {project.liveUrl && (
                        <a
                          className="text-link"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live website <ArrowUpRight size={19} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="tools wrap" id="tools">
            <Reveal as="h2">My Power Tools</Reveal>
            <div className="tool-grid">
              {tools.map((tool, i) => (
                <Reveal className="tool" key={tool.name} order={i % 3}>
                  <img
                    src={tool.icon}
                    alt=""
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                  <span>{tool.name}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="experience section-space" id="experience">
          <div className="wrap">
            <Reveal className="experience-title">
              <span className="script-heading">Always learning</span>
              <h2>
                Experience
                <br />& Simulations
              </h2>
              <p>
                Professional internships and industry simulations shaping my
                career.
              </p>
            </Reveal>
            <div className="experience-list">
              {experiences.map((experience, i) => (
                <Reveal as="article" key={experience.company}>
                  <span className="experience-number">0{i + 1}</span>
                  <div>
                    <p className="project-subtitle">
                      {experience.company} · {experience.type}
                    </p>
                    <h3>{experience.title}</h3>
                    <p className="experience-dates">{experience.dates}</p>
                    <p>{experience.description}</p>
                    <div className="tags">
                      {experience.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="experience-arrow" size={30} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="certifications section-space" id="certifications">
          <div className="wrap">
            <Reveal className="section-heading">
              <span className="script-heading">
                Learning, put into practice
              </span>
              <h2>
                Certifications
                <br />& Courses
              </h2>
            </Reveal>
            <div className="certificate-list">
              {certifications.map((cert, i) => (
                <Reveal
                  as="button"
                  className="certificate"
                  key={cert.title}
                  onClick={() => setCertificate(cert)}
                >
                  <span className="certificate-number">0{i + 1}</span>
                  <span className="certificate-info">
                    <span className="cert-provider">
                      {cert.provider} · {cert.year}
                    </span>
                    <strong>{cert.title}</strong>
                    <span className="cert-skills">
                      {cert.skills.join(" · ")}
                    </span>
                  </span>
                  <span className="certificate-view">
                    View <ArrowUpRight size={24} />
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-space" id="contact">
          <div className="wrap contact-grid">
            <Reveal>
              <span className="script-heading">Have something in mind?</span>
              <h2>
                Let’s build
                <br />
                something
                <br />
                <span>meaningful.</span>
              </h2>
              <a
                className="button"
                href={`mailto:${email}?subject=Portfolio%20Inquiry`}
              >
                Send a message <ArrowUpRight size={22} />
              </a>
            </Reveal>
            <Reveal className="contact-details" order={1}>
              <p>
                Based in Kochi, I build practical AI and data systems for
                analytics, automation, and product workflows.
              </p>
              <a href={`mailto:${email}`}>
                <Mail size={20} />
                {email}
              </a>
              <a href="tel:+918590207382">
                <Phone size={20} />
                +91 8590207382
              </a>
              <p className="location">
                <MapPin size={20} />
                Kochi, Kerala, India
              </p>
              <Socials />
              <button className="text-link" onClick={() => setResume(true)}>
                View full résumé <Download size={18} />
              </button>
              <div className="contact-interests">
                <h3>Areas of interest</h3>
                <div className="tags">
                  {interests.map((interest) => (
                    <span key={interest}>{interest}</span>
                  ))}
                </div>
              </div>
              <p className="languages">
                English (Professional) · Malayalam (Native) · Hindi
                (Conversational)
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer">
        <Reveal className="wrap">
          <a href="#hero" className="footer-name">
            Safvan<span>✦</span>
          </a>
          <div className="footer-bottom">
            <p>© 2026 Safvan Sidheeq. All rights reserved.</p>
            <a href="#hero">
              Back to top <ArrowUp size={17} />
            </a>
          </div>
        </Reveal>
      </footer>
      {certificate && (
        <Modal title={certificate.title} onClose={closeCertificate}>
          <div className="pdf-actions">
            <a href={certificate.pdf} target="_blank" rel="noopener noreferrer">
              Open PDF in a new tab <ArrowUpRight size={17} />
            </a>
          </div>
          <iframe
            src={certificate.pdf}
            title={certificate.title}
            className="certificate-pdf"
          />
        </Modal>
      )}
      {resume && (
        <Modal
          title="Safvan Sidheeq — Résumé"
          onClose={closeResume}
          className="resume-modal"
        >
          <Resume isOpen onClose={closeResume} embedded />
        </Modal>
      )}
    </>
  );
}
