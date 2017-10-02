import { IDispatcher } from "./IDispatcher";
import { AppEvent }    from "./AppEvent";

interface IKeyFunction {
    [key: string]:Function[];
}

export class Dispatcher implements IDispatcher{

    private _target:IDispatcher;
    private _eventsListenerList:IKeyFunction = {};

    constructor (target:IDispatcher){
        this._target = target;
    }

    public addEventListener(type:string, listenerToAdd:Function):Boolean{
        if(null == type){
            throw new Error("The type property must be different from 0");
        }

        if(type.length == 0){
            throw new Error("The type property must be a String with a length greater than 0");
        
        }
        
        let listenerList:Function[] = <Function[]>this._eventsListenerList[type];
        if(null == listenerList){
            listenerList = [];
            this._eventsListenerList[type] = listenerList;
        }

        let length = listenerList.length;
        let listener:Function;
        for(let index = 0; index < length; index++){
            if(listenerList[index] == listenerToAdd){
                // Early return
                return false;
            }
        }

        listenerList.push(listenerToAdd);
        return true;
    }

    public removeEventListener(type:string, listenerToRemove:Function):Boolean{
        if(null == type){
            throw new Error("The type property must be different from 0");
        }

        if(type.length == 0){
            throw new Error("The type property must be a String with a length greater than 0");
        
        }
        
        let listenerList:Function[] = <Function[]>this._eventsListenerList[type];
        if(null == listenerList){
            // Early return
            return false;
        }

        let length = listenerList.length;
        let listener:Function;
        for(let index = 0; index < length; index++){
            if(listenerList[index] == listenerToRemove){
                listenerList.splice(index, 1);
            }
        }
        return true;
    }

    public dispatch (event:Event):void{
        var type = event.type;
        let listenerList:Function[] = <Function[]>this._eventsListenerList[type];
        if(null == listenerList){
            // Early return
            return;
        }

        let length = listenerList.length;
        let listener:Function;
        for(let index = 0; index < length; index++){
            listenerList[index](event);
        }
    }

    public dispatchByType(type:string, data?:any):void {
        if(null == type){
            throw new Error("The type property must be different from 0");
        }

        if(type.length == 0){
            throw new Error("The type property must be a String with a length greater than 0");
        }

        var event:AppEvent = new AppEvent(type, data);
        dispatchEvent(event);
    }
}