import { Dispatcher }       from "../../event/Dispatcher";
import { MOUSE_TYPES }      from "../../event/MOUSE_TYPES";
import { CANVATE_MEDIATOR } from "../../event/Mediator";
import { CanvateEvent }     from "../../event/CanvateEvent";
import { IKeyValue }        from "../../utils/IKeyValue";
import { Shape }            from "./Shape";
import { IStringShape }     from "./Shape";

export let idCounter:number = 0;

export class Canvate {
    // ::: PROPERTIES MEMBER ::: //
    private _lastTime:number = 0;
    private _width:number;
    private _height:number;
    private _lastColor:number       = 1;
    private _alphaBackground:number = 1;
    private _lastX:number;
    private _lastY:number;
    private _mouseX:number;
    private _mouseY:number;

    private _enterFrame:Function;
    private _cancelEnterFrame:Function;
    private _updateCallback:Function;

    private _wasShapeDown:Boolean   = false;
    private _wasShapeOvered:Boolean = false;
    
    private _canvas:HTMLCanvasElement;
    private _canvasButtons:HTMLCanvasElement;
    private _tempCanvas:HTMLCanvasElement;
    private _canvasOff:HTMLCanvasElement;

    private _context:CanvasRenderingContext2D;
    private _contextButtons:CanvasRenderingContext2D;
    private _tempContext:CanvasRenderingContext2D;
    private _contextOff:CanvasRenderingContext2D;
    
    private _bounds:DOMRectInit;

    private _fillStyle:string|CanvasPattern = "#0"; // TODO image pattern type
    
    private _drawsList:Array<Shape> = []; //TODO Vector
    
    private _self:Canvate = this;

    private _dispatcher:Dispatcher;
    
    private _pixelColor:any; //TODO
    private _buttonsList:any = {}; //TODO Vector
    private _maskTypes:any = { //TODO
                                mask  : 'destination-in'
                               ,slice : 'destination-out'
                              }

    private _lastShapeOvered:Shape;
    private _lastShapeDown:Shape;
    
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

    // ::: CANVATE BACKGROUND INTERFACE　::: //
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

    // ::: CHILDREN INTERFACE ::: //
    public addChild(child:Shape):Boolean{
        var length:number = this._drawsList.length;
        for(let index:number = 0; index < length; index++){
            if(child == this._drawsList[index]){
                // Early return
                return false;
            }
        }

        var event:CanvateEvent = new CanvateEvent(CanvateEvent.ADDED, child.id);
        CANVATE_MEDIATOR.dispatchEvent(event);
        
        this._drawsList.push(child);
        return true;
    }

    public clear ():void {
        //TODO CLEAR ALL DEPENDENCIES
        this._drawsList.length = 0;
    }

    public switchShapes (shape1:Shape, shape2:Shape){
        if(shape1 == shape2){
            return;
        }

        var index1:number = -1;
        var index2:number = -1;
        var shape:Shape;
        var index:number = this._drawsList.length;

        while(--index > -1){
            shape = this._drawsList[index];
            if(shape1 == shape){
                index1 = index;
            }
            
            if(shape2 == shape){
                index2 = index;
            }
        }

        if(-1 != index1 && -1 != index2){
            shape1 = this._drawsList[index1];
            shape2 = this._drawsList[index2];
            this._drawsList[index1] = shape2;
            this._drawsList[index2] = shape1;
        }
    }

    public bringToFront (shape:Shape){
        this.setDepth(shape, this._drawsList.length-1);
     }

     public sendToBack (shape:Shape){
		this.setDepth(shape, 0);
	}

     public setDepth (shape:Shape, depth:number){
        if(isNaN(depth)){
            return;
        }

        depth = Math.round(depth);

        var index = this._drawsList.length;
        depth     = depth >= index ? index-1 : depth;
        depth     = depth < 0      ? 0       : depth;

        while(--index > -1){
            if(shape == this._drawsList[index]){
                var shapeToAdd:Shape = this._drawsList.splice(index, 1)[0];
                this._drawsList.splice(depth, 0, shapeToAdd);
                return;
            }
        }
    }

    //==============================================

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
        let shape:Shape;
        let length = this._drawsList.length;
        for(let index=0; index < length; index++){
            shape = this._drawsList[index];
            try {
                shape.renderOnTarget(this._contextOff, this._contextButtons);
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
        this._lastX  = (mouseX - this._bounds.x) * (this._canvas.width/this._bounds.width);
        this._lastY  = (mouseY - this._bounds.y)  * (this._canvas.height/this._bounds.height);
        
        this._mouseX = mouseX;
        this._mouseY = mouseY;

        this.resolveOver();
    };
        
    private onClick (event:MouseEvent){
        event.preventDefault();
        var shape:Shape =  <Shape> this._buttonsList[this._pixelColor];
        if( Boolean(shape) ){
            shape.doOnClick(this._lastX, this._lastY);
        }
    };
        
    private onMouseDown (event:MouseEvent){
        event.preventDefault();
        var shape:Shape =  <Shape> this._buttonsList[this._pixelColor];
        if( Boolean(shape) ){
            this._wasShapeDown = true;
            this._lastShapeDown = shape;
            shape.doOnMouseDown(this._lastX, this._lastY);
        }else{
            this._wasShapeDown = false; 
        }
    };

    private onMouseUp (event:MouseEvent){
        event.preventDefault();
        if(this._wasShapeDown){
            this._lastShapeDown.doOnMouseUp(this._lastX, this._lastY);
            this._wasShapeDown = false;
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
                        this._wasShapeDown;
        if(isNotOver){
            //Early return
            return;
        }
        
        let pixel       = this._contextButtons.getImageData(this._lastX, this._lastY, 1, 1).data;
        let hex         = ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16).toUpperCase();
        let pixelColor  = this._pixelColor    = "#" + ("000000" + hex).slice(-6);
        
        let shape:Shape =  this._buttonsList[this._pixelColor];
        var mouseCursor = "default";
        
        if(Boolean(shape)){
            if(shape.hasButtonListener){
                mouseCursor = "pointer";
            }
            
            if(this._wasShapeOvered && shape != this._lastShapeOvered){
                this.resolveOut();
                this._lastShapeOvered = shape;
                this._wasShapeOvered = true;
                if(shape.hasOver || shape.hasEnter){
                    shape.doOnMouseOver(this._lastX, this._lastY);
                }
            }
        }else {
            this.resolveOut();
        }
        
        this._canvas.style.cursor = mouseCursor;
    }

    private resolveOut(){
        if(this._wasShapeDown){
            return;
        }

        if(this._wasShapeOvered){
            if(this._lastShapeOvered.hasOut){
                this._lastShapeOvered.doOnMouseOut(this._lastX, this._lastY);
                this._wasShapeOvered = false;
            }
        }
    }
}