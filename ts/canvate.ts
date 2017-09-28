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
	private _drawsList       = []; //TODO Vector
	private _buttonsList     = {}; //TODO Vector   
	private _lastColor:number       = 1;
	private _self:Canvate           = this;
	private _colorBackground:String = "#0";
	private _alphaBackground:number = 1;
	private _maskTypes:any      = { //TODO 
								 mask  : 'destination-in'
								,slice : 'destination-out'
								// source-over     : default
								// source-in       : renders source only in the intersections
								// source-out      : renders source only in the non intersections
								
								// source-atop     : renders the base and the interseccion with source
								
								// destination-in  : renders base only in the intersections
								// destination-out : renders base only in the non intersection
								
								// xor             : erases only intersection
							}
    
    private _imageBackground:any; //TODO 
	private _displayBackground:any //TODO;
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
	private _bounds:any; //TODO
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
        this._width           = width;
        this._height          = height;
        
        this._canvas          = element || document.createElement("canvas");
        this._context         = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        this._tempCanvas      = document.createElement("canvas");
        this._tempContext     = <CanvasRenderingContext2D>this._tempCanvas.getContext("2d");
        
        this._enterFrame = this.fallback;


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
		/*
		_canvas.onmousemove = function(event) {
			event.preventDefault();
			_bounds = _canvas.getBoundingClientRect();
			_mouseX = event.clientX;
			_mouseY = event.clientY;
			_lastX  = (_mouseX - _bounds.left) * (_canvas.width/_bounds.width);
			_lastY  = (_mouseY - _bounds.top) * (_canvas.width/_bounds.width);
			
			resolveOver();
		};
		
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
		_displayBackground = _setColorBackground;
		
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
}

var canvas:Canvate = new Canvate(900, 1250);