let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let mouse = { x: 0, y: 0 }
let defualt = { x: 500, y: 500 }

class Player {
    constructor() {
        this.x = 0
        this.y = 0
        this.dir = 360
    }
    draw() {
        // this.dir %= 360
        ctx.beginPath() 
        ctx.fillStyle = "#3366ff"
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir))*100,      defualt.y + Math.cos(degToRad(this.dir))*100);
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir+120))*100,  defualt.y + Math.cos(degToRad(this.dir+120))*100);
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir+240))*100,  defualt.y + Math.cos(degToRad(this.dir+240))*100);
        ctx.fill()
    }

    getX() { return this.x+defualt.x }
    getY() { return this.y+defualt.y }
}

class Bullet {
    constructor() {
        this.s = 10;
        this.x = -this.s/2;
        this.y = -this.s/2;
        this.seeX = player.getX() - mouse.x;
        this.seeY = player.getY() - mouse.y;
    }
    
    draw() {
        ctx.fillStyle="#3366ff"
        ctx.fillRect(player.getX()+this.x, player.getY()+this.y, 10, 10);
    }
    run() {
        this.x -= this.seeX/30;
        this.y -= this.seeY/30;
    }
    
    getX() { return this.x+defualt.x }
    getY() { return this.y+defualt.y }

}

const degToRad = d => d / 180 * Math.PI;
const radToDeg = d => d * 180 / Math.PI;

let player = new Player();
/** @type {Array<Bullet>} */
let bullet = []

const loop = () => {
    ctx.clearRect(0, 0, 5000, 5000)
    player.draw()
    if (player.getY() < mouse.y)player.dir = radToDeg(Math.atan((player.getX() - mouse.x) / (player.getY() - mouse.y)))
    else player.dir = radToDeg(Math.atan((player.getX() - mouse.x) / (player.getY() - mouse.y))) + 180;
    
    // player.dir += 0.1

    bullet.forEach(e => {
        e.run();
        e.draw();
    })
    if (bullet[0] != undefined){
        if (bullet[0].getX() < -100 || bullet[0].getX() > 5000) bullet.shift()
    }
    
    requestAnimationFrame(loop)
}

document.body.addEventListener("mousedown", () => {
    bullet.push(new Bullet())

})
document.body.addEventListener("mousemove", (e) => {

    mouse.x = e.offsetX
    mouse.y = e.offsetY

})
loop()

