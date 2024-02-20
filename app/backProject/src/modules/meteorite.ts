import { iMeteorite } from "../env/types";

export class Meteorite implements iMeteorite{
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    size: number;
    img: HTMLImageElement;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.size = size;
        this.img = new Image();
        this.img.src = './assets/images/klipartz.png';
        this.draw();
    }

    private draw(): void {
        this.context.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
