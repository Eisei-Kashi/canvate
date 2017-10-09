import { Shape }       from "./Shape";
import { Box }         from "./Box";
import { AppEvent } from "../../event/AppEvent";

export interface IKeyHTMLImageElement {
    [key: string]: HTMLImageElement;
}

export let  _imagesLoaded:IKeyHTMLImageElement = {};

export class CanvateImage extends Shape {
    protected _image:HTMLImageElement = new HTMLImageElement();
    protected _url:string;
    protected _nonZeroSize:Boolean = true;

    constructor(x:number=0, y:number=0, width:number=0, height:number=0, crop?:Box){
        super(x, y, width, height, crop);
        this._image.onload  = this.onLoad;
        this._image.onerror = this.onError;
    }

    set src(url:string){
        this._url = url;
        if(undefined != _imagesLoaded[this._url] ){
            this.onLoad();
        }else{
            this._image.src = this._url;
        }
    }

    set image (img:HTMLImageElement){
        this._image = img;
    }

    get image ():HTMLImageElement{
        return this._image;
    }

    set resizeOnLoad(value:Boolean){
        this._nonZeroSize = value;
    }

    get resizeOnLoad():Boolean{
        return this._nonZeroSize;
    }

    private onLoad (event?:Event) {
        _imagesLoaded[this._url] = this._image;
        if(this._nonZeroSize){
            if(0 == this._width){
                this._width = this._image.width;
            }

            if(0 == this._crop.width){
                this._crop.width = this._image.width;
            }

            if(0 == this._height){
                this._height = this._image.height;
            }

            if(0 == this._crop.height){
                this._crop.height = this._image.height;
            }
        }
        var eventToDispatch:AppEvent = new AppEvent(AppEvent.COMPLETE, this._image);
    }

    private onError (){
        console.error("Image can not be loaded.\n");
        console.error(this._url);
    }
}