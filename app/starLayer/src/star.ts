import { CircleData,iObservable, iStar } from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";

export class Star implements iStar{
    private x:number
    private y:number
    private radius:number
    private alpha:number
    element$: iObservable<CircleData>
    constructor(startX:number, startY:number, radius:number, alpha:number) {
        this.x = Math.round(startX);
        this.y = Math.round(startY);
        this.element$ = new Observable<CircleData>()
        this.radius = radius;
        this.alpha = alpha;
        this.draw();
    }

    private draw():void {
        this.element$.next({type:"circle", x:this.x, y:this.y, radius:this.radius, color: `rgba(255, 255, 255, ${this.alpha})`})
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
