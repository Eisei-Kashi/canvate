import {AppEvent} from "./AppEvent";

export class CanvateEvent extends AppEvent{
    public static ADDED:string         = "canvateAdded";
    public static REMOVED:string       = "canvateRemoved";
    public static CLICK_OUTSIDE:string = "canvateClickOutside";

    private _shapeId:number;

    constructor(type:string, shapeId:number) {
        super(type);
        this._shapeId = shapeId;
    }

    get shapeId ():number {
        return this._shapeId;
    }
}