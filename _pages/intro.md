---
layout: page
title: intro
permalink: /
description:
---

<!-- Home page: the Highland coo + journey intro. assets/js/journey-intro.js draws it, then sends the visitor
     to the about page (data-next), where a matching curtain lifts. The cover div paints immediately. -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titan+One&family=Montserrat:wght@400;500;600&display=swap">
<div id="journey-intro" data-next="{{ '/about/' | relative_url }}" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:1020;background:#faf6ee;"></div>
<style>html[data-theme="dark"] #journey-intro{background:#1d1812 !important}</style>
<script>
  (function () {
    var el = document.getElementById("journey-intro");
    document.documentElement.style.overflow = "hidden";
    // If the intro script never starts (blocked or failed), go straight to the about page.
    setTimeout(function () {
      if (!window.__journeyStarted) location.replace(el.getAttribute("data-next"));
    }, 4000);
  })();
</script>
<noscript><style>#journey-intro{display:none}</style></noscript>
<script src="{{ '/assets/js/journey-intro.js' | relative_url }}" defer></script>

Continue to the [about page]({{ '/about/' | relative_url }}).
