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

function preload(){
	sound = loadSound('assets/stomper_reggae_bit.mp3');
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
		text(a, width/2, 32);
		var d = map(a, 0, 0.15, 50, 250);
		ellipse(width/2, height/2, d)
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
