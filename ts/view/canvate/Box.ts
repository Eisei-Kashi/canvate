export class Box {
    protected _x:number       = 0;
    protected _y:number       = 0;
    protected _width:number   = 0;
    protected _height:number  = 0

    constructor (x:number=0, y:number=0, width:number=0, height:number=0){
        this._x      = x;
        this._y      = y;
        this._width  = width;
        this._height = height;
    }

    set x (num:number) {
        this._x = num;
    }
    get x (){
        return this._x;
    }

    set y (num:number) {
        this._y = num;
    }

    get y (){
        return this._y;
    }

    set width (num:number) {
        this._width = num;
    }
    get width (){
        return this._width;
    }

    set height (num:number) {
        this._height = num;
    }
    get height (){
        return this._height;
    }
}