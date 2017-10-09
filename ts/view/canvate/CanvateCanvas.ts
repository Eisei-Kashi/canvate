import { Shape }       from "./Shape";
import { Box }         from "./Box";
import { AppEvent } from "../../event/AppEvent";

export class CanvateCanvas extends Shape {
    protected _image:HTMLCanvasElement = new HTMLCanvasElement();
    
    constructor(x:number=0, y:number=0, width:number=0, height:number=0, crop?:Box){
        super(x, y, width, height, crop);
    }

    set image (img:HTMLCanvasElement){
        this._image = img;
    }

    get image ():HTMLCanvasElement{
        return this._image;
    }
}