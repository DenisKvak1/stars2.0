import { drawImageData, iAim, iObservable } from "../../../env/types";
import { Observable } from "../../../env/helpers/observable";


export class Aim implements iAim {
    private leftBorder: number;
    private rightBorder: number;
    private upBorder: number;
    private downBorder: number;
    private x: number;
    private y: number;
    private size: number;
    private canvas: HTMLCanvasElement
    private readonly img: HTMLImageElement;
    element$: iObservable<drawImageData>

    constructor(canvas: HTMLCanvasElement, x: number, y: number, size: number) {
        this.leftBorder = size / 2;
        this.rightBorder = canvas.width - size / 2;
        this.upBorder = size / 2;
        this.downBorder = canvas.height - size / 2;
        this.element$ = new Observable<drawImageData>()
        this.canvas = canvas

        this.x = x;
        this.y = y;
        this.size = size;
        this.img = new Image();
        this.setImg('./assets/images/pic1.png');
        this.draw();
    }

    private draw(): void {
        this.element$.next({ image: this.img, x: this.x - this.size / 2, y: this.y - this.size / 2, type:"image", height: this.size, width:this.size})
    }

    setImg(src: string): void {
        this.img.src = src;
    }

    addSize(size: number): void {
        this.size += size;
        this.draw();
    }

    setSize(size: number): void {
        this.size = size;
        this.leftBorder = size / 2;
        this.rightBorder = this.canvas.width - size / 2;
        this.upBorder = size / 2;
        this.downBorder = this.canvas.height - size / 2;
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

    setX(x: number): void {
        this.x = x;
        this.draw();
    }

    setY(y: number): void {
        this.y = y;
        this.draw();
    }

    moveUp(speed: number): void {
        this.y -= speed;
        if (this.y < this.upBorder) {
            this.y = this.upBorder;
        }
        this.draw();
    }

    moveDown(speed: number): void {
        this.y += speed;
        if (this.y > this.downBorder) {
            this.y = this.downBorder;
        }
        this.draw();
    }

    moveRight(speed: number): void {
        this.x += speed;
        if (this.x > this.rightBorder) {
            this.x = this.rightBorder;
        }
        this.draw();
    }

    moveLeft(speed: number): void {
        this.x -= speed;
        if (this.x < this.leftBorder) {
            this.x = this.leftBorder;
        }
        this.draw();
    }
}
