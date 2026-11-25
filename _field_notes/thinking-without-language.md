---
layout: field-note
section: midnight-thoughts
title: Do We Still Think Without Language?
date: 2026-10-16
standfirst: A question about human cognition, and an unexpected journey into multimodal intelligence.
excerpt: A question about human cognition, and an unexpected journey into multimodal intelligence.
tags: [Human cognition, Multimodal AI, World models]
status: Still wondering
# The trail shown under "Down the rabbit hole" on the Field Notes page.
rabbit_hole:
  - step: Non-linguistic cognition
    note: People who lose almost all language can still do arithmetic, logic and music.
    paper: Fedorenko & Varley, 2016
    url: https://doi.org/10.1111/nyas.13046
  - step: Multimodal representations
    note: Pictures and words in one space, though the pictures learnt from captions.
    paper: Radford et al., CLIP, 2021
    url: https://arxiv.org/abs/2103.00020
  - step: Latent spaces
    note: What if a model could think before it talks?
    paper: Hao et al., Coconut, 2024
    url: https://arxiv.org/abs/2412.06769
  - step: Predictive world models
    note: Predict how the world goes, not the next word.
    paper: Ha & Schmidhuber, World Models, 2018
    url: https://arxiv.org/abs/1803.10122
---

<p class="margin">written somewhere past midnight, tidied up a little since</p>

<section class="part" markdown="1">
<div class="part-label"><span class="no">01</span><h2>The thought</h2><span class="src">my own words</span></div>

<p class="big-q">If humans can imagine, plan, navigate and reason without putting everything into words, why should artificial intelligence rely so heavily on language?</p>

That's more or less how I wrote it down. No clever framing, no plan to go anywhere with it.

Think about walking through your own house with the lights off. You don't narrate it. Nobody says *left at the door, three steps, mind the table* in their head. You just know the house. Somewhere in there is a model of the world, and it isn't made of sentences.
</section>

<section class="part" markdown="1">
<div class="part-label"><span class="no">02</span><h2>What sparked it</h2><span class="src">books, and my day job</span></div>

Two things, mostly.

I was reading *Sapiens*, where Harari makes language the hero of the human story. Gossip let us keep track of each other. Fiction let thousands of strangers cooperate around things that only exist because we agree they do: gods, nations, money. My favourite line in the book is the one about the monkey.

<blockquote class="lit"><p>You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.</p><cite>Yuval Noah Harari, Sapiens</cite></blockquote>

It's a great argument for why language matters. It's a strange argument for why thinking needs language. You can't sell a monkey heaven, sure. It still finds the banana.

