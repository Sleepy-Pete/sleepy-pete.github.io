---
title: Twelve Principles of Animation
date: 2025-01-02
tags:
  - genuary
  - creative-coding
  - p5js
draft: false
---

## The Prompt

> Twelve principles of animation

## The Sketch

<div id="sketch-container"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
<script src="/static/genuary-02-sketch.js"></script>

## About This Sketch

The twelve principles of animation were introduced by Disney animators Ollie Johnston and Frank Thomas in their 1981 book "The Illusion of Life." These principles are fundamental to creating believable, appealing animation.

This sketch demonstrates several key principles:

- **Squash and Stretch** - The ball deforms as it bounces, compressing on impact and stretching during flight
- **Anticipation** - The ball squashes down before launching upward
- **Ease In/Ease Out** - Movement accelerates and decelerates naturally (not linear)
- **Arc** - The ball follows a natural parabolic arc
- **Follow Through** - The ball's deformation continues slightly after impact
- **Timing** - Different speeds create different feelings of weight and impact

The sketch shows a bouncing ball that demonstrates these principles in action. Watch how the ball squashes on impact, stretches during flight, and follows natural physics-based arcs.

## The Twelve Principles

1. **Squash and Stretch** - Gives weight and flexibility
2. **Anticipation** - Prepares the audience for action
3. **Staging** - Directs attention to what's important
4. **Straight Ahead & Pose to Pose** - Two animation techniques
5. **Follow Through & Overlapping Action** - Different parts move at different rates
6. **Ease In/Ease Out** - Natural acceleration and deceleration
7. **Arc** - Most natural motion follows arcs
8. **Secondary Action** - Supporting actions that add dimension
9. **Timing** - Speed creates personality and emotion
10. **Exaggeration** - Pushes reality for effect
11. **Solid Drawing** - Understanding 3D space and form
12. **Appeal** - Creating engaging, charismatic characters

## Code

```javascript
new p5(function(p) {
  let bgColor;
  let ball;
  
  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vy = 0;
      this.vx = 0;
      this.gravity = 0.6;
      this.bounce = -0.85;
      this.radius = 40;
      this.squash = 1;
      this.stretch = 1;
    }
    
    update() {
      // Apply gravity
      this.vy += this.gravity;
      this.y += this.vy;
      this.x += this.vx;
      
      // Bounce off bottom with squash and stretch
      if (this.y + this.radius > p.height) {
        this.y = p.height - this.radius;
        this.vy *= this.bounce;
        // Squash on impact
        this.squash = 1.4;
        this.stretch = 0.6;
      } else {
        // Stretch during fall
        let speed = p.abs(this.vy);
        this.stretch = 1 + speed * 0.02;
        this.squash = 1 - speed * 0.01;
      }
      
      // Ease back to normal shape (follow through)
      this.squash = p.lerp(this.squash, 1, 0.1);
      this.stretch = p.lerp(this.stretch, 1, 0.1);
      
      // Bounce off walls
      if (this.x - this.radius < 0 || this.x + this.radius > p.width) {
        this.vx *= -0.8;
        this.x = p.constrain(this.x, this.radius, p.width - this.radius);
      }
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      
      // Draw squashed/stretched ellipse
      p.fill(255, 100, 150);
      p.noStroke();
      p.ellipse(0, 0, this.radius * 2 * this.squash, this.radius * 2 * this.stretch);
      
      // Add highlight for depth
      p.fill(255, 150, 200, 150);
      p.ellipse(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.5);
      
      p.pop();
    }
  }

  p.setup = function() {
    let canvas = p.createCanvas(600, 600);
    canvas.parent('sketch-container');
    p.frameRate(60);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeQuery.matches;
    bgColor = isDarkMode ? '#161618' : '#faf8f8';
    
    ball = new Ball(p.width / 2, 100);
    ball.vx = p.random(-3, 3);
  };

  p.draw = function() {
    p.background(bgColor);
    
    // Draw ground line
    p.stroke(100);
    p.strokeWeight(2);
    p.line(0, p.height - 1, p.width, p.height - 1);
    
    ball.update();
    ball.display();
  };
  
  p.mousePressed = function() {
    // Reset ball on click
    ball.x = p.mouseX;
    ball.y = p.mouseY;
    ball.vy = 0;
    ball.vx = p.random(-5, 5);
  };
});
```

---

[[index|← Home]]

