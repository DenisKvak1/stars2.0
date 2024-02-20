import {CoreRender} from "./modules/CoreRender";
import {LayerController} from "./modules/layerController";

(window as any).CoreRender = CoreRender;
(window as any).LayerController = LayerController;

export {CoreRender, LayerController}