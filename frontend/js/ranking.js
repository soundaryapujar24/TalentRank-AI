/*
 * ranking.js
 * Ranked candidates screen: status rules (score 75+ = shortlisted), score ring, radar chart, search and filters, and the status rules.
 * Functions: sh, st, tc, mk, ring, show, rr, radar, refreshAll, scr, ofr, mt
 */

function sh(c) {
  return c.s >= 75 || c.m;
}

function st(c) {
  return c.of
    ? "Offer released"
    : c.tp == "pass"
      ? "Selected"
      : c.tp == "fail"
        ? "Not selected"
        : sh(c)
          ? "Shortlisted"
          : c.s >= 60
            ? "Under review"
            : "Not selected";
}

function tc(c) {
  return c.tp == "fail" ? "not" : sh(c) ? "fit" : c.s >= 60 ? "close" : "not";
}

function mk(i) {
  C[i].m = true;
  sched();
  rr();
  kbr();
  show(i);
  app(+document.getElementById("pv").value);
}

function ring(v) {
  var c = 2 * Math.PI * 36,
    col = v >= 75 ? "#0F9D8A" : v >= 60 ? "#E0A100" : "#D64545";
  return (
    "<svg width='84' height='84' viewBox='0 0 84 84' role='img' aria-label='Score " +
    v +
    "'><circle cx='42' cy='42' r='36' fill='none' stroke='var(--line)' stroke-width='8'/><circle cx='42' cy='42' r='36' fill='none' stroke='" +
    col +
    "' stroke-width='8' stroke-linecap='round' stroke-dasharray='" +
    (c * v) / 100 +
    " " +
    c +
    "' transform='rotate(-90 42 42)'/><text x='42' y='48' text-anchor='middle' font-size='20' font-weight='800' fill='currentColor'>" +
    v +
    "</text></svg>"
  );
}

function show(i) {
  var c = C[i],
    h = "";
  SEL = i;
  Array.prototype.forEach.call(tb.children, function (e, k) {
    e.className = "row" + (e.dataset.i == i ? " on" : "");
  });
  Q.forEach(function (q, k) {
    var p = c.v[k];
    h +=
      "<div class='ev'><p><b>" +
      q +
      "</b></p><div class='m'><u style='width:" +
      p * 100 +
      "%'></u></div><small>Similarity " +
      p.toFixed(2) +
      " · " +
      (p >= 0.6 ? "Resume: “" + R[k] + "”" : "No close match in the resume") +
      "</small></div>";
  });
  var sc = "",
    fr = RK.filter(function (k) {
      return rd(c, k).result == "Failed";
    })[0];
  if (c.of)
    sc =
      "<div class='note'><b>Offer letter released</b><br>The candidate can view and download it under Offer letters.</div>";
  else if (stage(c) == "Selected")
    sc =
      "<div class='note'><b>All three rounds passed</b><p style='margin:10px 0 0'><button class='btn' onclick='openOffer(" +
      i +
      ")'>Release offer letter</button></p></div>";
  else if (fr)
    sc =
      "<div class='note'><b>Not selected after the " + RNM[fr] + "</b></div>";
  else if (sh(c))
    sc =
      "<div class='note'><b>Recruitment rounds</b><br>Current stage: " +
      stage(c) +
      ". Schedule each round and record its result in the Interview scheduler.</div>";
  var bt =
    c.s >= 60 && c.s < 75 && !c.m
      ? "<p style='margin:12px 0 0'><button class='btn' onclick='mk(" +
        i +
        ")'>Shortlist manually</button></p>"
      : "";
  var vd = c.m
    ? "Shortlisted manually by HR. The candidate can now be scheduled for the recruitment rounds."
    : c.s >= 75
      ? "Above the cut-off of 75. Shortlisted automatically and ready for the Aptitude Round."
      : c.s >= 60
        ? "Below the cut-off of 75. HR can review and shortlist manually. No round is scheduled yet."
        : "Below 60. Not selected for this role.";
  ex.innerHTML =
    "<div class='eh'>" +
    ring(c.s) +
    "<div><h2 style='margin:0'>" +
    (BL ? "Candidate " + String.fromCharCode(65 + i) : c.n) +
    "</h2><span class='tag " +
    tc(c) +
    "'>" +
    st(c) +
    "</span><div style='color:var(--mut);font-size:12px;margin-top:4px'>SBERT " +
    c.a +
    " × 0.6 + Keywords " +
    c.b +
    " × 0.4<br>Resume source: " +
    (c.src == "AI"
      ? "AI-generated (My Generated CVs)"
      : "Uploaded (My Uploaded Resumes)") +
    "</div></div></div>" +
    radar(c) +
    "<p style='margin:0 0 6px;font-weight:700'>SBERT: job need vs resume evidence</p>" +
    h +
    "<p style='margin:12px 0 4px;font-weight:700'>Keyword match</p>" +
    c.ok
      .map(function (k) {
        return "<span class='chip ok'>" + k + "</span>";
      })
      .join("") +
    c.no
      .map(function (k) {
        return "<span class='chip miss'>" + k + " missing</span>";
      })
      .join("") +
    "<div class='note'>" +
    vd +
    "</div>" +
    bt +
    sc;
}

