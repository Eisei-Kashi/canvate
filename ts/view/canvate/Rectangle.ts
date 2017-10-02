import { Shape } from "./Shape";

export class Rectangle extends Shape {
    constructor(width:number=0, height:number=0){
        super(0, 0, width, height);
        this.draw();
    }

    protected draw(){
        this._canvas.width        = this._width  + 1;
        this._canvas.height       = this._height + 1;
        
        this._context.fillStyle   = this._color;
        this._context.fillRect(this._x, this._y, this._width, this._height);
        this._context.fill();

        if(this.hasButtonListener){
            this._buttonCanvas.width  = this._width;
            this._buttonCanvas.height = this._height;
            
            this._buttonContext.fillStyle = this.buttonColor;
            this._buttonContext.fillRect(this._x, this._y, this._width, this._height);
            this._buttonContext.fill();
        }

        this._hasChanged = false;
    }
}