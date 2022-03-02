let w = 640;
let h = 480;
let capture;
let model;
let skeletons;

let synth, soundLoop;


//let notePattern
let notePattern = [60, 62, 64, 67, 69, 72];
let notePattern1 = [40, 42, 44, 47, 49, 52];

let currentNote;
let currentNote1;





function setup() {
  let cnv = createCanvas(innerWidth, innerHeight);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  
  loadSkeletonModel();
  

  cnv.mousePressed(canvasPressed);
  

  let intervalInSeconds = 0.2;
   soundLoop = new p5.SoundLoop(onSoundLoop, intervalInSeconds);

   synth = new p5.PolySynth();
}

function draw() {
  background(200);

  if(capture.loadedmetadata) {
    // draw the capture first
    push();
      scale(setScale(), setScale());
      translate(w, 0);
      scale(-1, 1);
      image(capture, 0, 0);
    pop();
  }

  // if we see skeletons
  if(skeletons !== undefined) {
    //console.log(skeletons);

    // loop through all the skeletons
    for(let skel of skeletons) {
      
    // console.log(skel)
      
      // loop through and draw all the keypoints of the current skeleton
      // for(let pt of skel.pose.keypoints) {
      //   fill(0, 255, 0);
      //   ellipse(w-pt.position.x, pt.position.y, 10, 10);
      // }
      
      let leftWrist = skel.pose.leftWrist;
      currentNote = floor(map(leftWrist.y, height, 0, 0, notePattern.length))
      
      let rightWrist = skel.pose.rightWrist;
      currentNote1 = floor(map(rightWrist.y, height, 0, 0, notePattern1.length))
      
      // line(0, leftWrist.y, w, rightWrist.y);
      // strokeWeight(4);
      push();
      translate(width, 0);
      scale(-setScale(), setScale());
      noStroke();
      fill(0, 0, 0, rightWrist.y/2.5)
      circle(leftWrist.x, leftWrist.y, rightWrist.y/2);
      
      pop();
      

      //console.log(currentNote);
      // fill(255, 0, 0);
      // ellipse(w-nose.x, nose.y, 40, 40)
      // noLoop();
    }
  }

}

function loadSkeletonModel() {
  // load the PoseNet model
  model = ml5.poseNet(capture, { maxPoseDetections: 1 } );
  
  // when it has a new pose (skeleton), this 
  // function will be run!
  // (basically we just grab the first prediction,
  // since we only want one skeleton)
  model.on('pose', function(predictions) {
    skeletons = predictions;
  });
}

function canvasPressed() {
  // ensure audio is enabled
  userStartAudio();

  if (soundLoop.isPlaying) {
    soundLoop.stop();
  } else {
    // start the loop
    soundLoop.start();
  }
}

function onSoundLoop(timeFromNow) {
  let noteIndex = (soundLoop.iterations - 1) % notePattern.length;
  let noteIndex1 = (soundLoop.iterations - 1) % notePattern1.length;
  
  //let note = midiToFreq(notePattern[noteIndex]);
  let note = midiToFreq(notePattern[currentNote])
  let note1 = midiToFreq(notePattern1[currentNote1])
  
  synth.play(note, 0.5, timeFromNow);
  synth.play(note1, 0.5, timeFromNow);
  
  background(noteIndex * 360 / notePattern.length, 50, 100);
  background(noteIndex * 360 / notePattern1.length, 50, 100);
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight)
}

function setScale() {
  if(innerWidth/w >= innerHeight/h) {
    return innerWidth/w;
  } else {
    return innerHeight/h;
  }

}

