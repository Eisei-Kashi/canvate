// For testing, a helper to load data
function loadXML(url, onLoadComplete, onError){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/server', true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
        }
    }
    xhr.send("foo=bar&lorem=ipsum"); 
    // xhr.send('string'); 
    // xhr.send(new Blob()); 
    // xhr.send(new Int8Array()); 
    // xhr.send({ form: 'data' }); 
    // xhr.send(document);
}

var Data = {
    appWidth:640
  , appHeight:1136
  , backgroundPath:"img/background/"
}

//Take the reference of a Canvas tag in the HTML
var element = document.getElementById("WAM");
//Create the CANVATE
var _canvate = new Canvate(Data.appWidth, Data.appHeight, element);

//Helper to load images inside the Canvate.
// url      : url of the image
// onLoad   : callback when the image is loaded
// onError  : callback for fail loading.
function loadImage(url, onLoad, onError){
  _canvate.loadSprite(url, onLoad, onError);
}

// Reference to the splash sprite
var splash;
// Reference to the loading animation
var loadingAnim;

// Load a loading image inside the Canvate
var url = "img/loader/loading.png";
loadImage(url, onLoadingLoaded);

// Callback when the loading image is loaded
function onLoadingLoaded( loader){
    // Properties of the animation, is like a MovieClip in Flash
    var spriteData = {};
    
    spriteData.frameRate   = 3;
    spriteData.totalFrames = 10;
    
    spriteData.x           = 318;
    spriteData.y           = 325;
    spriteData.pivotX      = 0.5;
    spriteData.pivotY      = 0.5;
    spriteData.width       = 120;
    spriteData.height      = 120;

    var gridData = {
                      x:0, y:0 //Coordinate from were capture the tiles
                     ,width:300, height:300 //Size of the tile
                    };

    // Get the Secuence from the loader.
    loadingAnim = loader.getSecuence(spriteData, gridData);
    
    // Loads the splash.
    loadImage("img/background/splash.png", onSpalshLoaded);
}

// Callback when the image splah is loaded
function onSpalshLoaded(loader){
    // Get an image from the loader.
    splash      = loader.getImage();

    // Set the position
    splash.x    = 0;
    splash.y    = 0;

    // Add the image to the Canvate
    _canvate.addChild(splash);
    // Add the Secuence to the Canvate
    _canvate.addChild(loadingAnim);

    // Trigger the animation, it will play as a loop
    loadingAnim.playLoop();
}