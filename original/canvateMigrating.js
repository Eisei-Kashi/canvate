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
 };