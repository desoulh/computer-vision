let capture;
const w = 640;
const h = 360;

var fade;
var fadeAmount = 1



function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  
  fade = 0
    
  rectMode(CENTER)
}

function draw() {
  // background(14, 227, 103);
  background(120)


  
  const stepSize = 20;
  
  
  noStroke();
  
  capture.loadPixels();
  
  
  for(let y = 0; y < capture.height; y+=stepSize) {
    for(let x = 0; x < capture.width; x+=stepSize) {
      
      const i = (x + y * width) * 4;
      
      const r = capture.pixels[i]; // red channel
      const g = capture.pixels[i+1]; // green channel
      const b = capture.pixels[i+2]; // blue channel
      // capture.pixels[i+3] = 1; // alpha channel
      
      const brightness = (r + g + b) / 3
      
      var threshould = 127;
      if (brightness > threshould) {
        fill(255, 255, 255, fade);
      } else {
        fill(0, 0, 0, fade);
      }
      
      if (fade<0) fadeAmount=1; 
 
      if (fade>255) fadeAmount=-20; 
 
      fade += fadeAmount; 
      print(fade)
      // fill(r, g, b);

      
      push();
      translate(width,0);
      scale(-1,1);
      rect(x, y, fade/5)
      
      pop();
      
      

      
      
      
    }
    
  }
 

  
  // image(capture, 0, 0);
  //print(capture.pixels.length)
  
}