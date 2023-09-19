let debug = false;
let LIMIT = 1000
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const gameover = document.querySelector("div")
const KEY = ""
fetch("https://api.keywordad.kakao.com/openapi/v1/adAccounts", {method: "GET", headers: {"Authorization": KEY}});

let shakePos = {
    x: 0,
    y: 0
}
let canvasPos = {
    x: 0,
    y: 0
}

let mouse = {
    x: 0,
    y: 0
}
let bs = 0;

function shake(power){
    if (power == undefined){ power = 100 }
    let repeat = 2;
    for (let i = 0; i<repeat; i++){
        setTimeout(() => {
            if (i == repeat-1){
                console.log("end")
                shakePos.y = 0
                shakePos.x = 0
            }else{
                shakePos.y = Math.random()*power * (Math.round(Math.random())?-1:1)
                shakePos.x = Math.random()*power * (Math.round(Math.random())?-1:1)
            }
        
        }, 50 * i)
    }
}

let defualt = { x: 500, y: 500 }
// w a s d
let keys = [null, null, null, null]
class Player {
    constructor() {
        this.r = 50
        this.hp = 100;
        this.x = 0
        this.y = 0
        this.dir = 360
    }
    draw() {
        if (player.hp < 0) player.hp = 0
        if (player.hp > bs) bs = Math.round(player.hp)
        // this.dir %= 360
        let spd = 5;
        if (keys.includes("w")) this.y += spd
        if (keys.includes("s")) this.y -= spd
        if (keys.includes("a")) this.x += spd
        if (keys.includes("d")) this.x -= spd
        ctx.beginPath() 
        ctx.fillStyle = "#c6a0f6"
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir))*100,      defualt.y + Math.cos(degToRad(this.dir))*100);
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir+120))*100,  defualt.y + Math.cos(degToRad(this.dir+120))*100);
        ctx.lineTo(defualt.x + Math.sin(degToRad(this.dir+240))*100,  defualt.y + Math.cos(degToRad(this.dir+240))*100);
        ctx.fill()
        if (debug){
            ctx.beginPath() 
            ctx.fillStyle = "red"
            ctx.arc(defualt.x, defualt.y, this.r, 0, 2 * Math.PI);
            ctx.fill()
        }
    }

    getX() { return defualt.x+this.x }
    getY() { return defualt.y+this.y }
}
mouse.getX = () => {
    defualt.x + mouse.x
}
mouse.getY = () => {
    defualt.x + mouse.y
}
class DeleteEffect{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} todoR 
     */
    constructor(x, y, todoR) {
        this.r = todoR;
        this.todoR = todoR*3;
        this.x = x;
        this.y = y;
        this.cnt = 0;
    }
    
    draw() {
        if (this.x == 999999 && this.y == 999999) return
        if (this.cnt >= 10){
            this.delete()
            return
        }
        this.r += (this.todoR-this.r)/30
        ctx.beginPath()
        ctx.fillStyle=`rgba(245, 169, 127, ${1 - this.cnt/10})`
        ctx.arc(this.getX(), this.getY(), this.r, 0, 2 * Math.PI);
        ctx.fill()
        this.cnt += 1;
        // ctx.fillRect(player.getX()+this.x, player.getY()+this.y, 10, 10);
    }


    getX() { return this.x+player.getX() }
    getY() { return this.y+player.getY() }

    delete(){
        this.seeX = 0;
        this.seeY = 0;
        this.x = 999999;
        this.y = 999999;
    }
}
class Bullet {
    constructor() {
        shake()
        this.r = 10;
        this.x = player.x;
        this.y = player.y;
        this.seeX = defualt.x - mouse.x;
        this.seeY = defualt.y - mouse.y;
        player.hp -= 10
    }
    
    draw() {
        if (this.x == 999999 && this.y == 999999) return
        ctx.beginPath()
        ctx.fillStyle="#c6a0f6"
        ctx.arc(this.getX(), this.getY(), this.r, 0, 2 * Math.PI);
        ctx.fill()
        // ctx.fillRect(player.getX()+this.x, player.getY()+this.y, 10, 10);
    }
    run() {
        this.x += this.seeX/30;
        this.y += this.seeY/30;
    }
    
    getX() { return player.getX() - this.x }
    getY() { return player.getY() - this.y }

    
    getSeeX() { return this.x+player.getX() }
    getSeeY() { return this.y+player.getY() }

    delete(){        
        this.seeX = 0;
        this.seeY = 0;
        this.x = 999999;
        this.y = 999999;
    }
}

class Planet {
    constructor(){
        this.moveCnt = 0;
        
        this.r = Math.random() * 200;
        this.x = -player.getX() + defualt.x + Math.random()*3000 * (Math.round(Math.random())?-1:1);
        this.y = -player.getY() + defualt.y + Math.random()*1000 * (Math.round(Math.random())?-1:1);
        this.hp = this.r;
        this.color = 0;

        this.seeX = (Math.random()*1000 * (Math.round(Math.random())?-1:1)) / this.r*10;
        this.seeY = (Math.random()*1000 * (Math.round(Math.random())?-1:1)) / this.r*10;
        // this.seeX = 0;
        // this.seeY = 0;
        // console.log(this.x, this.y)
        // console.log(this.r)
    }

