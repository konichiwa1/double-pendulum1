let canvas = document.getElementById("canvas");
let angle1 = document.getElementById("angle1");
let angle2 = document.getElementById("angle2");
let angleBtn = document.getElementById("angleBtn");

let ctx;
let p1, p2;
let g = 1;
let sin = Math.sin;
let cos = Math.cos;
const PI = Math.PI;
let ang1=PI/2, ang2=0;

let curve = [];

class Pendulum{
    constructor(x, y, length, radius, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.length = length;
        this.angle = angle;         // with vertical
        this.omega = 0;
        this.alpha = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+this.length*Math.sin(this.angle), this.y+this.length*Math.cos(this.angle));
        ctx.lineWidth = "2";
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x+this.length*Math.sin(this.angle), this.y+this.length*Math.cos(this.angle), this.radius, 0, 2*Math.PI, false);
        ctx.fillStyle = "blue";
        ctx.fill();
    }

    update() {
        this.draw();
    }
}

function init() {
    ctx = canvas.getContext("2d");
    curve = [];
    p1 = new Pendulum(canvas.width/2, canvas.height/12, canvas.height*(5/12), 20, ang1);
    p2 = new Pendulum(p1.x+p1.length*Math.sin(p1.angle), p1.y+p1.length*Math.cos(p1.angle), canvas.height*(6/13), 20, ang2);
    curve.push({x:p2.x+p2.length*sin(p2.angle), y:p2.y+p2.length*cos(p2.angle)});
}

function animate() {
    window.requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    p1.alpha = (-g*3*sin(p1.angle)-g*sin(p1.angle-2*p2.angle)-2*sin(p1.angle-p2.angle)*(p2.omega*p2.omega*p2.length+p1.omega*p1.omega*p1.length*cos(p1.angle-p2.angle)))/(p1.length*(3-cos(2*p1.angle-2*p2.angle)));
    p2.alpha = (2*sin(p1.angle-p2.angle)*(p1.omega*p1.omega*2*p1.length+2*g*cos(p1.angle)+p2.omega*p2.omega*p2.length*cos(p1.angle-p2.angle)))/(p2.length*(3-cos(2*p1.angle-2*p2.angle)));
    
    p1.omega += p1.alpha;
    p2.omega += p2.alpha;
    p1.angle += p1.omega;
    p2.angle += p2.omega;

    p2.x = p1.x+p1.length*sin(p1.angle);
    p2.y = p1.y+p1.length*cos(p1.angle);
    curve.push({x:p2.x+p2.length*sin(p2.angle), y:p2.y+p2.length*cos(p2.angle)});
    drawCurve();
    p1.update();
    p2.update();
    //p2.update();
}

function drawCurve() {
    ctx.beginPath();
    ctx.moveTo(curve[0].x, curve[0].y);
    for(let i=1; i<curve.length; i++) {
        ctx.lineTo(curve[i].x, curve[i].y);
    }
    ctx.lineWidth = "1";
    ctx.strokeStyle = "green";
    ctx.stroke();
}

window.onload = window.onresize = () => {
    canvas.height = 0.8*window.innerHeight;
    canvas.width = 0.97*window.innerWidth;

    init();
}

angleBtn.onclick = () => {
    ang1 = parseFloat(angle1.value);
    ang2 = parseFloat(angle2.value);
    console.log(angle1.value);
    init();
}

init();
animate();
