class Canvate {
    // ::: PROPERTIES MEMBER ::: //
    private _lastTime = 0;
    private _enterFrame:Function;
    private _width:number;
    private _height:number;
    private _canvas:HTMLCanvasElement;
    private _context:CanvasRenderingContext2D;
    private _tempCanvas:HTMLCanvasElement;
    private _tempContext:CanvasRenderingContext2D;
    private _drawsList:Array<any>   = []; //TODO Vector
    private _buttonsList:Object     = {}; //TODO Vector
    private _lastColor:number       = 1;
    private _self:Canvate           = this;
    private _fillStyle:number|string|any = "#0"; // TODO image pattern type
    private _alphaBackground:number = 1;
    private _maskTypes:any          = { //TODO
                                         mask  : 'destination-in'
                                        ,slice : 'destination-out'
                                      }
    
    private _imageBackground:any; //TODO 
    private _backgroundImagePattern:any //TODO;
    private _canvasOff:HTMLCanvasElement;
    private _contextOff:CanvasRenderingContext2D;
    private _canvasButtons:HTMLCanvasElement;
    private _contextButtons:CanvasRenderingContext2D;
    private _pixelColor:any; //TODO
    private _lastX:number;
    private _lastY:number;
    private _mouseX:number;
    private _mouseY:number;
    private _bounds:any; //TODO make a class
    private _lastShapeOvered:any; //TODO
    private _lastShapeDown:any; //TODO
    private _updateCallback:Function;

    constructor (width:number, height:number, element?:HTMLCanvasElement, canvasDebugger?:HTMLElement){
        console.log("Canvate is Alive!");
        /*
        let vendors  = ['ms', 'moz', 'webkit', 'o'];
        
        for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            this._enterFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
    
        if (!this._enterFrame){
            this._enterFrame = this.fallback;
        }
    
        if (!window.cancelAnimationFrame){
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            }
        }
        */
        this._width         = width;
        this._height        = height;
        
        this._canvas        = element || document.createElement("canvas");
        this._context       = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        this._tempCanvas    = document.createElement("canvas");
        this._tempContext   = <CanvasRenderingContext2D>this._tempCanvas.getContext("2d");
        
        this._enterFrame    = this.fallback;
    }

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
        
        this._displayBackground = this._setColorBackground;

        update();
    }

    private fallback (callback:Function, element:HTMLElement):number {
        let currTime = Date.now();
        let timeToCall = Math.max(0, 16 - (currTime - this._lastTime));
        let id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
          timeToCall);
        this._lastTime = currTime + timeToCall;
        return id;
    };

    private displayBackground(){
		_contextOff.save();
		
		_contextOff.globalAlpha   = _alphaBackground;
		_contextOff.fillStyle     = _colorBackground;
		_contextOff.fillRect(0, 0, _canvas.width, _canvas.height);
		
		_contextButtons.fillStyle = "#000000";
		_contextButtons.fillRect(0, 0, _canvas.width, _canvas.height);
		
		_contextOff.restore();
	}

    // ::: INTERFACE CANVATE BACKGROUND::: //
     set backgroundColor (color:number|string):void{
        this._colorBackground = color;
        _displayBackground = _setColorBackground;
    }
    get backgroundColor ():number|string{
        return this._colorBackground;
    }
    
    set backgroundAlpha (alpha:number):void {
        this._alphaBackground = isNaN(alpha) ? this._alphaBackground : alpha;
    }
    get backgroundAlpha ():number {
        return this._alphaBackground;
    }
    
    set backgroundImage (image):void {
        this._backgroundImagePattern = this._context.createPattern(image, 'repeat');
        this._displayBackground      = this._setImageBackground;
    }
    get backgroundImage ():number {
        return this._alphaBackground;
    }
	this.setImageBackground = function (image, alpha){
		_alphaBackground        = isNaN(alpha) ? _alphaBackground : alpha;
		_backgroundImagePattern = _context.createPattern(image, 'repeat');
		_displayBackground      = _setImageBackground;
	}
	
	this.loadImageBackground = function (url, alpha){
		_alphaBackground  = isNaN(alpha) ? _alphaBackground : alpha;
		
		var img;
		
		onload = function() {
			imagesLoaded[url]       = img;
			_backgroundImagePattern = _context.createPattern(img, 'repeat');
			_displayBackground      = _setImageBackground;
		};
		
		if(null == img){
			img        = new Image();
			img.onload = onload;
			img.src    = url;
		}else{
			onload();
		}
	}
	
	function _setImageBackground(){
		_contextOff.save();
		
			_contextOff.globalAlpha   = _alphaBackground;
			_contextOff.fillStyle     = _backgroundImagePattern;
			_contextOff.fillRect(0, 0, _canvas.width, _canvas.height);
			
			_contextButtons.fillStyle = "#000000";
			_contextButtons.fillRect(0, 0, _canvas.width, _canvas.height);
		
		_contextOff.restore();
	}
	
	function _setColorBackground(){
		_contextOff.save();
		
		_contextOff.globalAlpha   = _alphaBackground;
		_contextOff.fillStyle     = _colorBackground;
		_contextOff.fillRect(0, 0, _canvas.width, _canvas.height);
		
		_contextButtons.fillStyle = "#000000";
		_contextButtons.fillRect(0, 0, _canvas.width, _canvas.height);
		
		_contextOff.restore();
	}

    private addEventListeners():void {
        
    }

    private onMouseMove(event:MouseEvent){
        event.preventDefault();
        this._bounds = this._canvas.getBoundingClientRect();
        let mouseX   = event.clientX;
        let mouseY   = event.clientY;
        this._lastX  = (mouseX - _bounds.left) * (this._canvas.width/this._bounds.width);
        this._lastY  = (mouseY - _bounds.top)  * (this._canvas.height/this._bounds.height);
        
        this._mouseX = mouseX;
        this._mouseY = mouseY;

        resolveOver();
    };
        /*
        _canvas.onclick = function(event){
            event.preventDefault();
            var shape =  _buttonsList[_pixelColor];
            if(Boolean(shape) && typeof(shape.onClick) != "undefined"){
                shape.onClick(_lastX, _lastY);   
            }
        };
        
        _canvas.onmousedown = function(event){
            event.preventDefault();
            var shape =  _buttonsList[_pixelColor];
            if(Boolean(shape) && typeof(shape.onClickOutSide) != "undefined"){
                _lastShapeDown = shape;  
            }else{
                _lastShapeDown = null; 
            }
        };
        
        _canvas.onmouseup = function(event){
            event.preventDefault();
            if(Boolean(_lastShapeDown)){
                _lastShapeDown.onClickOutSide(_lastX, _lastY);
                _lastShapeDown = null;
            }
        };
        
        document.onmouseleave = function(event){
            resolveOut();
        };
        */

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
                
                 if(shape != _lastShapeOvered){
                    resolveOut();
                    _lastShapeOvered = shape;
                    
                    if(hasOver){
                        shape.onOver(_lastX, _lastY);
                    }
                 }
            }else {
                resolveOut();
            }
            
            _canvas.style.cursor = mouseCursor;
        }

}

var canvas:Canvate = new Canvate(900, 1250);