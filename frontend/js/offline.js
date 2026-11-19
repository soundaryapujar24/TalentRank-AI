/*
 * offline.js
 * Offline mode: applications are queued while the network is down and synced when it comes back.
 * Functions: renderOut, netUI, setNet
 */

function renderOut() {
  var row = function (a) {
      return (
        "<div class='ob'><div><b>" +
        esc(a.j) +
        "</b><br><small style='color:var(--mut)'>Resume: " +
        esc(a.r) +
        (a.em ? " · " + esc(a.em) : "") +
        "</small></div><span class='tag " +
        (a.sent ? "fit" : "close") +
        "'>" +
        (a.sent ? "Submitted" : "Offline draft, not submitted") +
        "</span></div>"
      );
    },
    d = OUT.filter(function (a) {
      return !a.sent;
    }),
    s = OUT.filter(function (a) {
      return a.sent;
    }),
    hd = function (t) {
      return "<p style='margin:14px 0 6px;font-weight:700'>" + t + "</p>";
    };
  document.getElementById("ob").innerHTML =
    (SYN ? "<div class='toast' style='margin:0 0 8px'>" + SYN + "</div>" : "") +
    hd("Offline drafts (saved on this device, not submitted)") +
    (d.length
      ? d.slice().reverse().map(row).join("")
      : "<div class='fi'><small>No offline drafts.</small></div>") +
    hd("Submitted applications") +
    (s.length
      ? s.slice().reverse().map(row).join("")
      : "<div class='fi'><small>No submitted applications yet.</small></div>");
  save();
}

function netUI() {
  var n = document.getElementById("net");
  n.style.display = ROLE == "cd" ? "" : "none";
  n.className = "net" + (ONL ? "" : " o");
  n.innerHTML = "<span class='dotg'></span>" + (ONL ? "Online" : "Offline");
  document.getElementById("off").hidden = ONL || ROLE != "cd";
}

function setNet(on) {
  ONL = on;
  if (on) {
    var n = 0,
      dr = 0;
    PRI.concat(SEC).forEach(function (r) {
      if (r.ns) {
        r.ns = false;
        n++;
      }
    });
    OUT.forEach(function (a) {
      if (!a.sent) {
        a.sent = true;
        dr++;
      }
    });
    SYN =
      dr || n
        ? "Back online. " +
          (dr ? dr + " offline draft" + (dr > 1 ? "s" : "") + " submitted. " : "") +
          (n ? n + " resume" + (n > 1 ? "s" : "") + " synced." : "")
        : "";
  } else SYN = "";
  netUI();
  stores();
  renderOut();
}
