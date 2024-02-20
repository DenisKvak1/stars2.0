import { CircleData, drawImageData, drawKit, elementDate, RectData } from "../../../../env/types";

export class CoreRender implements CoreRender{
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private readonly drawKit: drawKit
  constructor(id:string) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement
    this.context = this.canvas.getContext('2d')
    this.drawKit = {
      rect: (element: RectData)=>{
        this.context.fillStyle = element.color;
        this.context.beginPath();
        this.context.fillRect(element.x, element.y, element.width, element.height)
        this.context.fill();
      },
      circle: (element: CircleData)=>{
        this.context.fillStyle = element.color;
        this.context.beginPath();
        this.context.arc(element.x, element.y, element.radius, 0, 2 * Math.PI)
        this.context.fill();
      },
      image: (element: drawImageData)=>{
        if(element.hasOwnProperty('width') && element.hasOwnProperty('height')){
          this.context.drawImage(element.image,element.x, element.y, element.width, element.height)
        } else {
          this.context.drawImage(element.image,element.x, element.y)
        }
      }
    }
  }
  renderLayer(layerArray: Array<elementDate>){
    for (let i = 0; i < layerArray.length; i++) {
      let element = layerArray[i]
      this.drawKit[element.type](element)
    }
  }
  clearArea(){
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
  }
}
