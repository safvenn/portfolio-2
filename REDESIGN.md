# Portfolio redesign

Implemented using the ECC change-feature workflow, delegated planning and code review, and ECC Chrome DevTools browser checks.

## Design

Reference: https://gaznil.com/ (inspected in the browser).

- Green, lemon, pale yellow, dark green, and ink palette; darker text variants improve contrast.
- Monoton name/counters, Unlock headings, Raleway body, Dancing Script accents, Viga labels, and Roboto Slab navigation.
- Sticky navigation, tilted portrait frame, scrolling strips with pause controls, rounded sections, numbered services, and alternating project rows.
- Uses Safvan's existing portrait and project assets, with existing portfolio information.

## Content and behavior

- Preserved all 4 project records, 3 internships, 5 certificates, and 8 contact interests.
- Updated the services to the requested five entries, with Data Science first, and removed Flutter and job-seeking language.
- Added internship dates from the supplied profile PDF and expanded skills with Oracle Database, TensorFlow, Agentic Workflows, MLOps, and explicitly listed OpenAI API and MERN Stack. The tools grid now contains 19 entries.
- Updated the location to Kochi and added the supplied logo and hero photograph.
- Added one-time scroll reveals, staggered cards, a scroll-progress line, and desktop portrait motion with reduced-motion support.
- Moved biography, education, and expertise from the old digital ID card into the About section.
- Standardized the email to safvankallayi7@gmail.com in the website, React résumé, ATS résumé, and résumé source, as requested.
- Kept certificate viewing, résumé printing, ATS résumé, existing section anchors, and the open-resume event. Dialogs lock background interaction, support Escape, and restore focus.
- Education content remains unchanged; experience dates follow the supplied profile PDF.

## Skills

Installed/refreshed project-local skills through the Skills CLI and updated skills-lock.json:

- anthropics/skills: frontend-design
- vercel-labs/agent-skills: vercel-react-best-practices, web-design-guidelines

## Verification

- Production build: passed.
- ESLint for changed JavaScript/JSX files: passed.
- Git whitespace check: passed.
- Browser layouts checked at 320, 390, 768, and 1440 pixels; narrow-screen overflow corrected.
- Fonts loaded; no broken loaded images or browser console errors observed.
- Mobile navigation, marquee pause, résumé open/close/focus restoration, and certificate viewer checked.
- Five certificate URLs returned HTTP 200 with application/pdf; ATS résumé returned HTTP 200.
- Mobile Lighthouse: accessibility 100, best practices 100, SEO 100. These scores do not measure performance or certify all accessibility behavior. The separate agentic-browsing category reports a missing llms.txt; no such file is needed for the portfolio redesign.
- Repository-wide ESLint has known issues in legacy files outside this redesign. Focused lint checks pass for the updated application files, including DigitalIdCard and WhatIBuild.

## Preview

Run `npm run dev` in this directory, then open the URL printed by Vite.
