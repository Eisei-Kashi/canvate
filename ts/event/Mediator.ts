import { Dispatcher }  from "./Dispatcher";
import { IDispatcher } from "./IDispatcher";
import { CanvateEvent } from "./CanvateEvent";

export class CanvateMediator implements IDispatcher {
    private _dispatcher:Dispatcher = new Dispatcher(this);

    public addEventListener(type:string, listener:Function):Boolean {
        let wasAdded:Boolean     = this._dispatcher.addEventListener(type, listener);
        return wasAdded;
    }

    public removeEventListener(type:string, listener:Function):Boolean {
        let wasRemoved:Boolean   = this._dispatcher.removeEventListener(type, listener);
        return wasRemoved;
    }

    public dispatchEvent (event:Event):void {
        this._dispatcher.dispatch(event)
    }
}

export const CANVATE_MEDIATOR:CanvateMediator = new CanvateMediator();