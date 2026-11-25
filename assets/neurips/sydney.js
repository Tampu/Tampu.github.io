/* NeurIPS Sydney meetup page: activity picker, postcard form, confetti. */
(function () {
  "use strict";

  var LABELS = {
    coffee: "Coffee chats & group lunches",
    sunset: "Sunset walk to Observatory Hill (6 or 12 Dec, evening)",
    bondi: "Sunrise at Bondi (6 or 12 Dec)",
    dec13: "Sunday 13 Dec post-conference day out",
    one2one: "1:1 chat",
  };
  var ORDER = Object.keys(LABELS);
  var STORE = "neurips-sydney-2026";
  var picks = new Set();
  var slots = new Set();

  var form = document.getElementById("interest");
  var card = document.getElementById("postcard");
  var bar = document.getElementById("picked-bar");
  var barCount = document.getElementById("picked-count");
  var topicWrap = document.getElementById("topic-wrap");
  var topic = document.getElementById("f-topic");
  var err = document.getElementById("err");
  var sendBtn = document.getElementById("send");
  var formInView = false;

  function sync() {
    document.querySelectorAll("[data-pick]").forEach(function (el) {
      el.setAttribute("aria-pressed", picks.has(el.dataset.pick) ? "true" : "false");
    });
    var n = picks.size;
    barCount.textContent = n + (n === 1 ? " picked" : " picked") + (n ? " ☀" : "");
    bar.classList.toggle("show", n > 0 && !formInView && !card.classList.contains("is-sent"));
    var one = picks.has("one2one");
    topicWrap.classList.toggle("open", one);
    topic.tabIndex = one ? 0 : -1;
  }

  document.addEventListener("click", function (e) {
    var sl = e.target.closest("[data-slot]");
    if (sl) {
      var v = sl.dataset.slot;
      if (slots.has(v)) slots.delete(v);
      else slots.add(v);
      sl.setAttribute("aria-pressed", slots.has(v) ? "true" : "false");
      return;
    }
    var el = e.target.closest("[data-pick]");
    if (!el) return;
    var id = el.dataset.pick;
    if (picks.has(id)) picks.delete(id);
    else picks.add(id);
    sync();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        formInView = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    ).observe(document.getElementById("count-me-in"));
  }

  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  function slotList() {
    // keep the order the slots appear on the page
    return Array.prototype.map
      .call(document.querySelectorAll("[data-slot]"), function (b) {
        return b.dataset.slot;
      })
      .filter(function (v) {
        return slots.has(v);
      });
  }

  function payload() {
    var chosen = ORDER.filter(function (k) {
      return picks.has(k);
    });
    return {
      submitted_at: new Date().toISOString(),
      name: val("name"),
      email: val("email"),
      affiliation: val("affiliation"),
      role: val("role"),
      activities: chosen.length
        ? chosen
            .map(function (k) {
              return LABELS[k];
            })
            .join("; ")
        : "Keep me posted about everything",
      coffee: picks.has("coffee") ? "yes" : "",
      sunset_6dec: picks.has("sunset") ? "yes" : "",
      bondi_sunrise: picks.has("bondi") ? "yes" : "",
      sunday_13dec: picks.has("dec13") ? "yes" : "",
      one_to_one: picks.has("one2one") ? "yes" : "",
      chat_topic: picks.has("one2one") ? val("chat_topic") : "",
      availability: slotList().join("; "),
      // copy of availability in the note, so it still lands in the Sheet if the Apps Script lacks an availability column
      note: [val("note"), slots.size ? "Free: " + slotList().join("; ") : ""].filter(Boolean).join(" | "),
      source: new URLSearchParams(location.search).get("src") || document.referrer || "direct",
      _subject: "NeurIPS Sydney meetup: " + val("name"),
    };
  }

  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = document.createElement("div");
    box.className = "confetti";
    var colors = ["#f3b23c", "#f7b89b", "#2c7aa0", "#cfc4ec", "#9ad0a0", "#ffe2a3"];
    for (var i = 0; i < 90; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--dx", (Math.random() * 2 - 1) * 160 + "px");
      p.style.setProperty("--rot", Math.random() * 900 - 450 + "deg");
      p.style.animationDuration = 2.2 + Math.random() * 2.2 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      if (i % 4 === 0) p.style.borderRadius = "50%";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () {
      box.remove();
    }, 5200);
  }

  function showSent(data, viaMail) {
    var first = (data.name || "").split(/\s+/)[0];
    document.getElementById("back-title").textContent = viaMail ? "Almost there!" : "You're on the list" + (first ? ", " + first : "") + "!";
    document.getElementById("back-msg").textContent = viaMail
      ? "Your email app should have opened with your note. Hit send and you're on the list."
      : "We'll send invites to " + data.email + " closer to the dates.";
    card.classList.add("is-sent");
    sync();
    confetti();
  }

  function remember(data) {
    try {
      localStorage.setItem(STORE, JSON.stringify({ picks: Array.from(picks), slots: Array.from(slots), name: data.name, email: data.email, affiliation: data.affiliation, role: data.role }));
    } catch (e) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.textContent = "";
    if (form.elements.website.value) return; // bot
    var data = payload();
    if (!data.name) {
      err.textContent = "What should we call you?";
      form.elements.name.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      err.textContent = "That email doesn't look quite right.";
      form.elements.email.focus();
      return;
    }

    var endpoint = (form.dataset.endpoint || "").trim();
    if (!endpoint) {
      var body = Object.keys(data)
        .filter(function (k) {
          return data[k] && k !== "_subject" && k !== "submitted_at" && !/^(coffee|sunset_6dec|bondi_sunrise|sunday_13dec|one_to_one)$/.test(k);
        })
        .map(function (k) {
          return k.replace(/_/g, " ") + ": " + data[k];
        })
        .join("\n");
      location.href = "mailto:" + form.dataset.email + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
      remember(data);
      showSent(data, true);
      return;
    }

    sendBtn.disabled = true;
    sendBtn.firstChild.nodeValue = "Sending… ";
    var appsScript = /script\.google(usercontent)?\.com/.test(endpoint);
    fetch(endpoint, {
      method: "POST",
      mode: appsScript ? "no-cors" : "cors",
      headers: { Accept: "application/json" },
      body: new URLSearchParams(data),
    })
      .then(function (r) {
        if (!appsScript && !r.ok) throw new Error(r.status);
        remember(data);
        showSent(data, false);
      })
      .catch(function () {
        err.textContent = "Hmm, that didn't send. Mind trying again, or emailing " + form.dataset.email + "?";
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.firstChild.nodeValue = "Send it ";
      });
  });

  document.getElementById("again").addEventListener("click", function () {
    card.classList.remove("is-sent");
    sync();
    form.elements.name.focus({ preventScroll: true });
  });

  // returning visitor: restore their picks and details
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved) {
      (saved.picks || []).forEach(function (k) {
        if (LABELS[k]) picks.add(k);
      });
      (saved.slots || []).forEach(function (v) {
        slots.add(v);
      });
      document.querySelectorAll("[data-slot]").forEach(function (b) {
        if (slots.has(b.dataset.slot)) b.setAttribute("aria-pressed", "true");
      });
      ["name", "email", "affiliation"].forEach(function (k) {
        if (saved[k]) form.elements[k].value = saved[k];
      });
      if (saved.role) {
        var r = form.querySelector('input[name="role"][value="' + saved.role.replace(/"/g, "") + '"]');
        if (r) r.checked = true;
      }
    }
  } catch (e) {}
  sync();
})();
