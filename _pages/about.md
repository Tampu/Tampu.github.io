---
layout: about
title: about
permalink: /about/
nav: true
nav_order: 1


profile:
  align: right
  image: tampu_dp.png # uncomment after adding assets/img/prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>CoRAL Lab, ASU</p>
    <p>Tempe, AZ</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items

latest_posts:
  enabled: false
---

<!-- Arriving from the intro page: a paper-colored curtain lifts to reveal this page. -->
<div id="journey-curtain" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:2000;background:#faf6ee;transition:transform 650ms cubic-bezier(.65,0,.25,1);"></div>
<script>
  (function () {
    var el = document.getElementById("journey-curtain");
    var reveal = false;
    try { reveal = sessionStorage.getItem("journeyReveal") === "1"; sessionStorage.removeItem("journeyReveal"); } catch (e) {}
    if (!reveal) { el.parentNode.removeChild(el); return; }
    document.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(function () {
        el.style.transform = "translateY(-100%)";
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
      });
    });
  })();
</script>
<style>html[data-theme="dark"] #journey-curtain{background:#1d1812 !important}</style>
<noscript><style>#journey-curtain{display:none}</style></noscript>

I am a PhD student in Computer Science at [Arizona State University](https://www.asu.edu/), advised by [Prof. Vivek Gupta](https://vgupta123.github.io/) in the CoRAL Lab.

My research interests lie broadly in **building reliable AI systems**. I am interested in how models reason, learn, and interact with complex information, and how we can make their decisions more transparent, grounded, and trustworthy.

My current research explores **multimodal reasoning, evidence attribution, and grounding** across tables, images, documents, and speech, as well as **reinforcement learning post-training for large language models (LLMs) and vision-language models (VLMs)**. I develop methods to evaluate and improve how models reason over diverse sources of information, connect their answers to supporting evidence, and learn through post-training. More broadly, I am interested in exploring approaches that advance the reasoning, adaptability, and reliability of AI systems.

Before my PhD, I spent three years as a Data Scientist at Phoenix Group in Edinburgh, UK, working on churn prediction, customer segmentation, and speech analytics. I hold an MSc in Big Data Science (Distinction) from [Queen Mary University of London](https://www.qmul.ac.uk/) and a BE in Electrical and Electronics Engineering from M. S. Ramaiah Institute of Technology, Bengaluru. During my MSc, I was also a KU Leuven International Scholar at [imec](https://www.imec-int.com/en), Belgium.

I am currently a Graduate Teaching Assistant at ASU, supporting CSE 576 (Natural Language Processing).

<div class="grass-rule" aria-hidden="true"></div>

## service

- **Program committee**: [SURGeLLM Workshop](https://surgellm.github.io/acl2026/) (ACL 2026), [GRAIL-V Workshop](https://grailworkshops.github.io) (CVPR 2026), [DocInsights Workshop](https://docinsights-workshop.github.io/docinsights-2026/) (EMNLP 2026)
- **Reviewer**: EMNLP 2026 (Demo Track), NeurIPS 2026 workshops

<div class="grass-rule" aria-hidden="true"></div>

<section id="get-in-touch" class="git" aria-labelledby="git-title">
<div class="grass-rule" aria-hidden="true"></div>
<div class="git-grid">
<svg class="git-art git-left" viewBox="0 0 220 380" aria-hidden="true"><polygon points="110.0,20.0 153.3,45.0 153.3,95.0 110.0,120.0 66.7,95.0 66.7,45.0" fill="#efe2c4"/><polygon points="110.0,25.0 149.0,47.5 149.0,92.5 110.0,115.0 71.0,92.5 71.0,47.5" fill="#e0b04a" stroke="#3b2a1a" stroke-width="1.5"/><path d="M98 76v-24" stroke="#8a5a14" stroke-width="1.6"/><ellipse cx="98" cy="50" rx="3" ry="7" fill="#8a5a14"/><path d="M110 76v-24" stroke="#8a5a14" stroke-width="1.6"/><ellipse cx="110" cy="50" rx="3" ry="7" fill="#8a5a14"/><path d="M122 76v-24" stroke="#8a5a14" stroke-width="1.6"/><ellipse cx="122" cy="50" rx="3" ry="7" fill="#8a5a14"/><circle cx="110" cy="92" r="15" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.2"/><text x="110" y="96" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#a4361b">6</text><circle cx="101.6" cy="101" r="1.4" fill="#a4361b"/><circle cx="105.8" cy="101" r="1.4" fill="#a4361b"/><circle cx="110.0" cy="101" r="1.4" fill="#a4361b"/><circle cx="114.2" cy="101" r="1.4" fill="#a4361b"/><circle cx="118.4" cy="101" r="1.4" fill="#a4361b"/><polygon points="66.0,96.0 109.3,121.0 109.3,171.0 66.0,196.0 22.7,171.0 22.7,121.0" fill="#efe2c4"/><polygon points="66.0,101.0 105.0,123.5 105.0,168.5 66.0,191.0 27.0,168.5 27.0,123.5" fill="#6b7a3a" stroke="#3b2a1a" stroke-width="1.5"/><path d="M52 122l8 14h-16z" fill="#3f4d22"/><rect x="50.5" y="136" width="3" height="4" fill="#5a3a1c"/><path d="M68 114l8 14h-16z" fill="#3f4d22"/><rect x="66.5" y="128" width="3" height="4" fill="#5a3a1c"/><path d="M80 130l8 14h-16z" fill="#3f4d22"/><rect x="78.5" y="144" width="3" height="4" fill="#5a3a1c"/><path d="M62 136l8 14h-16z" fill="#3f4d22"/><rect x="60.5" y="150" width="3" height="4" fill="#5a3a1c"/><polygon points="154.0,96.0 197.3,121.0 197.3,171.0 154.0,196.0 110.7,171.0 110.7,121.0" fill="#efe2c4"/><polygon points="154.0,101.0 193.0,123.5 193.0,168.5 154.0,191.0 115.0,168.5 115.0,123.5" fill="#b5562b" stroke="#3b2a1a" stroke-width="1.5"/><rect x="133" y="130" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="147" y="130" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="161" y="130" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="140" y="137" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="154" y="137" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="133" y="144" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="147" y="144" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><rect x="161" y="144" width="14" height="7" fill="#8c3b1c" stroke="#efe2c4" stroke-width=".8"/><circle cx="154" cy="166" r="15" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.2"/><text x="154" y="170" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#a4361b">8</text><circle cx="145.6" cy="175" r="1.4" fill="#a4361b"/><circle cx="149.8" cy="175" r="1.4" fill="#a4361b"/><circle cx="154.0" cy="175" r="1.4" fill="#a4361b"/><circle cx="158.2" cy="175" r="1.4" fill="#a4361b"/><circle cx="162.4" cy="175" r="1.4" fill="#a4361b"/><polygon points="110.0,172.0 153.3,197.0 153.3,247.0 110.0,272.0 66.7,247.0 66.7,197.0" fill="#efe2c4"/><polygon points="110.0,177.0 149.0,199.5 149.0,244.5 110.0,267.0 71.0,244.5 71.0,199.5" fill="#8d8a85" stroke="#3b2a1a" stroke-width="1.5"/><path d="M84 232l16-26 9 12 8-16 19 30z" fill="#5f5c58"/><path d="M100 206l4 6-7 2z M117 202l4 7-7 1z" fill="#e9e6df"/><circle cx="110" cy="244" r="15" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.2"/><text x="110" y="248" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#2e2216">9</text><circle cx="103.7" cy="253" r="1.4" fill="#2e2216"/><circle cx="107.9" cy="253" r="1.4" fill="#2e2216"/><circle cx="112.1" cy="253" r="1.4" fill="#2e2216"/><circle cx="116.3" cy="253" r="1.4" fill="#2e2216"/><rect x="76.0" y="104.5" width="24" height="7" rx="2" fill="#b8701d" stroke="#3b2a1a" stroke-width="1.3" transform="rotate(-30 88 108)"/><path d="M99 129v-11l11-10 11 10v11z" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.6" stroke-linejoin="round"/><path d="M50 236v-12h10v-8l8-8 8 8v20z" fill="#b8701d" stroke="#3b2a1a" stroke-width="1.6" stroke-linejoin="round"/><rect x="142.0" y="192.5" width="24" height="7" rx="2" fill="#b8701d" stroke="#3b2a1a" stroke-width="1.3" transform="rotate(90 154 196)"/></svg>
<form class="git-form" data-endpoint="" data-email="traviku2@asu.edu" novalidate>
<h2 id="git-title" class="git-title">get in touch</h2>
<div class="git-row">
<label>First name <span>(required)</span><input name="first_name" autocomplete="given-name" required></label>
<label>Last name <span>(required)</span><input name="last_name" autocomplete="family-name" required></label>
</div>
<label>Email <span>(required)</span><input name="email" type="email" autocomplete="email" required></label>
<label>Subject <span>(required)</span><input name="subject" required></label>
<label>Message <span>(required)</span><textarea name="message" rows="5" required></textarea></label>
<input type="text" name="_gotcha" class="git-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="git-actions"><button type="submit">Send</button><p class="git-status" role="status" aria-live="polite"></p></div>
</form>
<svg class="git-art git-right" viewBox="0 0 220 380" aria-hidden="true"><polygon points="110.0,40.0 153.3,65.0 153.3,115.0 110.0,140.0 66.7,115.0 66.7,65.0" fill="#efe2c4"/><polygon points="110.0,45.0 149.0,67.5 149.0,112.5 110.0,135.0 71.0,112.5 71.0,67.5" fill="#a8b86a" stroke="#3b2a1a" stroke-width="1.5"/><ellipse cx="110" cy="84" rx="16" ry="11" fill="#f7f3ea"/><circle cx="125" cy="80" r="6" fill="#3b2a1a"/><path d="M101 94v7M117 94v7" stroke="#3b2a1a" stroke-width="2.5"/><circle cx="110" cy="112" r="15" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.2"/><text x="110" y="116" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#2e2216">5</text><circle cx="103.7" cy="121" r="1.4" fill="#2e2216"/><circle cx="107.9" cy="121" r="1.4" fill="#2e2216"/><circle cx="112.1" cy="121" r="1.4" fill="#2e2216"/><circle cx="116.3" cy="121" r="1.4" fill="#2e2216"/><path d="M52 254c0-8 4-12 8-14-6-4-8-11-8-18 0-9 6-16 14-16s14 7 14 16c0 7-2 14-8 18 4 2 8 6 8 14z" fill="#4a4440" stroke="#1f1b19" stroke-width="1.6"/><circle cx="66" cy="198" r="10" fill="#4a4440" stroke="#1f1b19" stroke-width="1.6"/><ellipse cx="62" cy="195" rx="3" ry="2" fill="#8a8480"/><g transform="rotate(-14 150 212)"><rect x="136" y="198" width="28" height="28" rx="6" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.6"/><circle cx="144" cy="206" r="2.4" fill="#2e2216"/><circle cx="150" cy="212" r="2.4" fill="#2e2216"/><circle cx="156" cy="218" r="2.4" fill="#2e2216"/></g><g transform="rotate(12 172 252)"><rect x="158" y="238" width="28" height="28" rx="6" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.6"/><circle cx="166" cy="246" r="2.4" fill="#2e2216"/><circle cx="178" cy="246" r="2.4" fill="#2e2216"/><circle cx="166" cy="258" r="2.4" fill="#2e2216"/><circle cx="178" cy="258" r="2.4" fill="#2e2216"/></g><path d="M59 329v-11l11-10 11 10v11z" fill="#f6ead0" stroke="#3b2a1a" stroke-width="1.6" stroke-linejoin="round"/><rect x="101" y="326.5" width="34" height="7" rx="2" fill="#b8701d" stroke="#3b2a1a" stroke-width="1.3" transform="rotate(-20 118 330)"/><path d="M154 328v-12h10v-8l8-8 8 8v20z" fill="#b8701d" stroke="#3b2a1a" stroke-width="1.6" stroke-linejoin="round"/></svg>
</div>
</section>
<script>
  (function () {
    var section = document.getElementById("get-in-touch");
    if (!section) return;
    // Move the section to the very end of the about page, after the selected publications and social icons.
    var article = section.closest("article");
    if (article) article.appendChild(section);
    var form = section.querySelector("form");
    var status = form.querySelector(".git-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var d = new FormData(form);
      if (d.get("_gotcha")) return; // bots fill the hidden field
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        // A form service (e.g. Formspree) delivers the message by email.
        status.textContent = "Sending...";
        fetch(endpoint, { method: "POST", body: d, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset();
            status.textContent = "Thanks! Your message is on its way.";
          })
          .catch(function () { status.textContent = "Sorry, that didn't send. Please email me instead."; });
        return;
      }
      // No form service set up yet: open the visitor's email app with everything filled in.
      var body = d.get("message") + "\n\n- " + d.get("first_name") + " " + d.get("last_name") + " (" + d.get("email") + ")";
      location.href = "mailto:" + form.getAttribute("data-email") + "?subject=" + encodeURIComponent(d.get("subject")) + "&body=" + encodeURIComponent(body);
      status.textContent = "Opening your email app...";
    });
  })();
</script>

<script>window.SNAKE_WORDS = {{ site.data.snake_words | jsonify }};</script>
<script src="{{ '/assets/js/word-snake.js' | relative_url }}" defer></script>
