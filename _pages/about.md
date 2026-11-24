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

<div class="section-rule" aria-hidden="true"></div>

## service

- **Program committee**: [SURGeLLM Workshop](https://surgellm.github.io/acl2026/) (ACL 2026), [GRAIL-V Workshop](https://grailworkshops.github.io) (CVPR 2026), [DocInsights Workshop](https://docinsights-workshop.github.io/docinsights-2026/) (EMNLP 2026)
- **Reviewer**: EMNLP 2026 (Demo Track), NeurIPS 2026 workshops

<div class="section-rule" aria-hidden="true"></div>

<section id="get-in-touch" class="git" aria-labelledby="git-title">
<div class="section-rule" aria-hidden="true"></div>
<div class="git-grid">
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
