export type iObservable<T> = {
  subscribe: (callback: (eventData: T) => void) => { unsubscribe: () => void };
  next: (eventData?:T)=>void
  unsubscribeAll:()=> void
  getValue:()=> T
  setValue:(value:T)=>void
  once:(callback: (eventData?: T) => void)=> void
}
export type iCoreRender = {
  renderLayer:(layerArray: Array<elementDate>)=>void
  clearArea: ()=>void
}
export type iGameController = {
  canvasId: string,
  frame$: iObservable<null>
  layersData$: iObservable<layersData>
  canvas: HTMLCanvasElement
  pluginsState$: iObservable<pluginSTATEList>
  targetFps$: iObservable<number>;
  addPlugin: (plugin: iPlugin)=>void
  removePlugin: (pluginId:string)=>void
  getPlugin: (pluginId:string)=> IPluginInfo
}
export type aimStrike = {x: number, y:number, size: number}
export type IPluginInfo = {
  plugin: iPlugin;
  isPresent: boolean;
}
export type iLayerController = {
  frame$: iObservable<null>
  targetFps$: iObservable<number>
}
export type layersData = Array<Array<elementDate>>
export type layerData = Array<elementDate>


export type iStar={
  element$: iObservable<CircleData>
  setX: (x:number)=>void,
  setY: (y:number)=>void,
  moveX: (x:number)=>void,
  moveY: (y:number)=>void,
  getX: ()=>number,
  getY: ()=>number,
  getRadius: ()=>number,
  setAlpha: (alpha:number)=> void,
  addRadius:(radius:number)=> void,
  setRadius:(radius:number)=>void
}
export type iMeteorite = {
  element$: iObservable<drawImageData>
  getX: () => number;
  getY: () => number;
  getSize: () => number;
  addSize: (size: number) => void;
  setSize: (size: number) => void;
}
export type iAim = {
  element$: iObservable<drawImageData>
  setImg: (src: string) => void;
  addSize: (size: number) => void;
  setSize: (size: number) => void;
  getSize: () => number;
  getX: () => number;
  getY: () => number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  moveUp: (speed: number) => void;
  moveDown: (speed: number) => void;
  moveRight: (speed: number) => void;
  moveLeft: (speed: number) => void;
}

export type elementDate =  {
  type: string,
  x: number,
  y: number,
  [key: string]: any
}
export type CircleData = elementDate & {
  radius: number,
  color: string
}
export type RectData = elementDate & {
  width: number,
  height: number,
  color: string
}
export type drawImageData = elementDate & {
  image: CanvasImageSource,
  width?: number,
  height?: number
}
export type drawKit = {
  rect: (element: RectData) => void;
  circle: (element: CircleData) => void;
  image: (element: drawImageData) => void;
  [key: string]: (element: any) => void;
}

export const enum PLUGIN_STATE {
  INITIALIZED = "INITIALIZED",
  ADDED = "ADDED",
  PENDING = "PENDING",
  READY = "READY",
  REMOVED = "REMOVED"
}
export type iPlugin = {
  name: string
  state$: iObservable<PLUGIN_STATE>
  animate$: iObservable<layerData>

  register:(controller:iGameController)=>void
  unRegister: ()=> void
}
export type pluginSTATEList={
  [key: string]: PLUGIN_STATE
}
export type iStarLayer = iPlugin & {

}
export type iBackGroundLayer = iPlugin & {

}
export type iGlassBrokenLayer = iPlugin & {
  isBroken: boolean
}
export type iAimLayer = iPlugin & {
  strike$: iObservable<aimStrike>
}
export type iMeteoriteLayer = iPlugin & {
  hit: iObservable<null>
}
export type pluginList = {
  [key: string]:iPlugin
}
export type pluginPriorityList = {
  [key: string]:number
}
export const enum spinDirection {
  NONE = "NONE",
  RIGHT = "RIGHT",
  LEFT = "LEFT"
}