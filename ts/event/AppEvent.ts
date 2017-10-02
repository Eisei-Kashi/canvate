export class AppEvent extends Event{
    private _type:string;
    private _data:any;

    constructor(type:string, data?:any) {
        
        if(null == type){
            throw new Error("The type property must be different from 0");
        }
        
        if(type.length == 0){
            throw new Error("The type property must be a String with a length greater than 0");
        }

        super(type);
        
        this._type = type;
        this._data = data;
    }

    get type ():string {
        return this._type;
    }

    get target ():any {
        return this._data
    }

    public clone ():AppEvent {
        return new AppEvent(this._type, this._data);
    }
}