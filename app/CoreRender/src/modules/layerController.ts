import { Observable } from "../../../../env/helpers/observable";
import { iCoreRender, iGameController, iLayerController, iObservable, layersData } from "../../../../env/types";
import { CoreRender } from "./CoreRender";
import { calculateRefreshRate } from "../../../../env/helpers/helpers";

export class LayerController implements iLayerController {
  frame$: iObservable<null>;
  layersData: layersData;
  coreRender: iCoreRender;
  targetFps$: iObservable<number>;

  constructor(controller: iGameController) {
    this.targetFps$ = new Observable<number>()
    this.frame$ = new Observable<null>();
    this.coreRender = new CoreRender(controller.canvasId);
    this.layersData = controller.layersData$.getValue();
    controller.layersData$.subscribe((data) => this.layersData = data);
    this.render();
  }

  private render() {
    calculateRefreshRate().then((fps) => {
      this.targetFps$.next(fps)
      let animate = () => {
        this.coreRender.clearArea();
        for (let i = 0; i < this.layersData.length; i++) {
          let layer = this.layersData[i];
          this.coreRender.renderLayer(layer);
        }
        this.frame$.next();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }
}