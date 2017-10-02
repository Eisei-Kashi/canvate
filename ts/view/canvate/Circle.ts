import { Shape } from "./Shape";

export class Circle extends Shape {
    private _size:number = 0;

    constructor(diameter:number) {
        super(0, 0, diameter, diameter);
        this._size = diameter;
        this.draw();
    }
    
    protected draw():void {
        let halfSize:number = this._size/2;
        this._canvas.width        = this._size + 1;
        this._canvas.height       = this._size + 1;
            
        this._context.beginPath();
        this._context.fillStyle = this._color;
        this._context.arc(halfSize, halfSize, halfSize, 0, Math.PI*2, true);
        this._context.closePath();
        this._context.fill();

        if(this.hasButtonListener){
            this._buttonCanvas.width  = this._size;
            this._buttonCanvas.height = this._size;
            
            this._buttonContext.beginPath();
            this._buttonContext.fillStyle = this.buttonColor;
            this._buttonContext.arc(halfSize, halfSize, halfSize, 0, Math.PI*2, true);
            this._buttonContext.closePath();
            this._buttonContext.fill();
        }
    }
}