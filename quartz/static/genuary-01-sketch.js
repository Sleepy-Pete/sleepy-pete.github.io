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

