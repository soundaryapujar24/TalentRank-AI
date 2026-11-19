/*
 * state.js
 * Shared variables: selected candidate, resume stores (PRI = My Generated CVs, SEC = My Uploaded Resumes), offline outbox (OUT), network state and chatbot progress.
 */

var WALK = 0,
  WL = [];

var SL = {},
  FR = [],
  SL2 = {},
  BL = false,
  SEL = 0;

var tb = document.getElementById("rows"),
  ex = document.getElementById("ex");

var OUT = [],
  PRI = [],
  SEC = [],
  RND = {},
  WD = [],
  WR = [],
  OFR = {},
  SKL = [
    "Python",
    "Java",
    "SQL",
    "NLP",
    "Machine Learning",
    "Deep Learning",
    "FastAPI",
    "Docker",
    "TensorFlow",
    "PyTorch",
    "React",
    "JavaScript",
    "C++",
    "Data Analysis",
    "Excel",
    "Power BI",
  ];

try {
  var sv = JSON.parse(localStorage.getItem("tr_ats"));
  if (sv && sv.p) PRI = sv.p;
  if (sv && sv.s && sv.s.length) SEC = sv.s;
  if (sv && sv.o) OUT = sv.o;
  if (sv) {
    RND = sv.rnd || {};
    WD = sv.wd || [];
    WR = sv.wr || [];
    OFR = sv.of || {};
    (sv.m || []).forEach(function (n) {
      C.forEach(function (c) {
        if (c.n == n) c.m = true;
      });
    });
  }
  C.forEach(function (c) {
    if (OFR[c.n]) c.of = true;
  });
} catch (e) {}

var qi = 0,
  D = {},
  done = false,
  cl = document.getElementById("cl"),
  CAN = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "SQL",
    "NLP",
    "Machine Learning",
    "Deep Learning",
    "FastAPI",
    "Docker",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Git",
    "GitHub",
    "React",
    "HTML",
    "CSS",
    "Flask",
    "Django",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Pandas",
    "NumPy",
    "Excel",
    "Power BI",
    "Tableau",
    "Linux",
    "AWS",
    "Node.js",
    "Transformers",
    "SBERT",
    "C",
    "R",
  ],
  GR = [
    ["Programming", ["python", "java", "c++", "javascript", "c", "r"]],
    [
      "AI and ML",
      [
        "nlp",
        "machine learning",
        "deep learning",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "transformers",
        "sbert",
        "pandas",
        "numpy",
      ],
    ],
    [
      "Data",
      ["sql", "mysql", "postgresql", "mongodb", "excel", "power bi", "tableau"],
    ],
    [
      "Web and APIs",
      ["fastapi", "flask", "django", "react", "html", "css", "node.js"],
    ],
    ["Tools", ["git", "github", "docker", "linux", "aws"]],
  ];

var lg = document.getElementById("lgo");

var CJ = "Machine Learning Engineer";

var bl = document.getElementById("bell");

var ONL = navigator.onLine !== false,
  ROLE = "hr",
  SYN = "";