function rr() {
  tb.innerHTML = "";
  var cnt = 0;
  C.forEach(function (c, i) {
    if (!mt(c)) return;
    cnt++;
    var t = document.createElement("tr");
    t.dataset.i = i;
    t.className = "row";
    t.tabIndex = 0;
    t.innerHTML =
      "<td>" +
      (i + 1) +
      "</td><td><span class='av' style='background:hsl(" +
      ((i * 67 + 190) % 360) +
      " 70% 88%);color:hsl(" +
      ((i * 67 + 190) % 360) +
      " 55% 28%)'>" +
      (BL ? String.fromCharCode(65 + i) : ini(c.n)) +
      "</span><b>" +
      (BL ? "Candidate " + String.fromCharCode(65 + i) : c.n) +
      "</b></td><td class='sc'>" +
      c.s +
      "</td><td>" +
      c.a +
      "</td><td>" +
      c.b +
      "</td><td><small>" +
      (c.src == "AI" ? "AI-generated" : "Uploaded") +
      "</small></td><td><span class='tag " +
      tc(c) +
      "'>" +
      st(c) +
      "</span></td>";
    t.onclick = function () {
      show(i);
    };
    t.onkeydown = function (e) {
      if (e.key == "Enter") show(i);
    };
    tb.appendChild(t);
  });
  document.getElementById("fc").textContent =
    cnt + " of " + C.length + " candidates";
  if (!cnt)
    tb.innerHTML =
      "<tr><td colspan='7' style='color:var(--mut)'>No candidates match these filters.</td></tr>";
}

function radar(c) {
  var L = ["NLP", "APIs", "SQL", "Containers", "Keywords"],
    V = c.v
      .map(function (x) {
        return x * 100;
      })
      .concat([c.b]),
    cx = 110,
    cy = 100,
    R = 68;
  function pt(i, r) {
    var a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function fm(a) {
    return a[0].toFixed(1) + "," + a[1].toFixed(1);
  }
  function poly(r) {
    return L.map(function (_, i) {
      return fm(pt(i, r));
    }).join(" ");
  }
  var s =
    "<svg viewBox='0 0 220 200' width='100%' style='max-width:270px;display:block;margin:0 auto 8px' role='img' aria-label='Skill match radar for " +
    c.n +
    "'>";
  [0.5, 1].forEach(function (r) {
    s +=
      "<polygon points='" +
      poly(R * r) +
      "' fill='none' stroke='var(--line)'/>";
  });
  L.forEach(function (_, i) {
    var q = pt(i, R);
    s +=
      "<line x1='" +
      cx +
      "' y1='" +
      cy +
      "' x2='" +
      q[0].toFixed(1) +
      "' y2='" +
      q[1].toFixed(1) +
      "' stroke='var(--line)'/>";
  });
  s +=
    "<polygon points='" +
    V.map(function (v, i) {
      return fm(pt(i, (R * v) / 100));
    }).join(" ") +
    "' fill='rgba(20,184,166,.3)' stroke='#14B8A6' stroke-width='2.5' stroke-linejoin='round'/>";
  L.forEach(function (t, i) {
    var q = pt(i, R + 17);
    s +=
      "<text x='" +
      q[0].toFixed(1) +
      "' y='" +
      (q[1] + 3).toFixed(1) +
      "' font-size='10' font-weight='700' text-anchor='middle' fill='currentColor'>" +
      t +
      "</text>";
  });
  return s + "</svg>";
}

function refreshAll(i) {
  sched();
  rr();
  kbr();
  show(i);
  app(+document.getElementById("pv").value);
}

function scr(i, r) {
  C[i].tp = r;
  C[i].rt = +document.getElementById("rt").value;
  refreshAll(i);
}

function ofr(i) {
  C[i].of = true;
  refreshAll(i);
}

function mt(c) {
  var q = document.getElementById("fq").value.trim().toLowerCase(),
    s = document.getElementById("fs").value,
    r = document.getElementById("fr").value;
  return (
    (!q ||
      ((BL ? "" : c.n + " ") + c.ok.join(" ")).toLowerCase().indexOf(q) >= 0) &&
    (s == "All statuses" || st(c) == s) &&
    (r == "All sources" || (c.src == "AI" ? "AI-generated" : "Uploaded") == r)
  );
}
