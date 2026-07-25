import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Mail, Phone, MapPin, Github, Linkedin, Award, Briefcase, GraduationCap, Globe, Cpu } from 'lucide-react';

const Resume = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const skills = [
    { name: 'Artificial Intelligence & ML', level: '90%' },
    { name: 'Prompt Engineering & GenAI', level: '92%' },
    { name: 'Python (Pandas, NumPy, Scikit)', level: '90%' },
    { name: 'SQL & Database Modeling', level: '90%' },
    { name: 'FastAPI & Backend Engineering', level: '85%' },
    { name: 'Power BI & Data Visualization', level: '85%' },
    { name: 'AWS & Cloud Integration', level: '80%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.55)',
        zIndex: 2000,
        overflowY: 'auto',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E7E7E7',
          boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '920px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: '#F4F4F6', border: '1px solid #D2D2D4', color: '#666666',
            padding: '0.6rem', borderRadius: '50%', cursor: 'pointer',
            zIndex: 10, transition: 'all 0.2s', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FF634A'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF634A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F4F6'; e.currentTarget.style.color = '#666666'; e.currentTarget.style.borderColor = '#D2D2D4'; }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '3rem 2.5rem 2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1px solid #E7E7E7' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: '14px', background: '#FF634A',
              fontWeight: 800, fontSize: '1.3rem', color: '#fff', marginBottom: '1rem',
            }}>S</div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-display)',
              fontWeight: 800, letterSpacing: '-0.04em', color: '#1B1B1B', marginBottom: '0.5rem',
            }}>SAFVAN SIDHEEQ</h1>
            <p style={{
              fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#FF634A', fontFamily: 'var(--font-mono)', marginBottom: '1.5rem',
            }}>Aspiring AI Engineer | ML | FastAPI | SQL | Python | AWS</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { Icon: Mail, val: 'mkdsafwan4@gmail.com' },
                { Icon: Phone, val: '+91 8590207382' },
                { Icon: MapPin, val: 'Kozhikode, Kerala, India' },
              ].map(({ Icon, val }) => (
                <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666666', fontSize: '0.85rem' }}>
                  <Icon size={13} color="#FF634A" /> {val}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
              <a href="https://linkedin.com/in/safvenn" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FF634A', fontSize: '0.82rem', fontWeight: 600 }}>
                <Linkedin size={13} /> linkedin.com/in/safvenn
              </a>
              <a href="https://github.com/safvenn" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FF634A', fontSize: '0.82rem', fontWeight: 600 }}>
                <Github size={13} /> github.com/safvenn
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* Left Column */}
            <div>
              {/* Professional Summary */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>Professional Summary</h2>
                <p style={{ color: '#666666', fontSize: '0.88rem', lineHeight: 1.75 }}>
                  Aspiring AI Engineer with strong skills in Artificial Intelligence, Machine Learning, Prompt Writing, FastAPI backend engineering, SQL, Python, and Data Analytics. Passionate about building intelligent systems, optimizing ML workflows, and developing scalable cloud/web integrations.
                </p>
              </section>

              {/* Education */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <GraduationCap size={14} />Education
                </h2>
                <div style={{ padding: '1rem', background: '#F4F4F6', borderRadius: '12px', border: '1px solid #E7E7E7' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#1B1B1B', fontWeight: 700, marginBottom: '0.25rem' }}>University of Calicut</h3>
                  <p style={{ color: '#666666', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Kozhikode, Kerala, India</p>
                  <p style={{ fontSize: '0.78rem', color: '#FF634A', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>2025 - 2032</p>
                </div>
              </section>

              {/* Work & Internships */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <Briefcase size={14} />Work & Internships
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { company: 'Luminar Technolab', role: 'Data Science Intern', date: 'June 2026 - Present (Kochi)', desc: 'Focusing on data science workflows, EDA, machine learning pipelines, and predictive analytics.' },
                    { company: 'CODEEDEX TECHNOLOGIES', role: 'Flutter Intern', date: 'August 2025 - February 2026 (7 mos)', desc: 'Developed customized trip planning mobile application using Flutter and Firebase cloud integration.' },
                    { company: 'ICT Academy', role: 'Full-stack Developer Intern', date: 'May 2025 - June 2025 (Cyberpark Calicut)', desc: 'Developed full-stack web modules and backend API services.' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '0.85rem 1rem', background: '#F4F4F6', borderRadius: '10px', border: '1px solid #E7E7E7' }}>
                      <h3 style={{ fontSize: '0.88rem', color: '#1B1B1B', fontWeight: 700 }}>{item.company} — {item.role}</h3>
                      <p style={{ color: '#8A8A8A', fontSize: '0.78rem', margin: '0.15rem 0', fontFamily: 'var(--font-mono)' }}>{item.date}</p>
                      <p style={{ color: '#666666', fontSize: '0.82rem' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <Award size={14} />Certifications
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { title: 'Google AI Essentials Specialization', org: 'Google / Coursera — Jul 2026' },
                    { title: 'Exploratory Data Analysis with Python and Pandas', org: 'Coursera — 2026' },
                    { title: 'Databases and SQL for Data Science with Python', org: 'IBM / Coursera — 2026' },
                    { title: 'Data Visualisation: Business Insights', org: 'Tata / Forage — 2026' },
                    { title: 'Data Analytics Job Simulation', org: 'Deloitte / Forage — 2026' },
                  ].map((cert, i) => (
                    <div key={i} style={{ padding: '0.85rem 1rem', background: '#F4F4F6', borderRadius: '10px', border: '1px solid #E7E7E7' }}>
                      <h3 style={{ fontSize: '0.88rem', color: '#1B1B1B', fontWeight: 600, marginBottom: '0.2rem' }}>{cert.title}</h3>
                      <p style={{ color: '#FF634A', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{cert.org}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div>
              {/* Technical Skills */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>Technical Skills</h2>
                {skills.map((skill, i) => (
                  <div key={i} style={{ marginBottom: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.88rem', color: '#1B1B1B', fontWeight: 500 }}>{skill.name}</span>
                      <span style={{ color: '#FF634A', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{skill.level}</span>
                    </div>
                    <div style={{ height: '5px', background: '#E7E7E7', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: skill.level }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ height: '100%', background: '#FF634A', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* Projects */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>Key Projects</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    {
                      title: 'Budget Buddy — Room Expense Manager (Priority #1)',
                      desc: 'Full-stack React & TypeScript room management app with live Vercel deployment (budget-buddy4.vercel.app). Real-time balance calculations, group & friend debt settlements, custom split algorithms, and Firebase DB integration.',
                      stack: 'React • TypeScript • Firebase • Tailwind CSS • Vite',
                    },
                    {
                      title: 'Sales Analytics & AI Revenue Forecasting System',
                      desc: 'Production-grade full-stack web application with FastAPI backend, React frontend, Google Gemini AI business insight generator, and Linear Regression revenue forecasting.',
                      stack: 'Python • FastAPI • React • Gemini AI • Scikit-Learn • Pandas',
                    },
                    {
                      title: 'Petrol Station Analytics — End-to-End Pipeline',
                      desc: 'End-to-end pipeline processing 150K+ transactions (₹2.15B revenue). Built Operations & HR dashboards in Power BI with IQR outlier detection.',
                      stack: 'Python • Pandas • NumPy • Power BI • Matplotlib',
                    },
                    {
                      title: 'Hospital Doctor Utilization & Patient Cost Analysis',
                      desc: 'Integrated 4 datasets, built multi-table pipeline, executed 10+ SQL queries. Identified 3 high-cost patient segments.',
                      stack: 'Python • Pandas • MySQL • SQLAlchemy • Matplotlib',
                    },
                  ].map((proj, i) => (
                    <div key={i} style={{ padding: '1rem', background: '#F4F4F6', borderRadius: '12px', border: '1px solid #E7E7E7', borderLeft: '3px solid #FF634A' }}>
                      <h3 style={{ fontSize: '0.9rem', color: '#1B1B1B', fontWeight: 700, marginBottom: '0.35rem' }}>{proj.title}</h3>
                      <p style={{ color: '#666666', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '0.4rem' }}>{proj.desc}</p>
                      <p style={{ color: '#8A8A8A', fontSize: '0.73rem', fontFamily: 'var(--font-mono)' }}>{proj.stack}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Achievements */}
              <section>
                <h2 style={{
                  borderBottom: '2px solid #FF634A', paddingBottom: '0.5rem', marginBottom: '1.25rem',
                  fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#FF634A', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>Key Achievements</h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    'Earned Google AI Essentials Specialization from Google/Coursera',
                    'Completed Flutter & Firebase internship at CODEEDEX TECHNOLOGIES',
                    'Built data & AI processing pipelines using Python, SQL, and FastAPI',
                    'Completed Deloitte and Tata professional analytics simulations',
                    'Built multi-table hospital & retail analytics integrating multiple datasets',
                  ].map((achievement, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#666666', fontSize: '0.87rem', lineHeight: 1.5 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#FF634A',
                        flexShrink: 0, marginTop: '0.45rem',
                      }} />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #E7E7E7' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '1rem 3rem' }}
              onClick={() => {
                alert('To save as PDF:\n1. Press Ctrl+P (Cmd+P)\n2. Select "Save as PDF"\n3. Click Save');
                window.print();
              }}
            >
              <Download size={16} /> Download / Print Resume
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Resume;
