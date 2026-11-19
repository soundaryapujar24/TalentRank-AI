/*
 * storage.js
 * My Generated CVs (PRI) and My Uploaded Resumes (SEC) are two separate lists.
 * Uploaded files are kept as real files in IndexedDB so recruiters can download the original.
 * Functions: fdb, fput, fget, fdel, stores, addUp, dlCV, dlUP, delCV, delUP, donut, save
 */

var FDBP = null;

function fdb() {
  if (!FDBP)
    FDBP = new Promise(function (res) {
      try {
        var q = indexedDB.open("talentrank_files", 1);
        q.onupgradeneeded = function () {
          q.result.createObjectStore("f");
        };
        q.onsuccess = function () {
          res(q.result);
        };
        q.onerror = function () {
          res(null);
        };
      } catch (e) {
        res(null);
      }
    });
  return FDBP;
}

function fput(id, blob) {
  return fdb().then(function (d) {
    return new Promise(function (res) {
      if (!d) return res(false);
      var t = d.transaction("f", "readwrite");
      t.objectStore("f").put(blob, id);
      t.oncomplete = function () {
        res(true);
      };
      t.onerror = function () {
        res(false);
      };
    });
  });
}

function fget(id) {
  return fdb().then(function (d) {
    return new Promise(function (res) {
      if (!d) return res(null);
      var q = d.transaction("f").objectStore("f").get(id);
      q.onsuccess = function () {
        res(q.result || null);
      };
      q.onerror = function () {
        res(null);
      };
    });
  });
}

function fdel(id) {
  return fdb().then(function (d) {
    if (d) d.transaction("f", "readwrite").objectStore("f").delete(id);
  });
}

function btns(kind, i, del) {
  return (
    "<div class='acts'>" +
    (del
      ? "<button class='btn' onclick='edit" + kind + "(" + i + ")'>Edit with AI</button>"
      : "") +
    "<button class='btn' onclick='dl" +
    kind +
    "(" +
    i +
    ")'>Download</button>" +
    (del
      ? "<button class='btn' style='background:var(--mut);box-shadow:none' onclick='del" +
        kind +
        "(" +
        i +
        ")'>Delete</button>"
      : "") +
    "</div>"
  );
}

function stores(sel) {
  var o = "",
    rs = document.getElementById("rs");
  PRI.forEach(function (r, i) {
    o += "<option value='p" + i + "'>Generated CV · " + esc(r.n) + "</option>";
  });
  SEC.forEach(function (r, i) {
    o += "<option value='s" + i + "'>Uploaded · " + esc(r.n) + "</option>";
  });
  rs.innerHTML = o;
  if (sel) rs.value = sel;
  if (window.cpFill) cpFill();
  var none = function (t) {
    return "<div class='fi'><small>" + t + "</small></div>";
  };
  document.getElementById("pl").innerHTML = PRI.length
    ? PRI.map(function (r, i) {
        return (
          "<div class='fi'><b>" +
          esc(r.n) +
          "</b><small>" +
          esc(r.role) +
          " · " +
          r.d +
          (r.ns ? " · waiting to sync" : "") +
          "</small>" +
          btns("CV", i, true) +
          "</div>"
        );
      }).join("")
    : none("No generated CVs yet. Create one with the AI CV builder.");
  document.getElementById("sl2").innerHTML = SEC.length
    ? SEC.map(function (r, i) {
        return (
          "<div class='fi'><b>" +
          esc(r.n) +
          "</b><small>" +
          r.kb +
          " KB · " +
          r.d +
          (r.ns ? " · waiting to sync" : "") +
          "</small>" +
          btns("UP", i, true) +
          "</div>"
        );
      }).join("")
    : none("No uploaded resumes yet.");
  var hp = document.getElementById("hpl"),
    hs = document.getElementById("hsl");
  if (hp)
    hp.innerHTML = PRI.map(function (r, i) {
      return (
        "<div class='fi'><b>" + esc(r.n) + "</b><small>" + esc(r.role) + " · " + r.d + "</small>" + btns("CV", i, false) + "</div>"
      );
    }).join("");
  if (hs)
    hs.innerHTML = SEC.map(function (r, i) {
      return (
        "<div class='fi'><b>" + esc(r.n) + "</b><small>Uploaded by the candidate · " + r.kb + " KB · " + r.d + "</small>" + btns("UP", i, false) + "</div>"
      );
    }).join("");
  document.getElementById("hp").textContent = 120 + PRI.length;
  document.getElementById("hs").textContent = 127 + SEC.length + WALK;
  donut();
  save();
}

