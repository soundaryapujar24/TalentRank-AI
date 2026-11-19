/*
 * rounds.js
 * Three separate recruitment rounds (Aptitude, GD, Technical): stage rules, interview scheduler, Recruitment Overview board.
 * Each round keeps its own date, time, location, result and recruiter remarks, saved in the browser (RND).
 * Functions: rd, failed, elig, stage, syncC, sch, sched, svr, kbr
 */

var RK = ["apt", "gd", "tech"],
  RNM = {
    apt: "Aptitude Round",
    gd: "Group Discussion (GD) Round",
    tech: "Technical Round",
  },
  RES = ["Pending", "Passed", "Failed", "On Hold"],
  STG = [
    "Under review",
    "Aptitude Round",
    "GD Round",
    "Technical Round",
    "Selected",
    "Offer released",
    "Not selected",
  ];

function escA(s) {
  return esc(s == null ? "" : s)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rd(c, k) {
  return (RND[c.n] && RND[c.n][k]) || {};
}

function failed(c) {
  return RK.some(function (k) {
    return rd(c, k).result == "Failed";
  });
}

function elig(c, k) {
  if (!sh(c) || failed(c)) return false;
  var i = RK.indexOf(k);
  return i == 0 || rd(c, RK[i - 1]).result == "Passed";
}

function stage(c) {
  if (c.of) return "Offer released";
  if (failed(c) || (c.s < 60 && !c.m)) return "Not selected";
  if (!sh(c)) return "Under review";
  if (rd(c, "tech").result == "Passed") return "Selected";
  if (rd(c, "gd").result == "Passed") return "Technical Round";
  if (rd(c, "apt").result == "Passed") return "GD Round";
  return "Aptitude Round";
}

function syncC(c) {
  c.tp = failed(c)
    ? "fail"
    : rd(c, "tech").result == "Passed"
      ? "pass"
      : undefined;
}

function fD(d) {
  return new Date(d + "T00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fT(t) {
  var p = t.split(":"),
    h = +p[0];
  return (h % 12 || 12) + ":" + p[1] + " " + (h < 12 ? "AM" : "PM");
}

function sch(r) {
  return r && r.date && r.time
    ? "<div class='when'><span>Date</span><b>" +
        fD(r.date) +
        "</b><span>Time</span><b>" +
        fT(r.time) +
        "</b>" +
        (r.loc ? "<span>Where</span><b>" + esc(r.loc) + "</b>" : "") +
        "</div>"
    : "";
}

function sched() {
  C.forEach(syncC);
  var h = "";
  RK.forEach(function (k, ki) {
    var rows = "";
    C.forEach(function (c, i) {
      if (!elig(c, k)) return;
      var r = rd(c, k);
      rows +=
        "<tr data-i='" +
        i +
        "'><td><b>" +
        esc(c.n) +
        "</b><br><small>Score " +
        c.s +
        "</small></td><td><input type='date' class='rd' value='" +
        escA(r.date) +
        "' aria-label='Date'></td><td><input type='time' class='rt2' value='" +
        escA(r.time) +
        "' aria-label='Time'></td><td><input type='text' class='rl' placeholder='Room or meeting link' value='" +
        escA(r.loc) +
        "' aria-label='Location'></td><td><input type='text' class='ri' placeholder='Instructions' value='" +
        escA(r.ins) +
        "' aria-label='Instructions'></td><td><select class='rs2' aria-label='Result'>" +
        RES.map(function (x) {
          return (
            "<option" + ((r.result || "Pending") == x ? " selected" : "") + ">" + x + "</option>"
          );
        }).join("") +
        "</select><br><small>" +
        (r.result == "Passed"
          ? ki < 2
            ? "Eligible for " + RNM[RK[ki + 1]]
            : "Selected. Ready for an offer."
          : "Next round opens after Passed") +
        "</small></td><td><input type='text' class='rm' placeholder='Recruiter remarks' value='" +
        escA(r.rem) +
        "' aria-label='Remarks'></td><td><button class='btn' onclick='svr(" +
        i +
        ',"' +
        k +
        "\")'>Save</button></td></tr>";
    });
    h +=
      "<div class='card tw' id='rc" +
      k +
      "' style='margin-top:16px'><h2>" +
      RNM[k] +
      "</h2>" +
      (rows
        ? "<table class='rt'><tr><th>Candidate</th><th>Date</th><th>Time</th><th>Location or link</th><th>Instructions</th><th>Result</th><th>Remarks</th><th></th></tr>" +
          rows +
          "</table>"
        : "<p style='margin:0;color:var(--mut)'>" +
          (ki == 0
            ? "No shortlisted candidates yet."
            : "No candidate has passed the " + RNM[RK[ki - 1]] + " yet.") +
          "</p>") +
      "<div class='toast' id='tt" +
      k +
      "'></div></div>";
  });
  document.getElementById("rnds").innerHTML = h;
}

function svr(i, k) {
  var c = C[i],
    tr = document.querySelector("#rc" + k + " tr[data-i='" + i + "']"),
    g = function (s) {
      return tr.querySelector(s).value.trim();
    },
    t = document.getElementById("tt" + k),
    r = {
      date: g(".rd"),
      time: g(".rt2"),
      loc: g(".rl"),
      ins: g(".ri"),
      result: g(".rs2"),
      rem: g(".rm"),
    };
  if (!r.date || !r.time || !r.loc) {
    t.textContent =
      "Enter the date, time and location or meeting link for " + c.n + ".";
    return;
  }
  var when = new Date(r.date + "T" + r.time);
  if (isNaN(when)) {
    t.textContent = "The date or time is not valid.";
    return;
  }
  if (r.result == "Pending" && when < new Date()) {
    t.textContent = "That date and time are in the past. Choose a future slot.";
    return;
  }
  var clash = RK.filter(function (o) {
    var x = rd(c, o);
    return o != k && x.date == r.date && x.time == r.time;
  })[0];
  if (clash) {
    t.textContent =
      c.n +
      " already has the " +
      RNM[clash] +
      " at " +
      fT(r.time) +
      " on " +
      fD(r.date) +
      ". Choose a different time.";
    return;
  }
  RND[c.n] = RND[c.n] || {};
  RND[c.n][k] = r;
  save();
  refreshAll(SEL);
  document.getElementById("tt" + k).textContent =
    "Saved. " + c.n + " can now see this " + RNM[k] + " schedule and result.";
}

function kbr() {
  var f = document.getElementById("pf"),
    fv = f ? f.value : "All stages",
    kh = "",
    n = function (s) {
      return C.filter(function (c) {
        return stage(c) == s;
      }).length;
    };
  STG.forEach(function (s) {
    if (fv != "All stages" && fv != s) return;
    var L = C.filter(function (c) {
      return stage(c) == s;
    });
    kh +=
      "<div class='kc'><h3>" +
      s +
      "<span>" +
      L.length +
      "</span></h3>" +
      (L.length
        ? L.map(function (c) {
            var k = { "Aptitude Round": "apt", "GD Round": "gd", "Technical Round": "tech" }[s],
              r = k ? rd(c, k) : {};
            return (
              "<div class='kn'><b>" +
              esc(c.n) +
              "</b><small>Score " +
              c.s +
              " · " +
              c.r +
              (c.m ? " · added by HR" : "") +
              (r.date && r.time
                ? "<br>" + fD(r.date) + ", " + fT(r.time)
                : k
                  ? "<br>Not scheduled yet"
                  : "") +
              "</small></div>"
            );
          }).join("")
        : "<div class='emp'>No candidates yet</div>") +
      "</div>";
  });
  document.getElementById("kb").innerHTML = kh;
  document.getElementById("ks").innerHTML =
    "<b>" +
    C.length +
    "</b> candidates in total. Pending review: <b>" +
    n("Under review") +
    "</b>. In rounds: <b>" +
    (n("Aptitude Round") + n("GD Round") + n("Technical Round")) +
    "</b>. Selected: <b>" +
    n("Selected") +
    "</b>. Offers released: <b>" +
    n("Offer released") +
    "</b>. Not selected: <b>" +
    n("Not selected") +
    "</b>.";
}
