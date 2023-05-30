//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;
var isInitialized;
var amplitude;
var amplitudes;
var fft;


function preload(){
	sound = loadSound('assets/stomper_reggae_bit.mp3');
	amplitudes = [];
	for(var i = 0; i < 512; i++){
		amplitudes.push(0);
	}
}

function setup(){
	 createCanvas(windowWidth, windowHeight);
	 background(0);
	 controls = new ControlsAndInput();

	 //instantiate the fft object
	 fourier = new p5.FFT();

	 //create a new visualisation container and add visualisations
	 vis = new Visualisations();
	 vis.add(new Spectrum());
	 vis.add(new WavePattern());
	 vis.add(new Needles());
	 isInitialized = false;
	 amplitude = new p5.Amplitude();
	 fft = new p5.FFT
}

function draw(){
	background(0);
	//draw the selected visualisation
	vis.selectedVisual.draw();
	//draw the controls on top.
	controls.draw();
	if(!isInitialized){
		fill(255,255,255);
		text("press any key to begin", width/2, height/2);
	} else {
		var a = amplitude.getLevel();
		amplitudes.push(a);
		amplitudes.shift();
		text(a, width/2, 32);
		var d = map(a, 0, 0.15, 50, 250);
		ellipse(width/2, height/2, d);
		var freqs = fft.analyze();
		stroke(0, 0, 150)
		for(var i = 0; i < freqs.length; i++){
			line(i, height, i, height - freqs[i] * 2)
		}
		var energy = fft.getEnergy('bass');
		push();
		noStroke();
		fill(255, 0, 0);
		ellipse(width/4, height/2, 50 + energy);
		pop();

		push();
		noFill();
		stroke(255, 0, 0);
		beginShape();
		for(var i = 0; i < amplitudes.length; i++){
			var h = map(amplitudes[i], 0, 0.15, 0, -150);
			vertex(i * 2, height/2 + h);
		}
		endShape();
		pop();
	}
}

function mouseClicked(){
	controls.mousePressed();
}

function keyPressed(){
	controls.keyPressed(keyCode);
	if(!isInitialized){
		isInitialized = true;
		sound.setVolume(0.5);
		sound.loop();
	} else {
		if(key == ' '){
			if(sound.isPaused()){
				sound.play();
			} else {
				sound.pause();
			}
		}
	}
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	if(vis.selectedVisual.hasOwnProperty('onResize')){
		vis.selectedVisual.onResize();
	}
}
