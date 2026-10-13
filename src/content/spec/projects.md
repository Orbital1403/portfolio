---
title: "Project notes"
description: "MILA*: a personal audio streamer in development, combining hardware, music, software and careful testing."
---

## MILA\*

**Personal audio streamer · In development**

- **Goal:** local hi-res music, internet radio and streaming in one responsive player.
- **My role:** requirements, behaviour, testing on the real device and release decisions; AI coding assistants write much of the implementation.
- **Current state:** a working personal prototype in active development, used for everyday listening.
- **Validation:** automated tests and device checks; some integrations, recovery scenarios and audio behaviour still need further validation.

A music project that brings together my interest in computers, practical problem-solving and everyday listening. MILA\* combines existing hardware with an interface I can shape around my own needs.

<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-player.png" alt="The current MILA* player interface" data-group="cover" tabindex="0" role="button" aria-label="Enlarge the MILA* player screenshot" loading="lazy" />
<figcaption>Player — current source, playback controls and music collection · Click to enlarge</figcaption>
</figure>

### From frustration to a project

I listen to music every day, with a large personal library of hi-res FLAC files alongside internet radio and streaming. The streamers I used frustrated me: slow menus when browsing larger collections, occasional connection drops, and limited ways to adapt the system. I also wanted direct control over audio processing — ensuring bit-perfect delivery for high-resolution files, avoiding unwanted resampling, and verifying what the DAC actually receives.

I set out to build a true all-rounder: a dedicated player that unites high-resolution local playback, internet radio, and streaming without compromise. Rather than keeping my main computer running, I looked at the hardware I already had: a Raspberry Pi 5, touch display, fast NVMe disk for local audio storage, USB DAC and linear power supply. I put my requirements on paper and began shaping a streamer around them.

The goal was straightforward: make an all-rounder player that handles high-resolution FLAC albums effortlessly, keeps radio and streaming within easy reach, and remains completely responsive and transparent in how it behaves.

### One interface for everyday listening

The Player brings playback controls together with the queue, favourites and recently played or added content. Source filters let me move between local music, radio and streaming without switching to a different interface.

The built-in touch display is the main control surface. The same web interface can also be opened from a phone or computer on the local network. Playback stays on the streamer; those other devices act as remote controls.

### A library I can explore

Navigating a large collection of hi-res FLAC files requires an interface that stays swift and intuitive. Local music can be browsed by album, artist, genre or folder, supported by search, sorting and alphabet navigation. High-speed NVMe storage on the Pi keeps album art and metadata loading instantly.

I want browsing to feel connected to listening: inspect an album, choose a track, return to the collection and manage the queue without losing my place.

<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-library.png" alt="MILA* local music library with album artwork and browsing controls" data-group="cover" tabindex="0" role="button" aria-label="Enlarge the MILA* library screenshot" loading="lazy" />
<figcaption>Library — albums, artists, folders and persistent playback controls · Click to enlarge</figcaption>
</figure>

### Radio without the clutter

The radio view separates my own station collection from discovery. It brings together saved stations, search, recently played content and filters for country, genre and quality. Personal streams can also be added.

Reliable background listening is a central development goal. When a stream or connection fails, the interface should explain what happened and provide a clear way to recover. Long listening sessions and recovery checks are part of the remaining validation.

<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-radio.png" alt="MILA* internet radio view with saved stations" data-group="cover" tabindex="0" role="button" aria-label="Enlarge the MILA* radio screenshot" loading="lazy" />
<figcaption>Radio — personal stations and discovery in one view · Click to enlarge</figcaption>
</figure>

### Streaming and audio control

Qobuz browsing is integrated through Lyrion Music Server. AirPlay, Spotify Connect and Bluetooth are also part of the receiver work, with individual support and validation tracked during development.

The main playback path uses **Lyrion Music Server → Squeezelite → USB DAC**. My aim is to avoid unnecessary resampling and digital volume changes for supported content. The interface distinguishes source quality from the format currently reported at the DAC output.

That distinction matters: an output shown as 32-bit does not turn a compressed radio stream into higher-quality source material. The format display supports investigation; it is not, by itself, proof of bit-perfect reproduction.

### Settings that belong with the player

