---
title: "MILA* audio application"
description: "A personal audio application for Raspberry Pi, with a guide to the interface and Pi 1.0 availability."
---

<div class="mila-story">
<section id="from-frustration-to-a-project" class="mila-section"><h2>From frustration to a project</h2>
<p>I listen to music every day, with a large personal library of hi-res FLAC files alongside internet radio and streaming. The streamers I used frustrated me: slow menus when browsing larger collections, occasional connection drops, and limited ways to adapt the system. I also wanted direct control over audio processing — ensuring bit-perfect delivery for high-resolution files, avoiding unwanted resampling, and verifying what the DAC actually receives.</p>
<p>I set out to build a true all-rounder: a dedicated player that unites high-resolution local playback, internet radio, and streaming without compromise. Rather than keeping my main computer running, I looked at the hardware I already had: a Raspberry Pi 5, touch display, fast NVMe disk for local audio storage, USB DAC and linear power supply. I put my requirements on paper and began shaping a streamer around them.</p>
<p>The goal was straightforward: make an all-rounder player that handles high-resolution FLAC albums effortlessly, keeps radio and streaming within easy reach, and remains completely responsive and transparent in how it behaves.</p>
</section>

<section id="one-interface-for-everyday-listening" class="mila-section">
<p class="mila-kicker">01 / THE APPLICATION</p><h2>Built around listening.</h2>
<p>MILA is an audio application I develop around my own music collection and everyday listening. I wanted local albums, internet radio and streaming within easy reach, with clear playback controls and useful feedback when something goes wrong.</p>
<div class="mila-features">
<div><span class="mila-number">01</span><h3>Find your music</h3><p>Browse albums, artists, genres and folders. Keep favourites and listening history close.</p></div>
<div><span class="mila-number">02</span><h3>Stay with the music</h3><p>Manage playback and the queue from one place, with separate source and DAC format information.</p></div>
<div><span class="mila-number">03</span><h3>Choose your screen</h3><p>Use the touch display or open the same interface in a browser on your local network.</p></div>
</div></section>
<section id="guide" class="mila-section"><p class="mila-kicker">02 / A QUICK WALKTHROUGH</p><h2>From your library to your next track.</h2>
<p>Open a step to see the screen and the controls. This is a guide to using MILA once it is installed; the Raspberry Pi installation guide will accompany the public download.</p>
<figure class="mila-video"><video controls playsinline preload="metadata" poster="/images/projects/mila-v1/player-panik.jpg" aria-label="MILA video guide with on-screen instructions"><source src="/videos/mila-guide-en.mp4" data-hr-src="/videos/mila-guide-hr.mp4" type="video/mp4" /></video><figcaption>Video guide · English text · 53 seconds · No audio</figcaption></figure>
<details id="a-library-i-can-explore" class="mila-step" open><summary><span class="mila-number">01</span><span><strong>Choose an album</strong><small>Start in Library.</small></span><span class="mila-plus" aria-hidden="true">+</span></summary><div class="mila-step-body"><p>Open Library, select Albums and choose a cover to inspect the tracks. Use search or switch to Artists, Genres or Folders when you know what you want to hear.</p><figure class="project-figure"><img src="/images/projects/mila-v1/library.jpg" width="1280" height="720" alt="MILA album library with artwork, browsing controls and the mini-player" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Library — browse without losing playback controls</figcaption></figure></div></details>
<details class="mila-step" ><summary><span class="mila-number">02</span><span><strong>Listen and manage the queue</strong><small>Keep the next track in view.</small></span><span class="mila-plus" aria-hidden="true">+</span></summary><div class="mila-step-body"><p>Select Play on an album or track, then open Player. Pause, skip, seek and inspect the album tracks. Open Queue to manage the wider listening order. Source and DAC labels describe different parts of the audio path.</p><figure class="project-figure"><img src="/images/projects/mila-v1/player-panik.jpg" width="1280" height="720" alt="MILA player with live radio information and station presets" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Player — playback controls, audio information and radio presets</figcaption></figure></div></details>
<details id="radio-without-the-clutter" class="mila-step"><summary><span class="mila-number">03</span><span><strong>Make radio your own</strong><small>Saved stations, with discovery nearby.</small></span><span class="mila-plus" aria-hidden="true">+</span></summary><div class="mila-step-body"><p>Open Radio to see My Stations. Use Discover to look for something new, filter by country, genre or quality, or use Add Stream for a station URL you already have.</p><figure class="project-figure"><img src="/images/projects/mila-v1/radio.jpg" width="1280" height="720" alt="MILA radio with Radio Panik, Radio Student and Yammat FM logos" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Radio — your station collection and discovery filters</figcaption></figure></div></details>
<details id="settings-that-belong-with-the-player" class="mila-step"><summary><span class="mila-number">04</span><span><strong>Set up your listening space</strong><small>Appearance, audio and maintenance.</small></span><span class="mila-plus" aria-hidden="true">+</span></summary><div class="mila-step-body"><p>Open Settings and choose the relevant section: display, audio and services, music storage, network, maintenance or updates. Remote access to protected system controls uses the System PIN.</p><figure class="project-figure"><img src="/images/projects/mila-v1/settings.jpg" width="1280" height="720" alt="MILA settings overview with six sections" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Settings overview · Remote HTTP view</figcaption></figure></div></details>
<p class="mila-note">Screenshots captured from the running Raspberry Pi on 6 November 2026, with real album covers and station logos. Radio Panik is shown in the Player views. Click any image to enlarge.</p></section>
<section id="mobile" class="mila-section mila-mobile-layout"><div><p class="mila-kicker">03 / THE SAME APP, ANOTHER SCREEN</p><h2>Your phone is the remote.</h2>
<p>Playback stays on the Raspberry Pi. Your phone or computer controls the same player through a browser on the local network, without a separate mobile app.</p>
<p>The mobile layout keeps artwork, playback controls and the queue close together. On a larger screen, Now Playing gives the music more space.</p>
<span id="streaming-and-audio-control"></span><p class="mila-note">Source quality and DAC output are shown separately. A DAC format label alone is not proof of bit-perfect playback.</p></div>
<figure class="project-figure mila-phone"><img src="/images/projects/mila-v1/mobile-panik.jpg" width="390" height="844" alt="MILA mobile player receiving Radio Panik with station presets" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Mobile player · Live Raspberry Pi screenshot</figcaption></figure>
</section>
<figure class="project-figure"><img src="/images/projects/mila-v1/now-playing-panik.jpg" width="1280" height="720" alt="MILA full-screen Now Playing with artwork and audio format labels" data-group="cover" tabindex="0" role="button" loading="lazy"/><figcaption>Now Playing — Radio Panik · Live Raspberry Pi screenshot</figcaption></figure>
<section id="download" class="mila-section mila-release"><span id="current-state"></span><p class="mila-kicker">04 / VERSION &amp; AVAILABILITY</p><div class="mila-release-heading"><h2>MILA for Raspberry Pi</h2><span class="mila-version">Pi 1.0</span></div>
<p>The first version is stable in my private development and listening setup. A reviewed update is prepared, while a clean distribution image is a separate next step.</p>
<dl class="mila-release-data">
<div><dt>Current version</dt><dd>Pi 1.0 — private installation</dd></div>
<div><dt>Test platform</dt><dd>Raspberry Pi 5 · Raspberry Pi OS · USB DAC</dd></div>
<div><dt>Next update</dt><dd>Prepared and reviewed; not installed yet</dd></div>
<div><dt>Public download</dt><dd>Not available yet</dd></div>
</dl><div class="mila-download-state"><span aria-hidden="true">↓</span><div><strong>Raspberry Pi image — coming later</strong><p>The image has not been created. A public release will include its version, compatible hardware, installation guide, checksum and release notes.</p></div></div></section>
<section id="my-role-and-how-i-work" class="mila-section"><p class="mila-kicker">05 / BEHIND THE APPLICATION</p><h2>From a listening problem to a tested change.</h2>
<p>My background is in hardware, quality control and failure analysis. I define the requirements and expected behaviour, reproduce problems, test installed versions on the device and decide which changes are accepted. AI coding assistants write substantial parts of the implementation.</p>
<div class="mila-engineering"><div id="development-example-keeping-favourites-consistent"><span id="development-example-commands-that-only-looked-successful"></span><h3>Honest command feedback</h3><p>A lost response does not prove that a command failed. MILA distinguishes confirmed, rejected and unknown outcomes, and avoids automatically repeating a command that may already have run.</p></div><div id="testing-and-releases"><span id="development-example-a-lost-connection-without-false-alarms"></span><h3>Checks beyond the happy path</h3><p>Automated checks cover late responses, stale queue actions and private profile data. Installation work includes backups and recovery checks. Local tests, CI results and listening or touch checks on the device are recorded separately.</p></div></div>
<div id="hardware--foundation" class="mila-platform"><h3>Development and test environment</h3><p>I develop the application on a Raspberry Pi 5 with a 10-inch touch display, NVMe storage and a Topping E50 USB DAC. This is my test configuration, not a claim of compatibility with every Pi or DAC.</p><p>Photographs of the setup I use to develop and test the application. Backgrounds have been softened for presentation.</p><figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-front-v2-1600.jpg" width="1396" height="1127" srcset="/images/projects/gstreamer/mila-hardware-front-v2-800.jpg 800w, /images/projects/gstreamer/mila-hardware-front-v2-1600.jpg 1396w" sizes="(max-width: 800px) 100vw, 760px" alt="MILA listening setup viewed from the front, with touch display, DAC, linear power supply and speakers" data-index="0" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the MILA hardware setup" loading="lazy" />
<figcaption>My listening setup — front view · Click to enlarge</figcaption>
</figure>

<div class="mila-hardware-gallery">
<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-angle-v2-1600.jpg" width="1086" height="1448" alt="MILA listening setup viewed at an angle" data-index="1" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the angled hardware photograph" loading="lazy" />
<figcaption>The setup from another angle · Click to enlarge</figcaption>
</figure>
<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-player-v3.jpg" width="1448" height="1086" alt="MILA player on the touch display, with analog VU meters, Topping DAC and TeraDak linear power supply" data-index="2" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the hardware detail photograph" loading="lazy" />
<figcaption>MILA player on the touch display, DAC and linear power supply · Click to enlarge</figcaption>
</figure>
</div>

<p class="mila-stack">Python · HTML / CSS / JavaScript<br/>Lyrion Music Server → Squeezelite → USB DAC</p></div>
<p>The source is private. I can walk through the application, selected code and testing approach in a conversation.</p>
<a class="mila-text-link" href="/contact/">Discuss the project →</a></section>

</div>
