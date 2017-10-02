import { Box } from "./Box";

export class Shape extends Box implements IDispatcher{
    protected _canvas:HTMLCanvasElement;
    protected _context:CanvasRenderingContext2D;
    
    protected _buttonCanvas:HTMLCanvasElement;
    protected _buttonContext:CanvasRenderingContext2D;

    protected _mouseEventCounter:number = 0;
    protected _dispatcher:Dispatcher;
    protected _id:number;

    protected _visible:Boolean = true;
    
    protected _crop:Box;

    protected _scaleX:number   = 1;
    protected _scaleY:number   = 1;
    protected _pivotX:number   = 0;
    protected _pivotY:number   = 0;
    protected _rotation:number = 0;
    protected _alpha:number    = 1;

    protected _color:CanvasPattern|string = "black";
    protected _buttonColor:string;

    protected _hasChanged:Boolean = false;

    constructor(x:number=0, y:number=0, width:number=0, height:number=0){
        super(x, y, width, height);

        this._crop          = new Box(x, y, width, height);
        
        this._dispatcher    = new Dispatcher(this);
        this._id            = ++idCounter;
        this._buttonColor   = "#" + ("000000" + this._id.toString(16).toUpperCase()).slice(-6);

        this._canvas        = document.createElement('canvas');
        this._context       = <CanvasRenderingContext2D>this._canvas.getContext('2d');
        
        this._buttonCanvas  = document.createElement('canvas');
        this._buttonContext = <CanvasRenderingContext2D>this._buttonCanvas.getContext('2d');
    }

    // id
    get id():number {
        return this._id;
    }

    // type
    get type():number {
        return this._type;
    }

    // visible
    set visible (bool:Boolean){
        this._visible = bool;
    }

    get visible (){
        return this._visible;
    }

    // scaleX
    set scaleX (num:number){
        this._hasChanged = this._scaleX != num;
        this._scaleX     = num;
    }

    get scaleX (){
        return this._scaleX;
    }

    // scaleY
    set scaleY (num:number){
        this._hasChanged = this._scaleY != num;
        this._scaleY     = num;
    }

    get scaleY (){
        return this._scaleY;
    }

    // pivotX
    set pivotX (num:number){
        this._hasChanged = this._pivotX != num;
        this._pivotX     = num;
    }

    get pivotX (){
        return this._pivotX;
    }

    // pivotY
    set pivotY (num:number){
        this._hasChanged = this._pivotY != num;
        this._pivotY     = num;
    }

    get pivotY (){
        return this._pivotX;
    }

    // crop object
    set crop(box:Box):void{
        this._hasChanged = this._crop != box;
        this._crop = box;

        this.x      = box.x;
        this.y      = box.y;
        this.width  = box.width;
        this.height = box.height;
    }

    get crop():Box{
        return this._crop;
    }

    // crop X
    set cropX(num:number):Box{
        this._hasChanged = this._crop.x != num;
        this._crop.x = num;
    }

    get cropX():number{
        return this._crop.x;
    }

    // crop Y
    set cropY(num:number):Box{
        this._hasChanged = this._crop.y != num;
        this._crop.y = num;
    }

    get cropY():number{
        return this._crop.y;
    }

    // crop width
    set cropWidth(num:number):Box{
        this._hasChanged = this._crop.width != num;
        this._crop.width = num;
    }

    get cropWidth():number{
        return this._crop.width;
    }

    // crop height
    set cropHeight(num:number):Box{
        this._hasChanged = this._crop.height != num;
        this._crop.height = num;
    }

    get cropHeight():number{
        return this._crop.height;
    }

    // rotation
    set rotation (num:number){
        this._hasChanged = this._rotation != num;
        this._rotation   = num;
    }

    get rotation (){
        return this._rotation;
    }

    // alpha
    set alpha (num:number){
        this._hasChanged = this._alpha != num;
        this._alpha      = num;
    }

    get alpha (){
        return this._alpha;
    }

    // color
    set color (col:string|CanvasPattern){
        this._hasChanged = this._color != col
        this._color      = col;
    }

    get color ():string|CanvasPattern{
        return this._color;
    }

    // button color
    get buttonColor ():string {
        return this._buttonColor;
    }

    // has button handler
    get hasButtonListener ():Boolean {
        return 0 < this._mouseEventCounter;
    }

    // ::: Render ::: //
    public renderOnTarget(context:CanvasRenderingContext2D, buttonContext:CanvasRenderingContext2D){
        if(this._hasChanged){
            this.draw();
            this._hasChanged = false
        }
        context.save();
        context.globalAlpha = this._alpha;

        let pivotX  = this._pivotX;
        let pivotY  = this._pivotY;
        let x       = this._x;
        let y       = this._y;
        let radians = this._rotation;
        let scaleX  = this.scaleX;
        let scaleY  = this.scaleY;
        
        context.translate(this._x, this._y);
        context.rotate(this._rotation);
        context.scale(this._scaleX, this._scaleY);
        
        let cropX      = this.cropX;
        let cropY      = this.cropY;
        let cropWidth  = this.cropWidth;
        let cropHeight = this.cropHeight;
        let width      = this._width;
        let height     = this._height;

        context.drawImage(this._canvas
                         ,cropX,         cropY
                         ,cropWidth,     cropHeight
                         ,-pivotX*width, -pivotY*height
                         ,width,         height);
        
        context.restore();
        
        if(!this.hasButtonListener){
            // Early return
            return;
        }

        buttonContext.save();
        
        buttonContext.translate(x, y);
        buttonContext.rotate(radians);
        buttonContext.scale(scaleX, scaleY);
        buttonContext.drawImage(this._buttonCanvas,
                                cropX,          cropY
                                ,cropWidth,     cropHeight
                                ,-pivotX*width, -pivotY*height
                                ,width,         height);
        
        buttonContext.restore();
    }

    // ::: Interface Event dispatcher ::: //
    public addEventListener(type:string, listener:Function):Boolean {
        let wasAdded:Boolean     = this._dispatcher.addEventListener(type, listener);
        let isMouseEvent:Boolean = null != mouseEventTypes[type];
        if(wasAdded && isMouseEvent){
            this._mouseEventCounter++;
        }
        return wasAdded;
    }

    public removeEventListener(type:string, listener:Function):Boolean {
        let wasRemoved:Boolean   = this._dispatcher.removeEventListener(type, listener);
        let isMouseEvent:Boolean = null != mouseEventTypes[type];
        if(wasRemoved && isMouseEvent){
            this._mouseEventCounter--;
        }
        return wasRemoved;
    }

    protected draw(){};
}