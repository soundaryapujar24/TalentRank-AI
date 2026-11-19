/*
 * copilot.js
 * Career Copilot: CV templates, the Resume Vault edit flow, one-prompt role tailoring, the Role Fit meter and the skill-gap roadmap.
 * In the full project the prompt handler calls the AI backend. Here it is a rule-based demo that works offline.
 * Functions: cpRole, cpFit, cpTailor, cpImport, cpPrompt, cpSave, cpButtons, cpStart, editCV, editUP, cpQuick, cpFill, renderFit, cpMark
 */

var LASTTPL = "modern",
  CUR = -1,
  EM = null,
  FB = null,
  TPL = [
    ["modern", "Modern"],
    ["classic", "Classic"],
    ["minimal", "Minimal"],
    ["creative", "Creative"],
  ];

var TPLCSS =
  ".cv{font-family:Arial,Helvetica,sans-serif;color:#1b2333}" +
  ".cv .cv-n{font-size:22px;font-weight:800}.cv .cv-r{font-weight:700}.cv .cv-c{font-size:12px}" +
  ".cv .ps{margin:14px 0 6px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase}" +
  ".cv p{margin:0 0 3px}.cv ul{margin:3px 0 4px 18px;padding:0}" +
  ".t-modern .cv-h{background:linear-gradient(135deg,#0F9D8A,#0F7F9D);color:#fff;padding:16px 18px;border-radius:8px;margin-bottom:6px}" +
  ".t-modern .cv-r{color:#d8fffa}.t-modern .cv-c{color:#e6fbff}" +
  ".t-modern .ps{color:#0f7f9d;border-bottom:2px solid #bfe9e4;padding-bottom:3px}" +
  ".t-classic{font-family:Georgia,'Times New Roman',serif}" +
  ".t-classic .cv-h{text-align:center;border-bottom:2px solid #111;padding-bottom:10px}" +
  ".t-classic .cv-r{color:#333;font-style:italic}.t-classic .cv-c{color:#444}" +
  ".t-classic .ps{color:#111;border-bottom:1px solid #111;padding-bottom:2px}" +
  ".t-minimal .cv-h{padding-bottom:8px}" +
  ".t-minimal .cv-n{font-weight:300;font-size:26px;letter-spacing:1px}" +
  ".t-minimal .cv-r{color:#6b7690;font-weight:400}.t-minimal .cv-c{color:#6b7690}" +
  ".t-minimal .ps{color:#6b7690;font-weight:600;letter-spacing:2px}" +
  ".t-creative .cv-h{background:#1b2040;color:#fff;padding:16px 18px;border-radius:8px;border-left:8px solid #8B5CF6}" +
  ".t-creative .cv-r{color:#c4b5fd}.t-creative .cv-c{color:#cbd5e1}" +
  ".t-creative .ps{display:inline-block;background:linear-gradient(90deg,#8B5CF6,#14B8A6);color:#fff;padding:3px 10px;border-radius:99px}";

(function () {
  var s = document.createElement("style");
  s.textContent = TPLCSS;
  document.head.appendChild(s);
})();

