new p5(function(p) {
  let bgColor;
  let ball;

  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vy = 0;
      this.vx = 0;
      this.gravity = 0.3; // Reduced for slower, more visible motion
      this.bounce = -0.85;
      this.radius = 40;
      this.squash = 1;
      this.stretch = 1;
      this.targetSquash = 1; // Target values for smooth transitions
      this.targetStretch = 1;
      this.friction = 0.99; // Less air resistance for smoother motion
      this.groundFriction = 0.97; // Less ground friction
      this.distanceToGround = 0;
    }

    update() {
      // Apply gravity
      this.vy += this.gravity;

      // Apply air resistance
      this.vx *= this.friction;

      // Update position
      this.y += this.vy;
      this.x += this.vx;

      // Calculate distance to ground
      this.distanceToGround = p.height - (this.y + this.radius);

      // Check if ball is on or below ground
      let onGround = this.distanceToGround <= 0;

      // Anticipation - start squashing slightly before impact
      let anticipationDistance = 30; // Distance from ground to start anticipating
      if (!onGround && this.vy > 0 && this.distanceToGround < anticipationDistance) {
        // Gradually increase squash as we approach ground
        let anticipationAmount = 1 - (this.distanceToGround / anticipationDistance);
        let speed = p.abs(this.vy);
        this.targetSquash = 1 + (speed * 0.03 * anticipationAmount);
        this.targetStretch = 1 - (speed * 0.015 * anticipationAmount);
      }
      // Bounce off bottom with squash and stretch
      else if (onGround) {
        this.y = p.height - this.radius;

        // Only bounce if moving fast enough (prevents tiny bounces)
        if (p.abs(this.vy) > 0.3) {
          this.vy *= this.bounce;
          // Squash on impact (proportional to impact speed)
          let impactForce = p.abs(this.vy) / 10;
          this.targetSquash = 1 + impactForce * 1.2;
          this.targetStretch = 1 - impactForce * 0.6;
        } else {
          // Ball has settled - stop bouncing
          this.vy = 0;
          this.vx *= this.groundFriction; // Apply ground friction
          this.targetSquash = 1;
          this.targetStretch = 1;
        }
      }
      // Stretch during fall (follow-through)
      else if (this.vy > 0) {
        // Falling down - stretch vertically
        let speed = p.abs(this.vy);
        if (speed > 1) {
          this.targetStretch = 1 + speed * 0.02;
          this.targetSquash = 1 - speed * 0.01;
        } else {
          this.targetStretch = 1;
          this.targetSquash = 1;
        }
      }
      // Rising up - slight stretch
      else if (this.vy < -1) {
        let speed = p.abs(this.vy);
        this.targetStretch = 1 + speed * 0.015;
        this.targetSquash = 1 - speed * 0.008;
      }
      // Normal state
      else {
        this.targetSquash = 1;
        this.targetStretch = 1;
      }

      // Smoothly interpolate to target values (gradual transition)
      // Slower lerp for more visible deformation frames
      this.squash = p.lerp(this.squash, this.targetSquash, 0.12);
      this.stretch = p.lerp(this.stretch, this.targetStretch, 0.12);

      // Bounce off walls
      if (this.x - this.radius < 0 || this.x + this.radius > p.width) {
        this.vx *= -0.8;
        this.x = p.constrain(this.x, this.radius, p.width - this.radius);
      }

      // Stop very slow movement
      if (p.abs(this.vx) < 0.1) this.vx = 0;
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
    p.frameRate(120); // Higher frame rate for smoother animation

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

