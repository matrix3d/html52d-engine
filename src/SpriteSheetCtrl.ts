/**
 * ...
 * @author lizhi
 */
class SpriteSheetCtrl extends Ctrl{
	target:Sprite;
	image:BitmapData;
	imageWidth:number;
	imageHeight:number;
	numCols:number;
	numRows:number;
	fps:number;
	centerX:number;
	centerY:number;
	frame:number =0;
	constructor(target:Sprite,image:BitmapData,imageWidth:number,imageHeight:number,numCols:number,numRows:number,fps:number=1,centerX:number=0,centerY:number=0) {
		super();
		this.target=target;
		this.image=image;
		this.imageWidth=imageWidth;
		this.imageHeight=imageHeight;
		this.numCols=numCols;
		this.numRows=numRows;
		this.centerX=centerX;
		this.centerY=centerY;
		this.fps=fps;
	}
	update():void{
		this.target.graphics.clear();
		this.frame+=this.fps;
		var f = Math.floor(this.frame)%(this.numCols*this.numRows);
		var ox = f%this.numCols;
		var oy=Math.floor(f/this.numCols);
		var sw =this.imageWidth/this.numCols;
		var sh=this.imageHeight/this.numRows;
		this.target.graphics.drawImage(this.image,sw*ox,sh*oy,sw,sh,-this.centerX,-this.centerY,sw,sh);
	}
}