let birdTriangles = []; // triangles that make the body shape of the bird
let points = []; // points of the background triangles
let triangles = []; // the triangles that make up the background
let backgroundLayer;// to store the bkg so we don't have do draw it each frame(and slow down this whole thing)
let doves = [];//store all the doves
let crosshair;//crosshair shape that used as cursor
let clickCount = 0;
let bloodImage;

function preload() {
  bloodImage = loadImage('libraries/assets/blood.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //hide the original cursor
  noCursor();

  preDrawBkgPoints();
  preDrawBkgTri();

  backgroundLayer = createGraphics(windowWidth, windowHeight);
  backgroundLayer.background(30);
  backgroundLayer.noStroke();
  for (let tri of triangles) {
    let colorBkg = random(0, 50);
    backgroundLayer.fill(colorBkg);
    backgroundLayer.triangle(tri[0].x, tri[0].y, tri[1].x, tri[1].y, tri[2].x, tri[2].y);
  }

  // draw doves at beginning
  for (let i = 0; i < 5; i++) {
    let x = random(-200, -50);
    let y = random(height);
    let size = random(50, 100);
    let dove = new Dove(x, y, size);
    doves.push(dove);
  }
}

function draw() {
  image(backgroundLayer, 0, 0);

  for (let dove of doves) {
    for (let pos of dove.bloodPositions) {
      image(bloodImage, pos.x, pos.y, dove.size / 2, dove.size / 2); //draw the blood stain
    }
  }

  //update existing doves
  for (let i = doves.length - 1; i >= 0; i--) {
    let dove = doves[i];
    dove.update();
    dove.draw();
    if (dove.isOffScreen() && dove.particles.length === 0) {
      doves.splice(i, 1);
    }
  }

  //draw the cursor
  drawCrosshair(mouseX, mouseY);

  // generate new doves
  if (random(1) < 0.05) {
    let x = random(-200, -50);
    let y = random(height);
    let size = random(50, 300);
    let dove = new Dove(x, y, size);
    doves.push(dove);
  }
}

//draw the cursor
function drawCrosshair(x, y) {
  if (clickCount >= 4) {
    // Draw peace symbol as cursor
    let size = 250;
    let radius = size / 2;
    stroke(0);
    strokeWeight(20);
    noFill();
    ellipse(x, y, size, size);

    // Draw lines
    line(x, y - radius, x, y + radius);

    let leftAngle = radians(135); 
    let leftX = x + radius * cos(leftAngle);
    let leftY = y + radius * sin(leftAngle);
    line(x, y, leftX, leftY); 

    let rightAngle = radians(45);
    let rightX = x + radius * cos(rightAngle);
    let rightY = y + radius * sin(rightAngle);
    line(x, y, rightX, rightY); 

  } else {//draw crosshair
    stroke(255, 255, 255);
    strokeWeight(3);
    noFill();

    ellipse(x, y, 70, 70);
    ellipse(x, y, 40, 40);

    line(x - 40, y, x + 40, y);
    line(x, y - 40, x, y + 40);
  }
}

// resize according to canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  preDrawBkgPoints();
  preDrawBkgTri();

  // Recreate and redraw the backgroundLayer
  backgroundLayer = createGraphics(windowWidth, windowHeight);
  backgroundLayer.background(30);
  backgroundLayer.noStroke();
  for (let tri of triangles) {
    let colorBkg = random(0, 50);
    backgroundLayer.fill(colorBkg);
    backgroundLayer.triangle(tri[0].x, tri[0].y, tri[1].x, tri[1].y, tri[2].x, tri[2].y);
  }

  // If the blood stain has been drawn, redraw it onto the new backgroundLayer
  if (clickCount >= 4) {
    drawPeaceSign();
  }
}

// put points in the point list
function preDrawBkgPoints() {
  points = [];
  triangles = [];

  let numPoints = 288;
  for (let i = 0; i <= numPoints; i++) {
    points.push(createVector(random(width), random(height)));
  }
}

// draw triangles in the background
function preDrawBkgTri() {
  // put three points that are near each other into the triangle list
  triangles = [];
  for (let i = 0; i < points.length - 1; i++) {
    let pt1 = points[i];
    for (let j = i + 1; j < points.length; j++) {
      let pt2 = points[j];
      if (dist(pt1.x, pt1.y, pt2.x, pt2.y) < width / 8) { // the widest side length of the tri
        for (let k = j + 1; k < points.length; k++) {
          let pt3 = points[k];
          if (dist(pt2.x, pt2.y, pt3.x, pt3.y) < width / 8) {
            triangles.push([pt1, pt2, pt3]);
          }
        }
      }
    }
  }
}

