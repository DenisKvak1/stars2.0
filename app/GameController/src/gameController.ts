import { LayerController } from "../../CoreRender/src/modules/layerController";
import { Observable } from "../../../env/helpers/observable";
import {
  iGameController,
  iLayerController,
  iObservable,
  iPlugin, IPluginInfo,
  layersData,
  pluginList, pluginPriorityList, pluginSTATEList
} from "../../../env/types";

export class GameController implements iGameController {
  canvasId: string;
  layersData$: iObservable<layersData>;
  layerController: iLayerController;
  plugins: pluginList;
  private readonly pluginsPriority: pluginPriorityList;
  pluginsState$: iObservable<pluginSTATEList>;
  private readonly stateSubscribe: Record<string, { unsubscribe: () => void }>;
  frame$: iObservable<null>;
  canvas: HTMLCanvasElement;
  targetFps$: iObservable<number>;

  constructor(canvasId: string) {
    this.canvasId = canvasId;
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas = canvas;
    this.frame$ = new Observable<null>();
    this.targetFps$ = new Observable<number>();

    this.pluginsState$ = new Observable<pluginSTATEList>();
    this.stateSubscribe = {
      stars: null,
      meteorites: null,
      aim: null,
      background: null,
      glass: null
    };
    this.pluginsState$.setValue({
      stars: null,
      meteorites: null,
      aim: null,
      background: null,
      glass: null
    });
    this.plugins = {
      stars: null,
      meteorites: null,
      aim: null,
      background: null,
      glass: null
    };
    this.pluginsPriority = {
      background: 0,
      stars: 1,
      meteorites: 2,
      aim: 3,
      glass: 4
    };
    let startLayersDataValue: layersData = Object.keys(this.plugins).map(() => []);
    this.layersData$ = new Observable<layersData>(startLayersDataValue);
    this.layerController = new LayerController(this);

    this.layerController.targetFps$.subscribe((fps) => {
      this.targetFps$.next(fps);
    });

    this.layerController.frame$.subscribe(() => {
      this.frame$.next();
      let newLayerData = this.layersData$.getValue();
      for (let key in this.plugins) {
        if (this.plugins[key]) {
          newLayerData[this.pluginsPriority[this.plugins[key].name]] = this.plugins[key].animate$.getValue();
        }
      }
      this.layersData$.next(newLayerData);
    });
  }

  addPlugin(pluginInstance: iPlugin): void {
    let addPlugin = () => {
      if (!this.plugins.hasOwnProperty(pluginInstance.name)) {
        return;
      }
      this.plugins[pluginInstance.name] = pluginInstance;
      this.stateSubscribe[pluginInstance.name] = pluginInstance.state$.subscribe((state) => {
        let temp = this.pluginsState$.getValue();
        temp[pluginInstance.name] = state;
        this.pluginsState$.next(temp);
      });

      pluginInstance.register(this);
    };
    if (this.targetFps$.getValue()) {
      addPlugin();
    } else {
      this.targetFps$.once(() => {
        addPlugin();
      });
    }
  }

  removePlugin(pluginId: string): void {
    if (!this.plugins[pluginId]) {
      return;
    }
    this.stateSubscribe[pluginId] = null;
    this.plugins[pluginId] = null;
  }

  getPlugin(pluginId: string): IPluginInfo {
    const plugin = this.plugins[pluginId];
    if (!plugin) return {
      plugin: null,
      isPresent: false
    };

    return {
      plugin: plugin,
      isPresent: true
    };
  }
}