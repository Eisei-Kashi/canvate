export class Bitmap extends Rectangle {
    constructor(image:ImageBitmap, crop?:Box){
        super(0, 0);
        this._type = types.Bitmap;
        if(null != crop){
            this._crop   = crop;
        }

        this._width  = this._crop.width;
        this._height = this._crop.height;
    }
}