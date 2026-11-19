/*
 * utils.js
 * Small helper functions used everywhere: text cleanup, icon builder and button helpers.
 * Functions: ini, T, cap, esc, lines, cf, dot, canon, ico, bar
 */

function ini(n) {
  return n
    .split(" ")
    .map(function (w) {
      return w[0];
    })
    .join("")
    .slice(0, 2);
}

function T(b, t, m) {
  document.getElementById(b).onclick = function () {
    document.getElementById(t).textContent = m;
  };
}

function cap(s) {
  return s.toLowerCase().replace(/(^|\s)\w/g, function (m) {
    return m.toUpperCase();
  });
}

function esc(s) {
  return String(s).replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
  });
}

function lines(t) {
  return t
    .split(/\n|;/)
    .map(function (x) {
      return x.trim();
    })
    .filter(Boolean);
}

function cf(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function dot(s) {
  return /[.!?]$/.test(s) ? s : s + ".";
}

function canon(s) {
  var l = s.toLowerCase(),
    f = CAN.filter(function (c) {
      return c.toLowerCase() == l;
    })[0];
  return f || cf(s);
}

function ico(k, s) {
  return (
    "<svg viewBox='0 0 24 24' width='" +
    (s || 18) +
    "' height='" +
    (s || 18) +
    "' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" +
    IC[k] +
    "</svg>"
  );
}

function bar(l, p, t, w) {
  return (
    "<div class='bh'><i>" +
    l +
    "</i><div class='tr'><u style='width:" +
    w +
    "%" +
    (p < 30 ? ";background:linear-gradient(90deg,#F59E0B,#F97316)" : "") +
    "'></u></div><b>" +
    t +
    "</b></div>"
  );
}
