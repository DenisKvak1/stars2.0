import { iObservable } from "../types";

export function fpsTimer(frame$: iObservable<null>, fps: number, time: number, callback: Function) {
  let frameCount: number = 0;
  let subscribe = frame$.subscribe(()=>{
    frameCount++;
    if (time * fps/1000 <= frameCount) {
      callback();
      subscribe.unsubscribe()
    }
  })
}
export function fpsInterval(frame$: iObservable<null>, fps: number, time: number, callback: Function) {
  let frameCount: number = 0;
  let subscribe = frame$.subscribe(()=>{
    frameCount++;
    if (time * fps/1000 <= frameCount) {
      callback();
      frameCount = 0
    }
  })
  return {unsubscribe: ()=>subscribe.unsubscribe()}
}