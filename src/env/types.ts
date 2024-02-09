
export type iStar={
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
  getX: () => number;
  getY: () => number;
  getSize: () => number;
  addSize: (size: number) => void;
  setSize: (size: number) => void;
}
export type iAim = {
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