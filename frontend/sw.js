/* Service worker: keeps the app files so candidates can open the app and prepare offline drafts without internet. */
var N = "talentrank-v3",
  F = ["./", "index.html", "css/style.css"].concat(
    ["icons","data","state","utils","ranking","rounds","offers","walkins","candidate","cv-builder","copilot","storage","offline","navigation","charts","main"].map(function (n) {
      return "js/" + n + ".js";
    }),
  );
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(N).then(function (c) { return c.addAll(F); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x != N; }).map(function (x) { return caches.delete(x); }));
  }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method != "GET") return;
  e.respondWith(fetch(e.request).then(function (r) {
    var c = r.clone();
    caches.open(N).then(function (ch) { ch.put(e.request, c); });
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
