export class CanvateMediator implements IDispatcher {
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