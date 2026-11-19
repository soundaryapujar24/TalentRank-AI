/*
 * walkins.js
 * Walk-in recruitment. HR creates and edits drives and sees registrations; candidates view drives, register and track their registration.
 * Everything is saved in the browser (WD = drives, WR = registrations).
 * Functions: drOpen, renderWalkHR, saveDrive, editDrive, delDrive, setWR, renderWalkC, regOpen, regSave
 */

var WEDIT = "",
  WSEL = "";

function drOpen(d) {
  return new Date(d.date + "T" + d.time) > new Date();
}

function renderWalkHR() {
  var d = WD.filter(function (x) {
      return x.id == WEDIT;
    })[0],
    v = function (k) {
      return d ? escA(d[k]) : k == "company" ? "TalentRank Labs" : "";
    };
  document.getElementById("wform").innerHTML =
    "<h2>" +
    (d ? "Edit walk-in drive" : "Create walk-in drive") +
    "</h2><label for='wd1'>Job position</label><input type='text' id='wd1' value='" +
    v("title") +
    "'><label for='wd2'>Company</label><input type='text' id='wd2' value='" +
    v("company") +
    "'><label for='wd3'>Location</label><input type='text' id='wd3' value='" +
    v("loc") +
    "'><label for='wd4'>Drive date</label><input type='date' id='wd4' value='" +
    v("date") +
    "'><label for='wd5'>Drive time</label><input type='time' id='wd5' value='" +
    v("time") +
    "'><label for='wd6'>Eligibility</label><input type='text' id='wd6' value='" +
    v("elig") +
    "'><p class='row2'><button class='btn' onclick='saveDrive()'>" +
    (d ? "Save changes" : "Create drive") +
    "</button>" +
    (d
      ? "<button class='btn' style='background:var(--mut);box-shadow:none' onclick='editDrive(\"\")'>Cancel</button>"
      : "") +
    "</p><div class='toast' id='wdt'></div>";
  document.getElementById("wlist").innerHTML = WD.length
    ? WD.map(function (x) {
        var rg = WR.filter(function (r) {
          return r.d == x.id;
        });
        return (
          "<div class='card' style='margin-bottom:14px'><h2>" +
          esc(x.title) +
          "</h2><small style='color:var(--mut)'>" +
          esc(x.company) +
          " · " +
          esc(x.loc) +
          "</small>" +
          sch({ date: x.date, time: x.time }) +
          "<p style='margin:8px 0 0'>Eligibility: " +
          esc(x.elig || "Not specified") +
          "</p><p class='row2'><button class='btn' onclick='editDrive(\"" +
          x.id +
          "\")'>Edit</button><button class='btn' style='background:var(--mut);box-shadow:none' onclick='delDrive(\"" +
          x.id +
          "\")'>Delete</button></p><p style='margin:14px 0 4px;font-weight:700'>Registered candidates (" +
          rg.length +
          ")</p>" +
          (rg.length
            ? rg
                .map(function (r) {
                  return (
                    "<div class='fi'><b>" +
                    esc(r.n) +
                    "</b><small>" +
                    esc(r.p) +
                    (r.e ? " · " + esc(r.e) : "") +
                    "</small><select aria-label='Result for " +
                    escA(r.n) +
                    "' onchange='setWR(\"" +
                    r.id +
                    "\",this.value)'>" +
                    ["Registered", "Attended", "Selected", "Not selected"]
                      .map(function (s) {
                        return (
                          "<option" + (r.res == s ? " selected" : "") + ">" + s + "</option>"
                        );
                      })
                      .join("") +
                    "</select></div>"
                  );
                })
                .join("")
            : "<div class='fi'><small>No registrations yet.</small></div>") +
          "</div>"
        );
      }).join("")
    : "<div class='card'><div class='fi'><small>No walk-in drives yet. Create one to open registrations for candidates.</small></div></div>";
}

function saveDrive() {
  var g = function (k) {
      return document.getElementById(k).value.trim();
    },
    d = {
      id: WEDIT || "d" + Date.now().toString(36),
      title: g("wd1"),
      company: g("wd2"),
      loc: g("wd3"),
      date: g("wd4"),
      time: g("wd5"),
      elig: g("wd6"),
    },
    t = document.getElementById("wdt");
  if (!d.title || !d.company || !d.loc || !d.date || !d.time) {
    t.textContent =
      "Enter the position, company, location, date and time.";
    return;
  }
  if (new Date(d.date + "T" + d.time) < new Date()) {
    t.textContent = "Choose a future date and time for the drive.";
    return;
  }
  if (WEDIT)
    WD = WD.map(function (x) {
      return x.id == WEDIT ? d : x;
    });
  else WD.unshift(d);
  WEDIT = "";
  save();
  renderWalkHR();
  renderWalkC();
  document.getElementById("wdt").textContent = "Saved. Candidates can see this drive now.";
}

