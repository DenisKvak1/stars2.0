import {
  iGameController,
  iObservable,
  iStar,
  iStarLayer,
  layerData,
  PLUGIN_STATE,
  spinDirection
} from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";
import { calculatePointOnRing, distanceBetweenPoints, getRandomNumber } from "../../../env/helpers/helpers";
import { Star } from "./star";
import { fpsInterval } from "../../../env/helpers/fpsTimer";

export class StarLayer implements iStarLayer {
  animate$: iObservable<layerData>;
  name: string;
  state$: iObservable<PLUGIN_STATE>;
  private controller: iGameController
  private subscribeOnFrame: {unsubscribe: ()=>void}
  private stars: Array<iStar>
  private spinDirection: spinDirection
  private speed:number
  constructor() {
    this.animate$ = new Observable<layerData>();
    this.state$ = new Observable<PLUGIN_STATE>(PLUGIN_STATE.INITIALIZED);
    this.name = 'stars'
  }

  register(controller: iGameController):void {
    this.controller = controller
    this.state$.next(PLUGIN_STATE.ADDED)
    this.state$.next(PLUGIN_STATE.PENDING);
    this.init()
    this.animate()
    this.state$.next(PLUGIN_STATE.READY)
  }

  private init():void {
    this.speed = 0.65
    this.controller.targetFps$.subscribe(()=>{
      this.speed = 165/this.controller.targetFps$.getValue() * 0.65
    })
    this.spinDirection = spinDirection.NONE
    this.stars = []
    fpsInterval(this.controller.frame$, this.controller.targetFps$.getValue(), 80, ()=>{
      this.createRandomStar();
    })
    /// DEMO VERSION
    setInterval(():void => {
      this.spinDirection = spinDirection.LEFT
      setTimeout(():void => {
        this.spinDirection = spinDirection.RIGHT
        setTimeout(():void => {
          this.spinDirection = spinDirection.NONE
        }, 3000);
      }, 3000);
    }, 9000);
    /////
  }

  private animate():void {
    this.subscribeOnFrame = this.controller.frame$.subscribe(()=>{

      this.stars.forEach((star) => {
        let startRadius: number = 1;

        let cx: number = this.controller.canvas.width / 2;
        let cy: number = this.controller.canvas.width / 2;
        let theta: number = Math.atan2(star.getY() - cy, star.getX() - cx);
        let alpha: number = 1 / (startRadius * 2.3 / (star.getRadius() * 1.05));

        if (this.spinDirection !== spinDirection.NONE) {
          if (this.spinDirection === spinDirection.RIGHT) {
            theta += (165/this.controller.targetFps$.getValue())*0.01;
          }
          if (this.spinDirection === spinDirection.LEFT) {
            theta -= (165/this.controller.targetFps$.getValue())*0.01;
          }
          let r: number = distanceBetweenPoints(star.getX(), star.getY(), cx, cy);
          star.setX(cx + r * Math.cos(theta));
          star.setY(cy + r * Math.sin(theta));
        } else {
          theta += (165/this.controller.targetFps$.getValue())*0.01
        }

        star.setAlpha(alpha > 1 ? 1 : alpha);
        if (!(star.getRadius() > startRadius * 2.3)) {
          star.addRadius(startRadius / (this.controller.canvas.width / 2 / this.speed) * 2.1);
        }
        star.moveX(this.speed * Math.cos(theta));
        star.moveY(this.speed * Math.sin(theta));

        let x: number = star.getX();
        let y: number = star.getY();

        if (x < 0 || x > this.controller.canvas.width || y < 0 || y > this.controller.canvas.height) {
          let index = this.stars.findIndex((item) => item.getX() === star.getX() && item.getY() === star.getY());
          this.stars.splice(index, 1);
        }
      });
      this.animate$.next(this.stars.map((item)=> item.element$.getValue()))
    })
  }
  private createRandomStar():void {
    let trend:number = getRandomNumber(0, 360);
    let { x, y }:Record<string, number> = calculatePointOnRing(this.controller.canvas.width / 2, this.controller.canvas.height / 2, 35, (trend * Math.PI) / 180);
    let star:iStar = new Star(x, y, 1, 0);
    this.stars.push(star);
  }
  unRegister(): void {
    this.subscribeOnFrame.unsubscribe()
    this.state$.next(PLUGIN_STATE.REMOVED)
  }
}