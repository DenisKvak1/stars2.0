import { iStar } from "../env/types";

export class Star implements iStar{
    private x:number
    private y:number
    private context:CanvasRenderingContext2D
    private radius:number
    private alpha:number
    constructor(context:CanvasRenderingContext2D, startX:number, startY:number, radius:number, alpha:number) {
        this.x = Math.round(startX);
        this.y = Math.round(startY);
        this.context = context;
        this.radius = radius;
        this.alpha = alpha;
        this.draw();
    }

    private draw():void {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        this.context.fill();
        this.context.closePath();
    }

    setX(x:number):void {
        this.x = x;
        this.draw();
    }

    setY(y:number):void {
        this.y = y;
        this.draw();
    }
    moveX(x:number):void{
        this.x +=x
    }
    moveY(y:number):void{
        this.y +=y
    }
    getX():number{
        return this.x
    }
    getY():number{
        return this.y
    }
    getRadius():number{
        return this.radius
    }
    setAlpha(alpha:number):void {
        this.alpha = alpha;
        this.draw();
    }
    addRadius(radius:number):void{
        this.radius += radius;
        this.draw();
    }
    setRadius(radius:number):void{
        this.radius = radius
        this.draw()
    }
}
