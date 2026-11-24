// Ambient "word snake" background for the about page.
// A snake wanders a dotted grid and eats research and skill words letter by letter, in order.
// The words and their hover tips come from _data/snake_words.yml (window.SNAKE_WORDS, set in
// _pages/about.md); hovering a word in the margins shows what it means.
// When it finishes a word it changes color, shrinks back to its base length and goes
// after the next word. Watch-only: it never captures clicks, keys or scrolling.
(function () {
  "use strict";
  if (window.__wordSnake) return;
  var selfSrc = document.currentScript ? document.currentScript.src : "/assets/js/word-snake.js";
  // Desktop only: skip phones and tablets (narrow screens or touch-only pointers).
  var mobileQuery = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");
  if (mobileQuery.matches) {
    // A desktop window that starts narrow gets the snake once it is widened.
    var later = function () {
      if (!mobileQuery.matches) {
        mobileQuery.removeEventListener("change", later);
        var sc = document.createElement("script");
        sc.src = selfSrc;
        document.body.appendChild(sc);
      }
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", later);
    return;
  }
  window.__wordSnake = true;

  var DEFAULT_WORDS = "GROUNDING EVIDENCE ATTRIBUTION REASONING MULTIMODAL GRPO BENCHMARK FORECASTING RETRIEVAL ROBUSTNESS".split(" ");
  var TIPS = {};
  var WORDS = (window.SNAKE_WORDS || [])
    .map(function (e) {
      var w = String(e.word || "")
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");
      if (w) TIPS[w] = e.tip || "";
      return w;
    })
    .filter(Boolean);
  if (!WORDS.length) WORDS = DEFAULT_WORDS;
  var CELL = 24; // grid cell size in CSS px
  var STEP_MS = 95; // time per snake move
  var BASE_LEN = 4; // head + 3 body segments
  var RESPAWN_MS = 1400; // delay before a new word appears
  // Highland-coo golds and gingers, matching the intro page. Cycles on each finished word.
  var PALETTE = ["#b8701d", "#d4a03a", "#9d531c", "#c77b2f", "#e1a751", "#86501f"];
  var DIRS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.createElement("canvas");
  canvas.id = "word-snake-bg";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;";
  document.body.insertBefore(canvas, document.body.firstChild);
  // Shrinking the window to phone size hides the snake again; widening brings it back.
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", function () {
      canvas.style.display = mobileQuery.matches ? "none" : "";
    });
  }
  var ctx = canvas.getContext("2d");
  var dotLayer = document.createElement("canvas");

  var W, H, dpr, cols, rows, rowMin, rowMax, contentL, contentR;
  var words, occ, snake, dir, grow, carried, target, dirOrder, colorIdx;
  var fading, floaters, nextSpawnAt, lastStep, lastFrame;
  var themeColor, textLight, bgColor;
  var hovered = null;

  // Hover tips: the canvas ignores the mouse, so watch the page and map the pointer to a grid cell.
  var tip = document.createElement("div");
  tip.setAttribute("role", "tooltip");
  tip.style.cssText =
    "position:fixed;z-index:1040;max-width:260px;padding:8px 11px;border-radius:8px;pointer-events:none;opacity:0;" +
    "transition:opacity .15s ease;font:13px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;" +
    "background:var(--global-card-bg-color,#fff);color:var(--global-text-color,#222);" +
    "border:1px solid var(--global-theme-color,#b8701d);box-shadow:0 6px 18px rgba(0,0,0,.12)";
  document.body.appendChild(tip);
  function hideTip() {
    hovered = null;
    tip.style.opacity = 0;
  }
  document.addEventListener("mousemove", function (e) {
    if (!occ) return;
    var x = Math.floor(e.clientX / CELL);
    var y = Math.floor(e.clientY / CELL);
    var hit = occ.get(K(x, y));
    // Only in the margins, or over empty page background, so tips never pop up over the text.
    var bare = e.target === document.body || e.target === document.documentElement || !inContent(x);
    if (!hit || !bare || !TIPS[hit.w.text]) return hideTip();
    hovered = hit.w;
    tip.innerHTML = "<b style=\"color:var(--global-theme-color,#b8701d);letter-spacing:.04em\">" + hit.w.text + "</b><br>" + TIPS[hit.w.text];
    var left = Math.min(e.clientX + 14, window.innerWidth - 280);
    var top = e.clientY + 18 > window.innerHeight - 90 ? e.clientY - 80 : e.clientY + 18;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = top + "px";
    tip.style.opacity = 1;
  });
  document.addEventListener("mouseleave", hideTip);

  function K(x, y) {
    return y * cols + x;
  }
  function inBounds(x, y) {
    return x >= 0 && x < cols && y >= rowMin && y <= rowMax;
  }
  function inContent(x) {
    return x >= contentL && x <= contentR;
  }
  function snakeColor() {
    return PALETTE[colorIdx];
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function readTheme() {
    var cs = getComputedStyle(document.documentElement);
    themeColor = cs.getPropertyValue("--global-theme-color").trim() || "#b509ac";
    textLight = cs.getPropertyValue("--global-text-color-light").trim() || "#828282";
    bgColor = cs.getPropertyValue("--global-bg-color").trim() || "#ffffff";
    drawDots();
  }

  function drawDots() {
    if (!cols) return;
    dotLayer.width = canvas.width;
    dotLayer.height = canvas.height;
    var d = dotLayer.getContext("2d");
    d.setTransform(dpr, 0, 0, dpr, 0, 0);
    d.fillStyle = textLight;
    for (var y = rowMin; y <= rowMax; y++) {
      for (var x = 0; x < cols; x++) {
        d.globalAlpha = inContent(x) ? 0.12 : 0.25;
        d.beginPath();
        d.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1.3, 0, Math.PI * 2);
        d.fill();
      }
    }
  }

  // ---------- setup ----------

  function init() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(W / CELL);
    rows = Math.floor(H / CELL);
    var nav = document.getElementById("navbar");
    var foot = document.querySelector("footer.fixed-bottom");
    rowMin = Math.ceil((nav ? nav.offsetHeight : 56) / CELL);
    rowMax = rows - 1 - Math.ceil((foot ? foot.offsetHeight : 40) / CELL);
    var main = document.querySelector('[role="main"]') || document.querySelector(".container");
    if (main) {
      var r = main.getBoundingClientRect();
      contentL = Math.floor(r.left / CELL);
      contentR = Math.ceil(r.right / CELL) - 1;
    } else {
      contentL = cols;
      contentR = -1;
    }
    words = [];
    occ = new Map();
    fading = [];
    floaters = [];
    snake = null;
    colorIdx = 0;
    nextSpawnAt = 0;
    readTheme();
    var n = wordTarget();
    for (var i = 0; i < n; i++) placeWord();
    spawnSnake();
  }

  function wordTarget() {
    return Math.max(3, Math.min(9, Math.floor((cols * (rowMax - rowMin + 1)) / 140)));
  }

  function isFree(x, y) {
    if (!inBounds(x, y)) return false;
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (occ.has(K(x + dx, y + dy))) return false;
      }
    }
    var body = snake || [];
    for (var i = 0; i < body.length; i++) {
      if (Math.abs(body[i].x - x) <= 1 && Math.abs(body[i].y - y) <= 1) return false;
    }
    return true;
  }

  function placeWord() {
    var onScreen = new Set();
    for (var k = 0; k < words.length; k++) onScreen.add(words[k].text);
    var pool = [];
    for (k = 0; k < WORDS.length; k++) {
      if (!onScreen.has(WORDS[k])) pool.push(WORDS[k]);
    }
    var text = pool[(Math.random() * pool.length) | 0];
    var margins = [];
    if (contentL >= 3) margins.push([1, contentL - 1]);
    if (cols - 1 - contentR >= 3) margins.push([contentR + 1, cols - 2]);
    for (var attempt = 0; attempt < 80; attempt++) {
      var inMargin = attempt < 50 && margins.length;
      var m = inMargin ? margins[(Math.random() * margins.length) | 0] : null;
      // Words too long to lie across a margin stand upright in it instead.
      var vertical = (m && text.length + 1 > m[1] - m[0] + 1) || Math.random() < 0.25;
      var dx = vertical ? 0 : 1;
      var dy = vertical ? 1 : 0;
      var x0, y0;
      // Prefer the side margins so the words sit beside the text, not behind it.
      if (inMargin) {
        var span = m[1] - m[0] + 1 - (vertical ? 1 : text.length);
        if (span < 1) continue;
        x0 = m[0] + ((Math.random() * span) | 0);
      } else {
        x0 = 1 + ((Math.random() * (cols - 2 - (vertical ? 1 : text.length))) | 0);
      }
      y0 = rowMin + 1 + ((Math.random() * (rowMax - rowMin - 1 - (vertical ? text.length : 1))) | 0);
      var cells = [];
      var ok = true;
      for (var i = 0; i < text.length; i++) {
        var x = x0 + dx * i;
        var y = y0 + dy * i;
        if (!isFree(x, y)) {
          ok = false;
          break;
        }
        cells.push({ x: x, y: y, ch: text[i], eaten: false });
      }
      if (!ok) continue;
      var w = { text: text, cells: cells, next: 0, born: performance.now() };
      for (i = 0; i < cells.length; i++) occ.set(K(cells[i].x, cells[i].y), { w: w, i: i });
      words.push(w);
      return true;
    }
    return false;
  }

  function spawnSnake() {
    for (var attempt = 0; attempt < 200; attempt++) {
      var x = BASE_LEN + ((Math.random() * (cols - BASE_LEN - 2)) | 0);
      var y = rowMin + 1 + ((Math.random() * (rowMax - rowMin - 1)) | 0);
      var ok = true;
      for (var i = 0; i < BASE_LEN; i++) {
        if (occ.has(K(x - i, y)) || !inBounds(x - i, y)) ok = false;
      }
      if (!ok) continue;
      snake = [];
      for (i = 0; i < BASE_LEN; i++) snake.push({ x: x - i, y: y });
      dir = [1, 0];
      grow = 0;
      carried = [];
      target = null;
      dirOrder = shuffle(DIRS.slice());
      return;
    }
  }

  // ---------- movement ----------

  function bodySet() {
    // The tail cell frees up this step unless we are growing.
    var s = new Set();
    var n = snake.length - (grow > 0 ? 0 : 1);
    for (var i = 1; i < n; i++) s.add(K(snake[i].x, snake[i].y));
    return s;
  }

  function bfs(body, blockLetters, goals) {
    var h = snake[0];
    var start = K(h.x, h.y);
    var prev = new Int32Array(cols * rows).fill(-2);
    prev[start] = -1;
    var q = [start];
    for (var qi = 0; qi < q.length; qi++) {
      var c = q[qi];
      if (c !== start && goals.has(c)) {
        var s = c;
        while (prev[s] !== start) s = prev[s];
        return { goal: c, step: s };
      }
      var cx = c % cols;
      var cy = (c / cols) | 0;
      for (var d = 0; d < 4; d++) {
        var nx = cx + dirOrder[d][0];
        var ny = cy + dirOrder[d][1];
        if (!inBounds(nx, ny)) continue;
        var nk = K(nx, ny);
        if (prev[nk] !== -2 || body.has(nk)) continue;
        if (blockLetters && occ.has(nk) && !goals.has(nk)) continue;
        prev[nk] = c;
        q.push(nk);
      }
    }
    return null;
  }

  function floodSize(body, from, limit) {
    var seen = new Set([from]);
    var q = [from];
    for (var qi = 0; qi < q.length && seen.size < limit; qi++) {
      var cx = q[qi] % cols;
      var cy = (q[qi] / cols) | 0;
      for (var d = 0; d < 4; d++) {
        var nx = cx + DIRS[d][0];
        var ny = cy + DIRS[d][1];
        var nk = K(nx, ny);
        if (!inBounds(nx, ny) || body.has(nk) || seen.has(nk)) continue;
        seen.add(nk);
        q.push(nk);
      }
    }
    return seen.size;
  }

  function wanderMove(body) {
    // No reachable letter: keep going mostly straight, turning toward open space.
    var h = snake[0];
    var best = null;
    var bestScore = -1;
    for (var d = 0; d < 4; d++) {
      var nx = h.x + DIRS[d][0];
      var ny = h.y + DIRS[d][1];
      if (!inBounds(nx, ny) || body.has(K(nx, ny))) continue;
      var score = floodSize(body, K(nx, ny), 300);
      if (DIRS[d][0] === dir[0] && DIRS[d][1] === dir[1]) score += 40;
      score += Math.random() * 20;
      if (score > bestScore) {
        bestScore = score;
        best = K(nx, ny);
      }
    }
    return best;
  }

  function step(now) {
    if (!snake) {
      spawnSnake();
      if (!snake) return;
    }
    if (words.length < wordTarget() && now >= nextSpawnAt) {
      placeWord();
      nextSpawnAt = now + RESPAWN_MS;
    }

    var body = bodySet();
    var goals = new Map();
    if (target) {
      var tc = target.cells[target.next];
      goals.set(K(tc.x, tc.y), target);
    } else {
      words.forEach(function (w) {
        var c = w.cells[w.next];
        goals.set(K(c.x, c.y), w);
      });
    }

    var nextKey = null;
    if (goals.size) {
      var r = bfs(body, true, goals) || bfs(body, false, goals);
      if (r) {
        if (!target) {
          target = goals.get(r.goal);
          dirOrder = shuffle(DIRS.slice());
        }
        nextKey = r.step;
      }
    }
    if (nextKey === null) nextKey = wanderMove(body);
    if (nextKey === null) {
      dissolveSnake(snake);
      snake = null;
      target = null;
      return;
    }

    var nx = nextKey % cols;
    var ny = (nextKey / cols) | 0;
    dir = [nx - snake[0].x, ny - snake[0].y];
    snake.unshift({ x: nx, y: ny });
    if (grow > 0) grow--;
    else snake.pop();

    if (target) {
      var c = target.cells[target.next];
      if (c.x === nx && c.y === ny) {
        c.eaten = true;
        occ.delete(nextKey);
        carried.push(c.ch);
        grow++;
        target.next++;
        if (target.next === target.cells.length) completeWord(target, now);
      }
    }
  }

  function dissolveSnake(segs) {
    var col = snakeColor();
    segs.forEach(function (s, i) {
      fading.push({ x: s.x, y: s.y, color: col, life: 1, delay: i * 0.04 });
    });
  }

  function completeWord(w, now) {
    words.splice(words.indexOf(w), 1);
    if (hovered === w) hideTip();
    var mid = w.cells[(w.cells.length / 2) | 0];
    floaters.push({ text: w.text, x: mid.x * CELL + CELL / 2, y: mid.y * CELL + CELL / 2, color: snakeColor(), life: 1 });
    // Shrink back to base length; the cut-off tail fades away in the old color.
    dissolveSnake(snake.splice(BASE_LEN));
    grow = 0;
    carried = [];
    target = null;
    colorIdx = (colorIdx + 1) % PALETTE.length;
    nextSpawnAt = now + RESPAWN_MS;
  }

  // ---------- drawing ----------

  function cellRect(x, y, pad, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    var px = x * CELL + pad;
    var py = y * CELL + pad;
    var s = CELL - pad * 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, s, s, 5);
    else ctx.rect(px, py, s, s);
    ctx.fill();
  }

  function render(now, dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.drawImage(dotLayer, 0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 " + Math.round(CELL * 0.6) + "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

    // Letters on the grid.
    words.forEach(function (w) {
      var appear = Math.min(1, (now - w.born) / 600);
      w.cells.forEach(function (c, i) {
        if (c.eaten) return;
        var isNext = w === target && i === w.next;
        if (w === hovered) {
          ctx.clearRect(c.x * CELL + 4, c.y * CELL + 4, CELL - 8, CELL - 8);
          ctx.globalAlpha = 0.95 * appear;
          ctx.fillStyle = themeColor;
          ctx.fillText(c.ch, c.x * CELL + CELL / 2, c.y * CELL + CELL / 2 + 1);
          return;
        }
        var a = (inContent(c.x) ? 0.3 : 0.55) * appear;
        ctx.clearRect(c.x * CELL + 4, c.y * CELL + 4, CELL - 8, CELL - 8);
        ctx.globalAlpha = isNext ? Math.min(1, a + 0.35) : w === target ? a + 0.1 : a;
        ctx.fillStyle = isNext || w === target ? snakeColor() : textLight;
        ctx.fillText(c.ch, c.x * CELL + CELL / 2, c.y * CELL + CELL / 2 + 1);
      });
    });

    // Segments cut off or dropped, fading out.
    fading = fading.filter(function (f) {
      if (f.delay > 0) f.delay -= dt / 1000;
      else f.life -= dt / 600;
      if (f.life <= 0) return false;
      cellRect(f.x, f.y, 3 + (1 - f.life) * 6, f.color, 0.45 * f.life * (inContent(f.x) ? 0.6 : 1));
      return true;
    });

    // The snake: tail is lighter, eaten letters ride on the body in word order.
    if (snake) {
      var col = snakeColor();
      var n = snake.length;
      for (var i = n - 1; i >= 0; i--) {
        var s = snake[i];
        var a = (i === 0 ? 0.85 : 0.65 - (0.4 * i) / n) * (inContent(s.x) ? 0.6 : 1);
        cellRect(s.x, s.y, i === 0 ? 1.5 : 3, col, a);
        var li = carried.length - i; // segment 1 holds the newest letter
        if (i > 0 && li >= 0 && li < carried.length) {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = bgColor;
          ctx.fillText(carried[li], s.x * CELL + CELL / 2, s.y * CELL + CELL / 2 + 1);
        }
      }
      // Eyes on the head, facing the direction of travel.
      var h = snake[0];
      var cx = h.x * CELL + CELL / 2 + dir[0] * 4;
      var cy = h.y * CELL + CELL / 2 + dir[1] * 4;
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = bgColor;
      for (var e = -1; e <= 1; e += 2) {
        ctx.beginPath();
        ctx.arc(cx + dir[1] * 4 * e, cy + dir[0] * 4 * e, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Completed words float up and fade.
    ctx.font = "700 " + Math.round(CELL * 0.75) + "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    floaters = floaters.filter(function (f) {
      f.life -= dt / 1400;
      if (f.life <= 0) return false;
      ctx.globalAlpha = 0.8 * f.life;
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y - (1 - f.life) * 36);
      return true;
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    var dt = Math.min(100, now - lastFrame);
    lastFrame = now;
    // At most one move per frame, so a backgrounded tab does not fast-forward.
    if (now - lastStep >= STEP_MS) {
      lastStep = now;
      step(now);
    }
    render(now, dt);
    requestAnimationFrame(frame);
  }

  init();
  new MutationObserver(function () {
    readTheme();
    if (reduceMotion) render(performance.now() + 1000, 0);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      init();
      if (reduceMotion) render(performance.now() + 1000, 0);
    }, 200);
  });

  if (reduceMotion) {
    render(performance.now() + 1000, 0); // one still frame, no animation
  } else {
    lastStep = lastFrame = performance.now();
    requestAnimationFrame(frame);
  }
})();
