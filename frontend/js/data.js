/*
 * data.js
 * Demo data: job requirements (Q), resume evidence lines (R), candidates (C), CV chatbot questions (QS) and interview slots (TM, IV). In the full project this data comes from the backend API.
 */

var Q = [
  "Build NLP models for text classification",
  "Deploy models as APIs",
  "Work with SQL databases",
  "Containerize applications",
];

var R = [
  "Built a BERT resume classifier with 94% accuracy",
  "Deployed a FastAPI service handling 2k requests a day",
  "Designed a PostgreSQL schema for 50k records",
  "Packaged the app with Docker for deployment",
];

var C = [
  {
    n: "Ananya Rao",
    src: "AI",
    s: 91,
    a: 92,
    b: 90,
    r: "Fit",
    v: [0.91, 0.87, 0.8, 0.72],
    ok: ["Python", "NLP", "SQL", "FastAPI"],
    no: ["Docker"],
  },
  {
    n: "Rohit Nair",
    src: "UP",
    s: 86,
    a: 88,
    b: 83,
    r: "Fit",
    v: [0.62, 0.85, 0.83, 0.86],
    ok: ["Python", "SQL", "Docker"],
    no: ["NLP", "FastAPI"],
  },
  {
    n: "Meera Iyer",
    src: "UP",
    s: 78,
    a: 80,
    b: 75,
    r: "Fit",
    v: [0.66, 0.7, 0.81, 0.45],
    ok: ["Python", "SQL"],
    no: ["NLP", "Docker"],
  },
  {
    n: "Karthik S",
    src: "AI",
    s: 71,
    a: 70,
    b: 72,
    r: "Close fit",
    v: [0.5, 0.68, 0.74, 0.4],
    ok: ["Python", "SQL"],
    no: ["NLP", "FastAPI", "Docker"],
  },
  {
    n: "Sneha Patil",
    src: "UP",
    s: 64,
    a: 62,
    b: 68,
    r: "Close fit",
    v: [0.42, 0.55, 0.61, 0.3],
    ok: ["Python"],
    no: ["NLP", "SQL", "Docker"],
  },
  {
    n: "Vikram J",
    src: "UP",
    s: 52,
    a: 50,
    b: 55,
    r: "Not fit",
    v: [0.3, 0.35, 0.44, 0.28],
    ok: ["Java"],
    no: ["Python", "NLP", "SQL"],
  },
];

var TM = ["10:00 AM", "11:00 AM", "2:00 PM"],
  IV = ["Dr. Mehta", "Priya S."];

var QS = [
  {
    k: "nm",
    q: "Hi! Let's build your CV. What is your full name, and which role are you applying for?",
    ex: "I am Ananya Rao, applying for a Machine Learning Engineer role",
  },
  {
    k: "edu",
    q: "Thanks! What is your education? Degree, college, years and CGPA.",
    ex: "B.E. in CSE (AI & ML), ABC College of Engineering (VTU), 2023-2027, CGPA 8.4",
  },
  {
    k: "sk",
    q: "Which skills do you have? Separate them with commas.",
    ex: "Python, NLP, SQL, FastAPI, Docker, Scikit-learn, Git",
  },
  {
    k: "pr",
    q: "Tell me about your best projects. Write one per line as: project name - what it does.",
    ex: "AI Resume Screener - ranks resumes against a job description using SBERT and keyword matching in Python\nStudent Helpdesk Chatbot - answers college FAQs using NLP and FastAPI",
  },
  {
    k: "ex",
    q: "Any internships or work experience? Write: role, company, dates - what you did. Type skip if none.",
    ex: "ML Intern, ABC Technologies, Jun-Jul 2026 - cleaned datasets and trained a text classifier using Python and Scikit-learn",
  },
  {
    k: "ce",
    q: "Certifications and achievements? Separate them with semicolons. Type skip if none.",
    ex: "NPTEL Machine Learning course; Winner, college hackathon 2026",
  },
  {
    k: "ct",
    q: "Last step. Your email and phone number for the CV header.",
    ex: "ananya@example.com, +91 98765 43210",
  },
];
