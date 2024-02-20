import { drawImageData, iMeteorite, iObservable } from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";

export class Meteorite implements iMeteorite{
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    size: number;
    img: HTMLImageElement;
    element$: iObservable<drawImageData>

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.element$ = new Observable<drawImageData>()
        this.img = new Image();
        this.img.src = './assets/images/klipartz.png';
        this.draw();
    }

    private draw(): void {
        this.element$.next({type:"image",image: this.img, x: this.x - this.size / 2, y: this.y - this.size / 2, width:this.size, height:this.size})
    }

    addSize(size: number): void {
        this.size += size;
        this.draw();
    }

    setSize(size: number): void {
        this.size = size;
        this.draw();
    }

    getSize(): number {
        return this.size;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }
}
