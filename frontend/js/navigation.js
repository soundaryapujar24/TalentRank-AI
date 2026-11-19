/*
 * navigation.js
 * Switching between screens and roles, the landing page, the notification bell and the count-up animation.
 * Functions: nav, countUp, goHome, notes
 */

function nav(role, v) {
  document.body.classList.remove("land");
  document.querySelectorAll(".role button").forEach(function (b) {
    b.classList.toggle("on", b.dataset.r == role);
  });
  document.querySelectorAll("nav button").forEach(function (b) {
    b.style.display = b.dataset.r == role ? "" : "none";
    b.classList.toggle("on", b.dataset.v == v);
  });
  document.querySelectorAll("section").forEach(function (s) {
    s.classList.toggle("on", s.id == v);
  });
  var ab = document.querySelector("nav button.on");
  document.getElementById("crumb").textContent =
    (role == "hr" ? "HR workspace" : "Candidate portal") +
    (ab ? " / " + ab.textContent : "");
  document.getElementById("whol").textContent =
    role == "hr" ? "HR Admin" : "Candidate";
  document.getElementById("whoa").textContent = role == "hr" ? "HR" : "C";
  ROLE = role;
  netUI();
  notes(role);
  if (v == "d") countUp();
}

function countUp() {
  if (
    window.matchMedia &&
    matchMedia("(prefers-reduced-motion:reduce)").matches
  )
    return;
  document.querySelectorAll(".stat b").forEach(function (e) {
    if (e.dataset.n === undefined) e.dataset.n = e.textContent;
    var n = +e.dataset.n,
      t0 = null;
    function f(t) {
      t0 = t0 || t;
      var q = Math.min((t - t0) / 900, 1);
      e.textContent = Math.round(n * (1 - Math.pow(1 - q, 3)));
      if (q < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  });
}

function goHome() {
  document.body.classList.add("land");
  document.querySelectorAll("section").forEach(function (s) {
    s.classList.toggle("on", s.id == "home");
  });
  window.scrollTo(0, 0);
}

function notes(role) {
  var L =
    role == "hr"
      ? [
          ["Ananya Rao confirmed her slot", "5 min ago"],
          ["New application: Machine Learning Engineer", "12 min ago"],
          ["Scheduler checked all slots: 0 clashes", "1 hour ago"],
        ]
      : [
          ["Your CV was saved in My Generated CVs", "Just now"],
          ["Your application is being screened", "2 min ago"],
          ["Interview slots are shared once you are shortlisted", "1 hour ago"],
        ];
  document.getElementById("np").innerHTML = L.map(function (n) {
    return "<div>" + n[0] + "<small>" + n[1] + "</small></div>";
  }).join("");
}