function editDrive(id) {
  WEDIT = id;
  renderWalkHR();
}

function delDrive(id) {
  if (!confirm("Delete this drive and its registrations?")) return;
  WD = WD.filter(function (x) {
    return x.id != id;
  });
  WR = WR.filter(function (r) {
    return r.d != id;
  });
  save();
  renderWalkHR();
  renderWalkC();
}

function setWR(id, v) {
  WR.forEach(function (r) {
    if (r.id == id) r.res = v;
  });
  save();
  renderWalkC();
}

function renderWalkC() {
  var el = document.getElementById("wkl");
  if (!el) return;
  el.innerHTML = WD.length
    ? WD.map(function (x) {
        var mine = WR.filter(function (r) {
            return r.d == x.id;
          })[0],
          open = drOpen(x);
        return (
          "<div class='card' style='margin-bottom:14px'><h2>" +
          esc(x.title) +
          "</h2><small style='color:var(--mut)'>" +
          esc(x.company) +
          " · " +
          esc(x.loc) +
          "</small>" +
          sch({ date: x.date, time: x.time }) +
          "<p style='margin:8px 0 0'>Eligibility: " +
          esc(x.elig || "Not specified") +
          "</p><p class='row2'>" +
          (mine
            ? "<span class='tag fit'>Registered</span>"
            : open
              ? "<button class='btn' onclick='regOpen(\"" + x.id + "\")'>Register for this drive</button>"
              : "<span class='tag not'>Registration closed</span>") +
          "</p></div>"
        );
      }).join("")
    : "<div class='card'><div class='fi'><small>No walk-in drives are open right now. Check back soon.</small></div></div>";
  var d = WD.filter(function (x) {
    return x.id == WSEL;
  })[0];
  document.getElementById("wreg").innerHTML = d
    ? "<h2>Register: " +
      esc(d.title) +
      "</h2><label for='wr1'>Full name</label><input type='text' id='wr1'><label for='wr2'>Phone</label><input type='tel' id='wr2' placeholder='+91 98765 43210'><label for='wr3'>Email (optional)</label><input type='email' id='wr3'><p class='row2'><button class='btn' onclick='regSave()'>Confirm registration</button></p><div class='toast' id='wrt'></div>"
    : "<h2>Register</h2><p style='margin:0;color:var(--mut)'>Choose a drive and select Register.</p>";
  var my = WR.slice().reverse();
  document.getElementById("wmy").innerHTML = my.length
    ? my
        .map(function (r) {
          var x = WD.filter(function (y) {
            return y.id == r.d;
          })[0];
          return (
            "<div class='fi'><b>" +
            esc(x ? x.title : "Drive removed") +
            "</b><small>" +
            (x ? fD(x.date) + ", " + fT(x.time) + " · " : "") +
            "Reference " +
            esc(r.ref) +
            "</small><span class='tag " +
            (r.res == "Not selected" ? "not" : r.res == "Registered" ? "close" : "fit") +
            "'>" +
            esc(r.res) +
            "</span></div>"
          );
        })
        .join("")
    : "<div class='fi'><small>You have not registered for a drive yet.</small></div>";
}

function regOpen(id) {
  WSEL = id;
  renderWalkC();
  document.getElementById("wreg").scrollIntoView({ block: "nearest" });
}

function regSave() {
  var g = function (k) {
      return document.getElementById(k).value.trim();
    },
    n = g("wr1"),
    p = g("wr2"),
    e = g("wr3"),
    t = document.getElementById("wrt");
  if (!n || p.replace(/\D/g, "").length < 10) {
    t.textContent = "Enter your name and a phone number with at least 10 digits.";
    return;
  }
  if (e && e.indexOf("@") < 1) {
    t.textContent = "Enter a valid email or leave it empty.";
    return;
  }
  if (
    WR.some(function (r) {
      return r.d == WSEL && r.p.replace(/\D/g, "") == p.replace(/\D/g, "");
    })
  ) {
    t.textContent = "This phone number is already registered for this drive.";
    return;
  }
  var ref = "WK-" + Date.now().toString(36).toUpperCase().slice(-5);
  WR.push({ id: "r" + Date.now().toString(36), d: WSEL, n: n, p: p, e: e, ref: ref, res: "Registered", at: Date.now() });
  WSEL = "";
  save();
  renderWalkC();
  renderWalkHR();
  document.getElementById("wreg").insertAdjacentHTML(
    "beforeend",
    "<div class='toast'>Registration confirmed. Your reference is " + ref + ".</div>",
  );
}
