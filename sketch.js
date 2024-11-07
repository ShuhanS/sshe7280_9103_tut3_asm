let birdTriangles = []; // triangles that make the body shape of the bird
let points = []; // points of the background triangles
let triangles = []; // the triangles that make up the background

function setup() {
  createCanvas(windowWidth, windowHeight);

  preDrawBkgPoints();
  preDrawBkgTri();

  // prepare the triangles that make up the bird to be drawn later
  drawBirdTri();
}

function draw() {
  background(30);
  drawBackground();
  drawBirdTri();
}

// resize according to canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  preDrawBkgPoints();
  preDrawBkgTri();
}

// put points in the point list
function preDrawBkgPoints(){
  points = []; 
  triangles = []; 

  let numPoints = 288;
  for (let i = 0; i <= numPoints; i++) {
    points.push(createVector(random(width), random(height)));
  }
}

// draw triangles in the background
function preDrawBkgTri(){
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

// draw the background triangles that has been stored in list triangles before
function drawBackground() {
  noStroke();
  for (let tri of triangles) {
    let colorBkg = random(0, 140);
    fill(colorBkg);
    triangle(tri[0].x, tri[0].y, tri[1].x, tri[1].y, tri[2].x, tri[2].y);
  }
}

// draw the bird triangles
function drawBirdTri() {
  let offsetX = mouseX;
  let offsetY = mouseY;

  let doveCenterX = 0.5 * width;
  let doveCenterY = 0.5 * height;

  // The vectors are manually input to make it looks like a dove
  birdTriangles = [
    // dove body
    [
      createVector(0.57 * width - doveCenterX, 0.3 * height  - doveCenterY),
      createVector(0.42 * width - doveCenterX, 0.6 * height - doveCenterY),
      createVector(0.57 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    [
      createVector(0.42 * width - doveCenterX, 0.6 * height - doveCenterY),
      createVector(0.27 * width - doveCenterX, 0.75 * height - doveCenterY),
      createVector(0.57 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    [
      createVector(0.57 * width - doveCenterX, 0.6 * height - doveCenterY),
      createVector(0.72 * width - doveCenterX, 0.75 * height - doveCenterY),
      createVector(0.62 * width - doveCenterX, 0.45 * height - doveCenterY)
    ],
    // the wings
    [
      createVector(0.57 * width - doveCenterX, 0.3 * height - doveCenterY),
      createVector(0.27 * width - doveCenterX, 0.15 * height - doveCenterY),
      createVector(0.42 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    [
      createVector(0.57 * width - doveCenterX, 0.3 * height - doveCenterY),
      createVector(0.72 * width - doveCenterX, 0.15 * height - doveCenterY),
      createVector(0.57 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    // head
    [
      createVector(0.67 * width - doveCenterX, 0.3 * height - doveCenterY),
      createVector(0.57 * width - doveCenterX, 0.3 * height - doveCenterY),
      createVector(0.57 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    // tail
    [
      createVector(0.42 * width - doveCenterX, 0.6 * height - doveCenterY),
      createVector(0.27 * width - doveCenterX, 0.65 * height - doveCenterY),
      createVector(0.22 * width - doveCenterX, 0.6 * height - doveCenterY)
    ],
    [
      createVector(0.42 * width - doveCenterX, 0.6 * height - doveCenterY),
      createVector(0.24 * width - doveCenterX, 0.66 * height - doveCenterY),
      createVector(0.3 * width - doveCenterX, 0.72 * height - doveCenterY)
    ]
  ];

  noStroke();
  for (let tris of birdTriangles) {
    let colorBkg = random(180, 255);
    fill(colorBkg);
    triangle(
      tris[0].x + offsetX, tris[0].y + offsetY,
      tris[1].x + offsetX, tris[1].y + offsetY,
      tris[2].x + offsetX, tris[2].y + offsetY
    );
  }

}

// draw the bird
// function drawBird() {
//   noStroke();
//   for (let tris of birdTriangles) {
//     let colorBkg = random(180, 255);
//     fill(colorBkg);
//     triangle(tris[0].x, tris[0].y, tris[1].x, tris[1].y, tris[2].x, tris[2].y);
//   }
// }
