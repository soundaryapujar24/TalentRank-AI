/*
 * charts.js
 * Analytics and dashboard charts drawn as SVG: line, donut and gauge.
 * Functions: charts, charts2
 */

function charts() {
  var V = [10, 14, 12, 16, 19, 15, 11, 13, 21, 25, 20, 23, 24, 25],
    x = function (i) {
      return 28 + i * (468 / 13);
    },
    y = function (v) {
      return 165 - v * 5.2;
    },
    pts = V.map(function (v, i) {
      return x(i).toFixed(1) + "," + y(v).toFixed(1);
    }).join(" ");
  var s =
    "<svg viewBox='0 0 520 200' width='100%' role='img' aria-label='Applications per day over 14 days, 248 in total'><defs><linearGradient id='ag' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#14B8A6' stop-opacity='.45'/><stop offset='1' stop-color='#14B8A6' stop-opacity='0'/></linearGradient></defs>";
  [0, 10, 20].forEach(function (t) {
    s +=
      "<line x1='28' x2='496' y1='" +
      y(t) +
      "' y2='" +
      y(t) +
      "' stroke='var(--line)'/><text x='4' y='" +
      (y(t) + 4) +
      "' font-size='10' fill='var(--mut)'>" +
      t +
      "</text>";
  });
  s +=
    "<polygon points='28,165 " +
    pts +
    " 496,165' fill='url(#ag)'/><polyline points='" +
    pts +
    "' fill='none' stroke='#14B8A6' stroke-width='3' stroke-linejoin='round'/>";
  V.forEach(function (v, i) {
    s +=
      "<circle cx='" +
      x(i).toFixed(1) +
      "' cy='" +
      y(v).toFixed(1) +
      "' r='3.5' fill='#fff' stroke='#14B8A6' stroke-width='2'/>" +
      (i % 2 == 0
        ? "<text x='" +
          x(i).toFixed(1) +
          "' y='188' font-size='10' fill='var(--mut)' text-anchor='middle'>Day " +
          (i + 1) +
          "</text>"
        : "");
  });
  document.getElementById("c1").innerHTML = s + "</svg>";
  document.getElementById("c2").innerHTML = [
    ["Python", 92],
    ["SQL", 71],
    ["NLP", 54],
    ["FastAPI", 41],
    ["Docker", 28],
  ]
    .map(function (k) {
      return bar(k[0], k[1], k[1] + "%", k[1]);
    })
    .join("");
  document.getElementById("c3").innerHTML =
    "<div class='wfw'>" +
    waffle("AI-generated CVs", 17, "20 of 120 shortlisted", "#8B5CF6") +
    waffle("Uploaded resumes", 9, "12 of 128 shortlisted", "#14B8A6") +
    "</div><div class='note'>Each dot is 1% of that source. 20 + 12 = 32 shortlisted candidates in total.</div>";
}

function waffle(l, n, t, col) {
  var d = "";
  for (var i = 0; i < 100; i++)
    d +=
      "<i" +
      (i < n ? " class='on' style='background:" + col + ";box-shadow:0 0 8px " + col + "88;animation-delay:" + i * 12 + "ms'" : "") +
      "></i>";
  return (
    "<div class='wf' role='img' aria-label='" + l + ": " + n + " percent shortlisted, " + t + "'><div class='wfn' style='color:" +
    col + "'>" + n + "%</div><b>" + l + "</b><small>" + t + "</small><div class='wfg'>" + d + "</div></div>"
  );
}

function charts2() {
  var S = [
      ["Shortlisted", 32, "#14B8A6"],
      ["Under review", 82, "#F59E0B"],
      ["Not selected", 134, "#EF4444"],
    ],
    c = 2 * Math.PI * 40,
    off = 0,
    s =
      "<svg width='150' height='150' viewBox='0 0 100 100' role='img' aria-label='Candidate status: 32 shortlisted, 82 under review, 134 not selected'><circle cx='50' cy='50' r='40' fill='none' stroke='var(--line)' stroke-width='14'/>";
  S.forEach(function (x) {
    var l = (c * x[1]) / 248;
    s +=
      "<circle cx='50' cy='50' r='40' fill='none' stroke='" +
      x[2] +
      "' stroke-width='14' stroke-dasharray='" +
      l +
      " " +
      (c - l) +
      "' stroke-dashoffset='" +
      -off +
      "' transform='rotate(-90 50 50)'/>";
    off += l;
  });
  s +=
    "<text x='50' y='54' text-anchor='middle' font-size='17' font-weight='800' fill='currentColor'>248</text></svg>";
  document.getElementById("c4").innerHTML =
    "<div style='display:flex;align-items:center;gap:22px;flex-wrap:wrap'>" +
    s +
    "<div>" +
    S.map(function (x) {
      return (
        "<p style='margin:0 0 9px'><span class='dotc' style='background:" +
        x[2] +
        "'></span>" +
        x[0] +
        " <b>" +
        x[1] +
        "</b> <small style='color:var(--mut)'>(" +
        Math.round(x[1] / 2.48) +
        "%)</small></p>"
      );
    }).join("") +
    "</div></div>";
  document.getElementById("c6").innerHTML =
    "<svg viewBox='0 0 200 125' width='100%' style='max-width:300px;display:block;margin:0 auto' role='img' aria-label='Average match score 56 out of 100'><defs><linearGradient id='gg' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='#F59E0B'/><stop offset='1' stop-color='#14B8A6'/></linearGradient></defs><path d='M20 100 A80 80 0 0 1 180 100' fill='none' stroke='var(--line)' stroke-width='16' stroke-linecap='round'/><path d='M20 100 A80 80 0 0 1 180 100' fill='none' stroke='url(#gg)' stroke-width='16' stroke-linecap='round' pathLength='100' stroke-dasharray='56 100'/><text x='100' y='92' text-anchor='middle' font-size='34' font-weight='800' fill='currentColor'>56</text><text x='100' y='113' text-anchor='middle' font-size='11' fill='var(--mut)'>out of 100</text></svg><div class='note'>SBERT average 58 · Keyword average 53</div>";
}