function upMsg(t) {
  ["unm", "fnm"].forEach(function (k) {
    var e = document.getElementById(k);
    if (e) e.textContent = t;
  });
}

function addUp(f) {
  if (!f) return;
  if (!/\.(pdf|docx)$/i.test(f.name)) {
    upMsg("Only PDF or DOCX files can be uploaded.");
    return;
  }
  if (f.size > 5 * 1024 * 1024) {
    upMsg("The file is larger than 5 MB.");
    return;
  }
  var id = "f" + Date.now().toString(36);
  fput(id, f).then(function (ok) {
    if (!ok) {
      upMsg("The file could not be saved on this device.");
      return;
    }
    SEC.push({
      id: id,
      n: f.name,
      kb: Math.max(1, Math.round(f.size / 1024)),
      d: "Just now",
      ns: !ONL,
      type: f.type,
    });
    stores("s" + (SEC.length - 1));
    upMsg("Uploaded: " + f.name);
  });
}

function dlCV(i) {
  var r = PRI[i];
  if (!r) return;
  fileDl(
    r.n + ".html",
    "<!doctype html><html><head><meta charset='utf-8'><title>" +
      esc(r.n) +
      "</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:32px auto;line-height:1.5;color:#111;padding:0 16px}" +
      (typeof TPLCSS == "string" ? TPLCSS : "") +
      "</style></head><body>" +
      (r.h || "<h1>" + esc(r.n) + "</h1>") +
      "</body></html>",
  );
}

function dlUP(i) {
  var r = SEC[i];
  if (!r || !r.id) return;
  fget(r.id).then(function (b) {
    if (b) fileDl(r.n, b, r.type);
    else alert("This file is not stored on this device.");
  });
}

function delCV(i) {
  if (!confirm("Delete this generated CV?")) return;
  PRI.splice(i, 1);
  if (CUR == i) CUR = -1;
  else if (CUR > i) CUR--;
  stores();
}

function delUP(i) {
  if (!confirm("Delete this uploaded resume?")) return;
  var r = SEC.splice(i, 1)[0];
  if (r && r.id) fdel(r.id);
  stores();
}

function donut() {
  var a = 120 + PRI.length,
    b = 127 + SEC.length + WALK,
    t = a + b,
    c = 2 * Math.PI * 40;
  document.getElementById("dn").innerHTML =
    "<svg width='120' height='120' viewBox='0 0 100 100' role='img' aria-label='AI-generated " +
    a +
    ", uploaded " +
    b +
    "'><circle cx='50' cy='50' r='40' fill='none' stroke='#8B5CF6' stroke-width='14'/><circle cx='50' cy='50' r='40' fill='none' stroke='#14B8A6' stroke-width='14' stroke-dasharray='" +
    (c * a) / t +
    " " +
    c +
    "' transform='rotate(-90 50 50)'/><text x='50' y='55' text-anchor='middle' font-size='17' font-weight='800' fill='currentColor'>" +
    t +
    "</text></svg><div><p style='margin:0 0 8px'><span class='dotc' style='background:#14B8A6'></span>Generated CVs <b>" +
    a +
    "</b></p><p style='margin:0'><span class='dotc' style='background:#8B5CF6'></span>Uploaded resumes <b>" +
    b +
    "</b></p></div>";
}

function save() {
  try {
    localStorage.setItem(
      "tr_ats",
      JSON.stringify({
        p: PRI,
        s: SEC,
        o: OUT,
        rnd: RND,
        wd: WD,
        wr: WR,
        of: OFR,
        m: C.filter(function (c) {
          return c.m;
        }).map(function (c) {
          return c.n;
        }),
      }),
    );
  } catch (e) {}
}
