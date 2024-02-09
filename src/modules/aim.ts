import { iAim } from "../env/types";


export class Aim implements iAim {
    private context: CanvasRenderingContext2D;
    private readonly leftBorder: number;
    private readonly rightBorder: number;
    private readonly upBorder: number;
    private readonly downBorder: number;
    private x: number;
    private y: number;
    private size: number;
    private readonly img: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, size: number) {
        this.context = context;
        this.leftBorder = 0 + size / 2;
        this.rightBorder = canvas.width - size / 2;
        this.upBorder = 0 + size / 2;
        this.downBorder = canvas.height - size / 2;
        this.x = x;
        this.y = y;
        this.size = size;
        this.img = new Image();
        this.setImg('./assets/images/pic1.png');
        this.draw();
    }

    private draw(): void {
        this.context.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
