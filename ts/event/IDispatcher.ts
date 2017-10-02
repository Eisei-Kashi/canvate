export interface IDispatcher{
    addEventListener(type:string, listener:Function):Boolean;
    removeEventListener(type:string, listener:Function):Boolean;
}