import { Shape }       from "./Shape";
import { Box }         from "./Box";
import { AppEvent } from "../../event/AppEvent";

export class CanvateVideo extends Shape {
    protected _image:HTMLVideoElement = new HTMLVideoElement();
    
    constructor(x:number=0, y:number=0, width:number=0, height:number=0, crop?:Box){
        super(x, y, width, height, crop);
    }

    protected _image:HTMLVideoElement = new HTMLVideoElement();
    set image (img:HTMLVideoElement){
        this._image = img;
    }

    get image ():HTMLVideoElement{
        return this._image;
    }
}