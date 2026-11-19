/*
 * candidate.js
 * Candidate portal: My application timeline and the schedule and result of each round.
 * Functions: sk, app
 */

function sk(c) {
  return (
    "<p style='margin:14px 0 6px;font-weight:700'>Skills to strengthen</p>" +
    c.no
      .map(function (k) {
        return "<span class='chip miss'>" + k + "</span>";
      })
      .join("")
  );
}

function app(i) {
  var c = C[i],
    t =
      "<li><b>Applied</b><br><small>Resume received</small></li><li><b>Resume screened</b><br><small>Result: " +
      c.r +
      "</small></li>",
    s = "";
  if (!sh(c)) {
    if (c.s >= 60) {
      t +=
        "<li class='w'><b>Under review</b><br><small>HR is looking at your profile</small></li>";
      s =
        "<h2>Interview</h2><p style='margin:0'>No round is scheduled yet. Rounds are shared only with shortlisted candidates. We will let you know if HR moves you forward.</p>" +
        sk(c);
    } else {
      t +=
        "<li class='w'><b>Not selected this time</b><br><small>Your profile did not match this role</small></li>";
      s =
        "<h2>Interview</h2><p style='margin:0'>Thank you for applying. We will keep your profile for future roles that match your skills.</p>" +
        sk(c);
    }
  } else {
    t +=
      "<li><b>Shortlisted</b><br><small>" +
      (c.m ? "HR selected your profile" : "Your profile is above the cut-off") +
      "</small></li>";
    var cur = null,
      bad = null;
    RK.forEach(function (k) {
      if (cur || bad) return;
      var r = rd(c, k),
        res = r.result || "Pending";
      if (res == "Passed") {
        t +=
          "<li><b>" + RNM[k] + "</b><br><small>Passed" +
          (r.date && r.time ? " · " + fD(r.date) + " at " + fT(r.time) : "") +
          (r.rem ? "<br>Recruiter remarks: " + esc(r.rem) : "") +
          "</small></li>";
      } else {
        if (res == "Failed") bad = k;
        else cur = k;
        t +=
          "<li" + (res == "Failed" ? "" : " class='w'") + "><b>" + RNM[k] + "</b><br><small>" +
          res +
          (r.date && r.time ? " · " + fD(r.date) + " at " + fT(r.time) : " · Not scheduled yet") +
          (r.rem ? "<br>Recruiter remarks: " + esc(r.rem) : "") +
          "</small></li>";
      }
    });
    if (bad) {
      t += "<li class='w'><b>Not selected</b><br><small>You were not selected after the " + RNM[bad] + "</small></li>";
      s = "<h2>" + RNM[bad] + "</h2>" + sch(rd(c, bad)) + "<p style='margin:12px 0 0'>Thank you for your time. We will keep your profile for future roles that match your skills.</p>" + sk(c);
    } else if (cur) {
      var r = rd(c, cur);
      s =
        "<h2>Your " + RNM[cur] + "</h2>" +
        (r.date && r.time
          ? sch(r) + (r.ins ? "<p style='margin:12px 0 0'><b>Instructions:</b> " + esc(r.ins) + "</p>" : "")
          : "<p style='margin:0'>This round has not been scheduled yet. The date and time will appear here as soon as HR saves them.</p>");
    } else if (c.of) {
      t += "<li class='w'><b>Offer letter released</b><br><small>Open Offer letters to view and download it</small></li>";
      s = "<h2>Congratulations!</h2><p style='margin:0'>You cleared all three rounds and HR has released your offer letter.</p><p style='margin:12px 0 0'><button class='btn' onclick=\"nav('cd','ol')\">Open offer letter</button></p>";
    } else {
      t += "<li class='w'><b>Selected</b><br><small>HR will release your offer letter here</small></li>";
      s = "<h2>Congratulations!</h2><p style='margin:0'>You cleared all three rounds. Your offer letter will appear under Offer letters when HR releases it.</p>";
    }
  }
  document.getElementById("tl").innerHTML = t;
  document.getElementById("side").innerHTML = s;
}
