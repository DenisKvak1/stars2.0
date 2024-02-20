import {
  drawImageData,
  iBackGroundLayer,
  iGameController,
  iObservable,
  layerData,
  PLUGIN_STATE
} from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";

export class BackgroundLayer implements iBackGroundLayer{
  name: string;
  animate$: iObservable<layerData>;
  state$: iObservable<PLUGIN_STATE>;
  imgBackGround: HTMLImageElement
  private controller: iGameController
  private subscribeOnFrame: {unsubscribe: ()=>void}
  constructor() {
    this.state$ = new Observable<PLUGIN_STATE>(PLUGIN_STATE.INITIALIZED);
    this.name = 'background'
    this.animate$ = new Observable<layerData>();
  }

  register(controller: iGameController): void {
    this.state$.next(PLUGIN_STATE.ADDED)
    this.state$.next(PLUGIN_STATE.PENDING);
    this.controller = controller

    this.init()
    this.animate()
    this.state$.next(PLUGIN_STATE.READY)
  }
  private init(){
    this.imgBackGround = new Image();
    this.imgBackGround.src = './assets/images/back.jpg';
  }
  private animate(){
    this.subscribeOnFrame = this.controller.frame$.subscribe(()=>{
      let backGround:drawImageData = { image: this.imgBackGround, x: 0, y: 0, type:"image" }
      this.animate$.next([backGround])
    })
  }

  unRegister(): void {
    this.subscribeOnFrame.unsubscribe()
    this.state$.next(PLUGIN_STATE.REMOVED)
  }
}