let particles = []

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 30);
  
  for(var i = 0; i < 500; i++) {
    particles[i] = new Particle('red');
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 30, windowHeight - 30); // Adjust canvas size when the window is resized
}

function draw() {
  background(220);
  
  text(floor(frameRate()), 10, 10);
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.applyBorderRepulsion();
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let other = particles[j];
        let distance = p5.Vector.dist(p.pos, other.pos);
        if (distance < 150) {
          p.repel(other);
        }
      }
    }
    p.update();
    p.show();
  }
}

class Particle {
  constructor(color){
    this.color = color;
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.size = 5;
  }
  
  applyForce(force) {
    this.accel.add(force);
  }
  
  repel(other) {
    let dir = p5.Vector.sub(other.pos, this.pos);
    let distance = dir.mag();

    if (distance === 0) return; // avoid self or exact overlap

    // Normalize direction
    dir.normalize();

    // Attraction when far apart
    if (distance > 30 && distance < 150) {
      let strength = map(distance, 30, 150, 0.05, 0.001); // stronger when closer (but not too close)
      dir.mult(strength);
      this.applyForce(dir);
    }

    // Repulsion when very close
    if (distance <= 30) {
      let strength = map(distance, 1, 30, 1, 0.05); // strong repulsion up close
      dir.mult(-strength); // repel
      this.applyForce(dir);
    }
  }
  
  applyBorderRepulsion() {
  let margin = 25;
  let strength = 1;

  // Left wall
  if (this.pos.x < margin) {
    let force = (1 - this.pos.x / margin) * strength;
    this.applyForce(createVector(force, 0));
  }

  // Right wall
  if (this.pos.x > width - margin) {
    let dist = width - this.pos.x;
    let force = (1 - dist / margin) * strength;
    this.applyForce(createVector(-force, 0));
  }

  // Top wall
  if (this.pos.y < margin) {
    let force = (1 - this.pos.y / margin) * strength;
    this.applyForce(createVector(0, force));
  }

  // Bottom wall
  if (this.pos.y > height - margin) {
    let dist = height - this.pos.y;
    let force = (1 - dist / margin) * strength;
    this.applyForce(createVector(0, -force));
  }
}
  
  update() {
    this.vel.add(this.accel);
    this.pos.add(this.vel);
    this.accel.mult(0)
    this.vel.limit(1)
    
    
    
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }

    // Bounce off top or bottom
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }
    
    
    /*
    
    if(this.pos.x < 0) this.pos.x = width
    if(this.pos.x > width) this.pos.x = 0
    
    if(this.pos.y < 0) this.pos.y = height
    if(this.pos.y > height) this.pos.y = 0
    */
  }

  show() {
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
  }
}