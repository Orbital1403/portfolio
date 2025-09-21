---
title: "Programming in HTML5 with JavaScript and CSS3"
pubDate: 2025-09-18
description: "Introduction to building modern web pages using HTML5 structure, CSS3 styling, and JavaScript interactivity."
categories: ["Web Development", "HTML5", "CSS3", "JavaScript","ITAcademy"]
slug: html5-javascript-css3
---

# Programming in HTML5 with JavaScript and CSS3

This subject introduced me to the fundamentals of **frontend web development**: creating structured web pages with HTML, styling them with CSS, and adding interactivity using JavaScript.

## Topics I studied

- HTML5 structure and semantic elements (`header`, `nav`, `main`, `article`, `footer`)
- Forms and input controls (text fields, radio buttons, checkboxes, select menus)
- Multimedia integration (`<audio>`, `<video>`, `<canvas>`)
- CSS3 selectors, the box model, flexbox and grid layouts
- Colors, backgrounds, fonts, and responsive design
- JavaScript basics: variables, functions, loops, conditions
- DOM manipulation and event handling
- Simple form validation with JavaScript

## My experience

At first, understanding the **CSS box model** and positioning (relative, absolute, fixed, sticky) was tricky.
Later, working with **JavaScript events** and DOM updates gave me a clear picture of how web pages become interactive.

## Example: Interactive Button

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Interactive Button</title>
    <style>
      button {
        padding: 10px 20px;
        font-size: 16px;
        background: #0078d7;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      button:hover {
        background: #005a9e;
      }
    </style>
  </head>
  <body>
    <button id="clickMe">Click me!</button>
    <p id="output"></p>

    <script>
      const button = document.getElementById('clickMe')
      const output = document.getElementById('output')

      button.addEventListener('click', () => {
        output.textContent = 'You clicked the button!'
      })
    </script>
  </body>
</html>
```
