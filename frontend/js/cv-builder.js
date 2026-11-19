/*
 * cv-builder.js
 * AI CV builder chatbot: asks questions, reads the answers, draws the live CV preview and saves the CV to My Generated CVs.
 * Functions: say, ask, parse, summary, ps, renderCV, finish, send
 */

function say(t, c) {
  var d = document.createElement("div");
  d.className = "bb " + c;
  d.innerHTML = t;
  cl.appendChild(d);
  cl.scrollTop = cl.scrollHeight;
  return d;
}

function ask() {
  var cc = document.getElementById("cc");
  cc.innerHTML = "";
  if (qi < QS.length) {
    say(QS[qi].q, "bot");
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "Use sample answer: " + QS[qi].ex;
    b.onclick = function () {
      send(QS[qi].ex);
    };
    cc.appendChild(b);
  }
}

function parse(k, t) {
  var skip = /^skip$/i.test(t.trim());
  if (k == "nm") {
    var x = t.replace(/^\s*(i am|i'm|my name is)\s+/i, ""),
      nm = x
        .split(/,| applying| looking| for | as | and /i)[0]
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .join(" "),
      rm = t.match(
        /(?:for|as)\s+(?:an?\s+)?([a-z+# ]+?)\s+(?:role|position|job|internship)/i,
      );
    D.nm = cap(nm || "Your Name");
    D.role = rm ? cap(rm[1]) : "Software Engineer";
  } else if (k == "edu") D.edu = t.trim();
  else if (k == "sk")
    D.sk = t
      .split(/,|\n| and /)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean)
      .map(canon);
  else if (k == "pr")
    D.pr = lines(t.replace(/;/g, "\n")).map(function (l) {
      var m = l.split(/\s+[-–—]\s+|:\s+/),
        ti = m.shift();
      return { t: ti, d: m.join(" - ") };
    });
  else if (k == "ex")
    D.ex = skip
      ? []
      : lines(t).map(function (l) {
          var m = l.split(/\s+[-–—]\s+/),
            hd = m.shift();
          return { h: hd, d: m.join(" - ") };
        });
  else if (k == "ce") D.ce = skip ? [] : lines(t);
  else if (k == "ct") {
    D.em = (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0];
    D.ph = (t.match(/\+?\d[\d\s-]{8,}\d/) || [""])[0];
  }
}

function summary() {
  var dg = D.edu ? D.edu.split(",")[0].trim() : "",
    s = "Aspiring " + D.role + (dg ? " with a " + dg : "") + ".";
  if (D.focus) s += " Focused on " + D.focus + ".";
  s += " Skilled in " + D.sk.slice(0, D.short ? 3 : 5).join(", ") + ".";
  if (D.short) return s;
  if (D.pr && D.pr.length)
    s +=
      " Has built " +
      D.pr.length +
      " project" +
      (D.pr.length > 1 ? "s" : "") +
      ", including " +
      D.pr[0].t +
      ".";
  if (D.ex && D.ex.length)
    s += " Has hands-on experience as " + D.ex[0].h.split(",")[0].trim() + ".";
  return s + " Eager to contribute to a team and keep learning.";
}

function ps(t, b) {
  return "<div class='ps'>" + t + "</div>" + b;
}

function renderCV() {
  var pp = document.getElementById("pp"),
    s = "";
  if (!D.nm) {
    pp.innerHTML =
      "<div style='color:#6b7690;padding:60px 10px;text-align:center'>Your CV will appear here as you answer.</div>";
    return;
  }
  s +=
    "<div class='cv-h'><div class='cv-n'>" +
    esc(D.nm) +
    "</div><div class='cv-r'>" +
    esc(D.role) +
    "</div>" +
    (D.em || D.ph
      ? "<div class='cv-c'>" +
        [D.em, D.ph].filter(Boolean).map(esc).join(" · ") +
        "</div>"
      : "") +
    "</div>";
  if (D.sk) s += ps("Professional summary", "<p>" + esc(summary()) + "</p>");
  if (D.edu) s += ps("Education", "<p>" + esc(D.edu) + "</p>");
  if (D.sk) {
    var g = "";
    GR.forEach(function (r) {
      var m = D.sk.filter(function (x) {
        return r[1].indexOf(x.toLowerCase()) >= 0;
      });
      if (m.length)
        g += "<p><b>" + r[0] + ":</b> " + m.map(esc).join(", ") + "</p>";
    });
    var o = D.sk.filter(function (x) {
      return !GR.some(function (r) {
        return r[1].indexOf(x.toLowerCase()) >= 0;
      });
    });
    if (o.length) g += "<p><b>Other:</b> " + o.map(esc).join(", ") + "</p>";
    s += ps("Technical skills", g);
  }
  if (D.pr && D.pr.length)
    s += ps(
      "Projects",
      D.pr
        .map(function (p) {
          var te = CAN.concat(D.sk || []).filter(function (x, i, a) {
            return (
              x.length > 2 &&
              a.indexOf(x) == i &&
              new RegExp(
                "\\b" + x.replace(/[+.]/g, "\\$&") + "(?![\\w])",
                "i",
              ).test(p.d)
            );
          });
          return (
            "<p><b>" +
            esc(p.t) +
            "</b></p><ul>" +
            (p.d ? "<li>" + esc(dot(cf(p.d))) + "</li>" : "") +
            (te.length
              ? "<li>Technologies: " + te.map(esc).join(", ") + ".</li>"
              : "") +
            "</ul>"
          );
        })
        .join(""),
    );
  if (D.ex && D.ex.length)
    s += ps(
      "Experience",
      D.ex
        .map(function (e) {
          return (
            "<p><b>" +
            esc(e.h) +
            "</b></p>" +
            (e.d ? "<ul><li>" + esc(dot(cf(e.d))) + "</li></ul>" : "")
          );
        })
        .join(""),
    );
  if (D.ce && D.ce.length)
    s += ps(
      "Certifications and achievements",
      "<ul>" +
        D.ce
          .map(function (c) {
            return "<li>" + esc(c) + "</li>";
          })
          .join("") +
        "</ul>",
    );
  pp.innerHTML = "<div class='cv t-" + (D.tpl || LASTTPL) + "'>" + s + "</div>";
  if (window.cpMark) cpMark();
}

function finish() {
  var f =
    D.nm.replace(/\s+/g, "_") +
    "_" +
    D.role
      .split(" ")
      .map(function (w) {
        return w[0];
      })
      .join("") +
    "_Resume";
  D.tpl = D.tpl || LASTTPL;
  PRI.push({
    n: f,
    role: D.role,
    d: "Just now",
    ns: !ONL,
    h: document.getElementById("pp").innerHTML,
    data: cpCopy(D),
    tpl: D.tpl,
  });
  CUR = PRI.length - 1;
  stores("p" + CUR);
  done = true;
  EM = { from: "" };
  say(
    "Your CV is ready. I saved it in <b>My Generated CVs</b> as <b>" +
      f +
      "</b>. Pick a template on the right, or just tell me a change in one line, for example <i>Tailor this for a Data Analyst role</i>.",
    "bot",
  );
  if (!ONL)
    say(
      "You are offline, so I built this CV on your device. It will sync to My Generated CVs when you are back online. When you are online I can also polish the wording with AI.",
      "bot",
    );
  document.getElementById("ed").style.display = "";
  cpChips();
  renderFit();
  cpButtons();
}

function send(t) {
  t = t.trim();
  if (!t) return;
  document.getElementById("ci").value = "";
  if (done) {
    if (EM && EM.imp != null)
      say("Pasted resume text (" + t.split(/\n/).length + " lines)", "me");
    else say(esc(t).replace(/\n/g, "<br>"), "me");
    cpPrompt(t);
    return;
  }
  say(esc(t).replace(/\n/g, "<br>"), "me");
  parse(QS[qi].k, t);
  qi++;
  renderCV();
  if (qi < QS.length) setTimeout(ask, 450);
  else {
    document.getElementById("cc").innerHTML = "";
    var b = say("<span class='dots'><i></i><i></i><i></i></span>", "bot");
    setTimeout(function () {
      b.remove();
      finish();
    }, 900);
  }
}