Appearance, audio and services, music storage, and system maintenance are organised into four sections. The project includes theme and display options, meters, device information and user-data backup tools. Sensitive system actions use protected controls.

Screensavers and visual details are part of the experience, but they share the same design language as the listening and browsing screens.

<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-settings.png" alt="MILA* settings organised into four sections" data-group="cover" tabindex="0" role="button" aria-label="Enlarge the MILA* settings screenshot" loading="lazy" />
<figcaption>Settings — appearance, audio, storage and maintenance · Click to enlarge</figcaption>
</figure>

### My role and how I work

My background is in hardware, quality control and failure analysis, and I run MILA\* the same way. I lead the project: I define the requirements, decide how it should behave, test every change on the real device and decide what is released. AI coding assistants write much of the implementation under that direction. Directing that work and verifying the result is a skill in its own right.

The playback foundation comes from Lyrion and Squeezelite; my application connects the sources, controls and device functions into a coherent experience.

The work is iterative: notice a problem, reproduce it, investigate the cause, make a change and check the result. The examples below follow that pattern. I am also using the project to deepen my understanding of Python after completing my Java studies.

<section class="case-file" aria-labelledby="development-example-keeping-favourites-consistent">
<p class="case-label">Development example · 01</p>
<h3 id="development-example-keeping-favourites-consistent">Keeping favourites consistent</h3>
<dl class="case-steps">
<div><dt>01 / Problem</dt><dd>A single action could add the same favourite twice. A slow response could also arrive after a newer change and bring an older list back into view.</dd></div>
<div><dt>02 / Investigation</dt><dd>The development review found that two list views shared the same underlying collection. It also identified places where older responses could still overwrite current favourites.</dd></div>
<div><dt>03 / Change</dt><dd>The lists were separated, and newer confirmed changes now take priority over earlier responses. An uncertain operation is reported rather than automatically repeated.</dd></div>
<div><dt>04 / Check</dt><dd>Targeted automated checks covered duplicate additions, late responses and confirmed changes. The documented update was installed and the Favourites view was inspected on the Pi. Longer use and simultaneous-client checks remain part of ongoing validation.</dd></div>
</dl>
</section>

<section class="case-file" aria-labelledby="development-example-commands-that-only-looked-successful">
<p class="case-label">Development example · 02</p>
<h3 id="development-example-commands-that-only-looked-successful">Commands that only looked successful</h3>
<dl class="case-steps">
<div><dt>01 / Problem</dt><dd>Play, Pause and Next could fail without the interface saying so. Rejected commands were silently ignored, and an error-shaped reply from the music server could be read as a success.</dd></div>
<div><dt>02 / Investigation</dt><dd>The review followed a command from the touch button through the backend to Lyrion's JSON-RPC interface. A missing result was being turned into an empty "success". A response lost on the network also says nothing about whether the command actually ran.</dd></div>
<div><dt>03 / Change</dt><dd>Every command now ends in one of three outcomes: confirmed, rejected or unknown. An unknown outcome shows a warning that the command may already have run. Commands are deliberately not repeated automatically: repeating a Play/Pause toggle could undo a command that had in fact succeeded.</dd></div>
<div><dt>04 / Check</dt><dd>New automated cases covered rejected, malformed and lost responses. The update was installed with a fresh backup; the music server kept running and the player reported playback before and after the installation.</dd></div>
</dl>
</section>

<section class="case-file" aria-labelledby="development-example-a-lost-connection-without-false-alarms">
<p class="case-label">Development example · 03</p>
<h3 id="development-example-a-lost-connection-without-false-alarms">A lost connection without false alarms</h3>
<dl class="case-steps">
<div><dt>01 / Problem</dt><dd>When the interface lost contact with the player, the screen simply kept showing the last known state, with no sign that it might be out of date.</dd></div>
<div><dt>02 / Investigation</dt><dd>Status polling already handled timeouts and late responses correctly, so the gap was feedback, not data. The real question was which failures should count: a single slow reply or a browser tab in the background should not raise an alarm.</dd></div>
<div><dt>03 / Change</dt><dd>Two consecutive failed status checks now show a quiet notice that the status is unavailable and that the player is showing the last known playback. When contact returns, a short recovery message appears and then disappears. The notice never restarts or repeats anything, so it cannot interrupt playback.</dd></div>
<div><dt>04 / Check</dt><dd>Five new automated cases covered an outage, recovery, single failures and a hidden page. On the Pi the notice stays hidden during normal polling; its appearance was reviewed in an isolated preview. I have not yet caused a real network fault on the device to see it there.</dd></div>
</dl>
</section>

