export function  calculatePointOnRing(centerX:number, centerY:number, radius:number, t:number): { x: number; y: number } {
  let ringWidth = getRandomNumber(0, 40);
  const x: number = centerX + (radius + ringWidth / 2) * Math.cos(t);
  const y: number = centerY + (radius + ringWidth / 2) * Math.sin(t);
  return { x, y };
}
export function distanceBetweenPoints(x:number, y:number, cx:number, cy:number):number {
  return Math.sqrt(Math.pow((x - cx), 2) + Math.pow((y - cy), 2));
}
export function getRandomNumber(min:number, max:number):number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function calculateRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    let lastTimestamp = 0;
    let start = true;

    function animate(timestamp: number) {
      const deltaTime = timestamp - lastTimestamp;
      const fps = Math.round(1000 / deltaTime);
      lastTimestamp = timestamp;
      if (start) {
        requestAnimationFrame(animate);
      } else {
        resolve(fps);
      }
      start = false;
    }
    requestAnimationFrame(animate);
  });
}
