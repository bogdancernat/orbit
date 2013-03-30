var orbit = {
  circles: [],
  mousePosition: {x:110,y:110},
  needToClean: false,
  getRadians:  function (angle) {
    return angle * Math.PI/180;
  },
  distAB: function (x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  },
  init: function () {
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    this.canvas = document.querySelector("#canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("click", this.addCircle);
    this.canvas.addEventListener("mousemove",this.updateMousePosition);
    this.clearButton = document.querySelector("#clear");
    this.clearButton.addEventListener("click",this.clearCanvas);
  },
  clearCanvas: function (){
    if(!this.needToClean){
      this.needToClean = true;
    }
  },
  updateMousePosition: function (e){
    var pos = orbit.getElemPosition(orbit.canvas);
    orbit.mousePosition = {x: e.pageX - pos.x,
                     y: e.pageY - pos.y};
  },
  getElemPosition: function (e) {
    function getNumericStyleProperty(style, prop){
        return parseInt(style.getPropertyValue(prop),10) ;
    }
    var x = 0, y = 0;
    var inner = true ;
    do {
      x += e.offsetLeft;
      y += e.offsetTop;
      var style = getComputedStyle(e,null) ;
      var borderTop = getNumericStyleProperty(style,"border-top-width") ;
      var borderLeft = getNumericStyleProperty(style,"border-left-width") ;
      y += borderTop ;
      x += borderLeft ;
      if (inner){
        var paddingTop = getNumericStyleProperty(style,"padding-top") ;
        var paddingLeft = getNumericStyleProperty(style,"padding-left") ;
        y += paddingTop ;
        x += paddingLeft ;
      }
      inner = false ;
    } while (e = e.offsetParent);
    return { x: x, y: y };
  },
  animate: function(){
    requestAnimFrame(orbit.animate);
    orbit.draw();
  },
  draw: function(){
    var time = new Date().getTime() * 0.0004;
    this.context.fillStyle = 'rgba(244, 251, 232, 0.1)';
    this.context.fillRect(0,0,canvas.width,canvas.height);
    // console.log(this.circles);
    // console.log("mouse x:"+this.mousePosition.x);
    for (var i = 0; i < this.circles.length; i++) {
      this.context.beginPath();
      this.context.fillStyle = 'rgba('+this.circles[i].red+', '+this.circles[i].green+', '+this.circles[i].blue+', '+this.circles[i].alpha+')'; 
      this.context.arc(this.circles[i].xr + this.mousePosition.x,
                       this.circles[i].yr + this.mousePosition.y,
                       this.circles[i].r,
                       0,
                       Math.PI*2,
                       true);
      this.context.fill();
      this.context.closePath();
    };
    // if(this.needToClean){
    //   for(var i = 0; i < this.circles.length; i++){
        
    //   }
    // }
    this.updateCircles();
  },
  getCoordsDistAngle: function (angle, distance) {
    var rad = this.getRadians(angle);
    var c = {
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance
    };
    return c;
  },
  updateCircles: function(){
    for (var i = 0; i < this.circles.length; i++) {
      if(this.circles[i].distance - this.circles[i].distModif < 0 || 
         this.circles[i].distance - this.circles[i].distModif > 260){
        this.circles[i].distModif *= -1;
      }
      this.circles[i].distance -= this.circles[i].distModif;
      var c = orbit.getCoordsDistAngle(this.circles[i].angle,this.circles[i].distance);
      this.circles[i].angle = (this.circles[i].angle + this.circles[i].speed) % 360;
      this.circles[i].xr = c.x;
      this.circles[i].yr = c.y;
      // this.circles[i].speed = Math.sin(new Date().getTime()) * Math.random()*3;
    };
  },
  addCircle: function(){
    // var xPositivity = (Math.floor(Math.random()*10)%2==0) ? 1 : -1;
    // var yPositivity = (Math.floor(Math.random()*10)%2==0) ? 1 : -1;
    for (var i = 0; i < 1; i++) {
      var distance = Math.random()*220+40;
      var angle = Math.floor(Math.random()*360);
      var result = orbit.getCoordsDistAngle(angle,distance);
      var circle = {
        // xr: Math.floor(Math.random()*100+20) * xPositivity,
        // yr: Math.floor(Math.random()*100+20) * yPositivity,
        xr: result.x,
        yr: result.y,
        angle: angle,
        distance: distance,
        r: Math.floor(Math.random()*4+1),
        red: Math.floor(Math.random()*256),
        green: Math.floor(Math.random()*256),
        blue: Math.floor(Math.random()*256),
        alpha: Math.random(),
        speed: Math.random()*1.8+0.2,
        distModif: Math.random()*0.6
      };
      orbit.circles.push(circle);
      
    };

    // console.log(orbit.circles);
  }
};
window.onload = function(){
  orbit.init();
  orbit.animate();
}