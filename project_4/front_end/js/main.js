let the_real_width = 15;
let the_data_width = 12;
let x_from_data_to_real = the_real_width/the_data_width;
let the_real_height = 8;
let the_data_height = 6;
let y_from_data_to_real = the_real_height/the_data_height;
let canvas_width = 750;
let canvas_height = 400;
let x_on_the_canvas = x_from_data_to_real * canvas_width;
let y_on_the_canvas = y_from_data_to_real * canvas_height;
let server_ip = "192.168.22.37"

function accSubtr(arg1,arg2){
  var r1,r2,m,n;
  try {
      r1=arg1.toString().split(".")[1].length;
  } catch(e){r1=0}
  try {
      r2=arg2.toString().split(".")[1].length;
  } catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2));
  n=(r1>=r2)?r1:r2;
  return ((arg1*m-arg2*m)/m).toFixed(n);
}

function setup() {
  //15 : 8 =  750 : 400 
  let myCanvas = createCanvas(canvas_width, canvas_height);
  myCanvas.parent('myContainer');
}

function draw() {
  fill("red");
  
  //background(255);
  grid();
  displayMousePosition();

  ellipse(mouseX, mouseY, 20, 20);
  fill(0, 102, 153);
  textSize(16);
  ellipse(width -(x* x_from_data_to_real/the_real_width * width), y* y_from_data_to_real/the_real_height * height, 20, 20);
  let x_to_show = Math.round((x* x_from_data_to_real) * 100)/100
  let mousex_to_show = accSubtr(15, Math.round((mouseX/width) * 15 * 100)/100)
  text("    X: "+ x_to_show +" Y: "+Math.round((y * y_from_data_to_real) * 100)/100+" Z: 1.05",width - (x * x_from_data_to_real * (width/the_real_width)), y * y_from_data_to_real * (height/the_real_height));
  text("    X: "+ mousex_to_show +" Y: "+Math.round((mouseY/height) * 8 * 100)/100,mouseX, mouseY);
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
	textSize(16);
	noStroke();
  //accSubtr(15, Math.round((mouseX/width) * 15 * 100)/100);
  //let mousex_to_show = accSubtr(15, Math.round((mouseX/width) * 15 * 100)/100)
  let x_to_show = Math.round((x* x_from_data_to_real) * 100)/100
  let y_to_show = Math.round((y * y_from_data_to_real) * 100)/100
  if (x) {
    text("x:" + x_to_show, 10, 20);
	  text("y:" + y_to_show, 10, 40);
    text("z:" + 1.05, 10, 60);
  }
  stroke('black'); // reset stroke
}

let x;
let y;

async function getPosition() {
  let result = await
    fetch(`http://${server_ip}:5000/`, { method: "GET" })
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
