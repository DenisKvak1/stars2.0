import { aimStrike, iAim, iAimLayer, iGameController, iObservable, layerData, PLUGIN_STATE } from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";
import { Aim } from "./aim";

export class AimLayer implements iAimLayer {
  animate$: iObservable<layerData>;
  name: string;
  state$: iObservable<PLUGIN_STATE>;
  controller: iGameController;
  strike$: iObservable<aimStrike>
  private subscribeOnFrame: { unsubscribe: () => void };
  private aim: iAim;
  private aimMoveRight: boolean;
  private aimMoveLeft: boolean;
  private aimMoveUp: boolean;
  private aimMoveDown: boolean;
  private readonly aimStartSize:number
  private isAimHover:boolean
  constructor() {
    this.state$ = new Observable<PLUGIN_STATE>(PLUGIN_STATE.INITIALIZED);
    this.name = "aim";
    this.animate$ = new Observable<layerData>();
    this.strike$ = new Observable<aimStrike>()
    this.aimStartSize = 80

    this.aimMoveRight = false;
    this.aimMoveLeft = false;
    this.aimMoveUp = false;
    this.aimMoveDown = false;
  }

  register(controller: iGameController): void {
    this.state$.next(PLUGIN_STATE.ADDED);
    this.state$.next(PLUGIN_STATE.PENDING);
    this.controller = controller;

    this.init();
    this.animate();
    this.state$.next(PLUGIN_STATE.READY);
  }

  private init():void {
    this.aim = new Aim(this.controller.canvas, this.controller.canvas.width / 2, this.controller.canvas.height / 2, 80);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.controller.canvas.addEventListener("mousemove", this.handleEnterAim.bind(this))
  }

  private animate():void {
    this.subscribeOnFrame = this.controller.frame$.subscribe(() => {
      this.aim.setX(this.aim.getX());
      this.aim.setY(this.aim.getY());
      this.aim.setImg("./assets/images/pic1.png");
      this.aim.setSize(this.aimStartSize);

      if (!this.isAimHover) {
        this.aim.setImg('./assets/images/pic1.png');
        this.aim.setSize(this.aimStartSize);
      } else {
        this.aim.setImg('./assets/images/pic2.png');
        this.aim.setSize(this.aimStartSize * 1.1);
      }

      if (this.aimMoveLeft) {
        this.aim.moveLeft((165/this.controller.targetFps$.getValue())*3);
      }
      if (this.aimMoveRight) {
        this.aim.moveRight((165/this.controller.targetFps$.getValue())*3);
      }
      if (this.aimMoveDown) {
        this.aim.moveDown((165/this.controller.targetFps$.getValue())*3);
      }
      if (this.aimMoveUp) {
        this.aim.moveUp((165/this.controller.targetFps$.getValue())*3);
      }
      this.animate$.next([this.aim.element$.getValue()]);
    });
  }
  private handleKeyDown(event:KeyboardEvent):void {
    let keyCode:string = event.key;

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
  handleKeyUp(event:KeyboardEvent):void {
    let keyCode:string = event.key;
    if(keyCode === 'Enter'){
      this.strike$.next({x: this.aim.getX(), y: this.aim.getY(), size: this.aim.getSize()})
    }
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
  handleEnterAim(event:MouseEvent):void{
    const mouseX:number = event.clientX - this.controller.canvas.getBoundingClientRect().left;
    const mouseY:number = event.clientY - this.controller.canvas.getBoundingClientRect().top;

    const aimX:number = this.aim.getX();
    const aimY:number = this.aim.getY();
    const aimRadius:number = 40;

    const distance:number = Math.sqrt((mouseX - aimX) ** 2 + (mouseY - aimY) ** 2);
    if (distance <= aimRadius) {
      if (!this.isAimHover){
        this.isAimHover = true
      }
    } else {
      if(this.isAimHover){
        this.isAimHover = false
      }
    }
  }
  unRegister(): void {
    this.subscribeOnFrame.unsubscribe();
    this.state$.next(PLUGIN_STATE.REMOVED);
  }
}