    draw() {
        // if (this.x < LIMIT)
        if (this.x == 999999 && this.y == 999999) return
        ctx.beginPath()
        this.color += -this.color/30
        ctx.fillStyle=`rgb(${this.color+238}, ${this.color+212}, ${this.color+159})`
        ctx.arc(player.getX()+this.x, player.getY()+this.y, this.r, 0, 2 * Math.PI);
        ctx.fill()

        if (debug){
            ctx.beginPath()
            this.color += -this.color/10
            ctx.lineTo(defualt.x, defualt.y)
            ctx.lineTo(player.getX()+this.x, player.getY()+this.y)
            ctx.stroke()
        }
    }

    run() {
        if (this.seeX == 0 && this.seeY == 0) return
        this.moveCnt += 1
        this.x -= this.seeX/100;
        this.y -= this.seeY/100;

        let hypo2 = Math.pow(this.getSeeX()-defualt.x, 2) + Math.pow(this.getSeeY()-defualt.y, 2)
        if (hypo2 <= Math.pow(player.r + this.r, 2)) {
            this.delete()
            player.hp -= this.hp
            console.log("collider")
        }
    }


    delete(){
        if (this.seeX == 0 && this.seeY == 0) return
        effect.push(new DeleteEffect(this.x, this.y, this.r))
        this.seeX = 0;
        this.seeY = 0;
        this.x = 999999;
        this.y = 999999;
        shake(this.r*10)
    }

    /**
     * 
     * @param {Bullet} bullet 
     */
    collider(bullet) {
        if (this.seeX == 0 && this.seeY == 0) return
        let hypo = Math.pow(this.getX()-bullet.getX(), 2) + Math.pow(this.getY()-bullet.getY(), 2)
        if (hypo <= Math.pow(bullet.r + this.r, 2)) {
            this.hp -= 10
            console.log("collider")
            bullet.delete()
            this.color=96
            if (this.hp < 0) {
                player.hp += this.r*1.2
                this.delete()
            }
        }
    }

    getX() { return this.x+player.getX() }
    getY() { return this.y+player.getY() }

    
    getSeeX() { return player.getX() + this.x }
    getSeeY() { return player.getY() + this.y }
}

const degToRad = d => d / 180 * Math.PI;
const radToDeg = d => d * 180 / Math.PI;

let player = new Player();
/** @type {Array<Bullet>} */
let bullet = []

/** @type {Array<Planet>} */
let planet = [];

/** @type {Array<DeleteEffect>} */
let effect = [];

const genPlanet = () => {
    if (planet.length < LIMIT){
        planet.push(new Planet())
    }
    setTimeout(genPlanet, 1000)
}

const loop = () => {
    defualt.x = 500 + canvasPos.x
    defualt.y = 500 + canvasPos.y
    canvasPos.x += (shakePos.x-canvasPos.x)/30
    canvasPos.y += (shakePos.y-canvasPos.y)/30
    canvas.style.left = `${canvasPos.x}px`
    ctx.clearRect(0, 0, 5000, 5000)
    
    if (defualt.y < mouse.y)player.dir = radToDeg(Math.atan((defualt.x - mouse.x) / (defualt.y - mouse.y)))
    else player.dir = radToDeg(Math.atan((defualt.x - mouse.x) / (defualt.y - mouse.y))) + 180;
    
    // player.dir += 0.1

    bullet.forEach(e => {
        e.run();
        e.draw();
        if (Math.abs(e.x - player.x) >= 5000 || Math.abs(e.y - player.y) >= 5000) e.delete()
        planet.forEach(p => {
            p.collider(e)
            if (p.getSeeX() <= -500 && p.hp >= -1000) { p.hp = -10000 }
        })
    })
    if (bullet[0] != undefined){
        if (bullet[0].x == 999999 && bullet[0].y == 999999) bullet.shift()
    }

    if (effect[0] != undefined){
        if (effect[0].x == 999999 && effect[0].y == 999999) effect.shift()
    }
    
    
    planet.forEach(p => {
        if (p.moveCnt > 10000) p.delete()
        p.run()
        p.draw()
    })
    effect.forEach(e => {
        e.draw()
    })
    if (player.hp <= 0){ player.hp = 0 }
    if (player.hp <= 0){
        ctx.clearRect(0, 0, 5000, 5000)
        gameover.style.display="flex"
        gameover.innerHTML += `<h2>Best Score: ${bs}</h2>`
        document.getElementById("hp").style.display="none"
        return
    }

    document.getElementById("hp").innerHTML = Math.round(player.hp)

    player.draw()

    requestAnimationFrame(loop)
}

document.body.addEventListener("mousedown", () => {
    bullet.push(new Bullet())

})
document.body.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})

document.body.addEventListener("keydown" , e => {
    if (e.key == "w")keys[0] = "w"
    if (e.key == "a")keys[1] = "a"
    if (e.key == "s")keys[2] = "s"
    if (e.key == "d")keys[3] = "d"
})

document.body.addEventListener("keyup" , e => {
    if (e.key == "w")keys[0] = null
    if (e.key == "a")keys[1] = null
    if (e.key == "s")keys[2] = null
    if (e.key == "d")keys[3] = null
})

genPlanet()
loop()

