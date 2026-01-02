---
title: One Shape, One Color
date: 2026-01-02
tags:
  - genuary
  - creative-coding
  - p5js
draft: false
---

## The Prompt

> One shape, one color

## The Sketch

<div id="sketch-container"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
<script src="/static/genuary-01-sketch.js"></script>

## About This Sketch

For the first day of Genuary 2026, I created a grid of pulsing circles. Each circle breathes in and out with a sine wave, but with a slight offset based on its position in the grid, creating a rippling wave effect across the canvas.

The sketch uses a single color (cyan) for both the fill and stroke, and the background adapts to match your website's theme (light or dark mode). The constraint of "one shape, one color" is deceptively simple - it forces you to think about movement, pattern, and composition rather than complexity.

## Code

```javascript
new p5(function(p) {
  let bgColor;

  p.setup = function() {
    let canvas = p.createCanvas(600, 600);
    canvas.parent('sketch-container');
    p.frameRate(30);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeQuery.matches;
    bgColor = isDarkMode ? '#161618' : '#faf8f8';
  };

  p.draw = function() {
    p.background(bgColor);

    let cols = 5;
    let rows = 5;
    let spacing = p.width / cols;

    p.stroke(0, 200, 255);
    p.strokeWeight(3);
    p.fill(0, 200, 255);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = spacing * i + spacing / 2;
        let y = spacing * j + spacing / 2;

        let offset = (i + j) * 0.3;
        let size = 60 + p.sin(p.frameCount * 0.05 + offset) * 20;

        p.circle(x, y, size);
      }
    }
  };
});
```

---

[[index|← Home]]

