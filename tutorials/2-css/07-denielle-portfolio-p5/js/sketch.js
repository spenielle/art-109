
let canvas;
let xPos = 0;
let yPos = 0;
let easing = 0.09;

function setup (){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style("position", "fixed");
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw (){
    clear();


    xPos = xPos + ((mouseX - xPos) * easing);
    yPos = yPos + ((mouseY - yPos) * easing);

    drawThing(xPos, yPos);

}

// function mouseMoved(){
//     background(100);
//     drawThing(mouseX, mouseY);
   
// }

function drawThing(_x, _y){
    //strokeWeight(0);
    // fill(random(200, 255), random(200, 255), random(200, 255));
    // ellipse(_x, _y, 30, 30);
    noStroke();
    fill(random(200, 255), random(200, 255), random(200, 255));
    rect(_x, _y, 30, 30);
}