//create a class of the  doves
class Dove {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(3, 10), random(-1, 1));
    this.size = size;
    this.triangles = [];
    this.isExploded = false;
    this.particles = [];
    this.bloodPositions = [];
    this.generateTriangles();
  }

  generateTriangles() {
    let s = this.size;
    this.triangles = [
      // body
      [
        createVector(0.57 * s, 0.3 * s),
        createVector(0.42 * s, 0.6 * s),
        createVector(0.57 * s, 0.6 * s)
      ],
      [
        createVector(0.42 * s, 0.6 * s),
        createVector(0.27 * s, 0.75 * s),
        createVector(0.57 * s, 0.6 * s)
      ],
      [
        createVector(0.57 * s, 0.6 * s),
        createVector(0.72 * s, 0.75 * s),
        createVector(0.62 * s, 0.45 * s)
      ],
      // wing
      [
        createVector(0.57 * s, 0.3 * s),
        createVector(0.27 * s, 0.15 * s),
        createVector(0.42 * s, 0.6 * s)
      ],
      [
        createVector(0.57 * s, 0.3 * s),
        createVector(0.72 * s, 0.15 * s),
        createVector(0.57 * s, 0.6 * s)
      ],
      // head
      [
        createVector(0.67 * s, 0.3 * s),
        createVector(0.57 * s, 0.3 * s),
        createVector(0.57 * s, 0.6 * s)
      ],
      // tail
      [
        createVector(0.42 * s, 0.6 * s),
        createVector(0.27 * s, 0.65 * s),
        createVector(0.22 * s, 0.6 * s)
      ],
      [
        createVector(0.42 * s, 0.6 * s),
        createVector(0.24 * s, 0.66 * s),
        createVector(0.3 * s, 0.72 * s)
      ]
    ];
  }

  update() {
    if (!this.isExploded) {
      this.position.add(this.velocity);
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.update();
        p.draw();
        if (p.disappear()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  draw() {
    if (this.isExploded) {
      for (let p of this.particles) {
        p.draw();
      }
    } else {
      noStroke();
      for (let tris of this.triangles) {
        let colorBkg = random(180, 255);
        fill(colorBkg);
        triangle(
          tris[0].x + this.position.x, tris[0].y + this.position.y,
          tris[1].x + this.position.x, tris[1].y + this.position.y,
          tris[2].x + this.position.x, tris[2].y + this.position.y
        );
      }
    }
  }

  explode() {
    this.isExploded = true;
    this.bloodPositions.push(this.position.copy());
    for (let tris of this.triangles) {
      let colorBkg = random(180, 255);
      let vertices = [];
      for (let v of tris) {
        vertices.push(createVector(v.x + this.position.x, v.y + this.position.y));
      }
      let p = new Particle(vertices, colorBkg);
      this.particles.push(p);
    }
  }

  isOffScreen() {
    return this.position.x - this.size > width;
  }

  //check if the collision is within the area of the doves
  contains(x, y) {
    return x > this.position.x && x < this.position.x + this.size &&
      y > this.position.y && y < this.position.y + this.size;
  }

}

class Particle {
  constructor(vertices, color) {
    this.vertices = vertices;
    this.color = color;
    this.velocity = p5.Vector.random2D().mult(random(-100, 100)); // random direction and velocity
    this.position = createVector(0, 0); // set the beginning position
    this.scale = 1;
    this.alpha = 255;
  }

  //this part makes each particle become smaller, furthur to cursor, and more transparent
  update() {
    this.position.add(this.velocity);
    this.scale *= 0.9;
    this.alpha -= 10;
  }

  //when a particle is totally transparent or too small to be seen, remove it 
  disappear() {
    return this.alpha <= 0 || this.scale <= 0;
  }

  //draw each particle
  draw() {
    noStroke();
    fill(this.color, this.alpha);
    //cannot use triangle() here because the vertices change with time
    //beginShape() and endShape()
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x * this.scale + this.position.x, v.y * this.scale + this.position.y);
    }
    endShape(CLOSE);
  }
}

//when mousePressed(), draw the explosion
function mousePressed() {
  clickCount++;
  if (clickCount < 4) {
    for (let dove of doves) {
      if (!dove.isExploded && dove.contains(mouseX, mouseY)) {
        dove.explode();
        break;
      }
    }
  } else if (clickCount == 4) {
    // On the 4th click, draw the peace sign and change the crosshair
    drawPeaceSign();
  }
}

function drawPeaceSign() {
  let size = max(width, height) * 1.5; // Increase size to ensure coverage

  // 5 positions to place the images
  let positions = [
    { x: width * 0.25, y: height * 0.25 },
    { x: width * 0.75, y: height * 0.25 },
    { x: width * 0.25, y: height * 0.75 },
    { x: width * 0.75, y: height * 0.75 },
    { x: width * 0.5, y: height * 0.5 }
  ];

  backgroundLayer.imageMode(CENTER); // Set image mode to center

  for (let pos of positions) {
    backgroundLayer.image(bloodImage, pos.x, pos.y, size, size);
  }

  backgroundLayer.imageMode(CORNER); // Reset image mode to default
}

function drawBloodLine(pg, x1, y1, x2, y2) {
  let distance = dist(x1, y1, x2, y2);
  let steps = distance / (bloodImage.width / 4); // adjust step size
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    pg.image(bloodImage, x - bloodImage.width / 2, y - bloodImage.height / 2);
  }
}
