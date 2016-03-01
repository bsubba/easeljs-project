var stage;
var clickCount = 0;
var coordinates = [];
var centroid = [];
function init() { 
    var canvas = document.getElementsByTagName('canvas')[0];
    stage = new createjs.Stage("canvas");
    //Mouse click event listener
    canvas.addEventListener("dblclick", generatePosition, false);
    stage.update();
}
/**** Function to create circle ****/
function createCircle(x,y,r,stroke,id){
    var circle = new createjs.Shape();
    circle.graphics.setStrokeStyle(4).beginStroke(stroke).drawCircle(0, 0, r);
    circle.x = x;
    circle.y = y;
    circle.name = "circle";
    circle.id = id;
    circle.on("pressmove",drag);
    text = new createjs.Text("("+x+","+y+")", "13px Arial", "#000000"); 
    text.name = "label";
    text.textAlign = "center";
    text.textBaseline = "middle";
    text.x = x;
    text.y = y-25;
    text.id = id;
    circle.textObj = text;
    stage.addChild(circle, text); 
}  //End of function
/**** Function to create parallelogram ****/
function createParallelogram(points){
    var parlgrm = new createjs.Shape();
    parlgrm.graphics.beginStroke("blue");
    parlgrm.graphics.moveTo(points[0], points[1]).lineTo(points[4], points[5]).lineTo(points[2], points[3]).lineTo(points[6], points[7]).lineTo(points[0], points[1]);
    parlgrm.name="parallelogram";
    var centroidx =  (points[0]+points[2]+points[4]+points[6])/4;
    centroid.push(centroidx);
    var centroidy =  (points[1]+points[3]+points[5]+points[7])/4;  //Center of mass =(centroidx,centroidy)
    centroid.push(centroidy);
    stage.addChild(parlgrm);
}// End of function
/**** Drag event  ****/
function drag(evt) {
    var el = stage.children; //contains all the objects inside the canvas
    var sEl; 
    var xo = evt.target.x;  //original x position  before dragging
    var yo = evt.target.y;  //original y position  before dragging
    var dId = evt.target.id; //id of the dragged object
    evt.target.x = parseInt(evt.stageX.toFixed(0));  //change the x position of the dragged object
    evt.target.y = parseInt(evt.stageY.toFixed(0));  //change y position of the dragged object
    coordinates.splice(dId,1,evt.target.x); //Update array with new x position
    coordinates.splice(dId+1,1,evt.target.y); //Update array with new x position
    var textObj = evt.target.textObj;
    textObj.text = "("+evt.target.x+","+evt.target.y+")";
    textObj.x = parseInt(evt.stageX.toFixed(0));
    textObj.y = parseInt(evt.stageY.toFixed(0) - 20);
    var diffx = evt.target.x - xo;  //distace moved in x direction
    var diffy = evt.target.y- yo;   //distance moved in y direction
    
    //change the x and y position of all canvas objects with refernce to dragged objectw 
    for(sEl of el){
        var newX = sEl.x + diffx;
        var newY = sEl.y + diffy;
        if(dId != sEl.id && sEl.name!="area"){ 
            sEl.x = parseInt(newX);
            sEl.y = parseInt(newY);
            if(sEl.name=="circle"){
                coordinates.splice(sEl.id,1,newX); //Update array with new x position
                coordinates.splice(sEl.id+1,1,newY); //Update array with new y position
            }
            console.log(sEl.name+':y:'+newY);
            if(sEl.name === "label"){ 
                sEl.text = "("+coordinates[sEl.id]+","+coordinates[sEl.id+1]+")";
            }
        }
    }
  // make sure to redraw the stage to show the change
  stage.update();   
} //End of function
/**** Function to locate and generate circle on the clicked position ****/
function generatePosition(event)
{
    var x = event.clientX;
    var y = event.clientY;
    var canvas = document.getElementById("canvas");
    x = x - canvas.offsetLeft;
    y = y - canvas.offsetTop;     //(x,y) is the center of the circle
    if(clickCount < 6){
        coordinates.push(x);
        coordinates.push(y);
        createCircle(x,y,5.5,'red',clickCount);
        //display the parallelogram on after selection of third point
        if(clickCount == 4){
            var mx = (coordinates[0]+coordinates[2])/2;
            var my = (coordinates[1]+coordinates[3])/2;
            var xl = 2*mx-coordinates[4];    //midpoint formula
            var yl = 2*my-coordinates[5];    //(xl,yl) is the fourth co-ordinate of the parallelogram
            coordinates.push(xl);
            coordinates.push(yl);           // save the last co-ordinate in the same array
            createCircle(xl,yl,5.5,'red',clickCount+2);
            createParallelogram(coordinates);
            //find the area of parallelogram: absolute cross product of two adjacent sides vector
            var a1 =  coordinates[0]-coordinates[6];
            var a2 =  coordinates[1]-coordinates[7];
            var b1 =  coordinates[0]-coordinates[4];
            var b2 =  coordinates[1]-coordinates[5];
            var parArea = Math.abs(a1*b2-a2*b1);    //area of parallelogram
            var radius = Math.sqrt(parArea/Math.PI); //radius of the last circle (A = PI*R*R)
            createCircle(centroid[0],centroid[1],radius,'yellow',clickCount+4);  //Draw the final yellow circle
            area = new createjs.Text("Area of circle = area of parallelogram = "+parArea+" square units.", "13px Arial", "#000000"); 
            area.name = "area";
            area.textAlign = "center";
            area.textBaseline = "middle";
            area.x = 200;
            area.y = 370;
            stage.addChild(area);
        }
        clickCount = clickCount+2;
    }else{
        alert('You cannot select more than three points');
        return;
    }
    stage.update(); 
} //End of function
 
/**** Function to reset Canvas ****/
function reset(){
    stage.removeAllChildren();
    clickCount = 0;
    coordinates = [];
    centroid = [];
    stage.update();
} //End of function
