"use strict";
var Canvate = /** @class */ (function () {
    function Canvate(width, height, element, canvasDebugger) {
        this._lastTime = 0;
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
        this._enterFrame = this.fallback;
    }
    Canvate.prototype.fallback = function (callback, element) {
        var currTime = Date.now();
        var timeToCall = Math.max(0, 16 - (currTime - this._lastTime));
        var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
        this._lastTime = currTime + timeToCall;
        return id;
    };
    ;
    return Canvate;
}());
var canvas = new Canvate(900, 1250);
var Test = /** @class */ (function () {
    function Test() {
        console.log("Test object compiled!");
    }
    return Test;
}());
var test = new Test();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2FudmF0ZS50cyIsIi4uL3RzL3Rlc3QvVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7SUFJSSxpQkFBYSxLQUFZLEVBQUUsTUFBYSxFQUFFLE9BQW9CLEVBQUUsY0FBMkI7UUFIbkYsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUlsQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakM7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQWtCRTtRQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBRU8sMEJBQVEsR0FBaEIsVUFBa0IsUUFBaUIsRUFBRSxPQUFtQjtRQUNwRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYSxRQUFRLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN4RSxVQUFVLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN2QyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUFBLENBQUM7SUFDTixjQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQztBQUVELElBQUksTUFBTSxHQUFXLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQ3RDNUM7SUFDSTtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQsSUFBSSxJQUFJLEdBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENhbnZhdGUge1xyXG4gICAgcHJpdmF0ZSBfbGFzdFRpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZW50ZXJGcmFtZTpGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCBlbGVtZW50PzpIVE1MRWxlbWVudCwgY2FudmFzRGVidWdnZXI/OkhUTUxFbGVtZW50KXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnZhdGUgaXMgQWxpdmUhXCIpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgbGV0IHZlbmRvcnMgID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbnRlckZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5fZW50ZXJGcmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2VudGVyRnJhbWUgPSB0aGlzLmZhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKXtcclxuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9lbnRlckZyYW1lID0gdGhpcy5mYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZhbGxiYWNrIChjYWxsYmFjazpGdW5jdGlvbiwgZWxlbWVudDpIVE1MRWxlbWVudCk6bnVtYmVyIHtcclxuICAgICAgICBsZXQgY3VyclRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGxldCB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSB0aGlzLl9sYXN0VGltZSkpO1xyXG4gICAgICAgIGxldCBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LCBcclxuICAgICAgICAgIHRpbWVUb0NhbGwpO1xyXG4gICAgICAgIHRoaXMuX2xhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH07XHJcbn1cclxuXHJcbnZhciBjYW52YXM6Q2FudmF0ZSA9IG5ldyBDYW52YXRlKDkwMCwgMTI1MCk7IiwiY2xhc3MgVGVzdCB7XHJcbiAgICBjb25zdHJ1Y3RvciAoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRlc3Qgb2JqZWN0IGNvbXBpbGVkIVwiKTtcclxuICAgIH1cclxufVxyXG5cclxudmFyIHRlc3Q6VGVzdCA9IG5ldyBUZXN0KCk7Il19