The other thing was work. Most of my days go into [DRAGON](https://neurips.cc/virtual/2026/loc/sydney/poster/139496), a benchmark that asks vision-language models to point at the part of a diagram that actually justifies their answer. They are very good at saying the right thing. They are much worse at showing where they looked. Every week I watch a model talk its way to a correct answer it never really saw.

And then, because my brain files things strangely, I remembered the Yaksha.

<blockquote class="lit dialogue"><p><span class="who">Yaksha</span>What is swifter than the wind?</p><p><span class="who">Yudhishthira</span>The mind.</p><cite>The Yaksha's questions, Mahabharata (Vana Parva), paraphrased from memory</cite></blockquote>

The mind outruns the wind, and it definitely outruns speech. By the time a thought becomes a sentence, it has already been somewhere else and come back.
</section>

<section class="part" markdown="1">
<div class="part-label"><span class="no">03</span><h2>The rabbit hole</h2><span class="src">mapped with an AI assistant · read on my own</span></div>

<p class="fn-chain"><span>Non-linguistic cognition</span><i>→</i><span>multimodal representations</span><i>→</i><span>latent spaces</span><i>→</i><span>predictive world models</span></p>

A note on how this part was made: I used an AI assistant to sketch the territory and suggest where to look. The reading, and the opinions, are mine.

**Is it even true that people think without words?** Mostly, yes. Evelina Fedorenko and Rosemary Varley went through brain imaging studies and patients with severe aphasia, people who have lost nearly all of their language, and many of them can still do arithmetic, solve logic puzzles, think about what someone else believes, and enjoy music. The brain's language network stays fairly quiet during a lot of hard thinking. A 2024 paper in *Nature* with Steven Piantadosi and Edward Gibson says it plainly: language is mainly a tool for sharing thoughts, not the stuff thoughts are made of.

Arjuna had his own complaint about the mind, long before anyone put it in a scanner.

<blockquote class="lit"><p>The mind is restless, turbulent, obstinate and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind.</p><cite>Bhagavad Gita 6.34</cite></blockquote>

Restless, stubborn, harder to hold than the wind. The wind again. Not a word about it being made of words.

**So how do machines hold a picture?** Models like CLIP put images and sentences into one shared space, so a photo of a dog and the word *dog* land close together. Lovely idea, with a catch I hadn't noticed before: CLIP learnt what images mean from about 400 million captions. The eyes were trained by the mouth.

This is where *The Palace of Illusions* crept in. Divakaruni retells the Mahabharata from Draupadi's side of the room. Same war, same dice game, same exile, and it's a different story. The events don't change. Only the narrator does. A modality is a narrator too. Pixels, sound and words all describe the same world, and each one leaves different things out. If the only narrator a model trusts is language, it inherits all of language's blind spots.

**Does a model have to think in words at all?** A recent paper, Coconut, lets a language model reason in its own hidden states, feeding its last thought straight back in instead of writing it out as a word. Because it doesn't have to commit to a sentence while it's still unsure, it can keep a few possibilities open at once. Reading it felt like watching someone finally being allowed to think before they talk.

**Last stop: predicting the world.** In *World Models*, Ha and Schmidhuber train an agent that learns a compressed model of its game and then practises inside that dream. I-JEPA, from LeCun's group at Meta, learns from images by predicting the missing piece in an abstract space instead of repainting every pixel. Neither starts from words. Both try to predict how things go. That felt closest to the house with the lights off.
</section>

<section class="part" markdown="1">
<div class="part-label"><span class="no">04</span><h2>Papers and resources</h2><span class="src">what I read</span></div>

<ul class="fn-papers" markdown="0">
<li><span class="step">Thinking without words</span><span><a href="https://doi.org/10.1111/nyas.13046">Fedorenko &amp; Varley (2016). Language and thought are not the same thing: evidence from neuroimaging and neurological patients.</a> <em>Annals of the New York Academy of Sciences.</em><span class="why">The aphasia evidence. Start here.</span></span></li>
<li><span class="step">Thinking without words</span><span><a href="https://doi.org/10.1038/s41586-024-07522-w">Fedorenko, Piantadosi &amp; Gibson (2024). Language is primarily a tool for communication rather than thought.</a> <em>Nature.</em><span class="why">The strong version of the argument.</span></span></li>
<li><span class="step">Multimodal</span><span><a href="https://arxiv.org/abs/2103.00020">Radford et al. (2021). Learning Transferable Visual Models From Natural Language Supervision.</a> CLIP.<span class="why">The eyes trained by the mouth.</span></span></li>
<li><span class="step">Latent reasoning</span><span><a href="https://arxiv.org/abs/2412.06769">Hao et al. (2024). Training Large Language Models to Reason in a Continuous Latent Space.</a> Coconut.<span class="why">Thinking before talking.</span></span></li>
<li><span class="step">World models</span><span><a href="https://arxiv.org/abs/1803.10122">Ha &amp; Schmidhuber (2018). World Models.</a><span class="why">An agent that practises in its dreams.</span></span></li>
<li><span class="step">World models</span><span><a href="https://arxiv.org/abs/2301.08243">Assran et al. (2023). Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.</a> I-JEPA.<span class="why">Predict what the missing piece means, not what it looks like.</span></span></li>
<li><span class="step">Off the shelf</span><span><em>Sapiens</em>, Yuval Noah Harari · <em>The Palace of Illusions</em>, Chitra Banerjee Divakaruni · the <em>Bhagavad Gita</em>, chapters 2 and 6 · the Yaksha's questions from the <em>Mahabharata</em>.</span></li>
</ul>
</section>

<section class="part" markdown="1">
<div class="part-label"><span class="no">05</span><h2>Where I landed</h2><span class="src">my own words</span></div>

Not anywhere solid, which I'm slowly learning to be fine with.

Where I am right now: language is a wonderful way to share a thought, and a narrow place to keep one. People reason with maps, hands, pictures and gut feelings, and only some of it ever becomes a sentence. Most of today's models work the other way round. They see a diagram, turn it into words, and then think in the words. Some of the mistakes I see in my own work come from exactly that translation.

What I'm still wondering:

<p class="big-q">Can machines learn to reason about the world without having to translate every representation into language?</p>

And if they can, how will we know what they were thinking, without asking them to put it into words?

I don't know. Krishna's advice to Arjuna is still the most honest research plan I've found.

<blockquote class="lit"><p>You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.</p><cite>Bhagavad Gita 2.47</cite></blockquote>

Read, build, test, and let the answer turn up when it's ready.

<p class="signoff">Que sera, sera. Whatever will be, will be.</p>
</section>
