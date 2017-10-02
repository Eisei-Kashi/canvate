
import { IDispatcher } from "../../event/Dispatcher";
import { Dispatcher }  from "../../event/Dispatcher";

module com.kaizenjs.Canvate {
    //add child and button creation in the mouse event listener setter

    class Box {
        protected _x:number       = 0;
        protected _y:number       = 0;
        protected _width:number   = 0;
        protected _height:number  = 0

        constructor (x:number=0, y:number=0, width:number=0, height:number=0){
            this._x         = x;
            this._y         = y;
            this._width     = width;
            this._height    = height;
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

    class CanvateMediator implements IDispatcher {
        private _dispatcher = new Dispatcher(this);

        public addEventListener(type:string, listener:Function):Boolean {
            let wasAdded:Boolean     = this._dispatcher.addEventListener(type, listener);
            return wasAdded;
        }

        public removeEventListener(type:string, listener:Function):Boolean {
            let wasRemoved:Boolean   = this._dispatcher.removeEventListener(type, listener);
            return wasRemoved;
        }

        public dispatch (type:string, colorButton:string):void {
            this._dispatcher.dispatchByType(type, colorButton);
        }
    }

    let canvateMediator:CanvateMediator = new CanvateMediator();

    const enum types {
        Shape
        , Rectangle
        , Circle
        , Bitmap
        , Clip
    }

    interface IKeyValue {
        [key: string]: string;
    }

    const mouseEventTypes:IKeyValue = {
        CLICK : "click"
        , OVER  : "mouseover"
        , OUT   : "mouseout"
        , MOVE  : "mousemove"
        , DOWN  : "mousedown"
        , UP    : "mouseup"
        , ENTER : "mouseenter"
        , LEAVE : "mouseleave"
    }

    let idCounter:number = 0;

    export class Shape extends Box implements IDispatcher{
        protected _mouseEventCounter:number = 0;
        protected _dispatcher:Dispatcher;
        protected _id:number;
        protected _type:number     = types.Shape;

        protected _visible:Boolean = true;

        protected _scaleX:number   = 1;
        protected _scaleY:number   = 1;
        protected _pivotX:number   = 0;
        protected _pivotY:number   = 0;
        protected _rotation:number = 0;
        protected _alpha:number    = 1;

        protected _color:number|string = 0;
        protected _buttonColor:string;

        constructor(x:number=0, y:number=0, width:number=0, height:number=0){
            super(x, y, width, height);
            this._dispatcher = new Dispatcher(this);
            this._id          = ++idCounter;
            this._buttonColor = "#" + ("000000" + this._id.toString(16).toUpperCase()).slice(-6);
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
            this._scaleX = num;
        }

        get scaleX (){
            return this._scaleX;
        }

        // scaleY
        set scaleY (num:number){
            this._scaleX = num;
        }

        get scaleY (){
            return this._scaleY;
        }

        // pivotX
        set pivotX (num:number){
            this._pivotX = num;
        }

        get pivotX (){
            return this._pivotX;
        }

        // pivotY
        set pivotY (num:number){
            this._pivotY = num;
        }

        get pivotY (){
            return this._pivotX;
        }

        // rotation
        set rotation (num:number){
            this._rotation = num;
        }

        get rotation (){
            return this._rotation;
        }

        // alpha
        set alpha (num:number){
            this._alpha = num;
        }

        get alpha (){
            return this._alpha;
        }

        // color
        set color (col:number|string){
            this._color = col;
        }

        get color ():number|string{
            return this._color;
        }

        get buttonColor ():string {
            return this._buttonColor;
        }

        get hasButtonListener ():Boolean {
            return 0 < this._mouseEventCounter;
        }

        get canvasSet ():CanvasSet{

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
    }

    export class Rectangle extends Shape {
        private _canvas:HTMLCanvasElement;
        private _buttonCanvas:HTMLCanvasElement;

        constructor(width:number=0, height:number=0){
            super(0, 0, width, height);
            this._type = types.Rectangle;
        }

        get canvas ():HTMLCanvasElement{
            if(null == this._canvas){
                this._canvas         = document.createElement('canvas');
                this._canvas.width   = this._width  + 1;
                this._canvas.height  = this._height + 1;
                
                let context:CanvasRenderingContext2D = <CanvasRenderingContext2D>this._canvas.getContext('2d');
                    context.fillStyle   = <string | CanvasPattern>this._color;
                    context.fillRect(this._x, this._y, this._width, this._height);
                    context.fill();
            }

            return this._canvas;
        }

        get buttonCanvas ():HTMLCanvasElement {
            if(null == this._buttonCanvas){
                this._buttonCanvas = document.createElement('canvas');
                this._buttonCanvas.width  = this._width;
                this._buttonCanvas.height = this._height;
                
                let buttonContext:CanvasRenderingContext2D = <CanvasRenderingContext2D>this._buttonCanvas.getContext('2d');
                    buttonContext.fillStyle = this.buttonColor;
                    buttonContext.fillRect(this._x, this._y, this._width, this._height);
                    buttonContext.fill();
            }
            
            return this._buttonCanvas;
        }
    }

    export class Circle extends Shape {
        constructor(diameter:number){
            super(0, 0, diameter, diameter);
            this._type = types.Circle;
        }
    }

    export class Bitmap extends Rectangle {
        protected _crop:Box = new Box();

        constructor(image:ImageBitmap, crop?:Box){
            super(0, 0);
            this._type = types.Bitmap;
            if(null != crop){
                this._crop   = crop;
            }

            this._width  = this._crop.width;
            this._height = this._crop.height;
        }
    }

    export class Clip extends Bitmap {
        constructor(image:ImageBitmap, crop?:Box){
            super(image, crop);
        }
    }

    export class Canvate {
        // ::: PROPERTIES MEMBER ::: //
        private _lastTime = 0;
        private _enterFrame:Function;
        private _cancelEnterFrame:Function;
        private _width:number;
        private _height:number;
        private _canvas:HTMLCanvasElement;
        private _context:CanvasRenderingContext2D;
        private _tempCanvas:HTMLCanvasElement;
        private _tempContext:CanvasRenderingContext2D;
        private _drawsList:Array<any>   = []; //TODO Vector
        private _buttonsList:any     = {}; //TODO Vector
        private _lastColor:number       = 1;
        private _self:Canvate           = this;
        private _fillStyle:string|CanvasPattern = "#0"; // TODO image pattern type
        private _alphaBackground:number = 1;
        private _maskTypes:any          = { //TODO
                                            mask  : 'destination-in'
                                            ,slice : 'destination-out'
                                        }
        private _canvasOff:HTMLCanvasElement;
        private _contextOff:CanvasRenderingContext2D;
        private _canvasButtons:HTMLCanvasElement;
        private _contextButtons:CanvasRenderingContext2D;
        private _pixelColor:any; //TODO
        private _lastX:number;
        private _lastY:number;
        private _mouseX:number;
        private _mouseY:number;
        private _bounds:DOMRectInit;
        private _lastShapeOvered:Shape;
        private _lastShapeDown:Shape;
        private _updateCallback:Function;

        // ::: C O N S T R U C T O R::: //
        constructor (width:number, height:number, element?:HTMLCanvasElement, canvasDebugger?:HTMLElement){
            console.log("Canvate is Alive!");
            
            this._enterFrame       = this.fallbackEnterFrame;
            this._cancelEnterFrame = (id:number) => {
                                                        clearTimeout(id);
                                                    }
            
            let vendors  = ['ms', 'moz', 'webkit', 'o'];
            
            for(let index = 0; index < vendors.length && !window.requestAnimationFrame; ++index) {
                this._enterFrame       = <Function> window [vendors[index]+'RequestAnimationFrame'];

                this._cancelEnterFrame = <Function> window [vendors[index]+'CancelAnimationFrame'] || 
                                                    window [vendors[index]+'CancelRequestAnimationFrame'];
            }
            
            this._width         = width;
            this._height        = height;
            
            this._canvas        = element || document.createElement("canvas");
            this._context       = <CanvasRenderingContext2D>this._canvas.getContext("2d");

            this._tempCanvas    = document.createElement("canvas");
            this._tempContext   = <CanvasRenderingContext2D>this._tempCanvas.getContext("2d");
        }

        // ::: INTERFACE CANVATE BACKGROUND　::: //
        set backgroundColor (color:string) {
            this._fillStyle = color;
        }

        set backgroundImage (image:HTMLImageElement|HTMLVideoElement|HTMLCanvasElement){
            this._fillStyle = this._context.createPattern(image, 'repeat');
        }

        set fillStyle (fill:string|CanvasPattern){
            this._fillStyle = fill;
        }

        get fillStyle ():string|CanvasPattern{
            return this._fillStyle;
        }
        
        set backgroundAlpha (alpha:number) {
            this._alphaBackground = isNaN(alpha) ? this._alphaBackground : alpha;
        }

        get backgroundAlpha ():number {
            return this._alphaBackground;
        }

        public loadImageBackground (url:string){
            let img:HTMLImageElement;
            //TODO replace by Image loader
            img        = new Image();
            img.onload = ():void => {
                                        this._fillStyle = this._context.createPattern(img, 'repeat');
                                    };
            img.src    = url;
        }

        // ::: SHAPES INTERFACE ::: //
        public addChild(child:Rectangle|Circle|Bitmap|Clip|HTMLCanvasElement){
            if(child instanceof HTMLCanvasElement){
                //TODO add canvas
            }else{
                var type = child.type;
                switch(type){
                    case types.Bitmap :
                    break;
                    case types.Circle :
                    break;
                    case types.Clip :
                    break;
                    case types.Rectangle :
                    break;
                    case types.Shape :
                    break;
                }
            }
        }

        this.drawRectangle = function (data){
            var x      = data.x;
            var y      = data.y;
            var width  = data.width;
            var height = data.height;
            var color  = data.color;
            var alpha  = data.alpha;
            
            var shape               = {x:x, y:y, width:width, height:height, color:color, alpha:alpha};
            setImageArguments(shape);
            var key                 = setButton(shape);
        
            var canvas              = document.createElement('canvas');
                canvas.width        = width+1;
                canvas.height       = height+1;
                
            var context             = canvas.getContext('2d');
                context.fillStyle   = color;
                context.fillRect(x, y, width, height);
                context.fill();
                shape.canvas        = canvas;
            
            var buttonCanvas        = document.createElement('canvas');
                buttonCanvas.width  = width;
                buttonCanvas.height = height;
                
            var buttonContext       = buttonCanvas.getContext('2d');
                buttonContext.fillStyle   = key;
                context.fillRect(x, y, width, height);
                buttonContext.fill();
                
        var argumentsList = [shape, buttonCanvas, width, height];
        _addCommand(_drawCanvas, argumentsList);
        return shape;
        }

        // ::: Render interface ::: //
        public function clear ():void {
            //TODO CLEAR ALL DEPENDENCIES
            this._drawsList.length = 0;
        }

        // ::: Initialization ::: //
        private initialize () {
            this._canvasButtons        = <HTMLCanvasElement>this._canvas.cloneNode();
            this._canvasButtons.width  = this._canvas.width;
            this._canvasButtons.height = this._canvas.height;
            this._canvasButtons.id     = "buttons_" + this._canvas.id;
            this._contextButtons       = <CanvasRenderingContext2D>this._canvasButtons.getContext("2d");
            
            let width  = this._width;
            let height = this._height;
            
            this._canvas.width         = width;
            this._canvas.height        = height;
            this._canvasButtons.width  = width;
            this._canvasButtons.height = height;

            this._canvasOff            = <HTMLCanvasElement> this._canvas.cloneNode();
            this._contextOff           = <CanvasRenderingContext2D >this._canvasOff.getContext('2d');
            this._canvasOff.width      = width;
            this._canvasOff.height     = height;

            let id = "#" + this._canvas.id;

            this.addEventListeners();

            this.update();
        }

        // ::: Renderization ::: //
        private fallbackEnterFrame (callback:Function, element:HTMLElement):number {
            let currTime = Date.now();
            let timeToCall = Math.max(0, 16 - (currTime - this._lastTime));
            let id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
            timeToCall);
            this._lastTime = currTime + timeToCall;
            return id;
        };

        private displayBackground(){
            this._contextOff.save();
            
            this._contextOff.globalAlpha   = this._alphaBackground;
            this._contextOff.fillStyle     = this._fillStyle;
            
            let width  = this._canvas.width;
            let height = this._canvas.height;

            this._contextOff.fillRect(0, 0, width, height);
            
            this._contextButtons.fillStyle = "#000000";
            this._contextButtons.fillRect(0, 0, width, height);
            
            this._contextOff.restore();
        }

        private setUpdateCallback (callback:Function){
            this._updateCallback = callback;
        }
        
        private update(){
            if(Boolean(this._updateCallback)){
                this._updateCallback();
            }

            let width:number           = this._width;
            let height:number          = this._height;

            this._canvas.width         = width;
            this._canvas.height        = height;
            this._canvasButtons.width  = width;
            this._canvasButtons.height = height;
            this._canvasOff.width      = width;
            this._canvasOff.height     = height;
            
            
            this.displayBackground();
            
            let data;
            let command;
            let argumentList;
            let length = this._drawsList.length;
            for(let index=0; index < length; index++){
                data         = this._drawsList[index];
                command      = data.command;
                argumentList = data.argumentList;
                try {
                    command.apply(this, argumentList);
                }catch(error){
                    // console.log("The command is undefined");
                }
            }
            
            this.resolveOver();
            
            this._context.drawImage(this._canvasOff, 0, 0);
            //displayGrid();
            requestAnimationFrame(this.update);
        }
        
        // ::: Mouse event ::: //
        private addEventListeners():void {
            this._canvas.onmousemove    = this.onMouseMove;
            this._canvas.onclick        = this.onClick;
            this._canvas.onmousedown    = this.onMouseDown;
            this._canvas.onmouseup      = this.onMouseUp;
            this._canvas.onmouseleave   = this.onMouseLeave;
            
            document.onmouseout         = this.onMouseLeave;
        }

        private onMouseMove(event:MouseEvent){
            event.preventDefault();
            this._bounds = this._canvas.getBoundingClientRect();
            let mouseX   = event.clientX;
            let mouseY   = event.clientY;
            this._lastX  = (mouseX - this._bounds.left) * (this._canvas.width/this._bounds.width);
            this._lastY  = (mouseY - this._bounds.top)  * (this._canvas.height/this._bounds.height);
            
            this._mouseX = mouseX;
            this._mouseY = mouseY;

            this.resolveOver();
        };
            
        private onClick (event:MouseEvent){
            event.preventDefault();
            var shape:any =  <any> this._buttonsList[this._pixelColor];
            if(Boolean(shape) && typeof(shape.onClick) != "undefined"){
                shape.onClick(this._lastX, this._lastY);   
            }
        };
            
        private onMouseDown (event:MouseEvent){
            event.preventDefault();
            var shape:any =  this._buttonsList[this._pixelColor];
            if(Boolean(shape) && typeof(shape.onClickOutSide) != "undefined"){
                this._lastShapeDown = shape;  
            }else{
                this._lastShapeDown = null; 
            }
        };

        private onMouseUp (event:MouseEvent){
            event.preventDefault();
            if(Boolean(this._lastShapeDown)){
                this._lastShapeDown.onClickOutSide(this._lastX, this._lastY);
                this._lastShapeDown = null;
            }
        };
            
        private onMouseLeave (event:MouseEvent){
            this.resolveOut();
        };

        // ::: BUTTON ::: //
        private setButton (shape:Shape):string {
            let number = shape.id;
            let color  = "#" + ("000000" + number.toString(16).toUpperCase()).slice(-6);
            this._buttonsList[color] = shape;
            return color;
        }

        private resolveOver(){
            var isNotOver = undefined == this._lastX || 
                            undefined == this._lastY || 
                            this._lastShapeDown      != null;
            if(isNotOver){
                //Early return
                return;
            }
            
            let pixel       = this._contextButtons.getImageData(this._lastX, this._lastY, 1, 1).data;
            let hex         = ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16).toUpperCase();
            let pixelColor  = this._pixelColor    = "#" + ("000000" + hex).slice(-6);
            
            let shape       =  this._buttonsList[this._pixelColor];
            var mouseCursor = "default";
            
            if(Boolean(shape)){
                var hasOver      = typeof(shape.onOver) != "undefined";
                var hasMouse     = hasOver || typeof(shape.onClick) != "undefined" || typeof(shape.onOut) != "undefined" || typeof(shape.onClickOutSide) != "undefined";
                if(hasMouse){
                    mouseCursor = "pointer";
                }
                
                    if(shape != this._lastShapeOvered){
                    this.resolveOut();
                    this._lastShapeOvered = shape;
                    
                    if(hasOver){
                        shape.onOver(this._lastX, this._lastY);
                    }
                    }
            }else {
                this.resolveOut();
            }
            
            this._canvas.style.cursor = mouseCursor;
        }

        private resolveOut(){
            if(this._lastShapeDown != undefined){
                return;
            }
            if(Boolean(this._lastShapeOvered)){
                if(typeof(this._lastShapeOvered.onOut) != "undefined"){
                    this._lastShapeOvered.onOut(this._lastX, this._lastY);
                    this._lastShapeOvered = null;
                }
            }
        }
    }
}
var canvas:Canvate = new Canvate(900, 1250);