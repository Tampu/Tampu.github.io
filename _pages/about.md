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

Before my PhD, I spent 3 years as a Data Scientist at a financial services firm [Standard Life (Phoenix Group)](https://www.standardlifeplc.com) in Edinburgh, UK, working on churn prediction, customer segmentation, and speech analytics. I hold an MSc in Big Data Science (Distinction) from [Queen Mary University of London](https://www.qmul.ac.uk/) and a BE in Electrical and Electronics Engineering from M. S. Ramaiah Institute of Technology, Bengaluru. During my MSc, I was also a KU Leuven International Scholar at [imec](https://www.imec-int.com/en), Belgium.

I am currently a Graduate Teaching Assistant at ASU, supporting CSE 576 (Natural Language Processing).

<div class="avail" role="note" aria-label="Availability">
<p class="avail-badge"><span class="avail-dot" aria-hidden="true"></span>Open to opportunities</p>
<p class="avail-when">Summer 2027 Research Internships</p>
<p class="avail-tags"><span>Multimodal AI</span><span>LLM/VLM Reasoning</span><span>AI Agents</span><span>RL and Post-training</span><span>Reliable AI Systems</span></p>  
<p class="avail-text">Interested in connecting with research teams and industry labs working on reliable AI systems. Open to exploring challenging research problems beyond my current areas of focus. Particularly excited by opportunities to work on ambitious AI research, learn new directions, and contribute to impactful projects with research teams.</p>
</div>
<section id="service-section" class="service" markdown="1">
<div class="section-rule" aria-hidden="true"></div>

## service

- **Program committee**: [SURGeLLM Workshop](https://surgellm.github.io/acl2026/) (ACL 2026), [GRAIL-V Workshop](https://grailworkshops.github.io) (CVPR 2026), [DocInsights Workshop](https://docinsights-workshop.github.io/docinsights-2026/) (EMNLP 2026)
- **Reviewer**: EMNLP 2026 (Demo Track), NeurIPS 2026 workshops

</section>

<section id="get-in-touch" class="git" aria-labelledby="git-title">
<div class="section-rule" aria-hidden="true"></div>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap">
<div class="git-inner">
<img class="git-coo" src="{{ '/assets/img/coo-mail.webp' | relative_url }}" width="818" height="414" alt="My Highland coo mascot holding an envelope" loading="lazy">
<h2 id="git-title" class="git-title">Get in touch</h2>
<p class="git-lead">Interested in research collaborations, exchanging ideas, discussing opportunities, or just saying hello? I'd love to hear from you.</p>
<a class="git-email" href="mailto:traviku2@asu.edu">traviku2@asu.edu</a>

<p class="git-sign">A good conversation can start anywhere.</p>
</div>
</section>
<script>
  (function () {
    // Page order: bio, availability, selected publications, service, get in touch, social icons.
    // The layout renders publications after this content, so move service and get in touch below them.
    var service = document.getElementById("service-section");
    var contact = document.getElementById("get-in-touch");
    var article = contact && contact.closest("article");
    if (!article) return;
    var social = article.querySelector(".social");
    [service, contact].forEach(function (el) {
      if (!el) return;
      if (social) article.insertBefore(el, social);
      else article.appendChild(el);
    });
  })();
</script>

<script>window.SNAKE_WORDS = {{ site.data.snake_words | jsonify }};</script>
<script src="{{ '/assets/js/word-snake.js' | relative_url }}" defer></script>
