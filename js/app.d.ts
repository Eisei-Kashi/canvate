declare class Canvate {
    private _lastTime;
    private _enterFrame;
    constructor(width: number, height: number, element?: HTMLElement, canvasDebugger?: HTMLElement);
    private fallback(callback, element);
}
declare var canvas: Canvate;
declare class Test {
    constructor();
}
declare var test: Test;
