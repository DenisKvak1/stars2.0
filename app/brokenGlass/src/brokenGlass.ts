import {
  drawImageData,
  iGameController,
  iGlassBrokenLayer, iMeteoriteLayer,
  iObservable,
  layerData,
  PLUGIN_STATE
} from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";
import { fpsTimer } from "../../../env/helpers/fpsTimer";

export class brokenGlass implements iGlassBrokenLayer {
  animate$: iObservable<layerData>;
  name: string;
  state$: iObservable<PLUGIN_STATE>;
  isBroken: boolean;
  private imgBackGround: HTMLImageElement;
  private controller: iGameController;
  private subscribeOnFrame: { unsubscribe: () => void };

  constructor() {
    this.state$ = new Observable<PLUGIN_STATE>(PLUGIN_STATE.INITIALIZED);
    this.name = "glass";
    this.animate$ = new Observable<layerData>();

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
    this.imgBackGround = new Image();
    this.imgBackGround.src = "./assets/images/glass.png";
    const setupHitSubscription = () => {
      const meteoritesPlugin = this.controller.getPlugin("meteorites").plugin as iMeteoriteLayer;
      meteoritesPlugin.hit.subscribe(() => {
        this.isBroken = true;
        fpsTimer(this.controller.frame$, this.controller.targetFps$.getValue(), 3000, ()=>{
          this.isBroken = false
        })
      });
    };

    if (this.controller.pluginsState$.getValue().meteorites === PLUGIN_STATE.READY) {
      setupHitSubscription();
    } else {
      const subscribe = this.controller.pluginsState$.subscribe((event) => {
        if (event.meteorites === PLUGIN_STATE.READY) {
          setupHitSubscription();
          subscribe.unsubscribe();
        }
      });
    }
  }

  private animate():void {
    this.subscribeOnFrame = this.controller.frame$.subscribe(() => {
      if (this.isBroken) {
        let backGround: drawImageData = {
          image: this.imgBackGround,
          x: 0,
          y: 0,
          type: "image",
          height: this.controller.canvas.height,
          width: this.controller.canvas.width
        };
        this.animate$.next([backGround]);
      } else {
        this.animate$.next([]);
      }
    });
  }

  unRegister(): void {
    this.subscribeOnFrame.unsubscribe();
    this.state$.next(PLUGIN_STATE.REMOVED);
  }
}