/* ---------- role profiles ---------- */
var RP = [
  { n: "Machine Learning Engineer", k: ["machine learning engineer", "ml engineer", "ai engineer"], core: ["Python", "Machine Learning", "Deep Learning", "NLP", "PyTorch", "TensorFlow", "Scikit-learn", "Docker", "FastAPI"], f: "building and deploying machine learning models" },
  { n: "NLP Engineer", k: ["nlp engineer"], core: ["Python", "NLP", "Transformers", "SBERT", "PyTorch", "FastAPI", "Docker"], f: "language models and text understanding" },
  { n: "Data Scientist", k: ["data scientist"], core: ["Python", "Machine Learning", "SQL", "Pandas", "NumPy", "Scikit-learn", "NLP"], f: "finding insights and building predictive models from data" },
  { n: "Data Analyst", k: ["data analyst", "business analyst"], core: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Pandas", "NumPy"], f: "turning data into clear insights and dashboards" },
  { n: "Backend Developer", k: ["backend", "back-end", "back end"], core: ["Python", "FastAPI", "Flask", "Django", "SQL", "PostgreSQL", "MongoDB", "Docker", "Git", "AWS"], f: "building reliable APIs and database-backed services" },
  { n: "Frontend Developer", k: ["frontend", "front-end", "front end"], core: ["JavaScript", "React", "HTML", "CSS", "Git", "Node.js"], f: "building fast and accessible user interfaces" },
  { n: "Full Stack Developer", k: ["full stack", "full-stack", "fullstack"], core: ["JavaScript", "React", "Node.js", "HTML", "CSS", "SQL", "MongoDB", "Git", "Docker"], f: "delivering complete features from the interface to the database" },
  { n: "DevOps Engineer", k: ["devops"], core: ["Docker", "Linux", "AWS", "Git", "GitHub", "Python"], f: "automating deployment and keeping systems reliable" },
  { n: "Software Engineer", k: ["software engineer", "software developer"], core: ["Python", "Java", "C++", "Git", "SQL", "Docker"], f: "writing clean, tested and maintainable software" },
];

var RM = {
  Docker: "Containerize one of your projects with a Dockerfile (about 2 days)",
  SQL: "Practice joins and group-by on a sample database, then add one SQL project (about 1 week)",
  FastAPI: "Wrap one of your models in a FastAPI endpoint (about 2 days)",
  "Power BI": "Build one dashboard from a public dataset (about 3 days)",
  Tableau: "Publish one Tableau Public dashboard (about 3 days)",
  Excel: "Learn pivot tables and lookups, then clean one real dataset (about 2 days)",
  Git: "Put your projects on GitHub with clear commits and a README (about 1 day)",
  AWS: "Deploy one small app on the AWS free tier (about 1 week)",
  React: "Build a small React app with state and API calls (about 1 week)",
  PyTorch: "Reproduce one small model in PyTorch (about 1 week)",
  TensorFlow: "Train one small model with TensorFlow/Keras (about 1 week)",
  Pandas: "Do a full data-cleaning exercise in Pandas (about 3 days)",
};

function lc(s) {
  return String(s).toLowerCase();
}

function cpHas(txt, s) {
  return new RegExp("(^|[^\\w])" + s.replace(/[+.]/g, "\\$&") + "(?![\\w])", "i").test(txt);
}

function cpRole(t) {
  var l = lc(t),
    f = null;
  RP.forEach(function (r) {
    if (!f && r.k.concat([lc(r.n)]).some(function (a) { return l.indexOf(a) >= 0; })) f = r;
  });
  return f;
}

function cpCustom(t) {
  var m = t.match(/\b(?:for|as|to)\s+(?:an?\s+|the\s+)?([a-z+# \/&-]{3,40}?)\s*(?:role|position|job|opening|internship)?\s*[.!]?\s*$/i);
  if (!m) return null;
  var n = m[1].trim();
  if (/^(me|it|this|my|that|a|an|the)$/i.test(n)) return null;
  return { n: cap(n), core: ["Python", "Git", "SQL", "Docker", "AWS", "Linux"], f: "delivering dependable work as a " + n.toLowerCase() };
}

function cpText(d) {
  var a = [];
  (d.pr || []).forEach(function (p) { a.push(p.t + " " + p.d); });
  (d.ex || []).forEach(function (e) { a.push(e.h + " " + e.d); });
  return a.join(" \n ");
}

/* Role fit: same idea as the HR screen. 55% skills match, 30% proof inside projects/experience, 15% presentation. */
function cpFit(d, rp) {
  var sk = (d.sk || []).map(lc),
    txt = cpText(d),
    have = rp.core.filter(function (c) { return sk.indexOf(lc(c)) >= 0; }),
    miss = rp.core.filter(function (c) { return sk.indexOf(lc(c)) < 0; }),
    proof = have.filter(function (c) { return cpHas(txt, c); }),
    top = sk.slice(0, 5),
    topHit = rp.core.filter(function (c) { return top.indexOf(lc(c)) >= 0; }).length,
    cov = have.length / rp.core.length,
    pr = have.length ? proof.length / have.length : 0,
    pres = Math.min(1, topHit / Math.min(5, rp.core.length)) * 0.7 + (d.role == rp.n ? 0.3 : 0);
  return {
    score: Math.round(100 * (0.55 * cov + 0.3 * pr + 0.15 * pres)),
    cov: Math.round(cov * 100),
    proof: Math.round(pr * 100),
    pres: Math.round(pres * 100),
    have: have,
    miss: miss,
  };
}

function cpCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

/* Truthful tailoring: reorders and rewrites what the candidate really has. It never adds skills. */
function cpTailor(d, rp) {
  var n = cpCopy(d),
    core = rp.core.map(lc),
    ch = [],
    old = (n.sk || []).join("|"),
    rel = function (x) { return core.indexOf(lc(x)) >= 0 ? 1 : 0; };
  n.role = rp.n;
  n.focus = rp.f;
  n.sk = (n.sk || [])
    .map(function (s, i) { return [s, i]; })
    .sort(function (a, b) { return rel(b[0]) - rel(a[0]) || a[1] - b[1]; })
    .map(function (x) { return x[0]; });
  var po = (n.pr || []).map(function (p) { return p.t; }).join("|"),
    sc = function (p) {
      return rp.core.filter(function (c) { return cpHas(p.t + " " + p.d, c); }).length;
    };
  n.pr = (n.pr || [])
    .map(function (p, i) { return [p, i]; })
    .sort(function (a, b) { return sc(b[0]) - sc(a[0]) || a[1] - b[1]; })
    .map(function (x) { return x[0]; });
  ch.push("Target role changed to <b>" + esc(rp.n) + "</b>");
  if (n.sk.join("|") != old) ch.push("Moved the skills this role asks for to the top of your skills list");
  if ((n.pr || []).map(function (p) { return p.t; }).join("|") != po) ch.push("Put your most relevant project first");
  ch.push("Rewrote the summary to focus on " + esc(rp.f));
  return { d: n, ch: ch };
}

/* ---------- import text of an uploaded resume ---------- */
var SAMPLE_TXT =
  "Vikram J\nvikram@example.com, +91 98765 11111\nB.E. in CSE, XYZ Institute of Technology, 2023-2027, CGPA 7.8\nSkills: Python, SQL, Excel, Git, Pandas\nProjects\nSales Dashboard - cleaned sales data with Pandas and SQL and built charts in Excel\nCollege Fest Website - built the event page with HTML and CSS\nExperience\nData Intern, PQR Solutions, May-Jun 2026 - prepared weekly reports using Excel and SQL\nAchievements\nNPTEL Python for Data Science";

function cpImport(t) {
  var L = t.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean),
    buf = { head: [], edu: [], sk: [], pr: [], ex: [], ce: [] },
    sec = "head",
    hd = [
      [/^(education|academics?|qualification)/i, "edu"],
      [/^(technical\s+)?skills/i, "sk"],
      [/^(academic\s+)?projects?/i, "pr"],
      [/^(work\s+)?experience|^internships?/i, "ex"],
      [/^(certifications?|achievements?)/i, "ce"],
    ];
  L.forEach(function (l) {
    var h = null;
    hd.forEach(function (x) {
      if (x[0].test(l) && (l.length < 32 || /^[^:]{3,32}:/.test(l))) h = x[1];
    });
    if (h) {
      sec = h;
      var rest = /:/.test(l) ? l.replace(/^[^:]*:\s*/, "") : "";
      if (rest) buf[sec].push(rest);
      return;
    }
    buf[sec].push(l.replace(/^[-•*·]\s*/, ""));
  });
  var all = t,
    d = { sk: [], pr: [], ex: [], ce: [] },
    nm = (buf.head[0] || "").split(/[|,]/)[0].trim();
  d.nm = !nm || /@|\d/.test(nm) || nm.split(/\s+/).length > 4 ? "Your Name" : cap(nm);
  d.em = (all.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0];
  d.ph = (all.match(/\+?\d[\d\s-]{8,}\d/) || [""])[0];
  var rp = cpRole(buf.head.join(" "));
  d.role = rp ? rp.n : "Software Engineer";
  d.edu = buf.edu.join(", ");
  var raw = buf.sk.join(",").split(/,|;|\||\n/).map(function (s) { return s.trim(); }).filter(Boolean);
  d.sk = (raw.length ? raw : CAN.filter(function (c) { return cpHas(all, c); })).map(canon);
  d.pr = buf.pr.map(function (l) {
    var m = l.split(/\s+[-–—]\s+|:\s+/), ti = m.shift();
    return { t: ti, d: m.join(" - ") };
  });
  d.ex = buf.ex.map(function (l) {
    var m = l.split(/\s+[-–—]\s+/), h = m.shift();
    return { h: h, d: m.join(" - ") };
  });
  d.ce = buf.ce;
  return d;
}

/* ---------- prompt handler ---------- */
function cpPrompt(t) {
  if (EM && EM.imp != null) return cpDoImport(t);
  var raw = t.trim(),
    l = lc(raw),
    ch = [],
    before = cpCopy(D),
    m,
    tail = /(tailor|role|position|job|opening|apply|switch|convert|adapt|customi[sz]e|rewrite|make (it|this|my)|change (it|my|this)|update (it|my|this)|for a |for an )/i.test(raw);

  /* template */
  var tm = l.match(/\b(modern|classic|minimal|creative)\b/);
  if (tm && /(template|style|layout|design|look|theme)/.test(l)) {
    D.tpl = LASTTPL = tm[1];
    ch.push("Switched to the <b>" + cf(tm[1]) + "</b> template");
  }
  /* add certification / project */
  if ((m = raw.match(/^\s*add\s+(?:a\s+|an\s+)?(?:certifications?|achievements?)\s*[:\-]?\s*(.+)$/i))) {
    D.ce = (D.ce || []).concat(lines(m[1]));
    ch.push("Added to certifications: " + esc(m[1]));
  } else if ((m = raw.match(/^\s*add\s+(?:a\s+|an\s+)?project\s*[:\-]?\s*(.+)$/i))) {
    var q = m[1].split(/\s+[-–—]\s+|:\s+/), ti = q.shift();
    (D.pr = D.pr || []).push({ t: ti, d: q.join(" - ") });
    ch.push("Added project <b>" + esc(ti) + "</b>");
  } else if ((m = raw.match(/^\s*add\s+(?:the\s+)?(?:skills?\s*[:\-]?\s*)?(.+?)(?:\s+to\s+(?:my\s+)?(?:skills?|cv|resume))?\s*$/i)) && !/\b(role|position|job)\b/i.test(raw)) {
    var add = m[1].split(/,|\band\b/).map(function (s) { return s.trim(); }).filter(Boolean).map(canon),
      ne = add.filter(function (s) { return (D.sk || []).map(lc).indexOf(lc(s)) < 0; });
    if (ne.length) {
      D.sk = (D.sk || []).concat(ne);
      ch.push("Added skills: <b>" + ne.map(esc).join(", ") + "</b>");
    } else ch.push("Those skills are already on your CV");
  } else if ((m = raw.match(/^\s*(?:remove|delete)\s+(?:the\s+)?(?:skills?\s*[:\-]?\s*)?(.+?)\s*$/i))) {
    var rm = m[1].split(/,|\band\b/).map(function (s) { return lc(s.trim()); }),
      kept = (D.sk || []).filter(function (s) { return rm.indexOf(lc(s)) < 0; });
    if (kept.length != (D.sk || []).length) {
      ch.push("Removed: <b>" + esc(m[1]) + "</b>");
      D.sk = kept;
    } else ch.push("I could not find " + esc(m[1]) + " in your skills");
  }
  /* summary length */
  if (/summary/.test(l) && /(shorter|short|concise|brief)/.test(l)) {
    D.short = true;
    ch.push("Made the summary shorter");
  } else if (/summary/.test(l) && /(longer|detailed|expand|full)/.test(l)) {
    D.short = false;
    ch.push("Restored the full summary");
  }
  /* role: fit check or tailoring */
  var rp = ch.length ? null : cpRole(raw) || (tail ? cpCustom(raw) : null);
  if (rp) {
    var checkOnly = /\b(fit|match|ready|chances|suit|score)\b/.test(l) && !/(tailor|switch|convert|rewrite|adapt|customi|make|change|update|apply)/.test(l),
      f0 = cpFit(D, rp);
    if (checkOnly) {
      say(cpReport(rp, f0), "bot");
      renderFit(rp);
      return;
    }
    var r = cpTailor(D, rp),
      f1 = cpFit(r.d, rp);
    D = r.d;
    D.tpl = D.tpl || LASTTPL;
    FB = { role: rp.n, b: f0.score, a: f1.score };
    ch = r.ch;
    if (f1.miss.length) ch.push("<b>" + f1.miss.length + "</b> skill" + (f1.miss.length > 1 ? "s are" : " is") + " still missing for this role. I did not add them, see the roadmap");
    say("Done. Here is what I changed:<ul>" + ch.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>Role fit for <b>" + esc(rp.n) + "</b> moved from <b>" + f0.score + "</b> to <b>" + f1.score + "</b>. Nothing was invented. Save it as a new resume to keep your original.", "bot");
    renderCV();
    renderFit(rp);
    cpButtons();
    return;
  }
  if (!ch.length) {
    say("I can tailor this CV for a role, add or remove skills, add a project or certification, shorten the summary, or change the template. Try one of the examples below.", "bot");
    cpChips();
    return;
  }
  say("Done:<ul>" + ch.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>", "bot");
  renderCV();
  renderFit();
  cpButtons();
}

function cpReport(rp, f) {
  return (
    "Your fit for <b>" + esc(rp.n) + "</b> is <b>" + f.score + "/100</b> (skills match " + f.cov + "%, proof in projects " + f.proof + "%, presentation " + f.pres + "%)." +
    (f.miss.length ? " Missing: " + f.miss.map(esc).join(", ") + "." : " You have every core skill.") +
    " Say <i>Tailor this for " + esc(rp.n) + " role</i> to rewrite your CV for it."
  );
}

/* ---------- fit panel ---------- */
function renderFit(rp) {
  var e = document.getElementById("fit");
  if (!e) return;
  if (!done || !D.nm || !D.sk) {
    e.innerHTML = "";
    return;
  }
  rp = rp || cpRole(D.role) || { n: D.role, core: ["Python", "Git", "SQL", "Docker"], f: "" };
  var f = cpFit(D, rp),
    col = f.score >= 75 ? "#0F9D8A" : f.score >= 60 ? "#E0A100" : "#D64545",
    h = "<div class='fitc'><div class='fh'>" + ring(f.score).replace("width='84' height='84'", "width='70' height='70'") + "<div><b>Role fit: " + esc(rp.n) + "</b><small>Scored with the same rules HR screening uses, so there are no surprises after you apply.</small></div></div>";
  h += bar("Skills match", f.cov, f.cov + "%", f.cov) + bar("Proof in projects", f.proof, f.proof + "%", f.proof) + bar("Presentation", f.pres, f.pres + "%", f.pres);
  if (FB && FB.role == rp.n) h += "<div class='fbn'>Tailoring lifted your fit from <b>" + FB.b + "</b> to <b>" + FB.a + "</b></div>";
  if (f.miss.length) {
    h += "<h3>Skill gaps and a mini roadmap</h3><ul class='rmp'>";
    f.miss.slice(0, 4).forEach(function (s) {
      h += "<li><b>" + esc(s) + "</b><span>" + esc(RM[s] || "Finish a short course on " + s + " and add one mini-project that uses it (about 1 week)") + "</span></li>";
    });
    h += "</ul>";
  } else h += "<div class='note'>You cover every core skill for this role.</div>";
  h += "<div class='note'>Truthful by design: the AI only reorders and rewords what you really have. Missing skills become a learning plan, never fake keywords.</div></div>";
  e.innerHTML = h;
  void col;
}

/* ---------- templates picker ---------- */
function cpMark() {
  var t = (D && D.tpl) || LASTTPL;
  document.querySelectorAll("#tpls button").forEach(function (b) {
    b.classList.toggle("on", b.dataset.t == t);
  });
}

function cpTplUI() {
  var e = document.getElementById("tpls");
  if (!e) return;
  e.innerHTML = TPL.map(function (x) {
    return "<button type='button' class='tp' data-t='" + x[0] + "'><i class='th th-" + x[0] + "'><u></u><u></u><u></u></i><span>" + x[1] + "</span></button>";
  }).join("");
  e.onclick = function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    LASTTPL = b.dataset.t;
    D.tpl = LASTTPL;
    renderCV();
  };
  cpMark();
}

/* ---------- save and buttons ---------- */
function cpName() {
  var f = D.nm.replace(/\s+/g, "_") + "_" + D.role.split(" ").map(function (w) { return w[0]; }).join("") + "_Resume",
    n = f,
    k = 2;
  while (PRI.some(function (r) { return r.n == n; })) n = f + "_v" + k++;
  return n;
}

function cpSave(asNew) {
  var h = document.getElementById("pp").innerHTML,
    data = cpCopy(D);
  if (!asNew && CUR >= 0 && PRI[CUR]) {
    PRI[CUR].data = data;
    PRI[CUR].h = h;
    PRI[CUR].tpl = D.tpl;
    PRI[CUR].role = D.role;
    PRI[CUR].d = "Just now";
    stores("p" + CUR);
    say("Saved your changes to <b>" + esc(PRI[CUR].n) + "</b>.", "bot");
  } else {
    var n = cpName();
    PRI.push({ n: n, role: D.role, d: "Just now", ns: !ONL, h: h, data: data, tpl: D.tpl, from: (EM && EM.from) || (PRI[CUR] && PRI[CUR].n) || "" });
    CUR = PRI.length - 1;
    stores("p" + CUR);
    say("Saved as a new resume: <b>" + esc(n) + "</b>. Your original is untouched. You can find it in the Resume vault.", "bot");
  }
  cpButtons();
}

function cpButtons() {
  var pa = document.getElementById("pa");
  if (!done) {
    pa.innerHTML = "";
    return;
  }
  pa.innerHTML =
    (CUR >= 0 ? "<button class='btn' id='sv'>Save changes</button> " : "") +
    "<button class='btn' id='sn'>Save as new resume</button> <button class='btn' id='ap2'>Apply with this CV</button> <button class='btn' id='so' style='background:var(--mut);box-shadow:none'>Start over</button>";
  if (CUR >= 0) document.getElementById("sv").onclick = function () { cpSave(false); };
  document.getElementById("sn").onclick = function () { cpSave(true); };
  document.getElementById("ap2").onclick = function () {
    if (CUR < 0) cpSave(true);
    nav("cd", "a");
  };
  document.getElementById("so").onclick = function () {
    D = {};
    qi = 0;
    done = false;
    EM = null;
    CUR = -1;
    FB = null;
    cl.innerHTML = "";
    document.getElementById("ed").style.display = "none";
    document.getElementById("mb").style.display = "none";
    document.getElementById("fit").innerHTML = "";
    pa.innerHTML = "";
    var pp = document.getElementById("pp");
    pp.contentEditable = "false";
    document.getElementById("ed").textContent = "Edit CV";
    renderCV();
    ask();
  };
}

/* ---------- edit mode ---------- */
var EXAMPLES = [
  "Tailor this CV for a Data Analyst role",
  "How well do I fit a Backend Developer role?",
  "Add skill Docker",
  "Use the Creative template",
  "Make my summary shorter",
];

function cpChips() {
  var cc = document.getElementById("cc");
  cc.innerHTML = "";
  EXAMPLES.forEach(function (t) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = t;
    b.onclick = function () { send(t); };
    cc.appendChild(b);
  });
}

function cpBanner(t) {
  var e = document.getElementById("mb");
  e.style.display = "";
  e.innerHTML = t;
}

function cpStart(d, tpl, cur, label, from) {
  D = d;
  D.tpl = tpl || D.tpl || LASTTPL;
  LASTTPL = D.tpl;
  CUR = cur;
  FB = null;
  qi = QS.length;
  done = true;
  EM = { from: from || "" };
  cl.innerHTML = "";
  var pp = document.getElementById("pp");
  pp.contentEditable = "false";
  document.getElementById("ed").textContent = "Edit CV";
  document.getElementById("ed").style.display = "";
  cpBanner("<b>Edit mode:</b> " + esc(label) + ". Describe any change in one line and the AI will do it.");
  say("I opened <b>" + esc(label) + "</b>. Tell me what to change in one line. For example, tailor it for a different role, add a skill, or switch the template.", "bot");
  cpChips();
  renderCV();
  renderFit();
  cpButtons();
}

function editCV(i) {
  var r = PRI[i];
  if (!r) return;
  if (!r.data) {
    alert("This older CV has no editable data saved. Please create it again with the AI CV builder.");
    return;
  }
  nav("cd", "b");
  cpStart(cpCopy(r.data), r.tpl, i, r.n, r.n);
}

function editUP(i, pending) {
  var r = SEC[i];
  if (!r) return;
  nav("cd", "b");
  D = {};
  done = true;
  CUR = -1;
  FB = null;
  qi = QS.length;
  EM = { imp: i, from: r.n, pending: pending || "" };
  cl.innerHTML = "";
  document.getElementById("ed").style.display = "none";
  document.getElementById("fit").innerHTML = "";
  document.getElementById("pa").innerHTML = "";
  cpBanner("<b>Import mode:</b> " + esc(r.n) + " is stored as a file. Paste its text once and it becomes an editable CV.");
  say("You chose <b>" + esc(r.n) + "</b>. Paste the text of this resume in the box below. Once the backend parser is connected this step will happen automatically.", "bot");
  var cc = document.getElementById("cc");
  cc.innerHTML = "";
  var b = document.createElement("button");
  b.type = "button";
  b.textContent = "Use a sample resume text";
  b.onclick = function () { send(SAMPLE_TXT); };
  cc.appendChild(b);
  renderCV();
}

function cpDoImport(t) {
  var name = EM.from,
    pend = EM.pending;
  D = cpImport(t);
  D.tpl = LASTTPL;
  EM = { from: name };
  cpBanner("<b>Edit mode:</b> editable copy of " + esc(name) + ". Your uploaded file stays unchanged. Saving creates a new generated CV.");
  document.getElementById("ed").style.display = "";
  say("I turned it into an editable CV: <b>" + D.sk.length + "</b> skills, <b>" + D.pr.length + "</b> project" + (D.pr.length == 1 ? "" : "s") + " found. Your uploaded file is untouched, and anything you save becomes a new generated CV.", "bot");
  renderCV();
  renderFit();
  cpButtons();
  cpChips();
  if (pend) {
    say(esc(pend), "me");
    cpPrompt(pend);
  }
}

/* ---------- quick prompt from the Resume vault ---------- */
function cpFill() {
  var s = document.getElementById("qr");
  if (!s) return;
  var o = "";
  PRI.forEach(function (r, i) { o += "<option value='p" + i + "'>Generated CV · " + esc(r.n) + "</option>"; });
  SEC.forEach(function (r, i) { o += "<option value='s" + i + "'>Uploaded · " + esc(r.n) + "</option>"; });
  s.innerHTML = o || "<option value=''>No resumes yet</option>";
}

function cpQuick() {
  var v = document.getElementById("qr").value,
    t = document.getElementById("qp").value.trim(),
    m = document.getElementById("qm");
  if (!v) {
    m.textContent = "Create or upload a resume first.";
    return;
  }
  if (!t) {
    m.textContent = "Type what you want, for example: Tailor this for a Data Analyst role.";
    return;
  }
  m.textContent = "";
  document.getElementById("qp").value = "";
  var i = +v.slice(1);
  if (v.charAt(0) == "p") {
    if (!PRI[i].data) {
      m.textContent = "This older CV has no editable data. Create it again with the AI CV builder.";
      return;
    }
    editCV(i);
    say(esc(t), "me");
    cpPrompt(t);
  } else editUP(i, t);
}

/* ---------- start-up ---------- */
cpTplUI();
