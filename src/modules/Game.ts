import { Aim } from "./aim";
import { Star } from "./star";
import { Meteorite } from "./meteorite";
import { iAim, iMeteorite, iStar } from "../env/types";

export class Game {
  canvas:HTMLCanvasElement
  context: CanvasRenderingContext2D
  speed:number
  aimStartSize:number
  flagCircle: number
  aimFlag: boolean
  stars:Array<iStar>
  meteorites:Array<iMeteorite>
  aim: iAim
  aimMoveRight:boolean
  aimMoveLeft:boolean
  aimMoveUp:boolean
  aimMoveDown:boolean
  imgBackGround:HTMLImageElement
  isBrokenGlass:boolean
  constructor(idCanvas:string, speed:number = 0.65) {
    this.canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.speed = speed;
    this.aimStartSize = 80;
    this.aimFlag = false;
    this.stars = [];
    this.meteorites = [];
    this.aim = null;
    this.aimMoveRight = false;
    this.aimMoveLeft = false;
    this.aimMoveUp = false;
    this.aimMoveDown = false;
    this.imgBackGround = null;
    this.isBrokenGlass = false;

    this.initAim();
    this.initBackGround();

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.canvas.addEventListener("mousemove", this.handleEnterAim.bind(this));
    setInterval(():void => {
      this.generateStars();
    }, 80);

    setInterval(():void => {
      this.generateMeteorites();
    }, 10000);

    requestAnimationFrame(this.animate.bind(this));

    setInterval(():void => {
      this.turnLeft();
      setTimeout(():void => {
        this.turnRight();
        setTimeout(():void => {
          this.turnStop();
        }, 3000);
      }, 3000);
    }, 9000);
  }

  initAim():void {
    this.aim = new Aim(this.canvas, this.context, 250, 250, 80);
    this.aimMoveRight = false;
    this.aimMoveLeft = false;
    this.aimMoveUp = false;
    this.aimMoveDown = false;
  }

  initBackGround():void {
    this.imgBackGround = new Image();
    this.imgBackGround.src = './assets/images/back.jpg';
  }

  getRandomNumber(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calculatePointOnRing(centerX:number, centerY:number, radius:number, t:number): { x: number; y: number } {
    let ringWidth = this.getRandomNumber(0, 40);
    const x: number = centerX + (radius + ringWidth / 2) * Math.cos(t);
    const y: number = centerY + (radius + ringWidth / 2) * Math.sin(t);
    return { x, y };
  }


  distanceBetweenPoints(x:number, y:number, cx:number, cy:number):number {
    return Math.sqrt(Math.pow((x - cx), 2) + Math.pow((y - cy), 2));
  }

  turnLeft():void {
    this.flagCircle = 1;
  }

  turnRight():void {
    this.flagCircle = 2;
  }

  turnStop():void {
    this.flagCircle = 0;
  }

  animateStar(star:iStar) {
    let startRadius:number = 1;
  
    let cx:number = this.canvas.width / 2;
    let cy:number = this.canvas.width / 2;
    let theta:number = Math.atan2(star.getY() - cy, star.getX() - cx);
    let alpha:number = 1 / (startRadius * 2.3 / (star.getRadius() * 1.1));
  
    if (this.flagCircle) {
      if (this.flagCircle === 1) {
        theta += 0.01;
      }
      if (this.flagCircle === 2) {
        theta -= 0.01;
      }
      let r:number = this.distanceBetweenPoints(star.getX(), star.getY(), cx, cy);
      star.setX(cx + r * Math.cos(theta));
      star.setY(cy + r * Math.sin(theta));
    } else {
      theta += 0.01;
    }
  
    star.setAlpha(alpha > 1 ? 1 : alpha);
    if (!(star.getRadius() > startRadius * 2.3)) {
      star.addRadius(startRadius / (this.canvas.width / 2 / this.speed) * 2.3);
    }
    let radius:number = star.getRadius();
    star.moveX(this.speed * Math.cos(theta));
    star.moveY(this.speed * Math.sin(theta));
  
    let x:number = star.getX();
    let y:number = star.getY();
  
    if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
      this.context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
      let index = this.stars.findIndex((item) => item.getX() === star.getX() && item.getY() === star.getY());
      this.stars.splice(index, 1);
    }
  }
  

  animateMeteorite(meteorite:iMeteorite) {
    meteorite.addSize(0.2);
    if (meteorite.getSize() > 150) {
      let index:number = this.meteorites.findIndex((item) => item.getX() === meteorite.getX() && item.getY() === meteorite.getY());
      this.meteorites.splice(index, 1);
      this.isBrokenGlass = true;
      setTimeout(() => (this.isBrokenGlass = false), 2500);
    }
  }

