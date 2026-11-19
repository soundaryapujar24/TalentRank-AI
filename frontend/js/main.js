/*
 * main.js
 * Starts the app: connects the buttons to their functions and runs the first render. Loaded last.
 */

sched();

rr();

show(0);

kbr();

document.querySelectorAll(".role button").forEach(function (b) {
  b.onclick = function () {
    nav(b.dataset.r, b.dataset.r == "hr" ? "d" : "a");
  };
});

document.querySelectorAll("nav button").forEach(function (b) {
  b.onclick = function () {
    nav(b.dataset.r, b.dataset.v);
  };
});

T("pub", "pt", "Job published. It now appears on the careers page.");

document.getElementById("pv").onchange = function () {
  app(+this.value);
  renderOffers();
};

app(0);

document.getElementById("rf").onchange = function () {
  addUp(this.files[0]);
};

document.getElementById("ru").onchange = function () {
  addUp(this.files[0]);
};

document.getElementById("gob").onclick = function (e) {
  e.preventDefault();
  nav("cd", "b");
};

document.getElementById("gb").onclick = function () {
  nav("cd", "b");
};

document.getElementById("ap").onclick = function () {
  var r = document.getElementById("rs"),
    o = r.options[r.selectedIndex],
    at = document.getElementById("at"),
    name = document.getElementById("fn").value.trim(),
    email = document.getElementById("fe").value.trim();
  if (!name || email.indexOf("@") < 1 || !o) {
    at.textContent =
      "Please enter your name, a valid email, and choose a resume.";
    return;
  }
  var ix = +o.value.slice(1),
    nm = o.value.charAt(0) == "p" ? PRI[ix].n : SEC[ix].n;
  if (
    OUT.some(function (a) {
      return a.j == CJ && a.em == email;
    })
  ) {
    at.textContent =
      "You already have an application or an offline draft for " +
      CJ +
      " with this email.";
    return;
  }
  OUT.push({ j: CJ, r: nm, nm: name, em: email, sent: ONL, at: Date.now() });
  renderOut();
  at.textContent = ONL
    ? "Application submitted for " + CJ + " with " + nm + ". Your resume is being screened."
    : "You are offline. Your application is saved as an offline draft on this device. It is not submitted yet. It will be submitted automatically when you are back online.";
};

document.getElementById("cs").onclick = function () {
  send(document.getElementById("ci").value);
};

document.getElementById("ci").onkeydown = function (e) {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    send(this.value);
  }
};

document.getElementById("qg").onclick = cpQuick;
document.getElementById("qp").onkeydown = function (e) {
  if (e.key == "Enter") cpQuick();
};
document.querySelectorAll("#qc button").forEach(function (b) {
  b.onclick = function () {
    document.getElementById("qp").value = b.textContent;
    document.getElementById("qp").focus();
  };
});

document.getElementById("ed").onclick = function () {
  var pp = document.getElementById("pp"),
    on = pp.contentEditable == "true";
  pp.contentEditable = on ? "false" : "true";
  if (on && CUR >= 0 && PRI[CUR]) {
    PRI[CUR].h = pp.innerHTML;
    save();
  }
  this.textContent = on ? "Edit CV" : "Done editing";
  if (!on) pp.focus();
};

renderCV();

ask();

stores();

document.querySelectorAll("nav button").forEach(function (b) {
  b.innerHTML = ico(b.dataset.v) + "<span>" + b.textContent + "</span>";
});

document.querySelectorAll("[data-ic]").forEach(function (e) {
  e.innerHTML = ico(e.dataset.ic, 22);
});

IC.moon = "<path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'/>";

donut();

document.querySelectorAll("[data-go]").forEach(function (b) {
  b.onclick = function () {
    nav(b.dataset.go, b.dataset.go == "hr" ? "d" : "a");
  };
});

lg.tabIndex = 0;

lg.setAttribute("role", "button");

lg.setAttribute("aria-label", "Home");

lg.style.cursor = "pointer";

lg.onclick = goHome;

lg.onkeydown = function (e) {
  if (e.key == "Enter") goHome();
};

document.querySelectorAll(".tgl").forEach(function (b) {
  b.innerHTML = ico("moon");
  b.setAttribute("aria-label", "Toggle dark mode");
  b.onclick = function () {
    var r = document.documentElement,
      dk =
        r.dataset.theme == "dark" ||
        (!r.dataset.theme &&
          window.matchMedia &&
          matchMedia("(prefers-color-scheme:dark)").matches);
    r.dataset.theme = dk ? "light" : "dark";
  };
});

document.querySelectorAll(".job").forEach(function (j) {
  j.querySelector("button").onclick = function () {
    CJ = j.dataset.j;
    document.getElementById("ah").textContent = "Apply: " + CJ;
    document.querySelectorAll(".job").forEach(function (x) {
      x.classList.toggle("sel", x == j);
    });
  };
});

document.querySelector(".job").classList.add("sel");

charts();

bl.innerHTML = ico("bell") + "<span class='bd'>3</span>";

bl.setAttribute("aria-label", "Notifications");

bl.onclick = function (e) {
  e.stopPropagation();
  var o = document.getElementById("np").classList.toggle("show");
  bl.setAttribute("aria-expanded", o);
};

document.addEventListener("click", function (e) {
  if (!e.target.closest(".nf")) {
    document.getElementById("np").classList.remove("show");
    bl.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("blind").onchange = function () {
  BL = this.checked;
  rr();
  show(SEL);
};

document.getElementById("net").onclick = function () {
  setNet(!ONL);
};

window.addEventListener("offline", function () {
  setNet(false);
});

window.addEventListener("online", function () {
  setNet(true);
});

renderOut();

netUI();

document.getElementById("fq").oninput = rr;

document.getElementById("fs").onchange = rr;

document.getElementById("fr").onchange = rr;

renderWalkHR();

renderWalkC();

renderOffers();

document.getElementById("pf").onchange = kbr;

charts2();

nav("hr", "d");

goHome();