These examples show the approach I bring from quality control: work through the cause, document the change and check the result, including saying clearly what has not been checked yet.

### Testing and releases

MILA\* runs on a device I listen to every day, so a change is only finished once it has been checked.

- **Automated tests.** More than 1,100 automated tests cover the Python backend and the JavaScript interface: playback commands, library and queue, radio, favourites, settings and the installation tool itself. They are run before changes are installed.
- **Safe installation with rollback.** Updates go through an installation tool. It first creates a backup and verifies the copy on my computer by checksum. It then replaces only the program files, and checks that the interface starts, that every installed file matches the release and that every page resource is served correctly. If a check fails, the previous version is restored automatically. The music services keep running during an update.
- **Checks on the real device.** After an update I check status, library, queue and radio on the Pi, and finally listening and touch. Passing tests are not treated as proof that the sound is right.

The rollback path is covered by targeted tests; a controlled rollback on real hardware is still on the list.

### Hardware & foundation

Photographs of my listening setup, with the touch display, DAC, linear power supply and speakers. Backgrounds have been softened for presentation.

<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-front-v2-1600.jpg" srcset="/images/projects/gstreamer/mila-hardware-front-v2-800.jpg 800w, /images/projects/gstreamer/mila-hardware-front-v2-1600.jpg 1396w" sizes="(max-width: 800px) 100vw, 760px" alt="MILA listening setup viewed from the front, with touch display, DAC, linear power supply and speakers" data-index="0" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the MILA hardware setup" loading="lazy" />
<figcaption>My listening setup — front view · Click to enlarge</figcaption>
</figure>

<div class="mila-hardware-gallery">
<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-angle-v2-1600.jpg" alt="MILA listening setup viewed at an angle" data-index="1" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the angled hardware photograph" loading="lazy" />
<figcaption>The setup from another angle · Click to enlarge</figcaption>
</figure>
<figure class="project-figure">
<img src="/images/projects/gstreamer/mila-hardware-detail-v2-1600.jpg" alt="Close view of the MILA touch display, Topping DAC and TeraDak linear power supply" data-index="2" data-group="mila-hardware" tabindex="0" role="button" aria-label="Enlarge the hardware detail photograph" loading="lazy" />
<figcaption>Touch display, DAC and linear power supply · Click to enlarge</figcaption>
</figure>
</div>

| Component                     | Role                                    |
| ----------------------------- | --------------------------------------- |
| Raspberry Pi 5                | Dedicated computer running the streamer |
| NVMe disk                     | Local music storage                     |
| Topping E50 USB DAC           | Audio output                            |
| 10-inch touch display         | Built-in control interface              |
| Dedicated linear power supply | DAC power                               |
| Edifier MR5 speakers          | My listening setup                      |

**Software:** Raspberry Pi OS · Lyrion Music Server · Squeezelite · Python · HTML/CSS/JavaScript

### Current state

MILA\* is a working personal prototype in active development. The current focus is stable listening, recovery after interruptions and consistent behaviour across screen sizes. Some integrations and workflows still need refinement and real-world validation before a stable release.

The source code is in a private repository. I am happy to walk through it, the tests and the release history in a conversation.

---

<h3 id="portfolio-project">02 / This portfolio</h3>

**Personal website · In development**

This website is also one of my projects. I am adapting an existing Astro theme into a portfolio that connects my experience, practical work and current interests.

The technical-paper background and distinctive typography are retained from the original theme. I am refining the structure, writing, project presentation, responsive layouts and small interactions.

The aim is a clear, honest account of what I have done and what I am learning, with photographs and project notes that make the work tangible.

**Foundation:** Astro · HTML/CSS · JavaScript · Markdown · [Typography theme](https://github.com/moeyua/astro-theme-typography)

---

### 03 / Coursework & continued learning

I have completed my Java studies and now want to deepen my understanding of Python through practical work on MILA\*. Course summaries and certificates are on the [Skills](/skills/) page.
