import {
  iAimLayer,
  iGameController,
  iMeteorite,
  iMeteoriteLayer,
  iObservable,
  layerData,
  PLUGIN_STATE,
  pluginSTATEList
} from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";
import { getRandomNumber } from "../../../env/helpers/helpers";
import { Meteorite } from "./meteorite";
import { fpsInterval, fpsTimer } from "../../../env/helpers/fpsTimer";

export class MeteoriteLayer implements iMeteoriteLayer {
  animate$: iObservable<layerData>;
  name: string;
  state$: iObservable<PLUGIN_STATE>;
  private meteorites: Array<iMeteorite>;
  private controller: iGameController;
  hit: iObservable<null>
  private subscribeOnFrame: { unsubscribe: () => void };

  constructor() {
    this.state$ = new Observable<PLUGIN_STATE>(PLUGIN_STATE.INITIALIZED);
    this.name = "meteorites";
    this.hit = new Observable<null>()
    this.animate$ = new Observable<layerData>();
    this.meteorites = [];
  }

  register(controller: iGameController): void {
    this.state$.next(PLUGIN_STATE.ADDED);
    this.state$.next(PLUGIN_STATE.PENDING);
    this.controller = controller;

    this.init();
    this.animate();
    this.state$.next(PLUGIN_STATE.READY);
  }

  private init() {
    fpsInterval(this.controller.frame$, this.controller.targetFps$.getValue(), 10000, ()=>{
      this.generateMeteorites();
    })
    this.knockingMeteorites();
  }

  private animate() {
    this.subscribeOnFrame = this.controller.frame$.subscribe(() => {
      this.meteorites.forEach((meteorite) => {
        meteorite.addSize((165/this.controller.targetFps$.getValue())*0.2);
        if (meteorite.getSize() > 150) {
          let index: number = this.meteorites.findIndex((item) => item.getX() === meteorite.getX() && item.getY() === meteorite.getY());
          this.meteorites.splice(index, 1);
          this.hit.next()
        }
      });
      this.animate$.next(this.meteorites.map((item) => item.element$.getValue()));
    });
  }

  unRegister(): void {
    this.subscribeOnFrame.unsubscribe();
    this.state$.next(PLUGIN_STATE.REMOVED);
  }

  private generateMeteorites(): void {
    let size: number = 30;
    let count: number = getRandomNumber(1, 5);

    for (let index = 0; index < count; index++) {
      fpsTimer(this.controller.frame$, this.controller.targetFps$.getValue(), getRandomNumber(0,3000), ()=>{
        let meteorite: iMeteorite = new Meteorite(
          getRandomNumber(0 + size, this.controller.canvas.width - size),
          getRandomNumber(0 + size, this.controller.canvas.height - size),
          size
        );
        this.meteorites.push(meteorite)
      })
    }
  }

  private knockingMeteorites(): void {
    let handlerKnock = () => {
      let aim: iAimLayer;
      let aimInfo = this.controller.getPlugin("aim");

      aim = aimInfo.plugin as iAimLayer;
      aim.strike$.subscribe((event) => {
        const aimX: number = event.x;
        const aimY: number = event.y;
        const aimRadius: number = event.size / 3;

        const targetMeteorite = this.meteorites.find((meteorite) => {
          const x: number = meteorite.getX();
          const y: number = meteorite.getY();
          const size: number = meteorite.getSize();
          const closestX: number = Math.max(x - size / 2, Math.min(aimX, x + size / 2));
          const closestY: number = Math.max(y - size / 2, Math.min(aimY, y + size / 2));
          const distance: number = Math.sqrt((aimX - closestX) ** 2 + (aimY - closestY) ** 2);
          return distance <= aimRadius;
        });

        if (targetMeteorite) {
          this.meteorites.splice(this.meteorites.indexOf(targetMeteorite), 1);
        }
      });
    };
    if (this.controller.pluginsState$.getValue().aim === PLUGIN_STATE.READY) {
      handlerKnock()
    } else {
      let pluginStateSubscribe = this.controller.pluginsState$.subscribe((event: pluginSTATEList) => {
        if (event.aim === PLUGIN_STATE.READY) {
          handlerKnock()
          pluginStateSubscribe.unsubscribe();
        }
      });
    }
  }
}