window.imagesLoaded = [];

window.Canvate = function(width, height, element, canvasDebugger) {
	
	// ::: SHAPES HELPERS ::: //
    
    function convertImageToCanvas(image, shape){
        setImageArguments(shape, image.width, image.height);
        var crop       = shape.crop;
        var clipX      = crop.x;
        var clipY      = crop.y;
        var clipWidth  = crop.width;
        var clipHeigth = crop.height;
        var x          = shape.x || 0;
        var y          = shape.y || 0;
        var width      = shape.width  || image.width;
        var height     = shape.height || image.height;
        
        var imageCanvas        = document.createElement('canvas');
            imageCanvas.width  = image.width;
            imageCanvas.height = image.height;
        var imageContext       = imageCanvas.getContext('2d');
        imageContext.drawImage(image, 0,     0,     image.width,     image.height);
        
        shape.canvas  = imageCanvas;
        shape.context = imageContext;
    }
    
	function _drawSecuence (secuence, button, originalWidth, originalHeight){
		if(false == secuence.visible || secuence.isMask){
			// Early return
			return;
		}
		
		var params = secuence.getCanvasToRender();
		renderCanvas.apply(null, params);
	}

	function _drawCanvas (shape, button, originalWidth, originalHeight){
		if(false == shape.visible){
			// Early return
			return;
		}
		var crop       = shape.crop;
		var cropX      = crop.x;
		var cropY      = crop.y;
		var cropWidth  = crop.width;
		var cropHeight = crop.height;
		var x          = shape.x;
		var y          = shape.y;
		var width      = shape.width;
		var height     = shape.height;
		var rotation   = isNaN(shape.rotation) ? 0 : shape.rotation;
		var alpha      = isNaN(shape.alpha)    ? 1 : shape.alpha;
		
		var pivotX     = shape.pivotX;
		var pivotY     = shape.pivotY;
		
		renderCanvas({
						  canvas:shape.canvas
						 ,button:button.button
						 ,cropX:cropX, cropY:cropY
						 ,cropWidth:cropWidth, cropHeight:cropHeight
						 ,x:x, y:y
						 ,width:width, height:height
						 ,alpha:alpha
						 ,rotation:rotation
						 ,pivotX:pivotX, pivotY:pivotY
						 ,scaleX:shape.scaleX, scaleY:shape.scaleY
					});
	}
	
	function _addCommand (functionReference, argumentList, index){
		var data = {command:functionReference, argumentList:argumentList};
		argumentList[0].command = data;
    }

    // ::: SHAPES INTERFACE ::: //
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
    
    this.drawCircle = function (data){
        var x     = data.x;
        var y     = data.y;
        var size  = data.size;
        var color = data.color;
        var alpha = data.alpha;
        
        var shape               = {x:x, y:y, width:size, height:size, color:color, alpha:alpha};
		
        setImageArguments(shape);
		
        var halfSize            = size/2;
        var key                 = setButton(shape);
       
        var canvas              = document.createElement('canvas');
            canvas.width        = size+1;
            canvas.height       = size+1;
            
        var context             = canvas.getContext('2d');
            context.beginPath();
            context.fillStyle   = color;
            context.arc(halfSize, halfSize, halfSize, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
            shape.canvas        = canvas;
        
        var buttonCanvas        = document.createElement('canvas');
            buttonCanvas.width  = size;
            buttonCanvas.height = size;
            
        var buttonContext       = buttonCanvas.getContext('2d');
            buttonContext.beginPath();
            buttonContext.fillStyle = key;
            buttonContext.arc(halfSize, halfSize, halfSize, 0, Math.PI*2, true);
            buttonContext.closePath();
            buttonContext.fill();
            
       var argumentsList = [shape, buttonCanvas, size, size];
       _addCommand(_drawCanvas, argumentsList);
       return shape;
	}
	
	this.loadSprite = function (url, onLoadComplete, onError){
		var frameRate = 30;
		var image     = new Image();
		var shape     = {};

		shape.image         = image;
		shape.frameRate     = frameRate;

		shape.getSecuence = function(data, crop){
			var localFrameRate = isNaN(data.frameRate) ? shape.frameRate : data.frameRate;
			var secuence       = new Secuence(shape.canvas, data, crop);
			secuence.stopAt(1);
			return secuence;
		}
		
		shape.getImage = function(crop, data){
			data = null == data ? {totalFrames : 1} : data;
			var secuence = new Secuence(shape.canvas, data, crop);
				secuence.stopAt(0);
			return secuence;
		}

		shape.loadImage = function(url){
			image.src = url;
		}

		image.onload = function() {
			convertImageToCanvas(image, shape);
			if(Boolean(shape.onLoad)){
				shape.onLoad();
			}

			if(typeof onLoadComplete === "function"){
				onLoadComplete(shape);
			}
		}

		image.onerror = function(){
			if(typeof onError === "function"){
				onError("Error loading the image: " + url, );
			}

			if(Boolean(shape.onError)){
				shape.onError(url, shape);
			}else{
				throw new Error("Error loading the image: " + url);
			}
		}
		
		image.src = url;
		return shape;
	}
	
    this.captureImage = function (data, cropData){
        var node   = data.node; 
        var x      = data.x;
        var y      = data.y;
        var width  = data.width;
        var height = data.height;
       
        var shape = {image:node, x:x, y:y, width:width, height:height, crop:cropData};
        convertImageToCanvas(node, shape);
        button    = setButtonCanvas(shape);
        _addCommand(_drawCanvas,[shape, button, width, height]);
		
		return shape;
    }
	
	this.captureCanvas = function (canvas, data, cropData){
		data       = null == data     ? {} : data;
		cropData   = null == cropData ? {} : cropData;
		
		var x      = data.x || 0;
		var y      = data.y || 0;
		var width  = canvas.width  || canvas.width;
		var height = canvas.height || canvas.height;
	   
		var shape = {x:x, y:y, width:width, height:height, crop:cropData};
		
		setImageArguments(shape, width, height);
		
		var clipX      = cropData.x;
		var clipY      = cropData.y;
		var clipWidth  = cropData.width;
		var clipHeigth = cropData.height;
		var x          = shape.x || 0;
		var y          = shape.y || 0;
		var width      = shape.width  || width;
		var height     = shape.height || height;
		
		shape.canvas  = canvas;
		shape.context = canvas.getContext("2d");
		
		button    = setButtonCanvas(shape);
		_addCommand(_drawCanvas,[shape, button, width, height]);
		
		return shape;
	}
	
	// ::: CANVATE ::: //
	this.getCanvas = function (){
		return _canvas;
	}

	this.getContext = function (){
		return _context;
	}

	this.setUpdateCallback = function (callback){
		_updateCallback = callback;
	}

	this.switchShapes = function (shape1, shape2){
		if(shape1 == shape2){
			return;
		}
		
		var index1;
		var index2;
		var shape;
		var index = _drawsList.length;
		while(--index > -1){
			shape = _drawsList[index].argumentList[0];
			if(shape1 == shape){
				index1 = index;
			}
			
			if(shape2 == shape){
				index2 = index;
			}
		}
		
		if(null != index1 && null != index2){
			var command1 = _drawsList[index1];
			var command2 = _drawsList[index2];
			_drawsList[index1] = command2;
			_drawsList[index2] = command1;
		}
	}
    
	this.bringToFront = function (shape){
	   this.setDepth(shape, _drawsList.length-1);
	}

	this.sendToBack = function (shape){
		this.setDepth(shape, 0);
	}

	this.setDepth = function (shape, depth){
		if(isNaN(depth)){
			return;
		}
		var index = _drawsList.length;
		depth     = depth >= index ? index-1 : depth;
		depth     = depth < 0      ? 0       : depth;
		
		while(--index > -1){
			if(shape == _drawsList[index].argumentList[0]){
				var data = _drawsList.splice(index, 1)[0];
				_drawsList.splice(depth, 0, data);
				return;
			}
		}
	}

	this.addChild = function(child){
		_drawsList.push(child.command);
	}

	this.getCanvas = function(){
		return _canvas;
	}
    
	// ::: SECUENCE ::: //
	function Secuence(canvasOrigin, data, tile){
		var self          = this;
		this.framesList   = [];
		this.crop         = tile;
		
		for(var key in data){
			this[key] = data[key];
		}
		
		var maxWidth      = canvasOrigin.width;
		var maxHeight     = canvasOrigin.height;
		
		setImageArguments (this, maxWidth, maxHeight);
		
		var totalFrames   = data.totalFrames;
		
		tile              = null == tile ? {x:0, y:0, width:maxWidth, height:maxHeight} : tile;
		var tileX         = tile.x;
		var tileY         = tile.y;
		var width         = tile.width;
		var height        = tile.height;
		
		var canvas        = document.createElement('canvas');
			canvas.width  = width*totalFrames;
			canvas.height = height;
		var context       = canvas.getContext('2d');
		this.canvas       = canvas;
		this.context      = context;
		var rowX;
		for(var index=0; index < totalFrames; index++){
			rowX = width*index;
			this.framesList.push({
									x      : rowX,
									y      : 0,
									width  : width,
									height : height
								});
			
			context.drawImage(canvasOrigin, tileX,   tileY, width, height, 
											rowX, 0, width, height);
			
			tileX += width;
			if(tileX >= maxWidth){
				tileX = 0;
				tileY += height;
				if(tile.y > maxHeight){
					throw new Error("The total frames is out of bound");
				}
			}
		}
		
		var _button         = setButtonCanvas(self);
		var _originalWidth  = width;
		var _originalHeight = height;
		var _params         = [this, _button, width, height];
		var _commandId      = _addCommand(_drawSecuence, _params);

		function _playUntil(index){
			self.increment = self.frameIndex >= index ? -1 : 1;
			self.endIndex  = index;
		}

		var getIndexByFrame = function(frame){
			if(isNaN(frame)){
				throw new Error("The frame must be a integer and is: " + frame);
			}
			var index = frame - 1;
				index = index < 0 ? 0 : index;
				index = index >= self.framesList.length ? self.framesList.length-1 : index;
			
			return index;
		}

		var getFrameByIndex = function(index){
			if(isNaN(index)){
				throw new Error("The frame must be a integer and is: " + frame);
			}
			var index = frame - 1;
				index = index < 1 ? 1 : index;
				index = index >= self.framesList.length ? self.framesList.length-1 : index;
			return index+1;
		}
		
		// Secuence interface

		this.bringToFront = function(){
			_self.bringToFront(this);
		}
		
		this.onUpdateFrame = function(){
			//console.log(self.frame);
		}

		this.onUpdateRatio = function(){
			var frame         = getFrameByIndex(Math.floor(self.ratio*self.framesList.length));
			self.currentFrame = frame;
			frame--;
			self.frameIndex   = frame;
			self.endIndex     = frame;
		}

		this.play = function(onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
		   self.lastTime   = Date.now();
		   var index       = self.framesList.length-1;
		   self.lastAction = "play";
		   _playUntil(index);
		}

		this.playLoop = function(onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
		   self.lastTime   = Date.now();
		   var index       = self.framesList.length-1;
		   self.lastAction = "playLoop";
		   _playUntil(index);
		}

		this.playFrom = function(frame, onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
			self.lastTime     = Date.now();
			var index         = getIndexByFrame(frame);
			self.currentFrame = index+1;
			self.frameIndex   = index;
			self.lastAction   = "playFrom";
			_playUntil(self.framesList.length-1);
		}

		this.playUntil = function(frame, onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
			self.lastTime   = Date.now();
			var index       = getIndexByFrame(frame);
			self.lastAction = "playUntil";
			_playUntil(index);
		}

		this.playBetween = function(fromFrame, untilFrame, onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
			self.lastTime        = Date.now();
			var fromIndex        = getIndexByFrame(fromFrame);
			var untilIndex       = getIndexByFrame(untilFrame);
			self.frameIndex      = fromIndex;
			self.currentFrame    = fromIndex+1;
			self.lastAction      = "playBetween";
			_playUntil(untilIndex);
		}

		this.stop = function(onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
			self.lastTime        = Date.now();
			var index            = self.frameIndex;
			self.currentFrame    = index+1;
			self.endIndex        = index;
			self.lastAction      = "stop";
		}

		this.stopAt = function(frame, onFrame){
			if(onFrame != null){
				this.onFrame = onFrame;
			}
			self.lastTime        = Date.now();
			var index            = getIndexByFrame(frame);
			self.currentFrame    = index+1;
			self.frameIndex      = index;
			self.endIndex        = index;
			self.lastAction      = "stopAt";
		}
		
		this.setMask = function(mask, type){
			// source-over     : default
			// source-in       : renders source only in the intersections
			// source-out      : renders source only in the non intersections
			
			// source-atop     : renders the base and the interseccion with source
			
			// destination-in  : renders base only in the intersections
			// destination-out : renders base only in the non intersection
			
			// xor             : erases only intersection
			
			if(null != this.mask){
				this.mask.isMask = false;
			}
			
			mask.isMask   = true;
			this.mask     = mask;
			this.typeMask = _maskTypes[type] || _maskTypes.mask;
		}

		this.getRenderData = function(){
			var crop       = this.crop;
			var index      = this.frameIndex;
			var cropData   = this.framesList[index];
			var cropX      = crop.x      = cropData.x;
			var cropY      = crop.y      = cropData.y;
			var cropWidth  = crop.width  = cropData.width;
			var cropHeight = crop.height = cropData.height;
			
			var width      = this.width;
			var height     = this.height;
			var rotation   = this.rotation * (Math.PI*2)/360;
			var alpha      = this.alpha;
			
			var pivotX     = this.pivotX;
			var pivotY     = this.pivotY;
			var x          = this.x;
			var y          = this.y;
			
			var scaleX     = this.scaleX;
			var scaleY     = this.scaleY;
			
			this.currentFrame = index+1;
			
			var now = Date.now();
			var isTime = (now - this.lastTime) >= 1000/this.frameRate;
			
			if(isTime){
				this.lastTime = now;
				if(this.frameIndex !=  this.endIndex){
					this.frameIndex += this.increment;
				}else if(this.increment != 0){
					this.increment = 0;
					if(this.onFrame != null){
						this.onFrame(this.currentFrame, Math.floor(cropY/cropHeight), this.lastAction);
					}
					if(this.lastAction == "playLoop"){
						this.frameIndex = 0;
						this.playLoop(this.onFrame);
					}
				}
			}
			
			var data  = {
							 canvas:canvas
							,button: null
							,x:x
							,y:y
							,width:width ,height:height
							,cropWidth:cropWidth ,cropHeight:cropHeight ,cropX:cropX ,cropY:cropY
							,alpha:alpha
							,rotation:rotation
							,pivotX:pivotX ,pivotY:pivotY
							,scaleX:scaleX, scaleY:scaleY
						}
			return data;
		}
		
		this.getCanvasToRender = function(){
			
			var data  = this.getRenderData();
			var data1 = this.getRenderData();
			var mask  = this.mask;
			
			var button = _button.button;
			
			if(null != mask){
				_tempCanvas.width  = _canvas.width;
				_tempCanvas.height = _canvas.height;
				
				renderCanvas(data, _tempContext);
				
				_tempContext.globalCompositeOperation = 'destination-in';
				
				var maskData          = mask.getRenderData();
				renderCanvas(maskData, _tempContext);
				data.canvas           = _tempCanvas;
			}
			
			data.button = _button.button
			return [data];
		}
	}
	
	// ::: RENDER ::: //
	function displayGrid (){
		color = "red";
		_context.beginPath();
		var gap = 50;
		var x = 0;
		var y = 0;
		var width  = _canvas.width;
		var height = _canvas.height;
		
		while(x < width){
			_context.moveTo(x, 0);
			_context.lineTo(x, 0);
			_context.lineTo(x, height);
			x += gap
		}
		_context.strokeStyle = "lightgray";
		_context.stroke();
		x = 0;
		
		while(y < height){
			_context.moveTo(0, y);
			_context.lineTo(0, y);
			_context.lineTo(width, y);
			y += gap
		}
		_context.strokeStyle = "lightgray";
		_context.stroke();
	}

	function renderCanvas(data, target){
		var context       =  target || _contextOff;
		var buttonContext = !target ?  _contextButtons : null;
		
		context.save();
		context.globalAlpha = data.alpha;

		var pivotX  = data.pivotX;
		var pivotY  = data.pivotY;
		var x       = data.x;
		var y       = data.y;
		var radians = data.rotation;
		var scaleX  = data.scaleX;
		var scaleY  = data.scaleY;
		
		context.translate(x, y);
		context.rotate(radians);
		context.scale(scaleX, scaleY);
		
		var cropX      = data.cropX;
		var cropY      = data.cropY;
		var cropWidth  = data.cropWidth;
		var cropHeight = data.cropHeight;
		var width      = data.width;
		var height     = data.height;

		context.drawImage(data.canvas
						 ,cropX,     cropY
						 ,cropWidth, cropHeight
						 ,-pivotX*width,   -pivotY*height
						 ,width,     height);
		
		context.restore();
		
		if(null != data.button){
			buttonContext.save();
			
			buttonContext.translate(x, y);
			buttonContext.rotate(radians);
			buttonContext.scale(scaleX, scaleY);
			buttonContext.drawImage(data.button,
									cropX,      cropY
									,cropWidth, cropHeight
									,-pivotX*width,   -pivotY*height
									,width,     height);
			
			buttonContext.restore();
		}
	}
    
	function update(){
		if(Boolean(_updateCallback)){
			_updateCallback();
		}
		
		_canvas.width         = _width;
		_canvas.height        = _height;
		_canvasButtons.width  = _width;
		_canvasButtons.height = _height;
		_canvasOff.width      = _width;
		_canvasOff.height     = _height;
		
		
		_displayBackground();
		var data;
		var command;
		var argumentList;
		var length = _drawsList.length;
		for(var index=0; index < length; index++){
			data         = _drawsList[index];
			command      = data.command;
			argumentList = data.argumentList;
			try {
				command.apply(this, argumentList);
			}catch(error){
				// console.log("The command is undefined");
			}
		}
		
		resolveOver();
		
		_context.drawImage(_canvasOff, 0, 0);
		//displayGrid();
		requestAnimationFrame(update);
	}
 };