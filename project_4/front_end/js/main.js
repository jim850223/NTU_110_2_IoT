function setup() {
  //13 : 8 = 650 : 400
  let myCanvas = createCanvas(650, 400);
  myCanvas.parent('myContainer');
}

function draw() {
  fill("red");
  
  //background(255);
  grid();
  displayMousePosition();

  ellipse(mouseX, mouseY, 20, 20);
  fill(0, 102, 153);
  textSize(20);
  ellipse(x, y, 20, 20);
  text("    X: "+Math.round((x/width) * 13 * 100)/100+" Y: "+Math.round((y/height) * 8 * 100)/100,x, y);

  text("    X: "+Math.round((mouseX/width) * 13 * 100)/100+" Y: "+Math.round((mouseY/height) * 8 * 100)/100,mouseX, mouseY);

}

var u = 40;

//gird system reference
//https://editor.p5js.org/kchung/sketches/rkp-wOIF7


function grid() {
	background(255);
	stroke(220);
	strokeWeight(1);
	for (let x = 0; x <= width; x += u) {
		for (let y = 0; y <= height; y += u) {
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
}

function displayMousePosition() {
	textFont('menlo');
	textSize(14);
	noStroke();
	text("x:" + Math.round((mouseX/width) * 13 * 100)/100, 10, 20);
	text("y:" + Math.round((mouseY/height) * 8 * 100)/100, 10, 40);
  //text("x:" + x, 10, 20);
  //text("y:" + y, 10, 40);
  stroke('black'); // reset stroke
}

let x;
let y;

async function getPosition() {
  let result = await
    fetch(`http://127.0.0.1:3000/`, { method: "GET" })
      .then(response => { 
        return(response.json());                                                        
      }).then(response => {
        console.log("x is:",response.x);
        console.log("y is:",response.y);
        x = response.x;
        y = response.y;
      })
      return result
      }


//getPosition();
