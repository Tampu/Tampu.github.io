// Home-page intro (_pages/intro.md, the "intro" tab).
// A sleepy Highland coo lies on the word TAMPU over a dotted world map. It wakes up, turns its
// head to follow the journey Bengaluru -> London -> Leuven -> Edinburgh -> Tempe as each city lights
// up, then looks up, and the visitor is taken to the about page (data-next). The coo is drawn
// procedurally from a few thousand hair strands (seeded, so it looks the same every time).
// On finish it sets sessionStorage.journeyReveal so the about page lifts a matching curtain.
(function () {
  "use strict";
  var root = document.getElementById("journey-intro");
  if (!root) return;
  window.__journeyStarted = true;
  var NEXT = root.getAttribute("data-next") || "/about/";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var STOPS = [
    { name: "Bengaluru", lat: 12.97, lon: 77.59, label: "e", what: "B.E. Electrical & Electronics, MSRIT" },
    { name: "London", lat: 51.51, lon: -0.13, label: "sw", what: "MSc Big Data Science, Queen Mary University of London" },
    { name: "Leuven", lat: 50.88, lon: 4.7, label: "e", what: "Data Science Intern, imec (brain-on-chip research)" },
    { name: "Edinburgh", lat: 55.95, lon: -3.19, label: "ne", what: "Data Scientist, 3 years in financial services" },
    { name: "Tempe", lat: 33.43, lon: -111.94, label: "e", what: "PhD Researcher, Arizona State University" },
  ];

  // Timeline (ms). About 5.5 s; click anywhere or press Esc / Enter / Space to skip.
  var T_WAKE = 650; // the coo wakes up
  var T_FIRST = 1050; // first city lights up
  var STEP = 680; // time per city
  var ARC = 320; // time to draw the line to the next city
  var LOOK_UP = 650; // after Tempe: the coo looks up
  var HOLD = 900; // then hold before going to the about page

  // Land dots: equirectangular grid, 1.2 degree cells, rows from 80N down to 58S,
  // run-length encoded as "startCol.length" per row (rasterized from Natural Earth 110m land).
  var LAND = { step: 1.2, latTop: 80, rows: "71.7,79.9,95.39,159.7,228.5|65.2,68.2,78.8,89.45,161.5,167.2,233.3|49.4,69.2,76.9,91.44,163.1,234.5|53.4,59.3,65.4,73.2,100.34,199.5,227.18,264.6|55.2,71.1,75.8,102.31,197.3,222.20|46.7,61.2,65.4,70.4,76.2,80.2,83.3,103.29,195.3,217.32,253.3,267.3|45.5,51.8,60.2,65.4,70.2,75.12,104.26,194.2,207.4,212.1,214.3,218.39,266.9|0.1,19.2,47.1,52.11,70.3,76.15,106.26,170.4,195.2,206.4,212.47,260.17,280.1,299.1|14.18,40.5,48.1,52.14,68.1,70.3,79.1,81.2,85.9,104.3,108.23,166.10,200.1,206.77,292.5|0.1,11.44,56.1,60.2,71.6,79.3,87.6,107.20,164.18,194.1,198.1,200.6,208.3,212.88|0.4,13.69,86.1,89.8,105.17,162.22,186.2,190.21,212.88|0.8,12.2,15.63,88.5,95.3,105.15,130.2,136.2,161.17,181.2,185.1,187.113|3.3,11.66,78.2,85.9,106.10,131.7,159.9,171.8,184.116|16.59,78.2,81.2,90.6,107.9,132.4,158.9,169.130|13.60,80.2,92.2,108.6,155.10,168.132|12.60,85.5,109.5,154.10,168.113,283.2,287.7|10.2,13.10,24.3,29.42,85.7,112.2,154.11,169.2,174.105,285.5,291.1|15.7,34.37,85.7,95.2,155.3,159.6,169.99,276.2,283.3|19.2,22.1,38.35,86.12,145.2,160.4,170.97,281.4|17.2,39.37,86.13,145.3,157.2,160.3,168.97,280.6|14.2,40.39,85.15,146.3,157.1,159.1,161.1,168.96,280.5|41.40,84.18,142.3,147.3,157.2,160.1,163.101,280.4|42.40,84.20,142.3,146.4,154.115,280.2|43.40,84.19,142.1,146.5,153.116,280.2|43.1,45.55,102.1,146.1,151.116,268.2|45.1,47.47,97.1,101.4,148.119,268.2|46.1,48.44,93.3,101.5,146.121,268.1|47.49,103.1,105.1,148.33,182.83,268.1|47.50,98.2,149.26,178.1,181.84|47.47,95.2,149.11,163.11,178.1,181.83,268.1|46.45,143.13,159.2,164.9,183.79,268.3|46.45,142.11,157.1,160.2,166.7,185.74,267.1|46.44,143.8,157.1,162.2,166.7,174.84,267.1|47.41,142.8,157.1,163.1,167.2,172.78,251.2,254.2,267.1|47.40,142.8,163.1,167.3,172.76,254.3,266.2|48.38,143.6,161.2,168.1,173.76,250.2,255.3,265.2|49.38,145.1,150.9,177.1,180.71,255.3,263.4|49.38,145.14,171.1,177.1,180.69,255.2,260.7|51.33,144.15,180.70,261.1,263.1|52.31,142.20,167.2,179.72,258.2|53.1,55.27,142.21,167.6,175.1,179.73|53.1,56.19,78.4,142.109|54.1,56.15,81.2,141.49,192.60|55.1,58.11,81.2,139.39,179.12,193.58|56.1,59.10,82.1,84.2,138.40,180.12,195.1,198.52|59.10,82.1,138.41,181.12,196.1,200.49|57.1,60.9,137.43,181.12,195.2,206.42,250.1|58.1,61.8,81.2,136.44,182.17,208.39,250.1|62.7,83.3,136.45,183.17,208.16,227.17|62.7,75.2,86.2,136.45,183.16,211.11,227.12,241.1|20.1,62.8,74.3,89.3,136.45,184.14,211.10,228.10,241.1|64.13,85.1,88.3,94.1,137.45,185.12,211.9,229.10,251.1|66.10,136.46,185.11,211.7,229.10,250.2|69.1,72.4,78.2,136.47,186.7,211.6,229.1,231.9,250.1|73.8,135.49,186.5,212.5,232.9,250.1|76.4,136.49,186.3,212.5,232.1,234.7,250.1|78.2,90.1,136.50,213.4,232.1,235.6,254.1|78.2,87.3,91.2,137.49,189.4,213.4,232.1,236.4,249.1|79.2,87.3,91.8,138.54,214.2,232.1,238.1,252.1|80.4,85.14,139.53,214.1,217.1,232.1,254.1|85.16,140.51,216.2,233.1,253.2|86.16,141.11,154.37,217.1,234.1,247.1,254.1|86.20,142.3,147.2,154.36,229.2,234.2,246.3|86.21,158.31,230.2,234.2,245.3|85.23,158.31,231.3,235.1,243.5|84.24,158.29,232.3,236.1,241.8,256.1|83.25,158.28,233.3,241.7,256.1|83.28,157.28,234.3,241.7,251.1,259.3|83.30,158.26,234.3,242.5,249.2,260.2,264.2|83.34,159.24,235.3,243.1,245.2,249.1,251.1,255.1,258.1,261.8|82.37,160.23,236.2,251.2,263.8,276.2|82.39,160.22,237.1,265.7,274.2|83.38,161.22,239.5,265.8|84.37,161.22,242.4,265.4,272.1|85.35,161.22,253.1,273.1,283.2|85.34,161.23|86.33,161.23,260.1,268.1|86.32,161.23,191.1,259.5,268.2|86.32,160.24,190.2,255.1,258.5,268.2|87.31,160.24,189.3,254.9,268.3|89.28,160.23,187.5,252.13,268.3,299.1|91.26,160.21,187.4,252.20,298.1|91.26,160.20,187.4,251.21|92.24,161.18,187.4,249.25|92.24,161.18,186.4,246.28,288.1|91.24,162.18,186.4,245.31|91.21,162.18,186.4,245.31|91.19,162.16,187.2,245.32|91.19,163.14,244.34|91.19,163.14,245.33|91.18,164.13,246.32|91.17,164.12,246.32|90.18,165.10,246.32|90.17,165.9,247.9,261.16|90.16,165.7,246.7,262.2,265.11|90.11,103.2,166.1,247.2,264.12|89.13,266.9|89.14,267.8,295.2|89.13,268.2,271.2,296.3|89.9,295.2|89.9,296.1|88.8,271.3,293.2|88.8,271.2,292.2|89.7,290.3|88.6,289.3|87.7,290.1|87.8|87.7,207.1|87.6|87.6,101.1|88.5|89.5|91.5||" };

  var FONT = "Montserrat,'Helvetica Neue',Arial,sans-serif";
  var css =
    "#journey-intro{--ji-bg:#faf6ee;--ji-ink:#2b1d10;--ji-text:#2e2216;--ji-muted:#8c7558;--ji-dot:#cdb48b;--ji-accent:#b8701d;" +
    "position:fixed;inset:0;z-index:1020;overflow:hidden;cursor:pointer;background:var(--ji-bg);color:var(--ji-text);font-family:" +
    FONT +
    "}" +
    "html[data-theme=dark] #journey-intro{--ji-bg:#1d1812;--ji-ink:#f3e4c8;--ji-text:#efe2cb;--ji-muted:#b09a7a;--ji-dot:#6e5c42;--ji-accent:#e2a84a}" +
    "html body{background:#faf6ee}" +
    "html[data-theme=dark] body{background:#1d1812}" +
    "#navbar .nav-item.active>.nav-link,#navbar .nav-link:hover{color:#b8701d!important}" +
    "html[data-theme=dark] #navbar .nav-item.active>.nav-link,html[data-theme=dark] #navbar .nav-link:hover{color:#e2a84a!important}" +
    "#navbar{background:transparent!important;box-shadow:none!important;border-color:transparent!important}" +
    "footer.fixed-bottom,#progress{display:none!important}" +
    "#journey-intro canvas,#journey-intro .ji-map{position:absolute;inset:0;width:100%;height:100%}" +
    "#journey-intro canvas{opacity:0;transition:opacity .6s ease}" +
    "#journey-intro.ji-ready canvas{opacity:1}" +
    "#journey-intro .ji-label{font:500 14px " +
    FONT +
    ";fill:var(--ji-muted);transition:fill .3s ease}" +
    "#journey-intro .ji-label.on{fill:var(--ji-text)}" +
    "#journey-intro .ji-stage{position:absolute;left:50%;top:33%;transform:translateX(-50%);" +
    "width:min(700px,92vw,calc((64vh - 120px) / .58));text-align:center}" +
    "#journey-intro .ji-coo{display:block;width:100%;height:auto;overflow:visible}" +
    "#journey-intro .ji-sub{margin:.35em 0 0;font:400 clamp(17px,2.5vw,34px)/1.2 " +
    FONT +
    ";letter-spacing:.05em;color:var(--ji-text)}" +
    "#journey-intro .ji-what{min-height:1.4em;margin-top:16px;font:500 13px/1.4 " +
    FONT +
    ";letter-spacing:.06em;color:var(--ji-muted)}" +
    "#journey-intro .ji-what b{color:var(--ji-accent);font-weight:600}" +
    "#journey-intro .ji-skip{position:absolute;right:28px;bottom:22px;background:none;border:0;padding:4px 0;cursor:pointer;" +
    "font:500 12px " +
    FONT +
    ";letter-spacing:.12em;text-transform:uppercase;color:var(--ji-muted)}" +
    "#journey-intro .ji-skip:hover,#journey-intro .ji-skip:focus-visible{color:var(--ji-accent);outline:none}" +
    "@media (max-width:700px){#journey-intro .ji-stage{top:40%}#journey-intro .ji-label{font-size:11px}" +
    "#journey-intro .ji-what{font-size:11.5px}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- seeded randomness ----------
  var seed = 20261124;
  function rnd() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function rr(a, b) {
    return a + (b - a) * rnd();
  }
  function f1(v) {
    return Math.round(v * 10) / 10;
  }

  // ---------- the coo ----------
  // Colors of a golden ("yellow") Highland coo: dark ginger roots, amber body, honey-gold tips.
  var FUR = ["#4f2709", "#6a3410", "#844316", "#9d531c", "#b46624", "#c77b2f", "#d6913d", "#e1a751", "#eabd6b", "#f2d18f", "#f8e2b4"];
  var LAST = FUR.length - 1;

  // Hair is drawn as locks: a few fine strands that share one wavy path and taper together,
  // which reads as real coat rather than loose noodles. Strands are batched per color and width.
  function Fur() {
    this.b = {};
  }
  Fur.prototype.add = function (ci, width, d) {
    var key = FUR[Math.max(0, Math.min(LAST, ci))] + "|" + width;
    (this.b[key] = this.b[key] || []).push(d);
  };
  Fur.prototype.lock = function (x, y, dx, dy, len, spread, ci, n, wide) {
    var px = -dy;
    var py = dx;
    var w1 = rr(-0.2, 0.2) * len;
    var w2 = rr(-0.2, 0.2) * len;
    var c1x = x + dx * len * 0.33 + px * w1;
    var c1y = y + dy * len * 0.33 + py * w1;
    var c2x = x + dx * len * 0.66 + px * w2;
    var c2y = y + dy * len * 0.66 + py * w2;
    var bend = rr(-0.12, 0.12) * len;
    var ex = x + dx * len + px * bend;
    var ey = y + dy * len + py * bend;
    for (var i = 0; i < n; i++) {
      var o = (n === 1 ? 0 : i / (n - 1) - 0.5) * spread + rr(-0.5, 0.5);
      var cut = rr(0.78, 1);
      var d =
        "M" + f1(x + px * o) + " " + f1(y + py * o) +
        "C" + f1(c1x + px * o * 0.75) + " " + f1(c1y + py * o * 0.75) + " " +
        f1(c2x + px * o * 0.4) + " " + f1(c2y + py * o * 0.4) + " " +
        f1(x + (ex - x) * cut + px * o * 0.1) + " " + f1(y + (ey - y) * cut + py * o * 0.1);
      this.add(ci + Math.round(rr(-0.7, 0.7)), wide && rnd() < 0.35 ? 1.25 : rnd() < 0.6 ? 0.65 : 0.95, d);
    }
  };
  Fur.prototype.svg = function () {
    var out = "";
    for (var key in this.b) {
      var p = key.split("|");
      out += '<path d="' + this.b[key].join("") + '" fill="none" stroke="' + p[0] + '" stroke-width="' + p[1] + '" stroke-linecap="round"/>';
    }
    return out;
  };

  // Fill a union of ellipses with locks that fall downward and fan outward at the edges.
  // Shade follows height (light from above) plus a per-layer bias: dark undercoat, mid coat, sunlit tips.
  function furBlob(fur, ellipses, n, o) {
    var areas = ellipses.map(function (e) {
      return e[2] * e[3];
    });
    var total = areas.reduce(function (a, b) {
      return a + b;
    }, 0);
    for (var i = 0; i < n; i++) {
      var pick = rnd() * total;
      var e = ellipses[0];
      for (var j = 0; j < ellipses.length; j++) {
        pick -= areas[j];
        if (pick <= 0) {
          e = ellipses[j];
          break;
        }
      }
      var a = rnd() * Math.PI * 2;
      var r = Math.sqrt(rnd());
      var nx = Math.cos(a) * r;
      var ny = Math.sin(a) * r;
      if (o.upper && ny > o.upper) {
        i--;
        continue;
      }
      var x = e[0] + nx * e[2];
      var y = e[1] + ny * e[3];
      var dx = nx * o.spread + rr(-0.2, 0.2);
      var dy = ny * o.spread + o.fall + rr(-0.15, 0.15);
      var m = Math.hypot(dx, dy) || 1;
      dx /= m;
      dy /= m;
      var len = rr(o.len[0], o.len[1]);
      if (o.maxY && y + dy * len > o.maxY) len = Math.max(4, (o.maxY - y) / Math.max(dy, 0.25));
      var light = 1 - (y - o.top) / o.height; // 1 at the top, 0 at the bottom
      var ci = Math.round((light * 0.75 + o.bias + rr(-0.1, 0.1)) * LAST);
      fur.lock(x, y, dx, dy, len, rr(o.spreadW[0], o.spreadW[1]), ci, 3 + Math.floor(rnd() * 4), o.wide);
    }
  }

  // Three passes of the same region: dark undercoat, main coat, and sunlit tips on top.
  function coat(ellipses, n, base) {
    var fur = new Fur();
    var o = Object.assign({ spreadW: [2.5, 5], wide: true }, base);
    furBlob(fur, ellipses, Math.round(n * 0.35), Object.assign({}, o, { bias: -0.2, len: [o.len[0] * 1.2, o.len[1] * 1.25] }));
    furBlob(fur, ellipses, Math.round(n * 0.45), Object.assign({}, o, { bias: 0.06 }));
    furBlob(fur, ellipses, Math.round(n * 0.2), Object.assign({}, o, { bias: 0.3, upper: 0.1, wide: false, len: [o.len[0] * 0.7, o.len[1] * 0.8] }));
    return fur.svg();
  }

  function buildCoo() {
    var g =
      "<defs>" +
      '<linearGradient id="ji-coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf8b3c"/><stop offset=".6" stop-color="#a5621f"/><stop offset="1" stop-color="#6e3a12"/></linearGradient>' +
      '<radialGradient id="ji-muzzle" cx="50%" cy="28%" r="80%"><stop offset="0" stop-color="#e9c2a8"/><stop offset=".55" stop-color="#d7a089"/><stop offset="1" stop-color="#b47a66"/></radialGradient>' +
      '<radialGradient id="ji-pad" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#a56a5d"/><stop offset="1" stop-color="#7d4c43"/></radialGradient>' +
      // Horn: grey-brown ridged base, ivory body, dark tip.
      '<linearGradient id="ji-horn" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8d7659"/><stop offset=".22" stop-color="#cdbd9d"/>' +
      '<stop offset=".55" stop-color="#f1e8d4"/><stop offset=".85" stop-color="#d3c09c"/><stop offset="1" stop-color="#4e4034"/></linearGradient>' +
      '<linearGradient id="ji-hoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b3b33"/><stop offset="1" stop-color="#211915"/></linearGradient>' +
      '<filter id="ji-rough" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/>' +
      '<feDisplacementMap in="SourceGraphic" scale="4"/></filter>' +
      '<filter id="ji-soft"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="ji-soft2"><feGaussianBlur stdDeviation="3"/></filter>' +
      "</defs>";

    // Letters with a hand-drawn wobble, and a scribble of dry grass underneath.
    var grass = "";
    var grassCols = ["#c9973a", "#e0b65c", "#8e8a4e", "#b39770"];
    for (var i = 0; i < 150; i++) {
      grass +=
        '<path d="M' + f1(rr(40, 560)) + " " + f1(rr(314, 326)) + "l" + f1(rr(8, 22)) + " " + f1(rr(-4, 1)) +
        '" stroke="' + grassCols[i % 4] + '" stroke-width="' + f1(rr(0.8, 1.6)) + '" opacity=".75" stroke-linecap="round"/>';
    }
    g +=
      '<g class="ji-letters">' +
      grass +
      '<text x="300" y="318" text-anchor="middle" textLength="470" lengthAdjust="spacingAndGlyphs" filter="url(#ji-rough)" ' +
      "style=\"font:400 132px 'Titan One','Arial Black',sans-serif;fill:var(--ji-ink)\">TAMPU</text></g>";

    // Contact shadow where the coo lies on the letters.
    g += '<ellipse cx="335" cy="231" rx="175" ry="8" fill="#2a1606" opacity=".28" filter="url(#ji-soft)"/>';

    // Tail with a tuft.
    var tuft = new Fur();
    furBlob(tuft, [[547, 210, 7, 9]], 45, { spread: 0.5, fall: 1, len: [10, 18], top: 200, height: 30, bias: -0.05, spreadW: [2, 4] });
    g +=
      '<g class="ji-tail"><path d="M486 188C510 187 528 196 544 206" fill="none" stroke="#8a4716" stroke-width="4.5" stroke-linecap="round"/>' +
      tuft.svg() +
      "</g>";

    // Body: shoulder, back and rump of a coo lying down.
    var bodyE = [
      [352, 192, 148, 40],
      [428, 176, 76, 44],
      [300, 182, 70, 40],
      [268, 198, 66, 30],
    ];
    g +=
      '<g class="ji-body">' +
      bodyE
        .map(function (e) {
          return '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + (e[2] - 10) + '" ry="' + (e[3] - 12) + '" fill="url(#ji-coat)"/>';
        })
        .join("") +
      coat(bodyE, 1000, { spread: 0.32, fall: 0.9, len: [16, 30], top: 132, height: 100, maxY: 238 }) +
      "</g>";

    // Front legs and hooves, draped over the top of the letters.
    var legs = new Fur();
    furBlob(
      legs,
      [
        [217, 210, 16, 11],
        [293, 210, 16, 11],
      ],
      70,
      { spread: 0.35, fall: 1, len: [8, 15], top: 196, height: 34, maxY: 226, bias: -0.1, spreadW: [2, 4] },
    );
    function hoof(x) {
      return (
        '<path d="M' + (x - 15) + ' 225q0-9 15-9t15 9q0 9-15 9t-15-9z" fill="url(#ji-hoof)"/>' +
        '<path d="M' + x + ' 218v15" stroke="#120d0b" stroke-width="1.1" opacity=".8"/>' +
        '<path d="M' + (x - 10) + ' 221q5-3 9-3" stroke="#fff" stroke-width="1.2" opacity=".18" fill="none" stroke-linecap="round"/>'
      );
    }
    g += '<g class="ji-legs">' + legs.svg() + hoof(216) + hoof(294) + "</g>";

    // ---- head (everything below moves together) ----
    var h = '<g class="ji-head">';
    // Shadow the head casts on the shoulder.
    h += '<ellipse cx="290" cy="186" rx="48" ry="26" fill="#5a2d0c" opacity=".22" filter="url(#ji-soft2)"/>';
    // Horns: long, out to the side and then up.
    var horn = "M216 140C194 139 162 134 148 114C140 102 141 88 149 76C150 91 156 103 170 111C186 119 204 119 222 124Z";
    var ridges = '<path d="M205 122q-3 8 0 16M197 121q-3 8 0 15M189 119q-3 7 0 14" stroke="#7a6449" stroke-width=".9" fill="none" opacity=".45"/>';
    h +=
      '<g class="ji-horns"><path d="' + horn + '" fill="url(#ji-horn)" stroke="#7d6a52" stroke-width=".8"/>' + ridges +
      '<g transform="translate(510 0) scale(-1 1)"><path d="' + horn + '" fill="url(#ji-horn)" stroke="#7d6a52" stroke-width=".8"/>' + ridges + "</g></g>";
    // Ears: furry, sideways.
    function ear(cx, rot) {
      var f = new Fur();
      furBlob(f, [[cx, 158, 23, 9]], 70, { spread: 0.8, fall: 0.45, len: [7, 13], top: 146, height: 26, bias: 0.02, spreadW: [2, 3.5] });
      return (
        '<ellipse cx="' + cx + '" cy="158" rx="22" ry="9" fill="#8a4716" transform="rotate(' + rot + " " + cx + ' 158)"/>' +
        '<ellipse cx="' + cx + '" cy="160" rx="12" ry="4.5" fill="#c98f7b" opacity=".8" transform="rotate(' + rot + " " + cx + ' 158)"/>' +
        f.svg()
      );
    }
    h += '<g class="ji-ear-l">' + ear(186, -12) + "</g>" + '<g class="ji-ear-r">' + ear(324, 12) + "</g>";
    // Head.
    var headE = [
      [255, 160, 58, 46],
      [255, 132, 44, 26],
    ];
    h +=
      '<ellipse cx="255" cy="160" rx="55" ry="44" fill="url(#ji-coat)"/>' +
      coat(headE, 520, { spread: 0.55, fall: 0.7, len: [10, 20], top: 106, height: 106, spreadW: [2, 4] });
    // Sleeping eyes: closed lids under the fringe.
    h +=
      '<g class="ji-eyes" stroke="#2b1a10" stroke-width="2.2" fill="none" stroke-linecap="round">' +
      '<path d="M221 170q10 7 20 0"/><path d="M269 170q10 7 20 0"/></g>';
    // Muzzle: broad, soft pink-tan with a darker moist nose pad and side nostrils.
    h +=
      '<g class="ji-muzzle">' +
      '<path d="M214 193c0-14 18-21 41-21s41 7 41 21-16 23-41 23-41-9-41-23z" fill="url(#ji-muzzle)"/>' +
      '<path d="M226 193c0-8 13-12 29-12s29 4 29 12-12 14-29 14-29-6-29-14z" fill="url(#ji-pad)" opacity=".5"/>' +
      '<ellipse cx="250" cy="185" rx="15" ry="3.5" fill="#fff" opacity=".35"/>' +
      '<ellipse cx="236" cy="198" rx="4.4" ry="2.9" fill="#3a221b" transform="rotate(28 236 198)"/>' +
      '<ellipse cx="274" cy="198" rx="4.4" ry="2.9" fill="#3a221b" transform="rotate(-28 274 198)"/>' +
      '<path d="M242 210q13 4 26 0" stroke="#8f5a4c" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".7"/>' +
      "</g>";
    // Shadow of the fringe on the top of the muzzle.
    h += '<ellipse cx="255" cy="176" rx="40" ry="6" fill="#3a1d08" opacity=".35" filter="url(#ji-soft2)"/>';
    // The fringe: long golden locks from the forehead falling over the eyes.
    var fringe = new Fur();
    for (var k = 0; k < 150; k++) {
      // Locks start along the curved crown, so the fringe has a rounded top rather than a straight edge.
      var fx = rr(196, 314);
      var u = (fx - 255) / 58;
      var fy = 100 + u * u * 24 + rr(0, 20);
      var dx = ((fx - 255) / 58) * 0.42 + rr(-0.12, 0.12);
      var m = Math.hypot(dx, 1);
      var len = Math.min(rr(42, 66), (186 - fy) * m);
      var ci = Math.round((0.55 + rr(-0.2, 0.32)) * LAST);
      fringe.lock(fx, fy, dx / m, 1 / m, len, rr(3, 6), ci, 4 + Math.floor(rnd() * 4), true);
    }
    // A tousled crown between the horns.
    for (k = 0; k < 45; k++) {
      var tx = rr(214, 296);
      var ang = -Math.PI / 2 + ((tx - 255) / 41) * 0.9 + rr(-0.35, 0.35);
      fringe.lock(tx, rr(108, 120), Math.cos(ang), Math.sin(ang), rr(10, 20), rr(2, 4), Math.round(rr(0.6, 0.95) * LAST), 3, false);
    }
    h += '<g class="ji-fringe">' + fringe.svg() + "</g>";
    // Little marks: zzz while asleep, a startle when it wakes.
    h +=
      '<g class="ji-zzz" style="font:600 16px ' +
      FONT +
      ';fill:var(--ji-accent)"><text x="318" y="112">z</text><text x="332" y="96" font-size="12">z</text><text x="342" y="82" font-size="9">z</text></g>';
    h +=
      '<g class="ji-startle" stroke="var(--ji-accent)" stroke-width="2.4" stroke-linecap="round" opacity="0">' +
      '<path d="M300 96l8-14"/><path d="M314 104l14-8"/><path d="M292 90l1-14"/></g>';
    h += "</g>";
    return g + h;
  }

  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "Intro: Tampu, Computer Science PhD Researcher. Bengaluru, London, Leuven, Edinburgh, Tempe.");
  root.innerHTML =
    '<canvas aria-hidden="true"></canvas>' +
    '<svg class="ji-map" aria-hidden="true"><g class="ji-arcs"></g><g class="ji-cities"></g></svg>' +
    '<div class="ji-stage">' +
    '<svg class="ji-coo" viewBox="0 70 600 270" aria-hidden="true">' +
    buildCoo() +
    "</svg>" +
    '<p class="ji-sub">Computer Science PhD Researcher</p>' +
    '<div class="ji-what" aria-live="polite"></div>' +
    "</div>" +
    '<button type="button" class="ji-skip">Skip intro</button>';

  var SVGNS = "http://www.w3.org/2000/svg";
  var canvas = root.querySelector("canvas");
  var mapSvg = root.querySelector(".ji-map");
  var arcLayer = mapSvg.querySelector(".ji-arcs");
  var cityLayer = mapSvg.querySelector(".ji-cities");
  var stage = root.querySelector(".ji-stage");
  var what = root.querySelector(".ji-what");
  var coo = root.querySelector(".ji-coo");
  function part(sel) {
    return coo.querySelector(sel);
  }
  var headEl = part(".ji-head");
  var fringeEl = part(".ji-fringe");
  var muzzleEl = part(".ji-muzzle");
  var eyesEl = part(".ji-eyes");
  var earL = part(".ji-ear-l");
  var earR = part(".ji-ear-r");
  var tailEl = part(".ji-tail");
  var bodyEl = part(".ji-body");
  var zzz = part(".ji-zzz");
  var startle = part(".ji-startle");

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var cities = STOPS.map(function (st) {
    var g = el("g", {}, cityLayer);
    var ring = el("circle", { r: 6, fill: "none", stroke: "var(--ji-accent)", "stroke-width": 1.2, opacity: 0 }, g);
    var dot = el("circle", { r: 5, fill: "var(--ji-dot)" }, g);
    var label = el("text", { class: "ji-label" }, g);
    label.textContent = st.name;
    return { g: g, ring: ring, dot: dot, label: label };
  });
  var arcs = STOPS.slice(1).map(function () {
    var line = el("path", { fill: "none", stroke: "var(--ji-accent)", "stroke-width": 1.4, "stroke-linecap": "round", opacity: 0.8 }, arcLayer);
    var head = el("circle", { r: 2.6, fill: "var(--ji-accent)", opacity: 0 }, arcLayer);
    return { line: line, head: head, len: 0 };
  });

  // ---------- layout ----------
  var W, H, s, ox, oy, cooX, cooY;
  function layout() {
    W = window.innerWidth;
    H = window.innerHeight;
    var narrow = W <= 700;
    // Tempe sits near the left edge and Bengaluru near the right, like the poster.
    s = (W * (narrow ? 0.74 : 0.62)) / (77.59 + 111.94);
    ox = W * (narrow ? 0.1 : 0.17) - (-111.94 + 180) * s;
    oy = H * (narrow ? 0.17 : 0.21) - (LAND.latTop - 51.51) * s;
    var r = stage.getBoundingClientRect();
    cooX = r.left + r.width * 0.42;
    cooY = r.top + r.width * 0.15;
    drawDots();
    placeMarks(narrow);
  }

  function drawDots() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cell = LAND.step * s;
    var rad = Math.max(0.7, cell * 0.3);
    ctx.fillStyle = getComputedStyle(root).getPropertyValue("--ji-dot").trim() || "#cdb48b";
    var sr = stage.getBoundingClientRect();
    var cx = sr.left + sr.width / 2;
    var cy = sr.top + sr.height * 0.45;
    LAND.rows.split("|").forEach(function (row, ri) {
      if (!row) return;
      var y = oy + (ri + 0.5) * cell;
      if (y < -cell || y > H + cell) return;
      row.split(",").forEach(function (run) {
        var p = run.split(".");
        for (var c = +p[0]; c < +p[0] + +p[1]; c++) {
          var x = ox + (c + 0.5) * cell;
          if (x < -cell || x > W + cell) continue;
          // Fade the map out behind the coo so the mascot reads cleanly.
          var dx = (x - cx) / (sr.width * 0.62);
          var dy = (y - cy) / (sr.height * 0.62);
          var d = Math.sqrt(dx * dx + dy * dy);
          ctx.globalAlpha = 0.42 * Math.min(1, Math.max(0.18, (d - 0.45) * 1.4));
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }

  function project(lon, lat) {
    return { x: ox + (lon + 180) * s, y: oy + (LAND.latTop - lat) * s };
  }

  function placeMarks(narrow) {
    var pts = STOPS.map(function (st) {
      return project(st.lon, st.lat);
    });
    cities.forEach(function (c, i) {
      var p = pts[i];
      c.x = p.x;
      c.y = p.y;
      c.g.setAttribute("transform", "translate(" + f1(p.x) + " " + f1(p.y) + ")");
      var off = narrow ? 9 : 14;
      var pos = { e: [off, 5, "start"], sw: [-off + 4, 20, "end"], ne: [off - 2, -10, "start"] }[STOPS[i].label];
      c.label.setAttribute("x", pos[0]);
      c.label.setAttribute("y", pos[1]);
      c.label.setAttribute("text-anchor", pos[2]);
    });
    arcs.forEach(function (a, i) {
      var p0 = pts[i];
      var p1 = pts[i + 1];
      var lift = Math.max(14, Math.hypot(p1.x - p0.x, p1.y - p0.y) * 0.2);
      a.line.setAttribute(
        "d",
        "M" + f1(p0.x) + " " + f1(p0.y) + "Q" + f1((p0.x + p1.x) / 2) + " " + f1((p0.y + p1.y) / 2 - lift) + " " + f1(p1.x) + " " + f1(p1.y),
      );
      a.len = a.line.getTotalLength();
      a.line.setAttribute("stroke-dasharray", a.len);
    });
  }

  // ---------- motion ----------
  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  // Damped springs give the head weight and let the fringe and ears lag and bounce.
  function Spring(k, c) {
    this.x = 0;
    this.v = 0;
    this.k = k;
    this.c = c;
  }
  Spring.prototype.step = function (target, dt) {
    this.v += (this.k * (target - this.x) - this.c * this.v) * dt;
    this.x += this.v * dt;
    return this.x;
  };
  var sTurn = new Spring(70, 13); // -1 (left) .. 1 (right)
  var sLift = new Spring(60, 12); // head raised, px
  var sUp = new Spring(55, 11); // looking up, 0..1
  var sFringe = new Spring(110, 7); // follows the head turn with a lag and a little bounce
  var sEar = new Spring(160, 9); // ear flick

  var landAt = STOPS.map(function (_, i) {
    return T_FIRST + i * STEP + (i ? ARC : 0);
  });
  var T_UP = landAt[STOPS.length - 1] + LOOK_UP;
  var END = T_UP + HOLD;

  function gazeAt(i) {
    // Turn toward the city, and look up a little if it is above the coo.
    var c = cities[i];
    return { turn: clamp((c.x - cooX) / (W * 0.3), -1, 1), up: clamp((cooY - c.y) / (H * 0.45), 0, 0.55) };
  }

  var t0 = null;
  var last = 0;
  var current = -1;
  var finished = false;
  var woke = false;
  var lookedUp = false;

  function frame(now) {
    if (finished) return;
    if (t0 === null) {
      // Reduced motion: start at the end state (all cities lit, looking up) and hold it.
      if (reduceMotion) {
        t0 = now - T_UP - 600;
        END = T_UP + 600 + 2500;
      } else t0 = now;
      last = now;
    }
    var t = now - t0;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Arcs and city highlights.
    arcs.forEach(function (a, i) {
      var p = easeInOut(clamp((t - (landAt[i + 1] - ARC)) / ARC, 0, 1));
      a.line.setAttribute("stroke-dashoffset", a.len * (1 - p));
      if (p > 0 && p < 1) {
        var pt = a.line.getPointAtLength(a.len * p);
        a.head.setAttribute("cx", pt.x);
        a.head.setAttribute("cy", pt.y);
        a.head.setAttribute("opacity", 1);
      } else a.head.setAttribute("opacity", 0);
    });
    cities.forEach(function (c, i) {
      var k = clamp((t - landAt[i]) / 500, 0, 1);
      var lit = t >= landAt[i];
      c.dot.setAttribute("fill", lit ? "var(--ji-accent)" : "var(--ji-dot)");
      c.dot.setAttribute("r", lit ? 5 + 2.5 * (1 - k) : 4.5);
      c.ring.setAttribute("r", 5 + 13 * (1 - Math.pow(1 - k, 3)));
      c.ring.setAttribute("opacity", lit ? 1 - k : 0);
      c.label.classList.toggle("on", lit);
    });

    var idx = -1;
    for (var i = 0; i < STOPS.length; i++) if (t >= landAt[i]) idx = i;
    if (idx !== current && idx >= 0) {
      current = idx;
      what.innerHTML = "<b>" + STOPS[idx].name + "</b> &nbsp;·&nbsp; " + STOPS[idx].what;
    }

    // Where the coo looks: asleep, then each city (turning as the line is drawn), then up.
    var turn = 0;
    var up = 0;
    var lift = 0;
    if (t >= T_WAKE) {
      lift = 7;
      var target = -1;
      for (i = 0; i < STOPS.length; i++) if (t >= landAt[i] - (i ? ARC : 150)) target = i;
      if (target >= 0) {
        var gz = gazeAt(target);
        turn = gz.turn;
        up = gz.up;
      }
    }
    if (t >= T_UP) {
      turn = 0;
      up = 1;
      lift = 16;
    }
    if (t >= T_WAKE && !woke) {
      woke = true;
      sEar.v = 9; // flick
    }
    // zzz fade out on waking, a quick startle mark appears and fades; the eyes vanish under the fringe.
    var sinceWake = t - T_WAKE;
    zzz.setAttribute("opacity", f1(clamp(1 - sinceWake / 250, 0, 1)));
    eyesEl.setAttribute("opacity", f1(clamp(1 - sinceWake / 200, 0, 1)));
    startle.setAttribute("opacity", sinceWake < 0 ? 0 : f1(sinceWake < 450 ? clamp(sinceWake / 120, 0, 1) : clamp(1 - (sinceWake - 450) / 500, 0, 1)));
    if (t >= T_UP && !lookedUp) {
      lookedUp = true;
      sEar.v = -7;
    }

    var tu = sTurn.step(turn, dt);
    var li = sLift.step(lift, dt);
    var uu = sUp.step(up, dt);
    var fr = sFringe.step(tu, dt);
    var ear = sEar.step(0, dt);

    // Breathing: deeper while asleep, smaller once awake.
    var breath = Math.sin(t / (woke ? 900 : 620)) * (woke ? 0.006 : 0.014);
    bodyEl.setAttribute("transform", "translate(0 " + f1(228 * -breath) + ") scale(1 " + (1 + breath).toFixed(4) + ")");
    if (!woke) zzz.setAttribute("transform", "translate(0 " + f1(-((t / 30) % 14)) + ")");

    // Head: turn (shift + rotate around the neck), lift, and tilt back to look up.
    headEl.setAttribute(
      "transform",
      "translate(" + f1(tu * 12) + " " + f1(-li - uu * 6 + (woke ? 0 : breath * 120)) + ") rotate(" + f1(tu * 7 - uu * 6) + " 255 210)",
    );
    // The muzzle slides further than the head when turning and shortens when looking up: a cheap 3D turn.
    muzzleEl.setAttribute(
      "transform",
      "translate(" + f1(tu * 9) + " " + f1(-uu * 7) + ") translate(255 195) scale(1 " + (1 - uu * 0.12).toFixed(3) + ") translate(-255 -195)",
    );
    // The fringe swings behind the turn, so it keeps covering the eyes.
    fringeEl.setAttribute("transform", "rotate(" + f1((fr - tu) * -10 + tu * 2) + " 255 112) translate(" + f1(tu * 4) + " " + f1(-uu * 3) + ")");
    earL.setAttribute("transform", "rotate(" + f1(-ear * 6 - uu * 6) + " 208 156)");
    earR.setAttribute("transform", "rotate(" + f1(ear * 6 + uu * 6) + " 302 156)");
    tailEl.setAttribute("transform", "rotate(" + f1(woke ? Math.sin(t / 260) * 6 : 0) + " 490 188)");

    if (t >= END) return finish();
    requestAnimationFrame(frame);
  }

  function finish() {
    if (finished) return;
    finished = true;
    try {
      sessionStorage.setItem("journeyReveal", "1");
    } catch (e) {}
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", onKey);
    window.location.href = NEXT;
  }

  function onKey(e) {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      finish();
    }
  }
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  }

  root.addEventListener("click", finish);
  document.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
  new MutationObserver(drawDots).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  layout();
  // Fonts change the stage height, so lay out again once they are in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  requestAnimationFrame(function () {
    root.classList.add("ji-ready");
    requestAnimationFrame(frame);
  });
})();
