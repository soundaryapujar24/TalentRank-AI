/*
 * offers.js
 * Online offer letters: HR generates, previews and releases a letter to a selected candidate.
 * The candidate views it under "Offer letters" and downloads or prints it.
 * Functions: letterHTML, openOffer, previewOffer, relOffer, renderOffers, dlOffer, printOffer, fileDl, curC
 */

var OFT = null;

function curC() {
  return C[+document.getElementById("pv").value];
}

function today() {
  var d = new Date();
  return (
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2)
  );
}

function letterHTML(c, o) {
  return (
    "<div class='letter'><h3>" +
    esc(o.company) +
    "</h3><p>Date: " +
    fD(o.offerDate) +
    "</p><p>Dear " +
    esc(c.n) +
    ",</p><p>We are pleased to offer you the position of <b>" +
    esc(o.role) +
    "</b> at " +
    esc(o.company) +
    ".</p><p>Joining date: <b>" +
    fD(o.joinDate) +
    "</b></p>" +
    (o.pay ? "<p>Salary or stipend: <b>" + esc(o.pay) + "</b></p>" : "") +
    (o.terms
      ? "<p><b>Employment terms</b><br>" +
        esc(o.terms).replace(/\n/g, "<br>") +
        "</p>"
      : "") +
    "<p>Please confirm your acceptance before the joining date.</p><p>Sincerely,<br><b>" +
    esc(o.signatory) +
    "</b>" +
    (o.title ? "<br>" + esc(o.title) : "") +
    "<br>" +
    esc(o.company) +
    "</p></div>"
  );
}

function openOffer(i) {
  var c = C[i];
  if (stage(c) != "Selected") return;
  show(i);
  var l = OFT || {};
  ex.insertAdjacentHTML(
    "beforeend",
    "<div id='ofm'><h2 style='margin:16px 0 0'>Release offer letter</h2>" +
      "<label for='of1'>Company name</label><input type='text' id='of1' value='" +
      escA(l.company || "TalentRank Labs") +
      "'>" +
      "<label for='of2'>Job designation</label><input type='text' id='of2' value='" +
      escA(l.role || "Machine Learning Engineer") +
      "'>" +
      "<label for='of3'>Offer date</label><input type='date' id='of3' value='" +
      today() +
      "'>" +
      "<label for='of4'>Joining date</label><input type='date' id='of4'>" +
      "<label for='of5'>Salary or stipend (optional)</label><input type='text' id='of5' placeholder='Leave empty if not stated'>" +
      "<label for='of6'>Employment terms (optional)</label><textarea id='of6'></textarea>" +
      "<label for='of7'>Authorized signatory</label><input type='text' id='of7' value='" +
      escA(l.signatory || "") +
      "'>" +
      "<label for='of8'>Signatory title</label><input type='text' id='of8' value='" +
      escA(l.title || "") +
      "'>" +
      "<p class='row2'><button class='btn' onclick='previewOffer(" +
      i +
      ")'>Preview letter</button></p><div class='toast' id='oft'></div><div id='olv'></div></div>",
  );
  document.getElementById("ofm").scrollIntoView({ block: "nearest" });
}

function previewOffer(i) {
  var g = function (k) {
      return document.getElementById(k).value.trim();
    },
    c = C[i],
    o = {
      company: g("of1"),
      role: g("of2"),
      offerDate: g("of3"),
      joinDate: g("of4"),
      pay: g("of5"),
      terms: g("of6"),
      signatory: g("of7"),
      title: g("of8"),
    },
    t = document.getElementById("oft");
  if (!o.company || !o.role || !o.offerDate || !o.joinDate || !o.signatory) {
    t.textContent =
      "Company, designation, offer date, joining date and signatory are required.";
    return;
  }
  if (o.joinDate < o.offerDate) {
    t.textContent = "The joining date must be on or after the offer date.";
    return;
  }
  t.textContent = "";
  OFT = o;
  document.getElementById("olv").innerHTML =
    "<p style='margin:14px 0 8px;font-weight:700'>Preview</p>" +
    letterHTML(c, o) +
    "<p class='row2'><button class='btn' onclick='relOffer(" +
    i +
    ")'>Release to " +
    esc(c.n) +
    "</button></p>";
}

function relOffer(i) {
  var c = C[i];
  if (!OFT || stage(c) != "Selected") return;
  OFR[c.n] = Object.assign({ at: Date.now() }, OFT);
  c.of = true;
  save();
  refreshAll(i);
  renderOffers();
}

function renderOffers() {
  var c = curC(),
    o = OFR[c.n],
    el = document.getElementById("olc");
  if (!el) return;
  el.innerHTML = o
    ? letterHTML(c, o) +
      "<p class='row2'><button class='btn' onclick='dlOffer(\"" +
      escA(c.n) +
      "\")'>Download</button><button class='btn' style='background:var(--mut);box-shadow:none' onclick='printOffer(\"" +
      escA(c.n) +
      "\")'>Print or save as PDF</button></p>"
    : "<p style='margin:0'>No offer letter has been released to you yet. When HR releases one, it appears here.</p>";
}

function offerDoc(n) {
  var c = C.filter(function (x) {
    return x.n == n;
  })[0];
  return (
    "<!doctype html><html><head><meta charset='utf-8'><title>Offer letter " +
    esc(n) +
    "</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:32px auto;line-height:1.6;color:#111;padding:0 16px}h3{font-size:20px}</style></head><body>" +
    letterHTML(c, OFR[n]) +
    "</body></html>"
  );
}

function fileDl(name, data, type) {
  var b = data instanceof Blob ? data : new Blob([data], { type: type || "text/html" }),
    a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
}

function dlOffer(n) {
  if (OFR[n]) fileDl(n.replace(/\s+/g, "_") + "_Offer_Letter.html", offerDoc(n));
}

function printOffer(n) {
  var w = window.open("", "_blank");
  if (!w || !OFR[n]) return;
  w.document.write(offerDoc(n));
  w.document.close();
  w.focus();
  w.print();
}
