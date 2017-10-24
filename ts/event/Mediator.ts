import { Emmiter }  from "./Emmiter";
import { IEmmiter } from "./IEmmiter";
import { CanvateEvent } from "./CanvateEvent";

export class CanvateMediator implements IEmmiter {
    private _emmiter:Emmiter = new Emmiter(this);

    public addEventListener(type:string, listener:Function):Boolean {
        let wasAdded:Boolean     = this._emmiter.addEventListener(type, listener);
        return wasAdded;
    }

    public removeEventListener(type:string, listener:Function):Boolean {
        let wasRemoved:Boolean   = this._emmiter.removeEventListener(type, listener);
        return wasRemoved;
    }

    public emit (event:Event):void {
        this._emmiter.emit(event)
    }
}

export const CANVATE_MEDIATOR:CanvateMediator = new CanvateMediator();