  animateBackGround() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.imgBackGround, 0, 0, this.canvas.width, this.canvas.height);
  }

  brokenGlass() {
    if (this.isBrokenGlass) {
      let img:HTMLImageElement = new Image();
      img.src = './assets/images/glass.png';
      this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  animateAim() {
    this.aim.setX(this.aim.getX());
    this.aim.setY(this.aim.getY());
    if (!this.aimFlag) {
      this.aim.setImg('./assets/images/pic1.png');
      this.aim.setSize(this.aimStartSize);
    } else {
      this.aim.setImg('./assets/images/pic2.png');
      this.aim.setSize(this.aimStartSize * 1.2);
    }

    if (this.aimMoveLeft) {
      this.aim.moveLeft(3);
    }
    if (this.aimMoveRight) {
      this.aim.moveRight(3);
    }
    if (this.aimMoveDown) {
      this.aim.moveDown(3);
    }
    if (this.aimMoveUp) {
      this.aim.moveUp(3);
    }
  }

  drawAllStars() {
    this.stars.forEach((star) => {
      this.animateStar(star);
    });
  }

  drawAllMeteorites() {
    this.meteorites.forEach((meteorite) => {
      this.animateMeteorite(meteorite);
    });
  }

  generateStars() {
    let star:iStar = this.createRandomStar();
    this.stars.push(star);
  }

  createRandomStar() {
    let trend:number = this.getRandomNumber(0, 360);
    let { x, y } = this.calculatePointOnRing(this.canvas.width / 2, this.canvas.height / 2, 35, (trend * Math.PI) / 180);
    return new Star(this.context, x, y, 1, 0);
  }

  generateMeteorites() {
    let size:number = 30;
    let count:number = this.getRandomNumber(1, 5);

    for (let index = 0; index < count; index++) {
      setTimeout(() => {
        let meteorite:iMeteorite = new Meteorite(
          this.context,
          this.getRandomNumber(0 + size, this.canvas.width - size),
          this.getRandomNumber(0 + size, this.canvas.height - size),
          size
        );
        this.meteorites.push(meteorite);
      }, this.getRandomNumber(0, 3000));
    }
  }

  handleKeyDown(event:KeyboardEvent) {
    let keyCode = event.key;
    if (event.key === 'Enter' && this.meteorites.length > 0) {
      const aimX:number = this.aim.getX();
      const aimY:number = this.aim.getY();
      const aimRadius:number = this.aim.getSize() / 3;

      const targetMeteorite = this.meteorites.find((meteorite) => {
        const x:number = meteorite.getX()
        const y:number = meteorite.getY()
        const size:number = meteorite.getSize()
        const closestX:number = Math.max(x - size / 2, Math.min(aimX, x + size / 2));
        const closestY:number = Math.max(y - size / 2, Math.min(aimY, y + size / 2));
        const distance:number = Math.sqrt((aimX - closestX) ** 2 + (aimY - closestY) ** 2);
        return distance <= aimRadius;
      });

      if (targetMeteorite) {
        this.meteorites.splice(this.meteorites.indexOf(targetMeteorite), 1);
      }
    }

    switch (keyCode) {
      case 'ArrowRight':
        this.aimMoveRight = true;
        break;
      case 'ArrowLeft':
        this.aimMoveLeft = true;
        break;
      case 'ArrowUp':
        this.aimMoveUp = true;
        break;
      case 'ArrowDown':
        this.aimMoveDown = true;
        break;
    }
  }

  handleKeyUp(event:KeyboardEvent) {
    let keyCode:string = event.key;
    switch (keyCode) {
      case 'ArrowRight':
        this.aimMoveRight = false;
        break;
      case 'ArrowLeft':
        this.aimMoveLeft = false;
        break;
      case 'ArrowUp':
        this.aimMoveUp = false;
        break;
      case 'ArrowDown':
        this.aimMoveDown = false;
        break;
    }
  }
  handleEnterAim(event: MouseEvent) {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    const aimX = this.aim.getX();
    const aimY = this.aim.getY();
    const aimRadius = 40;

    const distance = Math.sqrt((mouseX - aimX) ** 2 + (mouseY - aimY) ** 2);
    if (distance <= aimRadius) {
      if (!this.aimFlag){
        this.aimFlag = true
      }
    } else {
      if(this.aimFlag){
        this.aimFlag = false
      }
    }
  }

  animate() {
    this.animateBackGround();
    this.drawAllStars();
    this.drawAllMeteorites();
    this.animateAim();
    this.brokenGlass();
    requestAnimationFrame(this.animate.bind(this));
  }
}

